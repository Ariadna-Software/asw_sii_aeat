// facturasEmitidas.dbToJs.js

var moment = require("moment");

var faturasEmitidasDbToJsAPI = {
  // emitidasDbToJs
  // de un objeto leido de la base de datos monta el JS que se le
  // enviará al servicio web de la AEAT
  emitidasDbToJs: function (dbObject) {
    var jsObject = {};
    // Obligatorio en todas las emitidas
    jsObject.Cabecera = {
      IDVersionSii: dbObject.CAB_IDVersionSii,
      Titular: {
        NombreRazon: dbObject.CAB_Titular_NombreRazon,
        NIFRepresentante: dbObject.CAB_Titular_NIFRepresentante,
        NIF: dbObject.CAB_Titular_NIF
      },
      TipoComunicacion: dbObject.CAB_TipoComunicacion
    };
    jsObject.RegistroLRFacturasEmitidas = {
      PeriodoImpositivo: {
        Ejercicio: dbObject.REG_PI_Ejercicio,
        Periodo: dbObject.REG_PI_Periodo
      },
      IDFactura: {
        IDEmisorFactura: {
          NIF: dbObject.REG_IDF_IDEF_NIF
        },
        NumSerieFacturaEmisor: dbObject.REG_IDF_NumSerieFacturaEmisor,
        NumSerieFacturaEmisorResumenFin: dbObject.REG_IDF_NumSerieFacturaEmisorResumenFin,
        FechaExpedicionFacturaEmisor: moment(dbObject.REG_IDF_FechaExpedicionFacturaEmisor).format("DD-MM-YYYY")
      },
      FacturaExpedida: {
        TipoFactura: dbObject.REG_FE_TipoFactura,
        TipoRectificativa: dbObject.REG_FE_TipoRectificativa,
      }
    };
    // Es el caso de envío de facturas agrupadas
    if (dbObject.REG_FE_FA_IDFA_NumSerieFacturaEmisor) {
      jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.FacturasAgrupadas = {
        IDFacturaAgrupada: {
          NumSerieFacturaEmisor: dbObject.REG_FE_FA_IDFA_NumSerieFacturaEmisor,
          FechaExpedicionFacturaEmisor: dbObject.REG_FE_FA_IDFA_FechaExpedicionFacturaEmisor
        }
      }
    }
    // Es el caso de facturas rectificadas
    if (dbObject.REG_FE_FR_IDR_NumSerieFacturaEmisor) {
      jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.FacturasRectificadas = {
        IDFacturaRectificada: {
          NumSerieFacturaEmisor: dbObject.REG_FE_FR_IDR_NumSerieFacturaEmisor,
          FechaExpedicionFacturaEmisor: dbObject.REG_FE_FR_IDR_FechaExpedicionFacturaEmisor
        }
      }
    }
    // Caso de factura rectificativa por sustitución
    if (dbObject.REG_FE_IR_BaseRectificada) {
      jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.ImporteRectificacion = {
        BaseRectificada: dbObject.REG_FE_IR_BaseRectificada,
        CuotaRectificada: dbObject.REG_FE_IR_CuotaRectificada,
        CuotaRecargoRectificado: REG_FE_IR_CuotaRecargoRectificado
      }
    }
    // Obligatorio en todas las facturas emitidas
    if (dbObject.REG_FE_FechaOperacion)
      jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.FechaOperacion = moment(dbObject.REG_FE_FechaOperacion).format("DD-MM-YYYY");
    jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.ClaveRegimenEspecialOTrascendencia = dbObject.REG_FE_ClaveRegimenEspecialOTrascendencia;
    jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.ImporteTotal = dbObject.REG_FE_ImporteTotal;
    jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.BaseImponibleACoste = dbObject.REG_FE_BaseImponibleACoste;
    jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.DescripcionOperacion = dbObject.REG_FE_DescripcionOperacion;
    // Caso de declarar un inmueble (ejemplo alquiler)
    if (dbObject.REG_FE_DI_DT_SituacionInmueble) {
      jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.DatosInmueble = {
        DetalleInmueble: {
          SituacionInmueble: dbObject.REG_FE_DI_DT_SituacionInmueble,
          ReferenciaCatastral: db.dbObject.REG_FE_DI_DT_ReferenciaCatastral
        }
      }
    }
    // Caso muy especial de transmision
    if (dbObject.REG_FE_ImporteTransmisionSujetoAIVA) {
      jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.ImporteTransmisionSujetoAIVA = dbObject.REG_FE_ImporteTransmisionSujetoAIVA;
    }
    // Los siguientes tres casos pueden tenner valor nulo en los campos
    // y en el caso de ser así el valor por defecto es no = 'N'
    if (dbObject.REG_FE_EmitidaPorTercero) {
      jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.EmitidaPorTerceros = dbObject.REG_FE_EmitidaPorTercero;
    } else {
      // si no hay informado, por defecto no
      jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.EmitidaPorTerceros = "N";
    }
    if (dbObject.REG_FE_VariosDestinatarios) {
      jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.VariosDestinatarios = dbObject.REG_FE_VariosDestinatarios;
    } else {
      // si no hay informado, por defecto no
      jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.VariosDestinatarios = "N";
    }
    if (dbObject.REG_FE_Cupon) {
      jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.Cupon = dbObject.REG_FE_Cupon;
    } 
    // La contraparte es obligatoria
    jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.Contraparte = {
      NombreRazon: dbObject.REG_FE_CNT_NombreRazon,
      NIFRepresentante: dbObject.REG_FE_CNT_NIFRepresentante,
      NIF: dbObject.REG_FE_CNT_NIF
    }
    // Caso de que se necesite identifcación adicional en la contraparte
    if (dbObject.REG_FE_CNT_IDOtro_ID) {
      jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.Contraparte.IDOtro = {
        CodigoPais: dbObject.REG_FE_CNT_IDOtro_CodigoPais,
        IDType: dbObject.REG_FE_CNT_IDOtro_IDType,
        ID: dbObject.REG_FE_CNT_IDOtro_ID
      }
    }
    // Hay que ver el tipo de desglose del que se trate
    var esDesgloseFactura = dbObject.REG_FE_TD_DF_SU_EX_CausaExencion || dbObject.REG_FE_TD_DF_SU_NEX_TipoNoExenta;
    var esDesgloseTipoOperacion = dbObject.REG_FE_TD_DTS_SU_EX_CausaExencion || dbObject.REG_FE_TD_DTS_SU_NEX_TipoNoExenta;
    if (esDesgloseFactura) {
      // Comprobar si está sujeta o no
      var estaSujeta = !(dbObject.REG_FE_TD_DF_NSU_ImportePorArticulos7_14_Otros || dbObject.REG_FE_TD_DF_NSU_ImporteTAIReglasLocalizacion);
      if (estaSujeta) {
        // Determinamos si la factura está exenta de IVA o no
        if (dbObject.REG_FE_TD_DF_SU_EX_CausaExencion) {
          // Factura exenta de IVA
          jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose = {
            DesgloseFactura: {
              Sujeta: {
                Exenta: {
                  CausaExencion: dbObject.REG_FE_TD_DF_SU_EX_CausaExencion,
                  BaseImponible: dbObject.REG_FE_TD_DF_SU_EX_BaseImponible
                }
              }
            }
          }
        } else {
          // Factura no exenta de IVA
          jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose = {
            DesgloseFactura: {
              Sujeta: {
                NoExenta: {
                  TipoNoExenta: dbObject.REG_FE_TD_DF_SU_NEX_TipoNoExenta
                }
              }
            }
          }
          // Vamos viendo los 6 posibles tipos de IVA a declarar
          var detallesIva = [];
          for (var i = 1; i <= 6; i++) {
            var reg = "REG_FE_TD_DF_SU_NEX_DI_DT" + i + "_TipoImpositivo";
            if (dbObject[reg] != null) {
              // hay un tipo para declarar
              var detalleIva = {
                TipoImpositivo: dbObject["REG_FE_TD_DF_SU_NEX_DI_DT" + i + "_TipoImpositivo"],
                BaseImponible: dbObject["REG_FE_TD_DF_SU_NEX_DI_DT" + i + "_BaseImponible"],
                CuotaRepercutida: dbObject["REG_FE_TD_DF_SU_NEX_DI_DT" + i + "_CuotaRepercutida"]
              }
              if (dbObject["REG_FE_TD_DF_SU_NEX_DI_DT" + i + "_TipoREquivalencia"])
                detalleIva.TipoRecargoEquivalencia = dbObject["REG_FE_TD_DF_SU_NEX_DI_DT" + i + "_TipoREquivalencia"];
              if (dbObject["REG_FE_TD_DF_SU_NEX_DI_DT" + i + "_CuotaREquivalencia"])
                detalleIva.TipoRecargoEquivalencia = dbObject["REG_FE_TD_DF_SU_NEX_DI_DT" + i + "_CuotaREquivalencia"];
              detallesIva.push(detalleIva);
            }
          }
          jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose.DesgloseFactura.Sujeta.NoExenta.DesgloseIVA = {
            DetalleIVA: detallesIva
          }
        }
      } else {
        // NO está sujeta 
        jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose = {
          DesgloseFactura: {
            NoSujeta: {
              Exenta: {
                CausaExeImportePorArticulos7_14_Otros: dbObject.REG_FE_TD_DF_NSU_ImportePorArticulos7_14_Otros,
                ImporteTAIReglasLocalizacion: dbObject.REG_FE_TD_DF_NSU_ImporteTAIReglasLocalizacion
              }
            }
          }
        }
      }
    }
    if (esDesgloseTipoOperacion) {
      jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose = { DesgloseTipoOperacion: {} };
      // Determinamos la parte que corresponde a servicios y la parte de entrega (en teoría deberín estar las dos)
      // si no ¿Para qué está haciendo una factura con desglose
      // -- SERVICIOS ----------------------------------------------------------------------------------------------------
      jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose.DesgloseTipoOperacion = { PrestacionServicios: {} }
      // Sujeta o no sujeta?
      var esSujetaConDesgloseServicios = dbObject.REG_FE_TD_DTS_SU_EX_CausaExencion || dbObject.REG_FE_TD_DTS_SU_NEX_TipoNoExenta;
      if (esSujetaConDesgloseServicios) {
        // Factura con desglose sujeta (servicios)
        if (dbObject.REG_FE_TD_DTS_SU_EX_CausaExencion) {
          // Factura con desglose sujeta (servicios) exenta de IVA
          jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose.DesgloseTipoOperacion.PrestacionServicios = {
            Sujeta: {
              Exenta: {
                CausaExencion: dbObject.REG_FE_TD_DTS_SU_EX_CausaExencion,
                BaseImponible: dbObject.REG_FE_TD_DTS_SU_EX_BaseImponible
              }
            }
          }
        } else {
          // Factura con desglose sujeta (servicios) NO exenta de IVA
          jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose.DesgloseTipoOperacion.PrestacionServicios = {
            Sujeta: {
              NoExenta: {
                TipoNoExenta: dbObject.REG_FE_TD_DTS_SU_NEX_TipoNoExenta
              }
            }
          }
          // Vamos viendo los 6 posibles tipos de IVA a declarar
          var detallesIva = [];
          for (var i = 1; i <= 6; i++) {
            var reg = "REG_FE_TD_DTS_SU_NEX_DI_DT" + i + "_TipoImpositivo";
            if (dbObject[reg] != null) {
              // hay un tipo para declarar
              var detalleIva = {
                TipoImpositivo: dbObject["REG_FE_TD_DTS_SU_NEX_DI_DT" + i + "_TipoImpositivo"],
                BaseImponible: dbObject["REG_FE_TD_DTS_SU_NEX_DI_DT" + i + "_BaseImponible"],
                CuotaRepercutida: dbObject["REG_FE_TD_DTS_SU_NEX_DI_DT" + i + "_CuotaRepercutida"]
              }
              if (dbObject["REG_FE_TD_DTS_SU_NEX_DI_DT" + i + "_TipoREquivalencia"])
                detalleIva.TipoRecargoEquivalencia = dbObject["REG_FE_TD_DTS_SU_NEX_DI_DT" + i + "_TipoREquivalencia"];
              if (dbObject["REG_FE_TD_DTS_SU_NEX_DI_DT" + i + "_CuotaREquivalencia"])
                detalleIva.TipoRecargoEquivalencia = dbObject["REG_FE_TD_DTS_SU_NEX_DI_DT" + i + "_CuotaREquivalencia"];              
              detallesIva.push(detalleIva);
            }
          }
          jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose.DesgloseTipoOperacion.PrestacionServicios.Sujeta.NoExenta.DesgloseIVA = {
            DetalleIVA: detallesIva
          }
        }
      } else {
        // Factura con desglose no sujeta (servicios)
        jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose.DesgloseTipoOperacion.PrestacionServicios = {
          NoSujeta: {
            ImportePorArticulos7_14_Otros: dbObject.REG_FE_TD_DTS_NSU_ImportePorArticulos7_14_Otros,
            ImporteTAIReglasLocalizacion: dbObject.REG_FE_TD_DTS_NSU_ImporteTAIReglasLocalizacion
          }
        }
      }
      // -- ENTREGA --------------------------------------------------------------------------------------------
      jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose.DesgloseTipoOperacion = { Entrega: {} }
      // Sujeta o no sujeta?
      var esSujetaConDesgloseEntrega = dbObject.REG_FE_TD_DTE_SU_EX_CausaExencion || dbObject.REG_FE_TD_DTE_SU_NEX_TipoNoExenta;
      if (esSujetaConDesgloseEntrega) {
        // Factura con desglose sujeta (entrega)
        if (dbObject.REG_FE_TD_DTE_SU_EX_CausaExencion) {
          // Factura con desglose sujeta (enrega) exenta de IVA
          jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose.DesgloseTipoOperacion.Entrega = {
            Sujeta: {
              Exenta: {
                CausaExencion: dbObject.REG_FE_TD_DTE_SU_EX_CausaExencion,
                BaseImponible: dbObject.REG_FE_TD_DTE_SU_EX_BaseImponible
              }
            }
          }
        } else {
          // Factura con desglose sujeta (entrega) NO exenta de IVA
          jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose.DesgloseTipoOperacion.Entrega = {
            Sujeta: {
              NoExenta: {
                TipoNoExenta: dbObject.REG_FE_TD_DTE_SU_NEX_TipoNoExenta
              }
            }
          }
          // Vamos viendo los 6 posibles tipos de IVA a declarar
          var detallesIva = [];
          for (var i = 1; i <= 6; i++) {
            var reg = "REG_FE_TD_DTE_SU_NEX_DI_DT" + i + "_TipoImpositivo";
            if (dbObject[reg] != null) {
              // hay un tipo para declarar
              var detalleIva = {
                TipoImpositivo: dbObject["REG_FE_TD_DTE_SU_NEX_DI_DT" + i + "_TipoImpositivo"],
                BaseImponible: dbObject["REG_FE_TD_DTE_SU_NEX_DI_DT" + i + "_BaseImponible"],
                CuotaRepercutida: dbObject["REG_FE_TD_DTE_SU_NEX_DI_DT" + i + "_CuotaRepercutida"]
              }
              if (dbObject["REG_FE_TD_DTE_SU_NEX_DI_DT" + i + "_TipoREquivalencia"])
                detalleIva.TipoRecargoEquivalencia = dbObject["REG_FE_TD_DTE_SU_NEX_DI_DT" + i + "_TipoREquivalencia"];
              if (dbObject["REG_FE_TD_DTE_SU_NEX_DI_DT" + i + "_CuotaREquivalencia"])
                detalleIva.TipoRecargoEquivalencia = dbObject["REG_FE_TD_DTE_SU_NEX_DI_DT" + i + "_CuotaREquivalencia"];
              detallesIva.push(detalleIva);
            }
          }
          jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose.DesgloseTipoOperacion.Entrega.Sujeta.NoExenta.DesgloseIVA = {
            DetalleIVA: detallesIva
          }
        }
      } else {
        // Factura con desglose no sujeta (entrega)
        jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose.DesgloseTipoOperacion.Entrega = {
          NoSujeta: {
            ImportePorArticulos7_14_Otros: dbObject.REG_FE_TD_DTE_NSU_ImportePorArticulos7_14_Otros,
            ImporteTAIReglasLocalizacion: dbObject.REG_FE_TD_DTE_NSU_ImporteTAIReglasLocalizacion
          }
        }
      }
    }
    return jsObject;
  }
}

module.exports = faturasEmitidasDbToJsAPI;