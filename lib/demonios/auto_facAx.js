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
var facturasEmitidasDbToJs = require("../facturasEmitidas/facturasEmitidas.dbToJs");
var facturaEmitidasSoap = require("../facturasEmitidas/facturasEmitidas.soap");


var facrecibidasDb = require("../facrecibidas/facrecibidas.db_mysql");
var facturasRecibidasDbToJs = require("../facturasRecibidas/facturasRecibidas.dbToJs");
var facturaRecibidasSoap = require("../facturasRecibidas/facturasRecibidas.soap");

var sqlServer = require("mssql");

var isRunningAx = false;

var id = setInterval(function () {
    if (isRunningAx) return;
    var prMessage = "";
    isRunningAx = true;
    console.log("-- AUTO AXAPTA [START] --" + moment(new Date()).format("DD/MM/YYYY HH:mm:ss"));

    // connect to your database
    sqlServer.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sqlServer.Request();

        // query to the database and get the records
        request.query(sqlBusquedaAx(), function (err, recordset) {

            if (err) console.log(err);
            console.log("-- WS --");
            fs.writeFileSync('/tmp/regAX.json', JSON.stringify(recordset, null, 2));
            sqlServer.close();

        });
    });
    //
    console.log("-- AUTO AXAPTA [END] --" + moment(new Date()).format("DD/MM/YYYY HH:mm:ss"));
    isRunningAx = false;
}, 5000); // lanzado cada 5 segundos

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
    sql += " FROM [AxDev].[dbo].[CAUSIIFACTURAS]";
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
    return sql;
}