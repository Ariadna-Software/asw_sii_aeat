// facturasRecibidas.dbToJs.js

var moment = require("moment");

var faturasRecibidasDbToJsAPI = {
  // recibidasDbToJs
  // de un objeto leido de la base de datos monta el JS que se le
  // enviará al servicio web de la AEAT
  recibidasDbToJs: function (dbObject) {
    var jsObject = {};
    // Obligatorio en todas las recibidas
    jsObject.Cabecera = {
      IDVersionSii: dbObject.CAB_IDVersionSii,
      Titular: {
        NombreRazon: dbObject.CAB_Titular_NombreRazon,
        NIFRepresentante: dbObject.CAB_Titular_NIFRepresentante,
        NIF: dbObject.CAB_Titular_NIF
      },
      TipoComunicacion: dbObject.CAB_TipoComunicacion
    };
    jsObject.RegistroLRFacturasRecibidas = {
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
      FacturaRecibida: {
        TipoFactura: dbObject.REG_FR_TipoFactura,
        TipoRectificativa: dbObject.REG_FR_TipoRectificativa,
      }
    };
    // Por si hay IDOtro en la identificación del emisor
    if (dbObject.REG_IDF_IDEF_IDOtro_ID) {
      jsObject.RegistroLRFacturasRecibidas.IDFactura.IDEmisorFactura.IDOtro = {
        CodigoPais: dbObject.REG_IDF_IDEF_IDOtro_CodigoPais,
        IDType: dbObject.REG_IDF_IDEF_IDOtro_IDType,
        ID: dbObject.REG_IDF_IDEF_IDOtro_ID
      }
      // Eliminamos el NIF para que no haya problemas de cruce
      delete jsObject.RegistroLRFacturasRecibidas.IDFactura.IDEmisorFactura.NIF;
    }
    // Es el caso de envío de facturas agrupadas
    if (dbObject.REG_FR_FA_IDFA_NumSerieFacturaEmisor) {
      jsObject.RegistroLRFacturasRecibidas.FacturaRecibida.FacturasAgrupadas = {
        IDFacturaAgrupada: {
          NumSerieFacturaEmisor: dbObject.REG_FR_FA_IDFA_NumSerieFacturaEmisor,
          FechaExpedicionFacturaEmisor: moment(dbObject.REG_FR_FA_IDFA_FechaExpedicionFacturaEmisor).format("DD-MM-YYYY")
        }
      }
    }
    // Es el caso de facturas rectificadas
    if (dbObject.REG_FR_FR_IDR_NumSerieFacturaEmisor) {
      jsObject.RegistroLRFacturasRecibidas.FacturaRecibida.FacturasRectificadas = {
        IDFacturaRectificada: {
          NumSerieFacturaEmisor: dbObject.REG_FR_FR_IDR_NumSerieFacturaEmisor,
          FechaExpedicionFacturaEmisor: moment(dbObject.REG_FR_FR_IDR_FechaExpedicionFacturaEmisor).format("DD-MM-YYYY")
        }
      }
    }
    // Caso de factura rectificativa por sustitución
    if (dbObject.REG_FR_IR_BaseRectificada || dbObject.REG_FR_IR_BaseRectificada == 0) {
      jsObject.RegistroLRFacturasRecibidas.FacturaRecibida.ImporteRectificacion = {
        BaseRectificada: dbObject.REG_FR_IR_BaseRectificada,
        CuotaRectificada: dbObject.REG_FR_IR_CuotaRectificada,
        CuotaRecargoRectificado: dbObject.REG_FR_IR_CuotaRecargoRectificado
      }
    }
    // Obligatorio en todas las facturas recibidas
    if (dbObject.REG_FR_FechaOperacion)
      jsObject.RegistroLRFacturasRecibidas.FacturaRecibida.FechaOperacion = moment(dbObject.REG_FR_FechaOperacion).format("DD-MM-YYYY");
    jsObject.RegistroLRFacturasRecibidas.FacturaRecibida.ClaveRegimenEspecialOTrascendencia = dbObject.REG_FR_ClaveRegimenEspecialOTrascendencia;
    jsObject.RegistroLRFacturasRecibidas.FacturaRecibida.ClaveRegimenEspecialOTrascendenciaAdicional1 = dbObject.REG_FR_ClaveRegimenEspecialOTrascendenciaAdicional1;
    jsObject.RegistroLRFacturasRecibidas.FacturaRecibida.ClaveRegimenEspecialOTrascendenciaAdicional2 = dbObject.REG_FR_ClaveRegimenEspecialOTrascendenciaAdicional2;
    jsObject.RegistroLRFacturasRecibidas.FacturaRecibida.NumRegistroAcuerdoFacturacion = dbObject.REG_FR_NumRegistroAcuerdoFacturacion;
    jsObject.RegistroLRFacturasRecibidas.FacturaRecibida.ImporteTotal = dbObject.REG_FR_ImporteTotal;
    jsObject.RegistroLRFacturasRecibidas.FacturaRecibida.BaseImponibleACoste = dbObject.REG_FR_BaseImponibleACoste;
    jsObject.RegistroLRFacturasRecibidas.FacturaRecibida.DescripcionOperacion = dbObject.REG_FR_DescripcionOperacion;

    // Comprobamos el desglose de IVA correspondiente a sujeto pasivo
    var detallesIva = [];
    for (var i = 1; i <= 6; i++) {
      var reg = "REG_FR_DF_ISP_DI_DT" + i + "_TipoImpositivo";
      if (dbObject[reg] != null) {
        // hay un tipo para declarar
        var detalleIva = {
          TipoImpositivo: dbObject["REG_FR_DF_ISP_DI_DT" + i + "_TipoImpositivo"],
          BaseImponible: dbObject["REG_FR_DF_ISP_DI_DT" + i + "_BaseImponible"],
          CuotaSoportada: dbObject["REG_FR_DF_ISP_DI_DT" + i + "_CuotaSoportada"]
        }
        if (dbObject["REG_FR_DF_ISP_DI_DT" + i + "_TipoREquivalencia"])
          detalleIva.TipoRecargoEquivalencia = dbObject["REG_FR_DF_ISP_DI_DT" + i + "_TipoREquivalencia"];
        if (dbObject["REG_FR_DF_ISP_DI_DT" + i + "_CuotaREquivalencia"])
          detalleIva.CuotaRecargoEquivalencia = dbObject["REG_FR_DF_ISP_DI_DT" + i + "_CuotaREquivalencia"];
        // --Agregar bien de inversion [VRS 1.4.0]
        if (dbObject["REG_FR_DF_ISP_DI_DT" + i + "_BienInversion"])
          detalleIva.BienInversion = dbObject["REG_FR_DF_ISP_DI_DT" + i + "_BienInversion"];
  
        detallesIva.push(detalleIva);
      }
    }
    if (detallesIva.length > 0) {
      jsObject.RegistroLRFacturasRecibidas.FacturaRecibida.DesgloseFactura = {
        InversionSujetoPasivo: {
          DetalleIVA: detallesIva
        }
      }
    }

    // Comprobamos el desglose de IVA que no es de sujeto pasivo
    var detallesIva = [];
    for (var i = 1; i <= 6; i++) {
      var reg = "REG_FR_DF_DGI_DI_DT" + i + "_TipoImpositivo";
      var reg2 = "REG_FR_DF_DGI_DI_DT" + i + "_PorcentCompensacionREAGYP";
      if (dbObject[reg] != null || dbObject[reg2] != null) {
        // hay un tipo para declarar
        var detalleIva = {};
        if (dbObject["REG_FR_DF_DGI_DI_DT" + i + "_TipoImpositivo"])
          detalleIva.TipoImpositivo = dbObject["REG_FR_DF_DGI_DI_DT" + i + "_TipoImpositivo"];
        detalleIva.BaseImponible = dbObject["REG_FR_DF_DGI_DI_DT" + i + "_BaseImponible"];
        if (dbObject["REG_FR_DF_DGI_DI_DT" + i + "_CuotaSoportada"])
          detalleIva.CuotaSoportada = dbObject["REG_FR_DF_DGI_DI_DT" + i + "_CuotaSoportada"];
        if (dbObject["REG_FR_DF_DGI_DI_DT" + i + "_TipoREquivalencia"])
          detalleIva.TipoRecargoEquivalencia = dbObject["REG_FR_DF_DGI_DI_DT" + i + "_TipoREquivalencia"];
        if (dbObject["REG_FR_DF_DGI_DI_DT" + i + "_CuotaREquivalencia"])
          detalleIva.TipoRecargoEquivalencia = dbObject["REG_FR_DF_DGI_DI_DT" + i + "_CuotaREquivalencia"];
        if (dbObject["REG_FR_DF_DGI_DI_DT" + i + "_PorcentCompensacionREAGYP"])
          detalleIva.PorcentCompensacionREAGYP = dbObject["REG_FR_DF_DGI_DI_DT" + i + "_PorcentCompensacionREAGYP"];
        if (dbObject["REG_FR_DF_DGI_DI_DT" + i + "_ImporteCompensacionREAGYP"])
          detalleIva.ImporteCompensacionREAGYP = dbObject["REG_FR_DF_DGI_DI_DT" + i + "_ImporteCompensacionREAGYP"];
        // --Agregar bien de inversion [VRS 1.4.0]
        if (dbObject["REG_FR_DF_DGI_DI_DT" + i + "_BienInversion"])
          detalleIva.BienInversion = dbObject["REG_FR_DF_DGI_DI_DT" + i + "_BienInversion"];          
        detallesIva.push(detalleIva);
      }
    }
    if (detallesIva.length > 0) {
      jsObject.RegistroLRFacturasRecibidas.FacturaRecibida.DesgloseFactura = {
        DesgloseIVA: {
          DetalleIVA: detallesIva
        }
      }
    }

    // La contraparte es obligatoria salvo en F2 (Simplificadas)
    if (dbObject.REG_FR_CNT_NIF || dbObject.REG_FR_CNT_IDOtro_ID) {
      jsObject.RegistroLRFacturasRecibidas.FacturaRecibida.Contraparte = {
        NombreRazon: dbObject.REG_FR_CNT_NombreRazon,
        NIFRepresentante: dbObject.REG_FR_CNT_NIFRepresentante,
        NIF: dbObject.REG_FR_CNT_NIF
      }
      // Caso de que se necesite identifcación adicional en la contraparte
      if (dbObject.REG_FR_CNT_IDOtro_ID) {
        jsObject.RegistroLRFacturasRecibidas.FacturaRecibida.Contraparte.IDOtro = {
          CodigoPais: dbObject.REG_FR_CNT_IDOtro_CodigoPais,
          IDType: dbObject.REG_FR_CNT_IDOtro_IDType,
          ID: dbObject.REG_FR_CNT_IDOtro_ID
        }
        // Eliminamos el otro NIF para evitar problemas
        delete jsObject.RegistroLRFacturasRecibidas.FacturaRecibida.Contraparte.NIF;
      }
    }

    //
    jsObject.RegistroLRFacturasRecibidas.FacturaRecibida.FechaRegContable = moment(dbObject.REG_FR_FechaRegContable).format("DD-MM-YYYY");
    jsObject.RegistroLRFacturasRecibidas.FacturaRecibida.CuotaDeducible = dbObject.REG_FR_CuotaDeducible;
    return jsObject;
  }
}

module.exports = faturasRecibidasDbToJsAPI;