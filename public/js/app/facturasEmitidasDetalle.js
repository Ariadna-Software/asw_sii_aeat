/*
 facturasEmitidas.js
 Funciones propias de la página FacturasEmitidas.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;
var gruposUsuarioId = 0;
var vm;

var apiFacturasEmitidasDetalle = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);

        vm = new apiFacturasEmitidasDetalle.datosPagina();
        ko.applyBindings(vm);

        $('#facturasEmitidas').attr('class', 'active');
        $('#facturaEmitida-form').submit(function () { return false; });
        $('#btnAceptar').click(apiFacturasEmitidasDetalle.aceptar);
        $('#btnSalir').click(apiFacturasEmitidasDetalle.salir);

        // Titulares
        $('#cmbTitulares').select2(select2_languages[usuario.codigoIdioma]);
        apiFacturasEmitidasDetalle.cargarTitulares();
        $("#cmbTitulares").select2().on('change', function (e) {
            apiFacturasEmitidasDetalle.cambioTitular(e.added);
        });
        // Emisores
        $('#cmbEmisores').select2(select2_languages[usuario.codigoIdioma]);
        apiFacturasEmitidasDetalle.cargarEmisores();
        $("#cmbEmisores").select2().on('change', function (e) {
            apiFacturasEmitidasDetalle.cambioEmisor(e.added);
        });
        IDEnvioFacturasEmitidas = apiComunGeneral.gup("id");
        if (IDEnvioFacturasEmitidas == 0) {
            vm.IDEnvioFacturasEmitidas(0);
        } else {
            apiFacturasEmitidasDetalle.cargarFacturasEmitidas(IDEnvioFacturasEmitidas);
        }
    },
    cargarFacturasEmitidas: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/facturasEmitidas/" + id, null, function (err, data) {
            if (err) return;
            apiFacturasEmitidasDetalle.cargarDatosPagina(data);
        });
    },
    cargarDatosPagina: function (data) {
        vm.IDEnvioFacturasEmitidas(data.IDEnvioFacturasEmitidas);
        vm.Origen(data.Origen);
        vm.FechaHoraCreacion(moment(data.FechaHoraCreacion).format(i18n.t('util.date_format')));
        vm.EnvioInmediato(data.EnvioInmediato);
        vm.Enviada(data.Enviada);
        vm.Resultado(data.Resultado);
        vm.CSV(data.CSV);
        vm.Mensaje(data.Mensaje);
        vm.XML_Enviado(data.XML_Enviado);
        // Cabecera
        vm.CAB_IDVersionSii(data.CAB_IDVersionSii);
        vm.CAB_Titular_NombreRazon(data.CAB_Titular_NombreRazon);
        vm.CAB_Titular_NIFRepresentante(data.CAB_Titular_NIFRepresentante);
        vm.CAB_Titular_NIF(data.CAB_Titular_NIF);
        vm.CAB_TipoComunicacion(data.CAB_TipoComunicacion);
        // Registro
        vm.REG_PI_Ejercicio(data.REG_PI_Ejercicio);
        vm.REG_PI_Periodo(data.REG_PI_Periodo);
        vm.REG_IDF_IDEF_NIF(data.REG_IDF_IDEF_NIF);
        vm.REG_IDF_NumSerieFacturaEmisor(data.REG_IDF_NumSerieFacturaEmisor);
        vm.REG_IDF_NumSerieFacturaEmisorResumenFin(data.REG_IDF_NumSerieFacturaEmisorResumenFin);
        vm.REG_IDF_FechaExpedicionFacturaEmisor(data.REG_IDF_FechaExpedicionFacturaEmisor);
        vm.REG_FE_TipoFactura(data.REG_FE_TipoFactura);
        vm.REG_FE_TipoRectificativa(data.REG_FE_TipoRectificativa);
        vm.REG_FE_FA_IDFA_NumSerieFacturaEmisor(data.REG_FE_FA_IDFA_NumSerieFacturaEmisor);
        vm.REG_FE_FA_IDFA_FechaExpedicionFacturaEmisor(moment(data.REG_FE_FA_IDFA_FechaExpedicionFacturaEmisor).format(i18n.t('util.date_format')));
        vm.REG_FE_FR_IDR_NumSerieFacturaEmisor(data.REG_FE_FR_IDR_NumSerieFacturaEmisor);
        vm.REG_FE_FR_IDR_FechaExpedicionFacturaEmisor(moment(data.REG_FE_FR_IDR_FechaExpedicionFacturaEmisor).format(i18n.t('util.date_format')));
        vm.REG_FE_IR_BaseRectificada(data.REG_FE_IR_BaseRectificada);
        vm.REG_FE_IR_CuotaRectificada(data.REG_FE_IR_CuotaRectificada);
        vm.REG_FE_IR_CuotaRecargoRectificado(data.REG_FE_IR_CuotaRecargoRectificado);
        vm.REG_FE_FechaOperacion(moment(data.REG_FE_FechaOperacion).format(i18n.t('util.date_format')));
        vm.REG_FE_ClaveRegimenEspecialOTrascendencia(data.REG_FE_ClaveRegimenEspecialOTrascendencia);
        vm.REG_FE_ClaveRegimenEspecialOTrascendenciaAdicional1(data.REG_FE_ClaveRegimenEspecialOTrascendenciaAdicional1);
        vm.REG_FE_ClaveRegimenEspecialOTrascendenciaAdicional2(data.REG_FE_ClaveRegimenEspecialOTrascendenciaAdicional2);
        vm.REG_FE_ImporteTotal(data.REG_FE_ImporteTotal);
        vm.REG_FE_BaseImponibleACoste(data.REG_FE_BaseImponibleACoste);
        vm.REG_FE_DescripcionOperacion(data.REG_FE_DescripcionOperacion);
        vm.REG_FE_DI_DT_SituacionInmueble(data.REG_FE_DI_DT_SituacionInmueble);
        vm.REG_FE_DI_DT_ReferenciaCatastral(data.REG_FE_DI_DT_ReferenciaCatastral);
        vm.REG_FE_ImporteTransmisionSujetoAIVA(data.REG_FE_ImporteTransmisionSujetoAIVA);
        vm.REG_FE_EmitidaPorTercero(data.REG_FE_EmitidaPorTercero);
        vm.REG_FE_VariosDestinatarios(data.REG_FE_VariosDestinatarios);
        vm.REG_FE_Cupon(data.REG_FE_Cupon);
        vm.REG_FE_CNT_NombreRazon(data.REG_FE_CNT_NombreRazon);
        vm.REG_FE_CNT_NIFRepresentante(data.REG_FE_CNT_NIFRepresentante);
        vm.REG_FE_CNT_NIF(data.REG_FE_CNT_NIF);
        vm.REG_FE_CNT_IDOtro_CodigoPais(data.REG_FE_CNT_IDOtro_CodigoPais);
        vm.REG_FE_CNT_IDOtro_IDType(data.REG_FE_CNT_IDOtro_IDType);
        vm.REG_FE_CNT_IDOtro_ID(data.REG_FE_CNT_IDOtro_ID);
        vm.REG_FE_TD_DF_SU_EX_CausaExencion(data.REG_FE_TD_DF_SU_EX_CausaExencion);
        vm.REG_FE_TD_DF_SU_EX_BaseImponible(data.REG_FE_TD_DF_SU_EX_BaseImponible);
        vm.REG_FE_TD_DF_SU_NEX_TipoNoExenta(data.REG_FE_TD_DF_SU_NEX_TipoNoExenta);
        // IVA 1
        vm.REG_FE_TD_DF_SU_NEX_DI_DT1_TipoImpositivo(data.REG_FE_TD_DF_SU_NEX_DI_DT1_TipoImpositivo);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT1_BaseImponible(data.REG_FE_TD_DF_SU_NEX_DI_DT1_BaseImponible);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT1_CuotaRepercutida(data.REG_FE_TD_DF_SU_NEX_DI_DT1_CuotaRepercutida);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT1_TipoREquivalencia(data.REG_FE_TD_DF_SU_NEX_DI_DT1_TipoREquivalencia);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT1_CuotaREquivalencia(data.REG_FE_TD_DF_SU_NEX_DI_DT1_CuotaREquivalencia);
        // IVA 2
        vm.REG_FE_TD_DF_SU_NEX_DI_DT2_TipoImpositivo(data.REG_FE_TD_DF_SU_NEX_DI_DT1_TipoImpositivo);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT2_BaseImponible(data.REG_FE_TD_DF_SU_NEX_DI_DT1_BaseImponible);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT2_CuotaRepercutida(data.REG_FE_TD_DF_SU_NEX_DI_DT1_CuotaRepercutida);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT2_TipoREquivalencia(data.REG_FE_TD_DF_SU_NEX_DI_DT1_TipoREquivalencia);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT2_CuotaREquivalencia(data.REG_FE_TD_DF_SU_NEX_DI_DT1_CuotaREquivalencia);
        // IVA 3
        vm.REG_FE_TD_DF_SU_NEX_DI_DT3_TipoImpositivo(data.REG_FE_TD_DF_SU_NEX_DI_DT1_TipoImpositivo);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT3_BaseImponible(data.REG_FE_TD_DF_SU_NEX_DI_DT1_BaseImponible);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT3_CuotaRepercutida(data.REG_FE_TD_DF_SU_NEX_DI_DT1_CuotaRepercutida);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT3_TipoREquivalencia(data.REG_FE_TD_DF_SU_NEX_DI_DT1_TipoREquivalencia);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT3_CuotaREquivalencia(data.REG_FE_TD_DF_SU_NEX_DI_DT1_CuotaREquivalencia);
        // IVA 4
        vm.REG_FE_TD_DF_SU_NEX_DI_DT4_TipoImpositivo(data.REG_FE_TD_DF_SU_NEX_DI_DT1_TipoImpositivo);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT4_BaseImponible(data.REG_FE_TD_DF_SU_NEX_DI_DT1_BaseImponible);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT4_CuotaRepercutida(data.REG_FE_TD_DF_SU_NEX_DI_DT1_CuotaRepercutida);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT4_TipoREquivalencia(data.REG_FE_TD_DF_SU_NEX_DI_DT1_TipoREquivalencia);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT4_CuotaREquivalencia(data.REG_FE_TD_DF_SU_NEX_DI_DT1_CuotaREquivalencia);
        // IVA 5
        vm.REG_FE_TD_DF_SU_NEX_DI_DT5_TipoImpositivo(data.REG_FE_TD_DF_SU_NEX_DI_DT1_TipoImpositivo);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT5_BaseImponible(data.REG_FE_TD_DF_SU_NEX_DI_DT1_BaseImponible);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT5_CuotaRepercutida(data.REG_FE_TD_DF_SU_NEX_DI_DT1_CuotaRepercutida);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT5_TipoREquivalencia(data.REG_FE_TD_DF_SU_NEX_DI_DT1_TipoREquivalencia);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT5_CuotaREquivalencia(data.REG_FE_TD_DF_SU_NEX_DI_DT1_CuotaREquivalencia);
        // IVA 6
        vm.REG_FE_TD_DF_SU_NEX_DI_DT6_TipoImpositivo(data.REG_FE_TD_DF_SU_NEX_DI_DT1_TipoImpositivo);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT6_BaseImponible(data.REG_FE_TD_DF_SU_NEX_DI_DT1_BaseImponible);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT6_CuotaRepercutida(data.REG_FE_TD_DF_SU_NEX_DI_DT1_CuotaRepercutida);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT6_TipoREquivalencia(data.REG_FE_TD_DF_SU_NEX_DI_DT1_TipoREquivalencia);
        vm.REG_FE_TD_DF_SU_NEX_DI_DT6_CuotaREquivalencia(data.REG_FE_TD_DF_SU_NEX_DI_DT1_CuotaREquivalencia);
        //
        vm.REG_FE_TD_DF_NSU_ImportePorArticulos7_14_Otros(data.REG_FE_TD_DF_NSU_ImportePorArticulos7_14_Otros);
        vm.REG_FE_TD_DF_NSU_ImporteTAIReglasLocalizacion(data.REG_FE_TD_DF_NSU_ImporteTAIReglasLocalizacion);
        vm.REG_FE_TD_DTS_SU_EX_CausaExencion(data.REG_FE_TD_DTS_SU_EX_CausaExencion);
        vm.REG_FE_TD_DTS_SU_EX_BaseImponible(data.REG_FE_TD_DTS_SU_EX_BaseImponible);
        vm.REG_FE_TD_DTS_SU_NEX_TipoNoExenta(data.REG_FE_TD_DTS_SU_NEX_TipoNoExenta);
        // IVA 1
        vm.REG_FE_TD_DTS_SU_NEX_DI_DT1_TipoImpositivo(data.REG_FE_TD_DTS_SU_NEX_DI_DT1_TipoImpositivo);
        vm.REG_FE_TD_DTS_SU_NEX_DI_DT1_BaseImponible(data.REG_FE_TD_DTS_SU_NEX_DI_DT1_BaseImponible);
        vm.REG_FE_TD_DTS_SU_NEX_DI_DT1_CuotaRepercutida(data.REG_FE_TD_DTS_SU_NEX_DI_DT1_CuotaRepercutida);
        // IVA 2
        vm.REG_FE_TD_DTS_SU_NEX_DI_DT2_TipoImpositivo(data.REG_FE_TD_DTS_SU_NEX_DI_DT2_TipoImpositivo);
        vm.REG_FE_TD_DTS_SU_NEX_DI_DT2_BaseImponible(data.REG_FE_TD_DTS_SU_NEX_DI_DT2_BaseImponible);
        vm.REG_FE_TD_DTS_SU_NEX_DI_DT2_CuotaRepercutida(data.REG_FE_TD_DTS_SU_NEX_DI_DT2_CuotaRepercutida);
        // IVA 3
        vm.REG_FE_TD_DTS_SU_NEX_DI_DT3_TipoImpositivo(data.REG_FE_TD_DTS_SU_NEX_DI_DT3_TipoImpositivo);
        vm.REG_FE_TD_DTS_SU_NEX_DI_DT3_BaseImponible(data.REG_FE_TD_DTS_SU_NEX_DI_DT3_BaseImponible);
        vm.REG_FE_TD_DTS_SU_NEX_DI_DT3_CuotaRepercutida(data.REG_FE_TD_DTS_SU_NEX_DI_DT3_CuotaRepercutida);
        // IVA 4
        vm.REG_FE_TD_DTS_SU_NEX_DI_DT4_TipoImpositivo(data.REG_FE_TD_DTS_SU_NEX_DI_DT4_TipoImpositivo);
        vm.REG_FE_TD_DTS_SU_NEX_DI_DT4_BaseImponible(data.REG_FE_TD_DTS_SU_NEX_DI_DT4_BaseImponible);
        vm.REG_FE_TD_DTS_SU_NEX_DI_DT4_CuotaRepercutida(data.REG_FE_TD_DTS_SU_NEX_DI_DT4_CuotaRepercutida);
        // IVA 5
        vm.REG_FE_TD_DTS_SU_NEX_DI_DT5_TipoImpositivo(data.REG_FE_TD_DTS_SU_NEX_DI_DT5_TipoImpositivo);
        vm.REG_FE_TD_DTS_SU_NEX_DI_DT5_BaseImponible(data.REG_FE_TD_DTS_SU_NEX_DI_DT5_BaseImponible);
        vm.REG_FE_TD_DTS_SU_NEX_DI_DT5_CuotaRepercutida(data.REG_FE_TD_DTS_SU_NEX_DI_DT5_CuotaRepercutida);
        // IVA 6
        vm.REG_FE_TD_DTS_SU_NEX_DI_DT6_TipoImpositivo(data.REG_FE_TD_DTS_SU_NEX_DI_DT6_TipoImpositivo);
        vm.REG_FE_TD_DTS_SU_NEX_DI_DT6_BaseImponible(data.REG_FE_TD_DTS_SU_NEX_DI_DT6_BaseImponible);
        vm.REG_FE_TD_DTS_SU_NEX_DI_DT6_CuotaRepercutida(data.REG_FE_TD_DTS_SU_NEX_DI_DT6_CuotaRepercutida);
        //
        vm.REG_FE_TD_DTS_NSU_ImportePorArticulos7_14_Otros(data.REG_FE_TD_DTS_NSU_ImportePorArticulos7_14_Otros);
        vm.REG_FE_TD_DTS_NSU_ImporteTAIReglasLocalizacion(data.REG_FE_TD_DTS_NSU_ImporteTAIReglasLocalizacion);
        vm.REG_FE_TD_DTE_SU_EX_CausaExencion(data.REG_FE_TD_DTE_SU_EX_CausaExencion);
        vm.REG_FE_TD_DTE_SU_EX_BaseImponible(data.REG_FE_TD_DTE_SU_EX_BaseImponible);
        vm.REG_FE_TD_DTE_SU_NEX_TipoNoExenta(data.REG_FE_TD_DTE_SU_NEX_TipoNoExenta);
        // IVA 1
        vm.REG_FE_TD_DTE_SU_NEX_DI_DT1_TipoImpositivo(data.REG_FE_TD_DTE_SU_NEX_DI_DT1_TipoImpositivo);
        vm.REG_FE_TD_DTE_SU_NEX_DI_DT1_BaseImponible(data.REG_FE_TD_DTE_SU_NEX_DI_DT1_BaseImponible);
        vm.REG_FE_TD_DTE_SU_NEX_DI_DT1_CuotaRepercutida(data.REG_FE_TD_DTE_SU_NEX_DI_DT1_CuotaRepercutida);
        // IVA 2
        vm.REG_FE_TD_DTE_SU_NEX_DI_DT2_TipoImpositivo(data.REG_FE_TD_DTE_SU_NEX_DI_DT2_TipoImpositivo);
        vm.REG_FE_TD_DTE_SU_NEX_DI_DT2_BaseImponible(data.REG_FE_TD_DTE_SU_NEX_DI_DT2_BaseImponible);
        vm.REG_FE_TD_DTE_SU_NEX_DI_DT2_CuotaRepercutida(data.REG_FE_TD_DTE_SU_NEX_DI_DT2_CuotaRepercutida);
        // IVA 3
        vm.REG_FE_TD_DTE_SU_NEX_DI_DT3_TipoImpositivo(data.REG_FE_TD_DTE_SU_NEX_DI_DT3_TipoImpositivo);
        vm.REG_FE_TD_DTE_SU_NEX_DI_DT3_BaseImponible(data.REG_FE_TD_DTE_SU_NEX_DI_DT3_BaseImponible);
        vm.REG_FE_TD_DTE_SU_NEX_DI_DT3_CuotaRepercutida(data.REG_FE_TD_DTE_SU_NEX_DI_DT3_CuotaRepercutida);
        // IVA 4
        vm.REG_FE_TD_DTE_SU_NEX_DI_DT4_TipoImpositivo(data.REG_FE_TD_DTE_SU_NEX_DI_DT4_TipoImpositivo);
        vm.REG_FE_TD_DTE_SU_NEX_DI_DT4_BaseImponible(data.REG_FE_TD_DTE_SU_NEX_DI_DT4_BaseImponible);
        vm.REG_FE_TD_DTE_SU_NEX_DI_DT4_CuotaRepercutida(data.REG_FE_TD_DTE_SU_NEX_DI_DT4_CuotaRepercutida);
        // IVA 5
        vm.REG_FE_TD_DTE_SU_NEX_DI_DT5_TipoImpositivo(data.REG_FE_TD_DTE_SU_NEX_DI_DT5_TipoImpositivo);
        vm.REG_FE_TD_DTE_SU_NEX_DI_DT5_BaseImponible(data.REG_FE_TD_DTE_SU_NEX_DI_DT5_BaseImponible);
        vm.REG_FE_TD_DTE_SU_NEX_DI_DT5_CuotaRepercutida(data.REG_FE_TD_DTE_SU_NEX_DI_DT5_CuotaRepercutida);
        // IVA 6
        vm.REG_FE_TD_DTE_SU_NEX_DI_DT6_TipoImpositivo(data.REG_FE_TD_DTE_SU_NEX_DI_DT6_TipoImpositivo);
        vm.REG_FE_TD_DTE_SU_NEX_DI_DT6_BaseImponible(data.REG_FE_TD_DTE_SU_NEX_DI_DT6_BaseImponible);
        vm.REG_FE_TD_DTE_SU_NEX_DI_DT6_CuotaRepercutida(data.REG_FE_TD_DTE_SU_NEX_DI_DT6_CuotaRepercutida);
        //
        vm.REG_FE_TD_DTE_NSU_ImportePorArticulos7_14_Otros(data.REG_FE_TD_DTE_NSU_ImportePorArticulos7_14_Otros);
        vm.REG_FE_TD_DTE_NSU_ImporteTAIReglasLocalizacion(data.REG_FE_TD_DTE_NSU_ImporteTAIReglasLocalizacion);
    },
    datosPagina: function () {
        var self = this;
        self.IDEnvioFacturasEmitidas = ko.observable();
        self.Origen = ko.observable();
        self.FechaHoraCreacion = ko.observable();
        self.EnvioInmediato = ko.observable();
        self.Enviada = ko.observable();
        self.Resultado = ko.observable();
        self.CSV = ko.observable();
        self.Mensaje = ko.observable();
        self.XML_Enviado = ko.observable();
        // Titulares
        self.optionsTitulares = ko.observableArray([]);
        self.selectedTitulares = ko.observableArray([]);
        self.sTitular = ko.observable();
        // Emisores
        self.optionsEmisores = ko.observableArray([]);
        self.selectedEmisores = ko.observableArray([]);
        self.sEmisor = ko.observable();
        // Cabecera
        self.CAB_IDVersionSii = ko.observable();
        self.CAB_Titular_NombreRazon = ko.observable();
        self.CAB_Titular_NIFRepresentante = ko.observable();
        self.CAB_Titular_NIF = ko.observable();
        self.CAB_TipoComunicacion = ko.observable();
        // Registro
        self.REG_PI_Ejercicio = ko.observable();
        self.REG_PI_Periodo = ko.observable();
        self.REG_IDF_IDEF_NIF = ko.observable();
        self.REG_IDF_NumSerieFacturaEmisor = ko.observable();
        self.REG_IDF_NumSerieFacturaEmisorResumenFin = ko.observable();
        self.REG_IDF_FechaExpedicionFacturaEmisor = ko.observable();
        self.REG_FE_TipoFactura = ko.observable();
        self.REG_FE_TipoRectificativa = ko.observable();
        self.REG_FE_FA_IDFA_NumSerieFacturaEmisor = ko.observable();
        self.REG_FE_FA_IDFA_FechaExpedicionFacturaEmisor = ko.observable();
        self.REG_FE_FR_IDR_NumSerieFacturaEmisor = ko.observable();
        self.REG_FE_FR_IDR_FechaExpedicionFacturaEmisor = ko.observable();
        self.REG_FE_IR_BaseRectificada = ko.observable();
        self.REG_FE_IR_CuotaRectificada = ko.observable();
        self.REG_FE_IR_CuotaRecargoRectificado = ko.observable();
        self.REG_FE_FechaOperacion = ko.observable();
        self.REG_FE_ClaveRegimenEspecialOTrascendencia = ko.observable();
        self.REG_FE_ClaveRegimenEspecialOTrascendenciaAdicional1 = ko.observable();
        self.REG_FE_ClaveRegimenEspecialOTrascendenciaAdicional2 = ko.observable();
        self.REG_FE_ImporteTotal = ko.observable();
        self.REG_FE_BaseImponibleACoste = ko.observable();
        self.REG_FE_DescripcionOperacion = ko.observable();
        self.REG_FE_DI_DT_SituacionInmueble = ko.observable();
        self.REG_FE_DI_DT_ReferenciaCatastral = ko.observable();
        self.REG_FE_ImporteTransmisionSujetoAIVA = ko.observable();
        self.REG_FE_EmitidaPorTercero = ko.observable();
        self.REG_FE_VariosDestinatarios = ko.observable();
        self.REG_FE_Cupon = ko.observable();
        self.REG_FE_CNT_NombreRazon = ko.observable();
        self.REG_FE_CNT_NIFRepresentante = ko.observable();
        self.REG_FE_CNT_NIF = ko.observable();
        self.REG_FE_CNT_IDOtro_CodigoPais = ko.observable();
        self.REG_FE_CNT_IDOtro_IDType = ko.observable();
        self.REG_FE_CNT_IDOtro_ID = ko.observable();
        self.REG_FE_TD_DF_SU_EX_CausaExencion = ko.observable();
        self.REG_FE_TD_DF_SU_EX_BaseImponible = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_TipoNoExenta = ko.observable();
        // IVA 1
        self.REG_FE_TD_DF_SU_NEX_DI_DT1_TipoImpositivo = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT1_BaseImponible = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT1_CuotaRepercutida = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT1_TipoREquivalencia = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT1_CuotaREquivalencia = ko.observable();
        // IVA 2
        self.REG_FE_TD_DF_SU_NEX_DI_DT2_TipoImpositivo = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT2_BaseImponible = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT2_CuotaRepercutida = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT2_TipoREquivalencia = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT2_CuotaREquivalencia = ko.observable();
        // IVA 3
        self.REG_FE_TD_DF_SU_NEX_DI_DT3_TipoImpositivo = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT3_BaseImponible = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT3_CuotaRepercutida = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT3_TipoREquivalencia = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT3_CuotaREquivalencia = ko.observable();
        // IVA 4
        self.REG_FE_TD_DF_SU_NEX_DI_DT4_TipoImpositivo = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT4_BaseImponible = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT4_CuotaRepercutida = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT4_TipoREquivalencia = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT4_CuotaREquivalencia = ko.observable();
        // IVA 5
        self.REG_FE_TD_DF_SU_NEX_DI_DT5_TipoImpositivo = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT5_BaseImponible = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT5_CuotaRepercutida = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT5_TipoREquivalencia = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT5_CuotaREquivalencia = ko.observable();
        // IVA 6
        self.REG_FE_TD_DF_SU_NEX_DI_DT6_TipoImpositivo = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT6_BaseImponible = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT6_CuotaRepercutida = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT6_TipoREquivalencia = ko.observable();
        self.REG_FE_TD_DF_SU_NEX_DI_DT6_CuotaREquivalencia = ko.observable();
        //
        self.REG_FE_TD_DF_NSU_ImportePorArticulos7_14_Otros = ko.observable();
        self.REG_FE_TD_DF_NSU_ImporteTAIReglasLocalizacion = ko.observable();
        self.REG_FE_TD_DTS_SU_EX_CausaExencion = ko.observable();
        self.REG_FE_TD_DTS_SU_EX_BaseImponible = ko.observable();
        self.REG_FE_TD_DTS_SU_NEX_TipoNoExenta = ko.observable();
        // IVA 1
        self.REG_FE_TD_DTS_SU_NEX_DI_DT1_TipoImpositivo = ko.observable();
        self.REG_FE_TD_DTS_SU_NEX_DI_DT1_BaseImponible = ko.observable();
        self.REG_FE_TD_DTS_SU_NEX_DI_DT1_CuotaRepercutida = ko.observable();
        // IVA 2
        self.REG_FE_TD_DTS_SU_NEX_DI_DT2_TipoImpositivo = ko.observable();
        self.REG_FE_TD_DTS_SU_NEX_DI_DT2_BaseImponible = ko.observable();
        self.REG_FE_TD_DTS_SU_NEX_DI_DT2_CuotaRepercutida = ko.observable();
        // IVA 3
        self.REG_FE_TD_DTS_SU_NEX_DI_DT3_TipoImpositivo = ko.observable();
        self.REG_FE_TD_DTS_SU_NEX_DI_DT3_BaseImponible = ko.observable();
        self.REG_FE_TD_DTS_SU_NEX_DI_DT3_CuotaRepercutida = ko.observable();
        // IVA 4
        self.REG_FE_TD_DTS_SU_NEX_DI_DT4_TipoImpositivo = ko.observable();
        self.REG_FE_TD_DTS_SU_NEX_DI_DT4_BaseImponible = ko.observable();
        self.REG_FE_TD_DTS_SU_NEX_DI_DT4_CuotaRepercutida = ko.observable();
        // IVA 5
        self.REG_FE_TD_DTS_SU_NEX_DI_DT5_TipoImpositivo = ko.observable();
        self.REG_FE_TD_DTS_SU_NEX_DI_DT5_BaseImponible = ko.observable();
        self.REG_FE_TD_DTS_SU_NEX_DI_DT5_CuotaRepercutida = ko.observable();
        // IVA 6
        self.REG_FE_TD_DTS_SU_NEX_DI_DT6_TipoImpositivo = ko.observable();
        self.REG_FE_TD_DTS_SU_NEX_DI_DT6_BaseImponible = ko.observable();
        self.REG_FE_TD_DTS_SU_NEX_DI_DT6_CuotaRepercutida = ko.observable();
        //
        self.REG_FE_TD_DTS_NSU_ImportePorArticulos7_14_Otros = ko.observable();
        self.REG_FE_TD_DTS_NSU_ImporteTAIReglasLocalizacion = ko.observable();
        self.REG_FE_TD_DTE_SU_EX_CausaExencion = ko.observable();
        self.REG_FE_TD_DTE_SU_EX_BaseImponible = ko.observable();
        self.REG_FE_TD_DTE_SU_NEX_TipoNoExenta = ko.observable();
        // IVA1
        self.REG_FE_TD_DTE_SU_NEX_DI_DT1_TipoImpositivo = ko.observable();
        self.REG_FE_TD_DTE_SU_NEX_DI_DT1_BaseImponible = ko.observable();
        self.REG_FE_TD_DTE_SU_NEX_DI_DT1_CuotaRepercutida = ko.observable();
        // IVA2
        self.REG_FE_TD_DTE_SU_NEX_DI_DT2_TipoImpositivo = ko.observable();
        self.REG_FE_TD_DTE_SU_NEX_DI_DT2_BaseImponible = ko.observable();
        self.REG_FE_TD_DTE_SU_NEX_DI_DT2_CuotaRepercutida = ko.observable();
        // IVA3
        self.REG_FE_TD_DTE_SU_NEX_DI_DT3_TipoImpositivo = ko.observable();
        self.REG_FE_TD_DTE_SU_NEX_DI_DT3_BaseImponible = ko.observable();
        self.REG_FE_TD_DTE_SU_NEX_DI_DT3_CuotaRepercutida = ko.observable();
        // IVA4
        self.REG_FE_TD_DTE_SU_NEX_DI_DT4_TipoImpositivo = ko.observable();
        self.REG_FE_TD_DTE_SU_NEX_DI_DT4_BaseImponible = ko.observable();
        self.REG_FE_TD_DTE_SU_NEX_DI_DT4_CuotaRepercutida = ko.observable();
        // IVA5
        self.REG_FE_TD_DTE_SU_NEX_DI_DT5_TipoImpositivo = ko.observable();
        self.REG_FE_TD_DTE_SU_NEX_DI_DT5_BaseImponible = ko.observable();
        self.REG_FE_TD_DTE_SU_NEX_DI_DT5_CuotaRepercutida = ko.observable();
        // IVA6
        self.REG_FE_TD_DTE_SU_NEX_DI_DT6_TipoImpositivo = ko.observable();
        self.REG_FE_TD_DTE_SU_NEX_DI_DT6_BaseImponible = ko.observable();
        self.REG_FE_TD_DTE_SU_NEX_DI_DT6_CuotaRepercutida = ko.observable();
        //
        self.REG_FE_TD_DTE_NSU_ImportePorArticulos7_14_Otros = ko.observable();
        self.REG_FE_TD_DTE_NSU_ImporteTAIReglasLocalizacion = ko.observable();
    },
    aceptar: function () {
        if (!apiFacturasEmitidasDetalle.datosOk()) return;
        var data = {
            IDEnvioFacturasEmitidas: vm.IDEnvioFacturasEmitidas(),
            Origen: vm.Origen(),
            FechaHoraCreacion: vm.FechaHoraCreacion(),
            EnvioInmediato: vm.EnvioInmediato(),
            Enviada: vm.Enviada(),
            Resultado: vm.Resultado(),
            CSV: vm.CSV(),
            Mensaje: vm.Mensaje(),
            XML_Enviado: vm.XML_Enviado(),
            CAB_IDVersionSii: vm.CAB_IDVersionSii(),
            CAB_Titular_NombreRazon: vm.CAB_Titular_NombreRazon(),
            CAB_Titular_NIFRepresentante: vm.CAB_Titular_NIFRepresentante(),
            CAB_Titular_NIF: vm.CAB_Titular_NIF(),
            CAB_TipoComunicacion: vm.CAB_TipoComunicacion(),
            REG_PI_Ejercicio: vm.REG_PI_Ejercicio(),
            REG_PI_Periodo: vm.REG_PI_Periodo(),
            REG_IDF_IDEF_NIF: vm.REG_IDF_IDEF_NIF(),
            REG_IDF_NumSerieFacturaEmisor: vm.REG_IDF_NumSerieFacturaEmisor(),
            REG_IDF_NumSerieFacturaEmisorResumenFin: vm.REG_IDF_NumSerieFacturaEmisorResumenFin(),
            REG_IDF_FechaExpedicionFacturaEmisor: vm.REG_IDF_FechaExpedicionFacturaEmisor(),
            REG_FE_TipoFactura: vm.REG_FE_TipoFactura(),
            REG_FE_TipoRectificativa: vm.REG_FE_TipoRectificativa(),
            REG_FE_FA_IDFA_NumSerieFacturaEmisor: vm.REG_FE_FA_IDFA_NumSerieFacturaEmisor(),
            REG_FE_FA_IDFA_FechaExpedicionFacturaEmisor: vm.REG_FE_FA_IDFA_FechaExpedicionFacturaEmisor(),
            REG_FE_FR_IDR_NumSerieFacturaEmisor: vm.REG_FE_FR_IDR_NumSerieFacturaEmisor(),
            REG_FE_FR_IDR_FechaExpedicionFacturaEmisor: vm.REG_FE_FR_IDR_FechaExpedicionFacturaEmisor(),
            REG_FE_IR_BaseRectificada: vm.REG_FE_IR_BaseRectificada(),
            REG_FE_IR_CuotaRectificada: vm.REG_FE_IR_CuotaRectificada(),
            REG_FE_IR_CuotaRecargoRectificado: vm.REG_FE_IR_CuotaRecargoRectificado(),
            REG_FE_FechaOperacion: vm.REG_FE_FechaOperacion(),
            REG_FE_ClaveRegimenEspecialOTrascendencia: vm.REG_FE_ClaveRegimenEspecialOTrascendencia(),
            REG_FE_ClaveRegimenEspecialOTrascendenciaAdicional1: vm.REG_FE_ClaveRegimenEspecialOTrascendenciaAdicional1(),
            REG_FE_ClaveRegimenEspecialOTrascendenciaAdicional2: vm.REG_FE_ClaveRegimenEspecialOTrascendenciaAdicional2(),
            REG_FE_ImporteTotal: vm.REG_FE_ImporteTotal(),
            REG_FE_BaseImponibleACoste: vm.REG_FE_BaseImponibleACoste(),
            REG_FE_DescripcionOperacion: vm.REG_FE_DescripcionOperacion(),
            REG_FE_DI_DT_SituacionInmueble: vm.REG_FE_DI_DT_SituacionInmueble(),
            REG_FE_DI_DT_ReferenciaCatastral: vm.REG_FE_DI_DT_ReferenciaCatastral(),
            REG_FE_ImporteTransmisionSujetoAIVA: vm.REG_FE_ImporteTransmisionSujetoAIVA(),
            REG_FE_EmitidaPorTercero: vm.REG_FE_EmitidaPorTercero(),
            REG_FE_VariosDestinatarios: vm.REG_FE_VariosDestinatarios(),
            REG_FE_Cupon: vm.REG_FE_Cupon(),
            REG_FE_CNT_NombreRazon: vm.REG_FE_CNT_NombreRazon(),
            REG_FE_CNT_NIFRepresentante: vm.REG_FE_CNT_NIFRepresentante(),
            REG_FE_CNT_NIF: vm.REG_FE_CNT_NIF(),
            REG_FE_CNT_IDOtro_CodigoPais: vm.REG_FE_CNT_IDOtro_CodigoPais(),
            REG_FE_CNT_IDOtro_IDType: vm.REG_FE_CNT_IDOtro_IDType(),
            REG_FE_CNT_IDOtro_ID: vm.REG_FE_CNT_IDOtro_ID(),
            REG_FE_TD_DF_SU_EX_CausaExencion: vm.REG_FE_TD_DF_SU_EX_CausaExencion(),
            REG_FE_TD_DF_SU_EX_BaseImponible: vm.REG_FE_TD_DF_SU_EX_BaseImponible(),
            REG_FE_TD_DF_SU_NEX_TipoNoExenta: vm.REG_FE_TD_DF_SU_NEX_TipoNoExenta(),

            REG_FE_TD_DF_SU_NEX_DI_DT1_TipoImpositivo: vm.REG_FE_TD_DF_SU_NEX_DI_DT1_TipoImpositivo(),
            REG_FE_TD_DF_SU_NEX_DI_DT1_BaseImponible: vm.REG_FE_TD_DF_SU_NEX_DI_DT1_BaseImponible(),
            REG_FE_TD_DF_SU_NEX_DI_DT1_CuotaRepercutida: vm.REG_FE_TD_DF_SU_NEX_DI_DT1_CuotaRepercutida(),
            REG_FE_TD_DF_SU_NEX_DI_DT1_TipoREquivalencia: vm.REG_FE_TD_DF_SU_NEX_DI_DT1_TipoREquivalencia(),
            REG_FE_TD_DF_SU_NEX_DI_DT1_CuotaREquivalencia: vm.REG_FE_TD_DF_SU_NEX_DI_DT1_CuotaREquivalencia(),

            REG_FE_TD_DF_SU_NEX_DI_DT2_TipoImpositivo: vm.REG_FE_TD_DF_SU_NEX_DI_DT2_TipoImpositivo(),
            REG_FE_TD_DF_SU_NEX_DI_DT2_BaseImponible: vm.REG_FE_TD_DF_SU_NEX_DI_DT2_BaseImponible(),
            REG_FE_TD_DF_SU_NEX_DI_DT2_CuotaRepercutida: vm.REG_FE_TD_DF_SU_NEX_DI_DT2_CuotaRepercutida(),
            REG_FE_TD_DF_SU_NEX_DI_DT2_TipoREquivalencia: vm.REG_FE_TD_DF_SU_NEX_DI_DT2_TipoREquivalencia(),
            REG_FE_TD_DF_SU_NEX_DI_DT2_CuotaREquivalencia: vm.REG_FE_TD_DF_SU_NEX_DI_DT2_CuotaREquivalencia(),

            REG_FE_TD_DF_SU_NEX_DI_DT3_TipoImpositivo: vm.REG_FE_TD_DF_SU_NEX_DI_DT3_TipoImpositivo(),
            REG_FE_TD_DF_SU_NEX_DI_DT3_BaseImponible: vm.REG_FE_TD_DF_SU_NEX_DI_DT3_BaseImponible(),
            REG_FE_TD_DF_SU_NEX_DI_DT3_CuotaRepercutida: vm.REG_FE_TD_DF_SU_NEX_DI_DT3_CuotaRepercutida(),
            REG_FE_TD_DF_SU_NEX_DI_DT3_TipoREquivalencia: vm.REG_FE_TD_DF_SU_NEX_DI_DT3_TipoREquivalencia(),
            REG_FE_TD_DF_SU_NEX_DI_DT3_CuotaREquivalencia: vm.REG_FE_TD_DF_SU_NEX_DI_DT3_CuotaREquivalencia(),

            REG_FE_TD_DF_SU_NEX_DI_DT4_TipoImpositivo: vm.REG_FE_TD_DF_SU_NEX_DI_DT4_TipoImpositivo(),
            REG_FE_TD_DF_SU_NEX_DI_DT4_BaseImponible: vm.REG_FE_TD_DF_SU_NEX_DI_DT4_BaseImponible(),
            REG_FE_TD_DF_SU_NEX_DI_DT4_CuotaRepercutida: vm.REG_FE_TD_DF_SU_NEX_DI_DT4_CuotaRepercutida(),
            REG_FE_TD_DF_SU_NEX_DI_DT4_TipoREquivalencia: vm.REG_FE_TD_DF_SU_NEX_DI_DT4_TipoREquivalencia(),
            REG_FE_TD_DF_SU_NEX_DI_DT4_CuotaREquivalencia: vm.REG_FE_TD_DF_SU_NEX_DI_DT4_CuotaREquivalencia(),

            REG_FE_TD_DF_SU_NEX_DI_DT5_TipoImpositivo: vm.REG_FE_TD_DF_SU_NEX_DI_DT5_TipoImpositivo(),
            REG_FE_TD_DF_SU_NEX_DI_DT5_BaseImponible: vm.REG_FE_TD_DF_SU_NEX_DI_DT5_BaseImponible(),
            REG_FE_TD_DF_SU_NEX_DI_DT5_CuotaRepercutida: vm.REG_FE_TD_DF_SU_NEX_DI_DT5_CuotaRepercutida(),
            REG_FE_TD_DF_SU_NEX_DI_DT5_TipoREquivalencia: vm.REG_FE_TD_DF_SU_NEX_DI_DT5_TipoREquivalencia(),
            REG_FE_TD_DF_SU_NEX_DI_DT5_CuotaREquivalencia: vm.REG_FE_TD_DF_SU_NEX_DI_DT5_CuotaREquivalencia(),

            REG_FE_TD_DF_SU_NEX_DI_DT6_TipoImpositivo: vm.REG_FE_TD_DF_SU_NEX_DI_DT6_TipoImpositivo(),
            REG_FE_TD_DF_SU_NEX_DI_DT6_BaseImponible: vm.REG_FE_TD_DF_SU_NEX_DI_DT6_BaseImponible(),
            REG_FE_TD_DF_SU_NEX_DI_DT6_CuotaRepercutida: vm.REG_FE_TD_DF_SU_NEX_DI_DT6_CuotaRepercutida(),
            REG_FE_TD_DF_SU_NEX_DI_DT6_TipoREquivalencia: vm.REG_FE_TD_DF_SU_NEX_DI_DT6_TipoREquivalencia(),
            REG_FE_TD_DF_SU_NEX_DI_DT6_CuotaREquivalencia: vm.REG_FE_TD_DF_SU_NEX_DI_DT6_CuotaREquivalencia(),

            REG_FE_TD_DF_NSU_ImportePorArticulos7_14_Otros: vm.REG_FE_TD_DF_NSU_ImportePorArticulos7_14_Otros(),
            REG_FE_TD_DF_NSU_ImporteTAIReglasLocalizacion: vm.REG_FE_TD_DF_NSU_ImporteTAIReglasLocalizacion(),
            REG_FE_TD_DTS_SU_EX_CausaExencion: vm.REG_FE_TD_DTS_SU_EX_CausaExencion(),
            REG_FE_TD_DTS_SU_EX_BaseImponible: vm.REG_FE_TD_DTS_SU_EX_BaseImponible(),
            REG_FE_TD_DTS_SU_NEX_TipoNoExenta: vm.REG_FE_TD_DTS_SU_NEX_TipoNoExenta(),

            REG_FE_TD_DTS_SU_NEX_DI_DT1_TipoImpositivo: vm.REG_FE_TD_DTS_SU_NEX_DI_DT1_TipoImpositivo(),
            REG_FE_TD_DTS_SU_NEX_DI_DT1_BaseImponible: vm.REG_FE_TD_DTS_SU_NEX_DI_DT1_BaseImponible(),
            REG_FE_TD_DTS_SU_NEX_DI_DT1_CuotaRepercutida: vm.REG_FE_TD_DTS_SU_NEX_DI_DT1_CuotaRepercutida(),

            REG_FE_TD_DTS_SU_NEX_DI_DT2_TipoImpositivo: vm.REG_FE_TD_DTS_SU_NEX_DI_DT2_TipoImpositivo(),
            REG_FE_TD_DTS_SU_NEX_DI_DT2_BaseImponible: vm.REG_FE_TD_DTS_SU_NEX_DI_DT2_BaseImponible(),
            REG_FE_TD_DTS_SU_NEX_DI_DT2_CuotaRepercutida: vm.REG_FE_TD_DTS_SU_NEX_DI_DT2_CuotaRepercutida(),

            REG_FE_TD_DTS_SU_NEX_DI_DT3_TipoImpositivo: vm.REG_FE_TD_DTS_SU_NEX_DI_DT3_TipoImpositivo(),
            REG_FE_TD_DTS_SU_NEX_DI_DT3_BaseImponible: vm.REG_FE_TD_DTS_SU_NEX_DI_DT3_BaseImponible(),
            REG_FE_TD_DTS_SU_NEX_DI_DT3_CuotaRepercutida: vm.REG_FE_TD_DTS_SU_NEX_DI_DT3_CuotaRepercutida(),

            REG_FE_TD_DTS_SU_NEX_DI_DT4_TipoImpositivo: vm.REG_FE_TD_DTS_SU_NEX_DI_DT4_TipoImpositivo(),
            REG_FE_TD_DTS_SU_NEX_DI_DT4_BaseImponible: vm.REG_FE_TD_DTS_SU_NEX_DI_DT4_BaseImponible(),
            REG_FE_TD_DTS_SU_NEX_DI_DT4_CuotaRepercutida: vm.REG_FE_TD_DTS_SU_NEX_DI_DT4_CuotaRepercutida(),

            REG_FE_TD_DTS_SU_NEX_DI_DT5_TipoImpositivo: vm.REG_FE_TD_DTS_SU_NEX_DI_DT5_TipoImpositivo(),
            REG_FE_TD_DTS_SU_NEX_DI_DT5_BaseImponible: vm.REG_FE_TD_DTS_SU_NEX_DI_DT5_BaseImponible(),
            REG_FE_TD_DTS_SU_NEX_DI_DT5_CuotaRepercutida: vm.REG_FE_TD_DTS_SU_NEX_DI_DT5_CuotaRepercutida(),

            REG_FE_TD_DTS_SU_NEX_DI_DT6_TipoImpositivo: vm.REG_FE_TD_DTS_SU_NEX_DI_DT6_TipoImpositivo(),
            REG_FE_TD_DTS_SU_NEX_DI_DT6_BaseImponible: vm.REG_FE_TD_DTS_SU_NEX_DI_DT6_BaseImponible(),
            REG_FE_TD_DTS_SU_NEX_DI_DT6_CuotaRepercutida: vm.REG_FE_TD_DTS_SU_NEX_DI_DT6_CuotaRepercutida(),

            REG_FE_TD_DTS_NSU_ImportePorArticulos7_14_Otros: vm.REG_FE_TD_DTS_NSU_ImportePorArticulos7_14_Otros(),
            REG_FE_TD_DTS_NSU_ImporteTAIReglasLocalizacion: vm.REG_FE_TD_DTS_NSU_ImporteTAIReglasLocalizacion(),
            REG_FE_TD_DTE_SU_EX_CausaExencion: vm.REG_FE_TD_DTE_SU_EX_CausaExencion(),
            REG_FE_TD_DTE_SU_EX_BaseImponible: vm.REG_FE_TD_DTE_SU_EX_BaseImponible(),
            REG_FE_TD_DTE_SU_NEX_TipoNoExenta: vm.REG_FE_TD_DTE_SU_NEX_TipoNoExenta(),

            REG_FE_TD_DTE_SU_NEX_DI_DT1_TipoImpositivo: vm.REG_FE_TD_DTE_SU_NEX_DI_DT1_TipoImpositivo(),
            REG_FE_TD_DTE_SU_NEX_DI_DT1_BaseImponible: vm.REG_FE_TD_DTE_SU_NEX_DI_DT1_BaseImponible(),
            REG_FE_TD_DTE_SU_NEX_DI_DT1_CuotaRepercutida: vm.REG_FE_TD_DTE_SU_NEX_DI_DT1_CuotaRepercutida(),

            REG_FE_TD_DTE_SU_NEX_DI_DT2_TipoImpositivo: vm.REG_FE_TD_DTE_SU_NEX_DI_DT2_TipoImpositivo(),
            REG_FE_TD_DTE_SU_NEX_DI_DT2_BaseImponible: vm.REG_FE_TD_DTE_SU_NEX_DI_DT2_BaseImponible(),
            REG_FE_TD_DTE_SU_NEX_DI_DT2_CuotaRepercutida: vm.REG_FE_TD_DTE_SU_NEX_DI_DT2_CuotaRepercutida(),

            REG_FE_TD_DTE_SU_NEX_DI_DT3_TipoImpositivo: vm.REG_FE_TD_DTE_SU_NEX_DI_DT3_TipoImpositivo(),
            REG_FE_TD_DTE_SU_NEX_DI_DT3_BaseImponible: vm.REG_FE_TD_DTE_SU_NEX_DI_DT3_BaseImponible(),
            REG_FE_TD_DTE_SU_NEX_DI_DT3_CuotaRepercutida: vm.REG_FE_TD_DTE_SU_NEX_DI_DT3_CuotaRepercutida(),

            REG_FE_TD_DTE_SU_NEX_DI_DT4_TipoImpositivo: vm.REG_FE_TD_DTE_SU_NEX_DI_DT4_TipoImpositivo(),
            REG_FE_TD_DTE_SU_NEX_DI_DT4_BaseImponible: vm.REG_FE_TD_DTE_SU_NEX_DI_DT4_BaseImponible(),
            REG_FE_TD_DTE_SU_NEX_DI_DT4_CuotaRepercutida: vm.REG_FE_TD_DTE_SU_NEX_DI_DT4_CuotaRepercutida(),

            REG_FE_TD_DTE_SU_NEX_DI_DT5_TipoImpositivo: vm.REG_FE_TD_DTE_SU_NEX_DI_DT5_TipoImpositivo(),
            REG_FE_TD_DTE_SU_NEX_DI_DT5_BaseImponible: vm.REG_FE_TD_DTE_SU_NEX_DI_DT5_BaseImponible(),
            REG_FE_TD_DTE_SU_NEX_DI_DT5_CuotaRepercutida: vm.REG_FE_TD_DTE_SU_NEX_DI_DT5_CuotaRepercutida(),

            REG_FE_TD_DTE_SU_NEX_DI_DT6_TipoImpositivo: vm.REG_FE_TD_DTE_SU_NEX_DI_DT6_TipoImpositivo(),
            REG_FE_TD_DTE_SU_NEX_DI_DT6_BaseImponible: vm.REG_FE_TD_DTE_SU_NEX_DI_DT6_BaseImponible(),
            REG_FE_TD_DTE_SU_NEX_DI_DT6_CuotaRepercutida: vm.REG_FE_TD_DTE_SU_NEX_DI_DT6_CuotaRepercutida(),

            REG_FE_TD_DTE_NSU_ImportePorArticulos7_14_Otros: vm.REG_FE_TD_DTE_NSU_ImportePorArticulos7_14_Otros(),
            REG_FE_TD_DTE_NSU_ImporteTAIReglasLocalizacion: vm.REG_FE_TD_DTE_NSU_ImporteTAIReglasLocalizacion()
        };

        if (vm.FechaHoraCreacion()) data.FechaHoraCreacion = moment(vm.FechaHoraCreacion(), i18n.t('util.date_format')).format(i18n.t('util.date_iso'));
        if (vm.REG_IDF_FechaExpedicionFacturaEmisor()) data.REG_IDF_FechaExpedicionFacturaEmisor = moment(vm.REG_IDF_FechaExpedicionFacturaEmisor(), i18n.t('util.date_format')).format(i18n.t('util.date_iso'));
        if (vm.REG_FE_FA_IDFA_FechaExpedicionFacturaEmisor()) data.REG_FE_FA_IDFA_FechaExpedicionFacturaEmisor = moment(vm.REG_FE_FA_IDFA_FechaExpedicionFacturaEmisor(), i18n.t('util.date_format')).format(i18n.t('util.date_iso'));
        if (vm.REG_FE_FR_IDR_FechaExpedicionFacturaEmisor()) data.REG_FE_FR_IDR_FechaExpedicionFacturaEmisor = moment(vm.REG_FE_FR_IDR_FechaExpedicionFacturaEmisor(), i18n.t('util.date_format')).format(i18n.t('util.date_iso'));
        if (vm.REG_FE_FechaOperacion()) data.REG_FE_FechaOperacion = moment(vm.REG_FE_FechaOperacion(), i18n.t('util.date_format')).format(i18n.t('util.date_iso'));

        var verb = "PUT";
        if (vm.IDEnvioFacturasEmitidas() == 0) verb = "POST";
        apiComunAjax.llamadaGeneral(verb, myconfig.apiUrl + "/api/facturasEmitidas", data, function (err, data) {
            if (err) return;
            apiFacturasEmitidasDetalle.salir();
        });
    },
    datosOk: function () {
        $('#facturaEmitida-form').validate({
            rules: {
                txtNombre: { required: true }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#facturaEmitida-form').valid();
    },
    salir: function () {
        window.open(sprintf('FacturasEmitidasGeneral.html'), '_self');
    },
    cargarTitulares: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/titulares", null, function (err, data) {
            if (err) return;
            var options = [{ titularId: 0, nombre: " " }].concat(data);
            vm.optionsTitulares(options);
            $("#cmbTitulares").val([id]).trigger('change');
        });
    },
    cambioTitular: function (data) {
        if (!data) return;
        var titularId = data.id;
        llamadaAjax('GET', "/api/titulares/" + titularId, null, function (err, data) {
            if (err) return;
            vm.CAB_Titular_NombreRazon(data.nombreRazon);
            vm.CAB_Titular_NIF(data.nifTitular);
            vm.CAB_Titular_NIFRepresentante(data.nifRepresentante);
        });
    },
    cargarEmisores: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/emisores", null, function (err, data) {
            if (err) return;
            var options = [{ emsiorId: 0, nombre: " " }].concat(data);
            vm.optionsEmisores(options);
            $("#cmbEmisores").val([id]).trigger('change');
        });
    },
    cambioEmisor: function (data) {
        if (!data) return;
        var emisorId = data.id;
        llamadaAjax('GET', "/api/emisores/" + emisorId, null, function (err, data) {
            if (err) return;
            vm.REG_IDF_IDEF_NIF(data.nif);
        });
    }
}


