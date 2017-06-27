// auto_faAx.js
// Demonio que lanza cada cierto tiempo una búsqueda en la base de datos para enviar
// importar las fcaturas de AXAPTA
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun"),
    util = require("util"),
    async = require("async"),
    sprintf = require("sprintf-js").sprintf;

var config = require("../../configSQLServer.json");
var fs = require('fs');

var facemitidasDb = require("../facemitidas/facemitidas.db_mysql");
var facturasEmitidasDb = require("../facturasEmitidas/facturasEmitidas.db_mysql");
var facturasEmitidasDbToJs = require("../facturasEmitidas/facturasEmitidas.dbToJs");
var facturaEmitidasSoap = require("../facturasEmitidas/facturasEmitidas.soap");


var facrecibidasDb = require("../facrecibidas/facrecibidas.db_mysql");
var facturasRecibidasDb = require("../facturasRecibidas/facturasRecibidas.db_mysql");
var facturasRecibidasDbToJs = require("../facturasRecibidas/facturasRecibidas.dbToJs");
var facturaRecibidasSoap = require("../facturasRecibidas/facturasRecibidas.soap");
var sqlsDb = require("../sqls/sqls");

var sqlServer = require("mssql");

var isRunningAx = false;

var id = setInterval(function () {
    console.log("FIST ", isRunningAx);
    if (isRunningAx) return;
    var prMessage = "";
    isRunningAx = true;
    console.log("-- AUTO AXAPTA [START] --" + moment(new Date()).format("DD/MM/YYYY HH:mm:ss"));
    axCallSync(function (err) {
        isRunningAx = false;
        if (err) {
            console.log ("ERR GENERAL: ", err.message);
            console.log("-- AUTO AXAPTA [END WITH ERR] --" + moment(new Date()).format("DD/MM/YYYY HH:mm:ss"));
        } else {
            console.log("-- AUTO AXAPTA [END] --" + moment(new Date()).format("DD/MM/YYYY HH:mm:ss"));
        }
    });
}, 5000); // lanzado cada 5 segundos

var axCallSync = function (done) {
    console.log("ENTRA ASYNC");
    console.log("ENTRA BUSAX");
    sqlsDb.execSQL(sqlBusquedaAx(), function (err, data) {
        if (err) return done(err);
        console.log("ENTRA BUSAX");
        console.log("ENTRA AXREGS");
        axRegs(data.recordset, function (err, data) {
            if (err) return done(err);
            console.log("SALE AXREGS");
            console.log("SALE ASYNC");
            done(null, data);
        });
    });
}

var axRegs = function (data, done) {
    var antGDESVATNUM;
    var antINVOICEID;
    var antINVOICEDATE;
    var antVATNUM;
    var primerCaso = true;
    var reg = null;

    async.each(data, function (r, callback) {
        console.log("ENTRA RCALL");
        if (moment(r.DEVENGODATE).format("YYYYMMDD") == "19000101") r.DEVENGODATE = null;
        if (r.GDESVATNUM != antGDESVATNUM || moment(r.INVOICEDATE).format("YYYYMMDD") != antINVOICEDATE || r.INVOICEID != antINVOICEID || antVATNUM != r.VATNUM) {
            // cambio de factura
            reg = crearRegSii(r);
            if (primerCaso) {
                primerCaso = false;
                antGDESVATNUM = r.GDESVATNUM;
                antINVOICEDATE = moment(r.INVOICEDATE).format("YYYYMMDD");
                antINVOICEID = r.INVOICEID;
                antVATNUM = r.VATNUM;
                console.log("SALE RCALL 1c");
                callback();
            } else {
                facturasEmitidasDb.post(reg, function (err, data) {
                    if (err) return callback(err);
                    var sql = "UPDATE [dbo].[CAUSIIFACTURAS] SET [ARIADNAID] = " + data.IDEnvioFacturasEmitidas;
                    sql += " WHERE [GDESVATNUM] = " + antGDESVATNUM;
                    sql += " AND [VATNUM] = " + antVATNUM;
                    sql += " AND [INVOICEID] = " + antINVOICEID;
                    sqlsDb.execSQL(sql, function (err) {
                        if (err) return callback(err);
                        antGDESVATNUM = r.GDESVATNUM;
                        antINVOICEDATE = moment(r.INVOICEDATE).format("YYYYMMDD");
                        antINVOICEID = r.INVOICEID;
                        antVATNUM = r.VATNUM;
                        console.log("SALE RCALL 2c");
                        callback();
                    })
                });
            }
        } else {
            // es la misma factura
            if (r.EMITIDARECIBIDA == 1)
                reg = desgloseIVAEmitida(r, reg);
            if (r.EMITIDARECIBIDA == 2)
                reg = desgloseIVARecibida(r, reg);
            console.log("SALE RCALL 3c");
            callback();
        }
    },
        function (err) {
            console.log("ENTRA RFINAL");
            if (err) return done(err);
            facturasEmitidasDb.post(reg, function (err, data) {
                if (err) return done(err);
                var sql = "UPDATE [dbo].[CAUSIIFACTURAS] SET [ARIADNAID] = " + data.IDEnvioFacturasEmitidas;
                sql += " WHERE [GDESVATNUM] = " + antGDESVATNUM;
                sql += " AND [VATNUM] = " + antVATNUM;
                sql += " AND [INVOICEID] = " + antINVOICEID;
                sqlsDb.execSQL(sql, function (err) {
                    if (err) return done(err);
                    console.log("SALE RFINAL");
                    done();
                })
            });
        });
}

var errConFunction = function (err, con) {
    isRunningAx = false;
    console.log("ERR: ", err.message);
    con.rollback(function () { });
    con.end();
};

var nothingTodDo = function (con) {
    isRunningAx = false;
    con.commit(function (err) {
        if (err) return errConFunction(err, con);
        con.end();
    });
}

var sqlBusquedaAx = function () {
    var sql = "SELECT";
    sql += " [EMITIDARECIBIDA]";
    sql += " ,[PAIS]";
    sql += " ,[GDESVATNUM]";
    sql += " ,[GDESCOMPANYNAME]";
    sql += " ,[INVOICEID]";
    sql += " ,[INVOICEDATE]";
    sql += " ,[DEVENGODATE]";
    sql += " ,[TIPOFACTURA]";
    sql += " ,[CLAVEREGIMEN]";
    sql += " ,[CAUSAEXENTA]";
    sql += " ,[TIPONOEXENTA]";
    sql += " ,[IMPORTETOTAL]";
    sql += " ,[BASEIMPONIBLETOTAL]";
    sql += " ,[DESCRIPCIONOPERACION]";
    sql += " ,[FACTURARECTIFICATIVA]";
    sql += " ,[RECTIFICATIVAINVOICEID]";
    sql += " ,[BASERECTIFICADA]";
    sql += " ,[CUOTARECTIFICADA]";
    sql += " ,[SITUACIONINMUEBLE]";
    sql += " ,[REFCATASTRAL]";
    sql += " ,[CUSTVENDNAME]";
    sql += " ,[VATNUM]";
    sql += " ,[INVERSIONSUJETOPASIVO]";
    sql += " ,[FECHAREGISTROCONTABLE]";
    sql += " ,[CUOTADEDUCIBLE]";
    sql += " ,[BASEIMPONIBLE]";
    sql += " ,[TIPOIVA]";
    sql += " ,SUM([CUOTA]) AS SUMCUOTA";
    sql += " FROM [dbo].[CAUSIIFACTURAS]";
    sql += " WHERE [EMITIDARECIBIDA] = 1"
    sql += " GROUP BY [EMITIDARECIBIDA]";
    sql += " ,[PAIS]";
    sql += " ,[GDESVATNUM]";
    sql += " ,[GDESCOMPANYNAME]";
    sql += " ,[INVOICEID]";
    sql += " ,[INVOICEDATE]";
    sql += " ,[DEVENGODATE]";
    sql += " ,[TIPOFACTURA]";
    sql += " ,[CLAVEREGIMEN]";
    sql += " ,[CAUSAEXENTA]";
    sql += " ,[TIPONOEXENTA]";
    sql += " ,[IMPORTETOTAL]";
    sql += " ,[BASEIMPONIBLETOTAL]";
    sql += " ,[DESCRIPCIONOPERACION]";
    sql += " ,[FACTURARECTIFICATIVA]";
    sql += " ,[RECTIFICATIVAINVOICEID]";
    sql += " ,[BASERECTIFICADA]";
    sql += " ,[CUOTARECTIFICADA]";
    sql += " ,[SITUACIONINMUEBLE]";
    sql += " ,[REFCATASTRAL]";
    sql += " ,[CUSTVENDNAME]";
    sql += " ,[VATNUM]";
    sql += " ,[INVERSIONSUJETOPASIVO]";
    sql += " ,[FECHAREGISTROCONTABLE]";
    sql += " ,[CUOTADEDUCIBLE]";
    sql += " ,[BASEIMPONIBLE]";
    sql += " ,[TIPOIVA]";
    sql += " ORDER BY [GDESVATNUM],[VATNUM],[INVOICEID],[INVOICEDATE]"
    return sql;
}

var crearRegSii = function (r) {
    var reg = {};
    if (r.EMITIDARECIBIDA == 1) {
        reg = crearRegSiiEmitida(r);
    }
    if (r.EMITIDARECIBIDA == 2) {
        reg = crearRegSiiRecibida(r);
    }
    return reg;
}

var crearRegSiiEmitida = function (r) {
    var reg = crearRegSiiComun(r);
    reg.REG_IDF_IDEF_NIF = r.GDESVATNUM;
    reg.REG_IDF_NumSerieFacturaEmisor = r.INVOICEID;
    reg.REG_IDF_FechaExpedicionFacturaEmisor = moment(r.INVOICEDATE).format("YYYY-MM-DD");
    reg.REG_FE_TipoFactura = r.TIPOFACTURA;
    if (r.DEVENGODATE) reg.REG_FE_FechaOperacion = moment(r.DEVENGODATE).format("YYYY-MM-DD");
    reg.REG_FE_ClaveRegimenEspecialOTrascendencia = r.CLAVEREGIMEN;
    reg.REG_FE_ImporteTotal = r.IMPORTETOTAL;
    reg.REG_FE_DescripcionOperacion = r.DESCRIPCIONOPERACION;
    reg.REG_FE_CNT_NombreRazon = r.CUSTVENDNAME;
    if (r.PAIS == "ES") {
        reg.REG_FE_CNT_NIF = r.VATNUM;
    } else {
        reg.REG_FE_CNT_IDOtro_CodigoPais = r.PAIS;
        reg.REG_FE_CNT_IDOtro_IDType = "02";
        reg.REG_FE_CNT_IDOtro_ID = r.VATNUM;
    }
    if (r.CAUSAEXENTA == "") {
        reg.REG_FE_TD_DF_SU_NEX_TipoNoExenta = r.TIPONOEXENTA;
    } else {
        reg.REG_FE_TD_DF_SU_EX_CausaExencion = r.CAUSAEXENTA;
        reg.REG_FE_TD_DF_SU_EX_BaseImponible = r.BASEIMPONIBLETOTAL;
    }
    // Casos especiales (RECTIFICATIVA)
    if (r.FACTURARECTIFICATIVA == "S") {
        reg.REG_FE_TipoRectificativa = "I";
        reg.REG_FE_FR_IDR_NumSerieFacturaEmisor = r.INVOICEID;
        reg.REG_FE_IR_BaseRectificada = r.BASERECTIFICADA;
        reg.REG_FE_IR_CuotaRectificada = r.CUOTARECTIFICADA;
    }
    // Caso especial (ALQUILER)
    if (r.SITUACIONINMUEBLE != 0) {
        reg.REG_FE_DI_DT_SituacionInmueble = r.SITUACIONINMUEBLE;
        reg.REG_FE_DI_DT_ReferenciaCatastral = r.REFCATASTRAL;
    }
    // Desglose de IVA pasado en el caso de NO EXENTA
    reg = desgloseIVAEmitida(r, reg);
    return reg;
}

var crearRegSiiRecibida = function (r) {

}

var crearRegSiiComun = function (r) {
    var reg = {
        IDEnvioFacturasEmitidas: 0,
        Origen: "AXAPTA",
        FechaHoraCreacion: new Date(),
        EnvioInmediato: 0,
        Enviada: 0,
        CAB_IDVersionSii: "0.7",
        CAB_Titular_NombreRazon: r.GDESCOMPANYNAME,
        CAB_Titular_NIF: r.GDESVATNUM,
        CAB_TipoComunicacion: "A0"
    }
    if (r.DEVENGODATE != null && r.DEVENGODATE != "null") {
        reg.REG_PI_Ejercicio = moment(r.DEVENGODATE).format("YYYY");
        reg.REG_PI_Periodo = moment(r.DEVENGODATE).format("MM");
    } else {
        reg.REG_PI_Ejercicio = moment(r.INVOICEDATE).format("YYYY");
        reg.REG_PI_Periodo = moment(r.INVOICEDATE).format("MM");
    }
    return reg;
}

var desgloseIVAEmitida = function (r, reg) {
    // en r registro leido en reg registro montado
    // si está exenta no hay que desglosar
    if (r.CAUSAEXENTA != "") return reg;
    // de momento no procesamos negativos para evitar error
    if (r.TiPOIVA < 0) return reg;
    // buscamos el registro de IVA que le corresponde
    var pos = 0;
    for (var i = 1; i <= 6; i++) {
        var str = "REG_FE_TD_DF_SU_NEX_DI_DT" + i + "_TipoImpositivo";
        if (!reg[str]) {
            pos = 1;
            break;
        }
    }
    // lo montamos
    reg["REG_FE_TD_DF_SU_NEX_DI_DT" + pos + "_TipoImpositivo"] = r.TIPOIVA;
    reg["REG_FE_TD_DF_SU_NEX_DI_DT" + pos + "_BaseImponible"] = r.BASEIMPONIBLE;
    reg["REG_FE_TD_DF_SU_NEX_DI_DT" + pos + "_CuotaRepercutida"] = r.SUMCUOTA;
    return reg;
}

var desgloseIVARecibida = function (r, reg) {

}