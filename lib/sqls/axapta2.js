var sqlsDb = require("../sqls/sqls");
var async = require("async");
var moment = require("moment");
var facturasEmitidasDb = require("../facturasEmitidas/facturasEmitidas.db_mysql");
var facturasRecibidasDb = require("../facturasRecibidas/facturasRecibidas.db_mysql");

var axaptaApi = {
  axCallSync: function (done) {
    sqlsDb.execSQL2(sqlBusquedaAx(), function (err, data) {
      if (err) return done(err);
      if (data.recordset.length == 0) return done();
      console.log(
        "-- AUTO AXAPTA [START] --" +
          moment(new Date()).format("DD/MM/YYYY HH:mm:ss")
      );
      axRegs(data.recordset, function (err, data) {
        if (err) return done(err);
        console.log(
          "-- AUTO AXAPTA [END] --" +
            moment(new Date()).format("DD/MM/YYYY HH:mm:ss")
        );
        done(null, data);
      });
    });
  },
};

var axRegs = function (data, done) {
  var antGDESVATNUM;
  var antINVOICEID;
  var antINVOICEDATE;
  var antVATNUM;
  var antTipo;
  var primerCaso = true;
  var reg = null;
  var basetotal = 0;
  var baseparcial = 0;

  async.eachSeries(
    data,
    function (r, callback) {
      if (moment(r.DEVENGODATE).format("YYYYMMDD") == "19000101")
        r.DEVENGODATE = null;
      if (
        r.GDESVATNUM != antGDESVATNUM ||
        moment(r.INVOICEDATE).format("YYYYMMDD") != antINVOICEDATE ||
        r.INVOICEID != antINVOICEID ||
        antVATNUM != r.VATNUM
      ) {
        // cambio de factura
        if (primerCaso) {
          primerCaso = false;
          antGDESVATNUM = r.GDESVATNUM;
          antINVOICEDATE = moment(r.INVOICEDATE).format("YYYYMMDD");
          antINVOICEID = r.INVOICEID;
          antVATNUM = r.VATNUM;
          antTipo = r.EMITIDARECIBIDA;
          basetotal = r.BASEIMPONIBLETOTAL;
          baseparcial = r.BASEIMPONIBLE;
          reg = crearRegSii(r);
          callback();
        } else {
          console.log("ID", antINVOICEID, "BT", basetotal, "BP", baseparcial);
          if (antTipo == 1) {
            if (basetotal.toFixed(4) === baseparcial.toFixed(4)) {
              facturasEmitidasDb.post(reg, function (err, data) {
                if (err) return callback(err);
                var sql =
                  "UPDATE [dbo].[CAUSIIFACTURAS] SET [ARIADNAID] = '" +
                  data.IDEnvioFacturasEmitidas +
                  "'";
                sql += ", [CAUSIISTATUS] = 40";
                sql += " WHERE [GDESVATNUM] = '" + antGDESVATNUM + "'";
                sql += " AND [VATNUM] = '" + antVATNUM + "'";
                sql += " AND [INVOICEID] = '" + antINVOICEID + "'";
                var mens =
                  "AXAPTAFAC--> GDESVATNUM: " +
                  antGDESVATNUM +
                  " VATNUM: " +
                  antVATNUM +
                  " INVOICEID: " +
                  antINVOICEID;
                sqlsDb.execSQL2(sql, function (err) {
                  if (err) {
                    console.log("AX SQL->", sql);
                    return callback(err);
                  }
                  console.log(mens);
                  antGDESVATNUM = r.GDESVATNUM;
                  antINVOICEDATE = moment(r.INVOICEDATE).format("YYYYMMDD");
                  antINVOICEID = r.INVOICEID;
                  antVATNUM = r.VATNUM;
                  antTipo = r.EMITIDARECIBIDA;
                  reg = crearRegSii(r);
                  basetotal = r.BASEIMPONIBLETOTAL;
                  baseparcial = r.BASEIMPONIBLE;
                  callback();
                });
              });
            } else {
              console.log(
                "Descuadre Lineas ID",
                antINVOICEID,
                "BT",
                basetotal.toFixed(4),
                "B",
                baseparcial.toFixed(4)
              );
              antGDESVATNUM = r.GDESVATNUM;
              antINVOICEDATE = moment(r.INVOICEDATE).format("YYYYMMDD");
              antINVOICEID = r.INVOICEID;
              antVATNUM = r.VATNUM;
              antTipo = r.EMITIDARECIBIDA;
              basetotal = r.BASEIMPONIBLETOTAL;
              baseparcial = r.BASEIMPONIBLE;
              reg = crearRegSii(r);
              callback();
            }
          } else {
            if (basetotal.toFixed(4) === baseparcial.toFixed(4)) {
              facturasRecibidasDb.post(reg, function (err, data) {
                if (err) return callback(err);
                var sql =
                  "UPDATE [dbo].[CAUSIIFACTURAS] SET [ARIADNAID] = '" +
                  data.IDEnvioFacturasRecibidas +
                  "'";
                sql += ", [CAUSIISTATUS] = 40";
                sql += " WHERE [GDESVATNUM] = '" + antGDESVATNUM + "'";
                sql += " AND [VATNUM] = '" + antVATNUM + "'";
                sql += " AND [INVOICEID] = '" + antINVOICEID + "'";
                var mens =
                  "AXAPTAFAC--> GDESVATNUM: " +
                  antGDESVATNUM +
                  " VATNUM: " +
                  antVATNUM +
                  " INVOICEID: " +
                  antINVOICEID;
                sqlsDb.execSQL2(sql, function (err) {
                  if (err) {
                    console.log("AX SQL->", sql);
                    return callback(err);
                  }
                  console.log(mens);
                  antGDESVATNUM = r.GDESVATNUM;
                  antINVOICEDATE = moment(r.INVOICEDATE).format("YYYYMMDD");
                  antINVOICEID = r.INVOICEID;
                  antVATNUM = r.VATNUM;
                  antTipo = r.EMITIDARECIBIDA;
                  basetotal = r.BASEIMPONIBLETOTAL;
                  baseparcial = r.BASEIMPONIBLE;
                  reg = crearRegSii(r);
                  callback();
                });
              });
            } else {
              console.log(
                "Descuadre Lineas ID",
                antINVOICEID,
                "BT",
                basetotal.toFixed(4),
                "B",
                baseparcial.toFixed(4)
              );
              antGDESVATNUM = r.GDESVATNUM;
              antINVOICEDATE = moment(r.INVOICEDATE).format("YYYYMMDD");
              antINVOICEID = r.INVOICEID;
              antVATNUM = r.VATNUM;
              antTipo = r.EMITIDARECIBIDA;
              basetotal = r.BASEIMPONIBLETOTAL;
              baseparcial = r.BASEIMPONIBLE;
              reg = crearRegSii(r);
              callback();
            }
          }
        }
      } else {
        // es la misma factura
        baseparcial += r.BASEIMPONIBLE;
        // if (r.EMITIDARECIBIDA == 1)
        //     reg = desgloseIVAEmitida(r, reg);
        // if (r.EMITIDARECIBIDA == 2)
        //     reg = desgloseIVARecibida(r, reg);
        reg = crearRegSii(r, reg);
        callback();
      }
    },
    function (err) {
      if (err) return done(err);
      if (reg == null) return done();
      console.log("ID", antINVOICEID, "BT", basetotal, "BP", baseparcial);
      if (antTipo == 1) {
        if (basetotal.toFixed(4) === baseparcial.toFixed(4)) {
          facturasEmitidasDb.post(reg, function (err, data) {
            if (err) return done(err);
            var sql =
              "UPDATE [dbo].[CAUSIIFACTURAS] SET [ARIADNAID] = '" +
              data.IDEnvioFacturasEmitidas +
              "'";
            sql += ", [CAUSIISTATUS] = 40";
            sql += " WHERE [GDESVATNUM] = '" + antGDESVATNUM + "'";
            sql += " AND [VATNUM] = '" + antVATNUM + "'";
            sql += " AND [INVOICEID] = '" + antINVOICEID + "'";
            // console.log('sql', sql)
            sqlsDb.execSQL2(sql, function (err) {
              if (err) return done(err);
              done();
            });
          });
        } else {
          console.log(
            "Descuadre Lineas ID",
            antINVOICEID,
            "BT",
            basetotal.toFixed(4),
            "B",
            baseparcial.toFixed(4)
          );
          done();
        }
      } else {
        if (basetotal.toFixed(4) === baseparcial.toFixed(4)) {
          facturasRecibidasDb.post(reg, function (err, data) {
            if (err) return done(err);
            var sql =
              "UPDATE [dbo].[CAUSIIFACTURAS] SET [ARIADNAID] = '" +
              data.IDEnvioFacturasRecibidas +
              "'";
            sql += ", [CAUSIISTATUS] = 40";
            sql += " WHERE [GDESVATNUM] = '" + antGDESVATNUM + "'";
            sql += " AND [VATNUM] = '" + antVATNUM + "'";
            sql += " AND [INVOICEID] = '" + antINVOICEID + "'";
            sqlsDb.execSQL2(sql, function (err) {
              if (err) return done(err);
              done();
            });
          });
        } else {
          console.log(
            "Descuadre Lineas ID",
            antINVOICEID,
            "BT",
            basetotal.toFixed(4),
            "B",
            baseparcial.toFixed(4)
          );
          done();
        }
      }
    }
  );
};

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
  sql += " ,[FECHARECTIFICADA]";
  sql += " ,[BASERECTIFICADA]";
  sql += " ,[CUOTARECTIFICADA]";
  sql += " ,[SITUACIONINMUEBLE]";
  sql += " ,[REFCATASTRAL]";
  sql += " ,[CUSTVENDNAME]";
  sql += " ,[TAXGROUP]";
  sql += " ,[VATNUM]";
  sql += " ,[INVERSIONSUJETOPASIVO]";
  sql += " ,[FECHAREGISTROCONTABLE]";
  sql += " ,[NOSUJETA]";
  sql += " ,[TIPOIVA]";
  sql += " ,[CODIGOIDPAIS]";
  sql += " ,SUM([BASEIMPONIBLE]) AS BASEIMPONIBLE";
  sql += " ,SUM([CUOTA]) AS SUMCUOTA";
  sql += " ,SUM([CUOTADEDUCIBLE]) AS CUOTADEDUCIBLE";
  sql += " FROM [dbo].[CAUSIIFACTURAS]";
  sql += " WHERE [ARIADNAID] = 0 AND [CAUSIISTATUS] <> 1";
  sql += " GROUP BY [EMITIDARECIBIDA]";
  sql += " ,[PAIS]";
  sql += " ,[GDESVATNUM]";
  sql += " ,[GDESCOMPANYNAME]";
  sql += " ,[INVOICEID]";
  sql += " ,[TAXGROUP]";
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
  sql += " ,[FECHARECTIFICADA]";
  sql += " ,[BASERECTIFICADA]";
  sql += " ,[CUOTARECTIFICADA]";
  sql += " ,[SITUACIONINMUEBLE]";
  sql += " ,[REFCATASTRAL]";
  sql += " ,[CUSTVENDNAME]";
  sql += " ,[VATNUM]";
  sql += " ,[INVERSIONSUJETOPASIVO]";
  sql += " ,[FECHAREGISTROCONTABLE]";
  sql += " ,[NOSUJETA]";
  sql += " ,[TIPOIVA]";
  sql += " ,[CODIGOIDPAIS]";
  sql += " ORDER BY [GDESVATNUM],[VATNUM],[INVOICEID],[INVOICEDATE]";
  return sql;
};

var crearRegSii = function (r, reg) {
  if (r.EMITIDARECIBIDA == 1) {
    reg = crearRegSiiEmitida(r, reg);
  }
  if (r.EMITIDARECIBIDA == 2) {
    reg = crearRegSiiRecibida(r, reg);
  }
  return reg;
};

var crearRegSiiEmitida = function (r, reg) {
  if (!reg) reg = crearRegSiiComun(r);
  reg.REG_IDF_IDEF_NIF = r.GDESVATNUM;
  reg.REG_IDF_NumSerieFacturaEmisor = r.INVOICEID;
  reg.REG_IDF_FechaExpedicionFacturaEmisor = moment(r.INVOICEDATE).format(
    "YYYY-MM-DD"
  );
  reg.REG_FE_TipoFactura = r.TIPOFACTURA;
  // if (r.DEVENGODATE && r.CLAVEREGIMEN != "15") reg.REG_FE_FechaOperacion = moment(r.DEVENGODATE).format("YYYY-MM-DD");
  if (r.DEVENGODATE)
    reg.REG_FE_FechaOperacion = moment(r.DEVENGODATE).format("YYYY-MM-DD");
  reg.REG_FE_ClaveRegimenEspecialOTrascendencia = r.CLAVEREGIMEN;
  // reg.REG_FE_ImporteTotal = r.IMPORTETOTAL;
  reg.REG_FE_DescripcionOperacion = "INVOICEID: " + r.INVOICEID;
  if (r.DESCRIPCIONOPERACION)
    reg.REG_FE_DescripcionOperacion = r.DESCRIPCIONOPERACION;
  reg.REG_FE_CNT_NombreRazon = r.CUSTVENDNAME;
  if (r.PAIS == "ES") {
    reg.REG_FE_CNT_NIF = r.VATNUM;
  } else {
    if (r.PAIS == "ESP") r.PAIS = "ES";
    reg.REG_FE_CNT_IDOtro_CodigoPais = r.PAIS;
    reg.REG_FE_CNT_IDOtro_IDType = r.CODIGOIDPAIS;
    reg.REG_FE_CNT_IDOtro_ID = r.VATNUM;
  }
  if (r.CAUSAEXENTA == "" && r.NOSUJETA != 1) {
    reg.REG_FE_TD_DF_SU_NEX_TipoNoExenta = r.TIPONOEXENTA;
  } else {
    if (r.NOSUJETA != 1) {
      if (r.PAIS == "ES") {
        reg.REG_FE_TD_DF_SU_EX_CausaExencion = r.CAUSAEXENTA;
        //reg.REG_FE_TD_DF_SU_EX_BaseImponible = r.BASEIMPONIBLETOTAL;
        reg.REG_FE_TD_DF_SU_EX_BaseImponible = r.BASEIMPONIBLE;
      } else {
        reg.REG_FE_TD_DTE_SU_EX_CausaExencion = r.CAUSAEXENTA;
        //reg.REG_FE_TD_DTE_SU_EX_BaseImponible = r.BASEIMPONIBLETOTAL;
        reg.REG_FE_TD_DTE_SU_EX_BaseImponible = r.BASEIMPONIBLE;
      }
    }
  }
  if (r.NOSUJETA == 1) {
    // Caso especial (TAXGROUP)
    if (r.TAXGROUP == "VNAL_NSAr7") {
      reg.REG_FE_TD_DF_NSU_ImportePorArticulos7_14_Otros = r.BASEIMPONIBLE;
    } else {
      if (r.PAIS == "ES") {
        //reg.REG_FE_TD_DF_NSU_ImporteTAIReglasLocalizacion = r.BASEIMPONIBLETOTAL;
        reg.REG_FE_TD_DF_NSU_ImporteTAIReglasLocalizacion = r.BASEIMPONIBLE;
      } else {
        if (r.BIENESSERVICIOS == 1) {
          //reg.REG_FE_TD_DTE_NSU_ImporteTAIReglasLocalizacion = r.BASEIMPONIBLETOTAL;
          reg.REG_FE_TD_DTE_NSU_ImporteTAIReglasLocalizacion = r.BASEIMPONIBLE;
        } else {
          //reg.REG_FE_TD_DTS_NSU_ImporteTAIReglasLocalizacion = r.BASEIMPONIBLETOTAL;
          reg.REG_FE_TD_DTS_NSU_ImporteTAIReglasLocalizacion = r.BASEIMPONIBLE;
        }
      }
    }
  }
  // Casos especiales (RECTIFICATIVA)
  if (r.FACTURARECTIFICATIVA == "S") {
    reg.REG_FE_TipoRectificativa = "S";
    reg.REG_FE_FR_IDR_NumSerieFacturaEmisor = r.RECTIFICATIVAINVOICEID;
    reg.REG_FE_IR_BaseRectificada = r.BASERECTIFICADA;
    reg.REG_FE_IR_CuotaRectificada = r.CUOTARECTIFICADA;
    reg.REG_FE_FR_IDR_FechaExpedicionFacturaEmisor = moment(
      r.FECHARECTIFICADA
    ).format("YYYY-MM-DD");
  }
  // Caso especial (ALQUILER)
  if (r.SITUACIONINMUEBLE != 0) {
    reg.REG_FE_DI_DT_SituacionInmueble = r.SITUACIONINMUEBLE;
    reg.REG_FE_DI_DT_ReferenciaCatastral = r.REFCATASTRAL;
  }

  // Desglose de IVA pasado en el caso de NO EXENTA
  reg = desgloseIVAEmitida(r, reg);
  // Controlar las facturas de primer semestre de 2017
  if (reg.REG_PI_Ejercicio == "2017" && reg.REG_PI_Periodo < "07") {
    if (reg.REG_FR_ClaveRegimenEspecialOTrascendencia != "12")
      reg.REG_FE_ClaveRegimenEspecialOTrascendencia = "16";
    reg.REG_FE_DescripcionOperacion = "Registro del primer semestre";
    reg.REG_FE_TD_DF_SU_NEX_TipoNoExenta = "S1";
  }

  return reg;
};

var crearRegSiiRecibida = function (r, reg) {
  if (!reg) reg = crearRegSiiComun(r);
  if (r.PAIS == "ES") {
    reg.REG_IDF_IDEF_NIF = r.VATNUM;
  } else {
    reg.REG_IDF_IDEF_IDOtro_CodigoPais = r.PAIS;
    reg.REG_IDF_IDEF_IDOtro_IDType = r.CODIGOIDPAIS;
    reg.REG_IDF_IDEF_IDOtro_ID = r.VATNUM;
  }
  reg.REG_IDF_NumSerieFacturaEmisor = r.INVOICEID;
  reg.REG_IDF_FechaExpedicionFacturaEmisor = moment(r.INVOICEDATE).format(
    "YYYY-MM-DD"
  );
  reg.REG_FR_TipoFactura = r.TIPOFACTURA;
  // SII-17
  // if (r.DEVENGODATE) reg.REG_FR_FechaOperacion = moment(r.DEVENGODATE).format("YYYY-MM-DD");
  reg.REG_FR_ClaveRegimenEspecialOTrascendencia = r.CLAVEREGIMEN;
  // reg.REG_FR_ImporteTotal = r.IMPORTETOTAL;
  reg.REG_FR_DescripcionOperacion = "INVOICEID: " + r.INVOICEID;
  if (r.DESCRIPCIONOPERACION)
    reg.REG_FR_DescripcionOperacion = r.DESCRIPCIONOPERACION;

  if (r.FACTURARECTIFICATIVA == "S") {
    reg.REG_FR_TipoRectificativa = "S";
    reg.REG_FR_FR_IDR_NumSerieFacturaEmisor = r.RECTIFICATIVAINVOICEID;
    reg.REG_FR_IR_BaseRectificada = r.BASERECTIFICADA;
    reg.REG_FR_IR_CuotaRectificada = r.CUOTARECTIFICADA;
    reg.REG_FR_FR_IDR_FechaExpedicionFacturaEmisor = moment(
      r.FECHARECTIFICADA
    ).format("YYYY-MM-DD");
  }
  reg.REG_FR_CNT_NombreRazon = r.CUSTVENDNAME;
  if (r.PAIS == "ES") {
    reg.REG_FR_CNT_NIF = r.VATNUM;
  } else {
    reg.REG_FR_CNT_IDOtro_CodigoPais = r.PAIS;
    reg.REG_FR_CNT_IDOtro_IDType = r.CODIGOIDPAIS;
    reg.REG_FR_CNT_IDOtro_ID = r.VATNUM;
  }
  reg.REG_FR_FechaRegContable = r.FECHAREGISTROCONTABLE;
  reg.REG_FR_CuotaDeducible = 0;
  // Desglose de IVA pasado
  reg = desgloseIVARecibida(r, reg);
  // Controlar las facturas de primer semestre de 2017
  if (reg.REG_PI_Ejercicio == "2017" && reg.REG_PI_Periodo < "07") {
    if (reg.REG_FR_ClaveRegimenEspecialOTrascendencia != "12")
      reg.REG_FR_ClaveRegimenEspecialOTrascendencia = "14";
    reg.REG_FR_DescripcionOperacion = "Registro del primer semestre";
    reg.REG_FR_FechaRegContable = moment(new Date()).format("YYYY-MM-DD");
    reg.REG_FR_CuotaDeducible = 0;
  }

  return reg;
};

var crearRegSiiComun = function (r) {
  var reg = {
    Origen: "AXAPTA",
    FechaHoraCreacion: new Date(),
    EnvioInmediato: 0,
    Enviada: 0,
    CAB_IDVersionSii: "1.1",
    CAB_Titular_NombreRazon: r.GDESCOMPANYNAME,
    CAB_Titular_NIF: r.GDESVATNUM,
    CAB_TipoComunicacion: "A0",
  };
  if (r.EMITIDARECIBIDA == 1) {
    reg.IDEnvioFacturasEmitidas = 0;
  } else {
    reg.IDEnvioFacturasRecibidas = 0;
  }
  if (r.DEVENGODATE != null && r.DEVENGODATE != "null") {
    reg.REG_PI_Ejercicio = moment(r.DEVENGODATE).format("YYYY");
    reg.REG_PI_Periodo = moment(r.DEVENGODATE).format("MM");
  } else {
    reg.REG_PI_Ejercicio = moment(r.INVOICEDATE).format("YYYY");
    reg.REG_PI_Periodo = moment(r.INVOICEDATE).format("MM");
  }
  return reg;
};

var desgloseIVAEmitida = function (r, reg) {
  // en r registro leido en reg registro montado
  // si está exenta no hay que desglosar
  if (r.CAUSAEXENTA != "" || r.NOSUJETA == 1) return reg;
  // de momento no procesamos negativos para evitar error
  if (r.TiPOIVA < 0) return reg;
  // buscamos el registro de IVA que le corresponde
  var pos = 0;
  for (var i = 1; i <= 6; i++) {
    var str = "REG_FE_TD_DF_SU_NEX_DI_DT" + i + "_BaseImponible";
    if (!reg[str]) {
      pos = i;
      break;
    }
  }
  if (r.PAIS == "ES") {
    // lo montamos
    reg["REG_FE_TD_DF_SU_NEX_DI_DT" + pos + "_TipoImpositivo"] = r.TIPOIVA;
    reg["REG_FE_TD_DF_SU_NEX_DI_DT" + pos + "_BaseImponible"] = r.BASEIMPONIBLE;
    reg["REG_FE_TD_DF_SU_NEX_DI_DT" + pos + "_CuotaRepercutida"] = r.SUMCUOTA;
  } else {
    // lo montamos
    reg["REG_FE_TD_DTE_SU_NEX_DI_DT" + pos + "_TipoImpositivo"] = r.TIPOIVA;
    reg["REG_FE_TD_DTE_SU_NEX_DI_DT" + pos + "_BaseImponible"] =
      r.BASEIMPONIBLE;
    reg["REG_FE_TD_DTE_SU_NEX_DI_DT" + pos + "_CuotaRepercutida"] = r.SUMCUOTA;
  }
  return reg;
};
var desgloseIVARecibida = function (r, reg) {
  reg.REG_FR_CuotaDeducible += r.CUOTADEDUCIBLE;
  if (r.INVERSIONSUJETOPASIVO == 1) {
    // REG_FR_DF_ISP_DI_DT1_TipoImpositivo
    var pos = 0;
    for (var i = 1; i <= 6; i++) {
      var str = "REG_FR_DF_ISP_DI_DT" + i + "_BaseImponible";
      if (!reg[str]) {
        pos = i;
        break;
      }
    }
    // lo montamos
    reg["REG_FR_DF_ISP_DI_DT" + pos + "_TipoImpositivo"] = r.TIPOIVA;
    reg["REG_FR_DF_ISP_DI_DT" + pos + "_BaseImponible"] = r.BASEIMPONIBLE;
    reg["REG_FR_DF_ISP_DI_DT" + pos + "_CuotaSoportada"] = r.SUMCUOTA;
  } else {
    var pos = 0;
    for (var i = 1; i <= 6; i++) {
      var str = "REG_FR_DF_DGI_DI_DT" + i + "_BaseImponible";
      if (!reg[str]) {
        pos = i;
        break;
      }
    }
    // lo montamos REG_FR_DF_DGI_DI_DT
    reg["REG_FR_DF_DGI_DI_DT" + pos + "_TipoImpositivo"] = r.TIPOIVA;
    reg["REG_FR_DF_DGI_DI_DT" + pos + "_BaseImponible"] = r.BASEIMPONIBLE;
    reg["REG_FR_DF_DGI_DI_DT" + pos + "_CuotaSoportada"] = r.SUMCUOTA;
  }
  return reg;
};
module.exports = axaptaApi;
