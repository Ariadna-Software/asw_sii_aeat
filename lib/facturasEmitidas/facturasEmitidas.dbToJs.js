// facturasEmitidas.dbToJs.js

var moment = require("moment");
var fs = require("fs");

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
      PeriodoLiquidacion: {
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
          FechaExpedicionFacturaEmisor: moment(dbObject.REG_FE_FA_IDFA_FechaExpedicionFacturaEmisor).format("DD-MM-YYYY")
        }
      }
    }
    // Es el caso de facturas rectificadas
    if (dbObject.REG_FE_FR_IDR_NumSerieFacturaEmisor) {
      jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.FacturasRectificadas = {
        IDFacturaRectificada: {
          NumSerieFacturaEmisor: dbObject.REG_FE_FR_IDR_NumSerieFacturaEmisor,
          FechaExpedicionFacturaEmisor: moment(dbObject.REG_FE_FR_IDR_FechaExpedicionFacturaEmisor).format("DD-MM-YYYY")
        }
      }
    }
    // Caso de factura rectificativa por sustitución
    if (dbObject.REG_FE_IR_BaseRectificada || dbObject.REG_FE_IR_BaseRectificada == 0) {
      jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.ImporteRectificacion = {
        BaseRectificada: dbObject.REG_FE_IR_BaseRectificada,
        CuotaRectificada: dbObject.REG_FE_IR_CuotaRectificada,
        CuotaRecargoRectificado: dbObject.REG_FE_IR_CuotaRecargoRectificado
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
          ReferenciaCatastral: dbObject.REG_FE_DI_DT_ReferenciaCatastral
        }
      }
    }
    // Caso muy especial de transmision
    if (dbObject.REG_FE_ImporteTransmisionInmueblesSujetoAIVA) {
      jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.ImporteTransmisionInmueblesSujetoAIVA = dbObject.REG_FE_ImporteTransmisionInmueblesSujetoAIVA;
    }
    // Los siguientes tres casos pueden tenner valor nulo en los campos
    // y en el caso de ser así el valor por defecto es no = 'N'
    if (dbObject.REG_FE_EmitidaPorTercero) {
      jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.EmitidaPorTercerosODestinatario = dbObject.REG_FE_EmitidaPorTercero;
    } else {
      // si no hay informado, por defecto no
      jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.EmitidaPorTercerosODestinatario = "N";
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
    if (dbObject.REG_FE_CNT_NIF || dbObject.REG_FE_CNT_IDOtro_ID) {
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
        // El nif ya no se pone porque está identificado por IDOtro y evitamos problemas
        delete jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.Contraparte.NIF;
      }
    }
    // Hay que ver el tipo de desglose del que se trate
    var esDesgloseFactura = dbObject.REG_FE_TD_DF_SU_EX_CausaExencion
      || dbObject.REG_FE_TD_DF_SU_NEX_TipoNoExenta
      || dbObject.REG_FE_TD_DF_NSU_ImportePorArticulos7_14_Otros
      || dbObject.REG_FE_TD_DF_NSU_ImporteTAIReglasLocalizacion;
    var esDesgloseTipoOperacion = dbObject.REG_FE_TD_DTS_SU_EX_CausaExencion
      || dbObject.REG_FE_TD_DTS_SU_NEX_TipoNoExenta
      || dbObject.REG_FE_TD_DTE_SU_EX_CausaExencion
      || dbObject.REG_FE_TD_DTE_SU_NEX_TipoNoExenta
      || dbObject.REG_FE_TD_DTS_NSU_ImportePorArticulos7_14_Otro
      || dbObject.REG_FE_TD_DTS_NSU_ImporteTAIReglasLocalizacion;
    if (esDesgloseFactura) {
      // Comprobar si está sujeta o no
      var estaSujeta = !(dbObject.REG_FE_TD_DF_NSU_ImportePorArticulos7_14_Otros || dbObject.REG_FE_TD_DF_NSU_ImporteTAIReglasLocalizacion);
      if (estaSujeta) {
        //-------------------------
        // Nueva zona comun porque se puede declarar exenta y no exenta. (VRS 1.2.0)
        // Factura no exenta de IVA

        jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose = {
          DesgloseFactura: {
            Sujeta: {}
          }
        }

        if (dbObject.REG_FE_TD_DF_SU_NEX_TipoNoExenta) {
          jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose.DesgloseFactura.Sujeta.NoExenta = {
            TipoNoExenta: dbObject.REG_FE_TD_DF_SU_NEX_TipoNoExenta
          }
        }
        if (dbObject.REG_FE_TD_DF_SU_EX_CausaExencion) {
          // Factura exenta de IVA
          jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose.DesgloseFactura.Sujeta.Exenta = {
            DetalleExenta: {
              CausaExencion: dbObject.REG_FE_TD_DF_SU_EX_CausaExencion,
              BaseImponible: dbObject.REG_FE_TD_DF_SU_EX_BaseImponible
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
              detalleIva.CuotaRecargoEquivalencia = dbObject["REG_FE_TD_DF_SU_NEX_DI_DT" + i + "_CuotaREquivalencia"];
            detallesIva.push(detalleIva);
          }
        }
        jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose.DesgloseFactura.Sujeta.NoExenta.DesgloseIVA = {
          DetalleIVA: detallesIva
        }

        //-----------------------------------------

        // // Determinamos si la factura está exenta de IVA o no
        // if (dbObject.REG_FE_TD_DF_SU_EX_CausaExencion) {
        //   // Factura exenta de IVA
        //   jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose = {
        //     DesgloseFactura: {
        //       Sujeta: {
        //         Exenta: {
        //           DetalleExenta: {
        //             CausaExencion: dbObject.REG_FE_TD_DF_SU_EX_CausaExencion,
        //             BaseImponible: dbObject.REG_FE_TD_DF_SU_EX_BaseImponible
        //           }
        //         }
        //       }
        //     }
        //   }
        // } else {
        //   // Factura no exenta de IVA
        //   jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose = {
        //     DesgloseFactura: {
        //       Sujeta: {
        //         NoExenta: {
        //           TipoNoExenta: dbObject.REG_FE_TD_DF_SU_NEX_TipoNoExenta
        //         }
        //       }
        //     }
        //   }
        //   // Vamos viendo los 6 posibles tipos de IVA a declarar
        //   var detallesIva = [];
        //   for (var i = 1; i <= 6; i++) {
        //     var reg = "REG_FE_TD_DF_SU_NEX_DI_DT" + i + "_TipoImpositivo";
        //     if (dbObject[reg] != null) {
        //       // hay un tipo para declarar
        //       var detalleIva = {
        //         TipoImpositivo: dbObject["REG_FE_TD_DF_SU_NEX_DI_DT" + i + "_TipoImpositivo"],
        //         BaseImponible: dbObject["REG_FE_TD_DF_SU_NEX_DI_DT" + i + "_BaseImponible"],
        //         CuotaRepercutida: dbObject["REG_FE_TD_DF_SU_NEX_DI_DT" + i + "_CuotaRepercutida"]
        //       }
        //       if (dbObject["REG_FE_TD_DF_SU_NEX_DI_DT" + i + "_TipoREquivalencia"])
        //         detalleIva.TipoRecargoEquivalencia = dbObject["REG_FE_TD_DF_SU_NEX_DI_DT" + i + "_TipoREquivalencia"];
        //       if (dbObject["REG_FE_TD_DF_SU_NEX_DI_DT" + i + "_CuotaREquivalencia"])
        //         detalleIva.CuotaRecargoEquivalencia = dbObject["REG_FE_TD_DF_SU_NEX_DI_DT" + i + "_CuotaREquivalencia"];
        //       detallesIva.push(detalleIva);
        //     }
        //   }
        //   jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose.DesgloseFactura.Sujeta.NoExenta.DesgloseIVA = {
        //     DetalleIVA: detallesIva
        //   }
        // }
      } else {
        // NO está sujeta 
        jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose = {
          DesgloseFactura: {
            NoSujeta: {
              ImportePorArticulos7_14_Otros: dbObject.REG_FE_TD_DF_NSU_ImportePorArticulos7_14_Otros,
              ImporteTAIReglasLocalizacion: dbObject.REG_FE_TD_DF_NSU_ImporteTAIReglasLocalizacion
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
      var esNoSujetaConDesgloseServicios = dbObject.REG_FE_TD_DTS_NSU_ImportePorArticulos7_14_Otros || dbObject.REG_FE_TD_DTS_NSU_ImporteTAIReglasLocalizacion;
      if (esSujetaConDesgloseServicios) {
        // Factura con desglose sujeta (servicios)
        if (dbObject.REG_FE_TD_DTS_SU_EX_CausaExencion) {
          // Factura con desglose sujeta (servicios) exenta de IVA
          jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose.DesgloseTipoOperacion.PrestacionServicios = {
            Sujeta: {
              Exenta: {
                DetalleExenta: {
                  CausaExencion: dbObject.REG_FE_TD_DTS_SU_EX_CausaExencion,
                  BaseImponible: dbObject.REG_FE_TD_DTS_SU_EX_BaseImponible
                }
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
      }
      if (esNoSujetaConDesgloseServicios) {
        // Factura con desglose no sujeta (servicios)
        jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose.DesgloseTipoOperacion.PrestacionServicios = {
          NoSujeta: {
            ImportePorArticulos7_14_Otros: dbObject.REG_FE_TD_DTS_NSU_ImportePorArticulos7_14_Otros,
            ImporteTAIReglasLocalizacion: dbObject.REG_FE_TD_DTS_NSU_ImporteTAIReglasLocalizacion
          }
        }
      }
      // -- ENTREGA --------------------------------------------------------------------------------------------
      // Sujeta o no sujeta?
      var esSujetaConDesgloseEntrega = dbObject.REG_FE_TD_DTE_SU_EX_CausaExencion || dbObject.REG_FE_TD_DTE_SU_NEX_TipoNoExenta;
      var esNoSujetaConDesgloseEntrega = dbObject.REG_FE_TD_DTE_NSU_ImportePorArticulos7_14_Otros || dbObject.REG_FE_TD_DTE_NSU_ImporteTAIReglasLocalizacion;
      if (esSujetaConDesgloseEntrega) {
        jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose.DesgloseTipoOperacion = { Entrega: {} }
        // Factura con desglose sujeta (entrega)
        if (dbObject.REG_FE_TD_DTE_SU_EX_CausaExencion) {
          // Factura con desglose sujeta (enrega) exenta de IVA
          jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose.DesgloseTipoOperacion.Entrega = {
            Sujeta: {
              Exenta: {
                DetalleExenta: {
                  CausaExencion: dbObject.REG_FE_TD_DTE_SU_EX_CausaExencion,
                  BaseImponible: dbObject.REG_FE_TD_DTE_SU_EX_BaseImponible
                }
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
      }
      if (esNoSujetaConDesgloseEntrega) {
        jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose.DesgloseTipoOperacion = { Entrega: {} }
        // Factura con desglose no sujeta (entrega)
        jsObject.RegistroLRFacturasEmitidas.FacturaExpedida.TipoDesglose.DesgloseTipoOperacion.Entrega = {
          NoSujeta: {
            ImportePorArticulos7_14_Otros: dbObject.REG_FE_TD_DTE_NSU_ImportePorArticulos7_14_Otros,
            ImporteTAIReglasLocalizacion: dbObject.REG_FE_TD_DTE_NSU_ImporteTAIReglasLocalizacion
          }
        }
      }
    }
    // fs.writeFileSync('/tmp/fEnviada.json', JSON.stringify(jsObject, null, 2));
    return jsObject;
  }
}

module.exports = faturasEmitidasDbToJsAPI;