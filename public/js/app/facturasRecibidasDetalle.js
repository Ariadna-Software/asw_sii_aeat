/*
 facturasRecibidas.js
 Funciones propias de la página FacturasRecibidas.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;
var gruposUsuarioId = 0;
var vm;

var apiFacturasRecibidasDetalle = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);

        vm = new apiFacturasRecibidasDetalle.datosPagina();
        ko.applyBindings(vm);
        if (usuario.esAdministrador) {
            $("#txtEnviada").prop('disabled', false);
        }
        $('#facturasRecibidas').attr('class', 'active');
        $('#facturaEmitida-form').submit(function () { return false; });

        $('#btnAceptar').click(apiFacturasRecibidasDetalle.aceptar);
        $('#btnEnviar').click(apiFacturasRecibidasDetalle.enviar);
        $('#btnSalir').click(apiFacturasRecibidasDetalle.salir);

        // Titulares
        $('#cmbTitulares').select2(select2_languages[usuario.codigoIdioma]);
        apiFacturasRecibidasDetalle.cargarTitulares();
        $("#cmbTitulares").select2().on('change', function (e) {
            apiFacturasRecibidasDetalle.cambioTitular(e.added);
        });
        // Emisores
        $('#cmbEmisores').select2(select2_languages[usuario.codigoIdioma]);
        apiFacturasRecibidasDetalle.cargarEmisores();
        $("#cmbEmisores").select2().on('change', function (e) {
            apiFacturasRecibidasDetalle.cambioEmisor(e.added);
        });
        // TipoComunicacion
        $('#cmbTipoComunicacion').select2(select2_languages[usuario.codigoIdioma]);
        apiFacturasRecibidasDetalle.cargarTipoComunicacion();
        // Periodo
        $('#cmbPeriodo').select2(select2_languages[usuario.codigoIdioma]);
        apiFacturasRecibidasDetalle.cargarPeriodo();
        // TipoRecibida
        $('#cmbTipoRecibida').select2(select2_languages[usuario.codigoIdioma]);
        apiFacturasRecibidasDetalle.cargarTipoRecibida();
        // Regimen
        $('#cmbRegimen').select2(select2_languages[usuario.codigoIdioma]);
        apiFacturasRecibidasDetalle.cargarRegimen();
        // Regimen1
        $('#cmbRegimen1').select2(select2_languages[usuario.codigoIdioma]);
        apiFacturasRecibidasDetalle.cargarRegimen1();
        // Regimen2
        $('#cmbRegimen2').select2(select2_languages[usuario.codigoIdioma]);
        apiFacturasRecibidasDetalle.cargarRegimen2();
        // TipoRectificativa
        $('#cmbTipoRectificativa').select2(select2_languages[usuario.codigoIdioma]);
        apiFacturasRecibidasDetalle.cargarTipoRectificativa();

        IDEnvioFacturasRecibidas = apiComunGeneral.gup("id");
        if (IDEnvioFacturasRecibidas == 0) {
            vm.IDEnvioFacturasRecibidas(0);
            vm.Origen("MANUAL");
            vm.EnvioInmediato(0);
            vm.Enviada(0);
            vm.CAB_IDVersionSii("0.7");
            vm.FechaHoraCreacion(moment(new Date()).format("DD/MM/YYYY"));
        } else {
            apiFacturasRecibidasDetalle.cargarFacturasRecibidas(IDEnvioFacturasRecibidas);
        }
    },
    cargarFacturasRecibidas: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/facturasRecibidas/" + id, null, function (err, data) {
            if (err) return;
            apiFacturasRecibidasDetalle.cargarDatosPagina(data);
        });
    },
    cargarDatosPagina: function (data) {
        vm.IDEnvioFacturasRecibidas(data.IDEnvioFacturasRecibidas);
        vm.Origen(data.Origen);
        if (data.FechaHoraCreacion)
            vm.FechaHoraCreacion(moment(data.FechaHoraCreacion).format(i18n.t('util.date_format')));
        vm.EnvioInmediato(data.EnvioInmediato);
        vm.Enviada(data.Enviada);
        vm.Resultado(data.Resultado);
        vm.CSV(data.CSV);
        vm.Mensaje(data.Mensaje);
        if (data.XML_Enviado)
            vm.XML_Enviado(vkbeautify.xml(data.XML_Enviado));
        // Cabecera
        vm.CAB_IDVersionSii(data.CAB_IDVersionSii);
        vm.CAB_Titular_NombreRazon(data.CAB_Titular_NombreRazon);
        vm.CAB_Titular_NIFRepresentante(data.CAB_Titular_NIFRepresentante);
        vm.CAB_Titular_NIF(data.CAB_Titular_NIF);
        vm.CAB_TipoComunicacion(data.CAB_TipoComunicacion);
        apiFacturasRecibidasDetalle.cargarTipoComunicacion(data.CAB_TipoComunicacion);
        // Registro
        vm.REG_PI_Ejercicio(data.REG_PI_Ejercicio);
        vm.REG_PI_Periodo(data.REG_PI_Periodo);
        apiFacturasRecibidasDetalle.cargarPeriodo(data.REG_PI_Periodo);
        vm.REG_IDF_IDEF_NIF(data.REG_IDF_IDEF_NIF);
        vm.REG_IDF_NumSerieFacturaEmisor(data.REG_IDF_NumSerieFacturaEmisor);
        vm.REG_IDF_NumSerieFacturaEmisorResumenFin(data.REG_IDF_NumSerieFacturaEmisorResumenFin);
        if (data.REG_IDF_FechaExpedicionFacturaEmisor)
            vm.REG_IDF_FechaExpedicionFacturaEmisor(moment(data.REG_IDF_FechaExpedicionFacturaEmisor).format(i18n.t('util.date_format')));
        vm.REG_FR_TipoFactura(data.REG_FR_TipoFactura);
        apiFacturasRecibidasDetalle.cargarTipoRecibida(data.REG_FR_TipoFactura);
        vm.REG_FR_TipoRectificativa(data.REG_FR_TipoRectificativa);
        apiFacturasRecibidasDetalle.cargarTipoRectificativa(data.REG_FR_TipoRectificativa);
        vm.REG_FE_FA_IDFA_NumSerieFacturaEmisor(data.REG_FE_FA_IDFA_NumSerieFacturaEmisor);
        if (data.REG_FE_FA_IDFA_FechaExpedicionFacturaEmisor)
            vm.REG_FE_FA_IDFA_FechaExpedicionFacturaEmisor(moment(data.REG_FE_FA_IDFA_FechaExpedicionFacturaEmisor).format(i18n.t('util.date_format')));
        vm.REG_FR_FR_IDR_NumSerieFacturaEmisor(data.REG_FR_FR_IDR_NumSerieFacturaEmisor);
        if (data.REG_FR_FR_IDR_FechaExpedicionFacturaEmisor)
            vm.REG_FR_FR_IDR_FechaExpedicionFacturaEmisor(moment(data.REG_FR_FR_IDR_FechaExpedicionFacturaEmisor).format(i18n.t('util.date_format')));
        vm.REG_FR_IR_BaseRectificada(data.REG_FR_IR_BaseRectificada);
        vm.REG_FR_IR_CuotaRectificada(data.REG_FR_IR_CuotaRectificada);
        vm.REG_FR_IR_CuotaRecargoRectificado(data.REG_FR_IR_CuotaRecargoRectificado);
        if (data.REG_FR_FechaOperacion)
            vm.REG_FR_FechaOperacion(moment(data.REG_FR_FechaOperacion).format(i18n.t('util.date_format')));
        vm.REG_FR_ClaveRegimenEspecialOTrascendencia(data.REG_FR_ClaveRegimenEspecialOTrascendencia);
        apiFacturasRecibidasDetalle.cargarRegimen(data.REG_FR_ClaveRegimenEspecialOTrascendencia);
        vm.REG_FR_ClaveRegimenEspecialOTrascendenciaAdicional1(data.REG_FR_ClaveRegimenEspecialOTrascendenciaAdicional1);
        apiFacturasRecibidasDetalle.cargarRegimen1(data.REG_FR_ClaveRegimenEspecialOTrascendenciaAdicional1);
        vm.REG_FR_ClaveRegimenEspecialOTrascendenciaAdicional2(data.REG_FR_ClaveRegimenEspecialOTrascendenciaAdicional2);
        apiFacturasRecibidasDetalle.cargarRegimen2(data.REG_FR_ClaveRegimenEspecialOTrascendenciaAdicional2);
        vm.REG_FR_NumRegistroAcuerdoFacturacion(data.REG_FR_NumRegistroAcuerdoFacturacion);
        vm.REG_FR_ImporteTotal(data.REG_FR_ImporteTotal);
        vm.REG_FR_NumRegistroAcuerdoFacturacion(data.REG_FR_NumRegistroAcuerdoFacturacion);
        vm.REG_FR_BaseImponibleACoste(data.REG_FR_BaseImponibleACoste);
        vm.REG_FR_DescripcionOperacion(data.REG_FR_DescripcionOperacion);
        vm.REG_FR_CNT_NombreRazon(data.REG_FR_CNT_NombreRazon);
        vm.REG_FR_CNT_NIFRepresentante(data.REG_FR_CNT_NIFRepresentante);
        vm.REG_FR_CNT_NIF(data.REG_FR_CNT_NIF);
        vm.REG_FR_CNT_IDOtro_CodigoPais(data.REG_FR_CNT_IDOtro_CodigoPais);
        vm.REG_FR_CNT_IDOtro_IDType(data.REG_FR_CNT_IDOtro_IDType);
        vm.REG_FR_CNT_IDOtro_ID(data.REG_FR_CNT_IDOtro_ID);
        vm.REG_IDF_IDEF_IDOtro_CodigoPais(data.REG_IDF_IDEF_IDOtro_CodigoPais);
        vm.REG_IDF_IDEF_IDOtro_IDType(data.REG_IDF_IDEF_IDOtro_IDType);
        vm.REG_IDF_IDEF_IDOtro_ID(data.REG_IDF_IDEF_IDOtro_ID);

        // IVA 1
        vm.REG_FR_DF_ISP_DI_DT1_TipoImpositivo(data.REG_FR_DF_ISP_DI_DT1_TipoImpositivo);
        vm.REG_FR_DF_ISP_DI_DT1_BaseImponible(data.REG_FR_DF_ISP_DI_DT1_BaseImponible);
        vm.REG_FR_DF_ISP_DI_DT1_CuotaSoportada(data.REG_FR_DF_ISP_DI_DT1_CuotaSoportada);
        vm.REG_FR_DF_ISP_DI_DT1_TipoREquivalencia(data.REG_FR_DF_ISP_DI_DT1_TipoREquivalencia);
        vm.REG_FR_DF_ISP_DI_DT1_CuotaREquivalencia(data.REG_FR_DF_ISP_DI_DT1_CuotaREquivalencia);
        // IVA 2
        vm.REG_FR_DF_ISP_DI_DT2_TipoImpositivo(data.REG_FR_DF_ISP_DI_DT2_TipoImpositivo);
        vm.REG_FR_DF_ISP_DI_DT2_BaseImponible(data.REG_FR_DF_ISP_DI_DT2_BaseImponible);
        vm.REG_FR_DF_ISP_DI_DT2_CuotaSoportada(data.REG_FR_DF_ISP_DI_DT2_CuotaSoportada);
        vm.REG_FR_DF_ISP_DI_DT2_TipoREquivalencia(data.REG_FR_DF_ISP_DI_DT2_TipoREquivalencia);
        vm.REG_FR_DF_ISP_DI_DT2_CuotaREquivalencia(data.REG_FR_DF_ISP_DI_DT2_CuotaREquivalencia);
        // IVA 3
        vm.REG_FR_DF_ISP_DI_DT3_TipoImpositivo(data.REG_FR_DF_ISP_DI_DT3_TipoImpositivo);
        vm.REG_FR_DF_ISP_DI_DT3_BaseImponible(data.REG_FR_DF_ISP_DI_DT3_BaseImponible);
        vm.REG_FR_DF_ISP_DI_DT3_CuotaSoportada(data.REG_FR_DF_ISP_DI_DT3_CuotaSoportada);
        vm.REG_FR_DF_ISP_DI_DT3_TipoREquivalencia(data.REG_FR_DF_ISP_DI_DT3_TipoREquivalencia);
        vm.REG_FR_DF_ISP_DI_DT3_CuotaREquivalencia(data.REG_FR_DF_ISP_DI_DT3_CuotaREquivalencia);
        // IVA 4
        vm.REG_FR_DF_ISP_DI_DT4_TipoImpositivo(data.REG_FR_DF_ISP_DI_DT4_TipoImpositivo);
        vm.REG_FR_DF_ISP_DI_DT4_BaseImponible(data.REG_FR_DF_ISP_DI_DT4_BaseImponible);
        vm.REG_FR_DF_ISP_DI_DT4_CuotaSoportada(data.REG_FR_DF_ISP_DI_DT4_CuotaSoportada);
        vm.REG_FR_DF_ISP_DI_DT4_TipoREquivalencia(data.REG_FR_DF_ISP_DI_DT4_TipoREquivalencia);
        vm.REG_FR_DF_ISP_DI_DT4_CuotaREquivalencia(data.REG_FR_DF_ISP_DI_DT4_CuotaREquivalencia);
        // IVA 5
        vm.REG_FR_DF_ISP_DI_DT5_TipoImpositivo(data.REG_FR_DF_ISP_DI_DT5_TipoImpositivo);
        vm.REG_FR_DF_ISP_DI_DT5_BaseImponible(data.REG_FR_DF_ISP_DI_DT5_BaseImponible);
        vm.REG_FR_DF_ISP_DI_DT5_CuotaSoportada(data.REG_FR_DF_ISP_DI_DT5_CuotaSoportada);
        vm.REG_FR_DF_ISP_DI_DT5_TipoREquivalencia(data.REG_FR_DF_ISP_DI_DT5_TipoREquivalencia);
        vm.REG_FR_DF_ISP_DI_DT5_CuotaREquivalencia(data.REG_FR_DF_ISP_DI_DT5_CuotaREquivalencia);
        // IVA 6
        vm.REG_FR_DF_ISP_DI_DT6_TipoImpositivo(data.REG_FR_DF_ISP_DI_DT6_TipoImpositivo);
        vm.REG_FR_DF_ISP_DI_DT6_BaseImponible(data.REG_FR_DF_ISP_DI_DT6_BaseImponible);
        vm.REG_FR_DF_ISP_DI_DT6_CuotaSoportada(data.REG_FR_DF_ISP_DI_DT6_CuotaSoportada);
        vm.REG_FR_DF_ISP_DI_DT6_TipoREquivalencia(data.REG_FR_DF_ISP_DI_DT6_TipoREquivalencia);
        vm.REG_FR_DF_ISP_DI_DT6_CuotaREquivalencia(data.REG_FR_DF_ISP_DI_DT6_CuotaREquivalencia);

        // IVA 1
        vm.REG_FR_DF_DGI_DI_DT1_TipoImpositivo(data.REG_FR_DF_DGI_DI_DT1_TipoImpositivo);
        vm.REG_FR_DF_DGI_DI_DT1_BaseImponible(data.REG_FR_DF_DGI_DI_DT1_BaseImponible);
        vm.REG_FR_DF_DGI_DI_DT1_CuotaSoportada(data.REG_FR_DF_DGI_DI_DT1_CuotaSoportada);
        vm.REG_FR_DF_DGI_DI_DT1_TipoREquivalencia(data.REG_FR_DF_DGI_DI_DT1_TipoREquivalencia);
        vm.REG_FR_DF_DGI_DI_DT1_CuotaREquivalencia(data.REG_FR_DF_DGI_DI_DT1_CuotaREquivalencia);
        vm.REG_FR_DF_DGI_DI_DT1_PorcentCompensacionREAGYP(data.REG_FR_DF_DGI_DI_DT1_PorcentCompensacionREAGYP);
        vm.REG_FR_DF_DGI_DI_DT1_ImporteCompensacionREAGYP(data.REG_FR_DF_DGI_DI_DT1_ImporteCompensacionREAGYP);
        // IVA 2
        vm.REG_FR_DF_DGI_DI_DT2_TipoImpositivo(data.REG_FR_DF_DGI_DI_DT2_TipoImpositivo);
        vm.REG_FR_DF_DGI_DI_DT2_BaseImponible(data.REG_FR_DF_DGI_DI_DT2_BaseImponible);
        vm.REG_FR_DF_DGI_DI_DT2_CuotaSoportada(data.REG_FR_DF_DGI_DI_DT2_CuotaSoportada);
        vm.REG_FR_DF_DGI_DI_DT2_TipoREquivalencia(data.REG_FR_DF_DGI_DI_DT2_TipoREquivalencia);
        vm.REG_FR_DF_DGI_DI_DT2_CuotaREquivalencia(data.REG_FR_DF_DGI_DI_DT2_CuotaREquivalencia);
        vm.REG_FR_DF_DGI_DI_DT2_PorcentCompensacionREAGYP(data.REG_FR_DF_DGI_DI_DT2_PorcentCompensacionREAGYP);
        vm.REG_FR_DF_DGI_DI_DT2_ImporteCompensacionREAGYP(data.REG_FR_DF_DGI_DI_DT2_ImporteCompensacionREAGYP);
        // IVA 3
        vm.REG_FR_DF_DGI_DI_DT3_TipoImpositivo(data.REG_FR_DF_DGI_DI_DT3_TipoImpositivo);
        vm.REG_FR_DF_DGI_DI_DT3_BaseImponible(data.REG_FR_DF_DGI_DI_DT3_BaseImponible);
        vm.REG_FR_DF_DGI_DI_DT3_CuotaSoportada(data.REG_FR_DF_DGI_DI_DT3_CuotaSoportada);
        vm.REG_FR_DF_DGI_DI_DT3_TipoREquivalencia(data.REG_FR_DF_DGI_DI_DT3_TipoREquivalencia);
        vm.REG_FR_DF_DGI_DI_DT3_CuotaREquivalencia(data.REG_FR_DF_DGI_DI_DT3_CuotaREquivalencia);
        vm.REG_FR_DF_DGI_DI_DT3_PorcentCompensacionREAGYP(data.REG_FR_DF_DGI_DI_DT3_PorcentCompensacionREAGYP);
        vm.REG_FR_DF_DGI_DI_DT3_ImporteCompensacionREAGYP(data.REG_FR_DF_DGI_DI_DT3_ImporteCompensacionREAGYP);
        // IVA 4
        vm.REG_FR_DF_DGI_DI_DT4_TipoImpositivo(data.REG_FR_DF_DGI_DI_DT4_TipoImpositivo);
        vm.REG_FR_DF_DGI_DI_DT4_BaseImponible(data.REG_FR_DF_DGI_DI_DT4_BaseImponible);
        vm.REG_FR_DF_DGI_DI_DT4_CuotaSoportada(data.REG_FR_DF_DGI_DI_DT4_CuotaSoportada);
        vm.REG_FR_DF_DGI_DI_DT4_TipoREquivalencia(data.REG_FR_DF_DGI_DI_DT4_TipoREquivalencia);
        vm.REG_FR_DF_DGI_DI_DT4_CuotaREquivalencia(data.REG_FR_DF_DGI_DI_DT4_CuotaREquivalencia);
        vm.REG_FR_DF_DGI_DI_DT4_PorcentCompensacionREAGYP(data.REG_FR_DF_DGI_DI_DT4_PorcentCompensacionREAGYP);
        vm.REG_FR_DF_DGI_DI_DT4_ImporteCompensacionREAGYP(data.REG_FR_DF_DGI_DI_DT4_ImporteCompensacionREAGYP);
        // IVA 5
        vm.REG_FR_DF_DGI_DI_DT5_TipoImpositivo(data.REG_FR_DF_DGI_DI_DT5_TipoImpositivo);
        vm.REG_FR_DF_DGI_DI_DT5_BaseImponible(data.REG_FR_DF_DGI_DI_DT5_BaseImponible);
        vm.REG_FR_DF_DGI_DI_DT5_CuotaSoportada(data.REG_FR_DF_DGI_DI_DT5_CuotaSoportada);
        vm.REG_FR_DF_DGI_DI_DT5_TipoREquivalencia(data.REG_FR_DF_DGI_DI_DT5_TipoREquivalencia);
        vm.REG_FR_DF_DGI_DI_DT5_CuotaREquivalencia(data.REG_FR_DF_DGI_DI_DT5_CuotaREquivalencia);
        vm.REG_FR_DF_DGI_DI_DT5_PorcentCompensacionREAGYP(data.REG_FR_DF_DGI_DI_DT5_PorcentCompensacionREAGYP);
        vm.REG_FR_DF_DGI_DI_DT5_ImporteCompensacionREAGYP(data.REG_FR_DF_DGI_DI_DT5_ImporteCompensacionREAGYP);
        // IVA 6
        vm.REG_FR_DF_DGI_DI_DT6_TipoImpositivo(data.REG_FR_DF_DGI_DI_DT6_TipoImpositivo);
        vm.REG_FR_DF_DGI_DI_DT6_BaseImponible(data.REG_FR_DF_DGI_DI_DT6_BaseImponible);
        vm.REG_FR_DF_DGI_DI_DT6_CuotaSoportada(data.REG_FR_DF_DGI_DI_DT6_CuotaSoportada);
        vm.REG_FR_DF_DGI_DI_DT6_TipoREquivalencia(data.REG_FR_DF_DGI_DI_DT6_TipoREquivalencia);
        vm.REG_FR_DF_DGI_DI_DT6_CuotaREquivalencia(data.REG_FR_DF_DGI_DI_DT6_CuotaREquivalencia);
        vm.REG_FR_DF_DGI_DI_DT6_PorcentCompensacionREAGYP(data.REG_FR_DF_DGI_DI_DT6_PorcentCompensacionREAGYP);
        vm.REG_FR_DF_DGI_DI_DT6_ImporteCompensacionREAGYP(data.REG_FR_DF_DGI_DI_DT6_ImporteCompensacionREAGYP);
        //
        vm.REG_FR_CuotaDeducible(data.REG_FR_CuotaDeducible);
        if (data.REG_FR_FechaRegContable)
            vm.REG_FR_FechaRegContable(moment(data.REG_FR_FechaRegContable).format(i18n.t('util.date_format')));
    },
    datosPagina: function () {
        var self = this;
        self.IDEnvioFacturasRecibidas = ko.observable();
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
        self.REG_FR_TipoFactura = ko.observable();
        self.REG_FR_TipoRectificativa = ko.observable();
        self.REG_FE_FA_IDFA_NumSerieFacturaEmisor = ko.observable();
        self.REG_FE_FA_IDFA_FechaExpedicionFacturaEmisor = ko.observable();
        self.REG_FR_FR_IDR_NumSerieFacturaEmisor = ko.observable();
        self.REG_FR_FR_IDR_FechaExpedicionFacturaEmisor = ko.observable();
        self.REG_FR_IR_BaseRectificada = ko.observable();
        self.REG_FR_IR_CuotaRectificada = ko.observable();
        self.REG_FR_IR_CuotaRecargoRectificado = ko.observable();
        self.REG_FR_FechaOperacion = ko.observable();
        self.REG_FR_ClaveRegimenEspecialOTrascendencia = ko.observable();
        self.REG_FR_ClaveRegimenEspecialOTrascendenciaAdicional1 = ko.observable();
        self.REG_FR_ClaveRegimenEspecialOTrascendenciaAdicional2 = ko.observable();
        self.REG_FR_ImporteTotal = ko.observable();
        self.REG_FR_NumRegistroAcuerdoFacturacion = ko.observable();
        self.REG_FR_BaseImponibleACoste = ko.observable();
        self.REG_FR_DescripcionOperacion = ko.observable();
        self.REG_FR_CNT_NombreRazon = ko.observable();
        self.REG_FR_CNT_NIFRepresentante = ko.observable();
        self.REG_FR_CNT_NIF = ko.observable();
        self.REG_FR_CNT_IDOtro_CodigoPais = ko.observable();
        self.REG_FR_CNT_IDOtro_IDType = ko.observable();
        self.REG_FR_CNT_IDOtro_ID = ko.observable();
        self.REG_IDF_IDEF_IDOtro_CodigoPais = ko.observable();
        self.REG_IDF_IDEF_IDOtro_IDType = ko.observable();
        self.REG_IDF_IDEF_IDOtro_ID = ko.observable();
        // IVA 1
        self.REG_FR_DF_ISP_DI_DT1_TipoImpositivo = ko.observable();
        self.REG_FR_DF_ISP_DI_DT1_BaseImponible = ko.observable();
        self.REG_FR_DF_ISP_DI_DT1_CuotaSoportada = ko.observable();
        self.REG_FR_DF_ISP_DI_DT1_TipoREquivalencia = ko.observable();
        self.REG_FR_DF_ISP_DI_DT1_CuotaREquivalencia = ko.observable();
        // IVA 2
        self.REG_FR_DF_ISP_DI_DT2_TipoImpositivo = ko.observable();
        self.REG_FR_DF_ISP_DI_DT2_BaseImponible = ko.observable();
        self.REG_FR_DF_ISP_DI_DT2_CuotaSoportada = ko.observable();
        self.REG_FR_DF_ISP_DI_DT2_TipoREquivalencia = ko.observable();
        self.REG_FR_DF_ISP_DI_DT2_CuotaREquivalencia = ko.observable();
        // IVA 3
        self.REG_FR_DF_ISP_DI_DT3_TipoImpositivo = ko.observable();
        self.REG_FR_DF_ISP_DI_DT3_BaseImponible = ko.observable();
        self.REG_FR_DF_ISP_DI_DT3_CuotaSoportada = ko.observable();
        self.REG_FR_DF_ISP_DI_DT3_TipoREquivalencia = ko.observable();
        self.REG_FR_DF_ISP_DI_DT3_CuotaREquivalencia = ko.observable();
        // IVA 4
        self.REG_FR_DF_ISP_DI_DT4_TipoImpositivo = ko.observable();
        self.REG_FR_DF_ISP_DI_DT4_BaseImponible = ko.observable();
        self.REG_FR_DF_ISP_DI_DT4_CuotaSoportada = ko.observable();
        self.REG_FR_DF_ISP_DI_DT4_TipoREquivalencia = ko.observable();
        self.REG_FR_DF_ISP_DI_DT4_CuotaREquivalencia = ko.observable();
        // IVA 5
        self.REG_FR_DF_ISP_DI_DT5_TipoImpositivo = ko.observable();
        self.REG_FR_DF_ISP_DI_DT5_BaseImponible = ko.observable();
        self.REG_FR_DF_ISP_DI_DT5_CuotaSoportada = ko.observable();
        self.REG_FR_DF_ISP_DI_DT5_TipoREquivalencia = ko.observable();
        self.REG_FR_DF_ISP_DI_DT5_CuotaREquivalencia = ko.observable();
        // IVA 6
        self.REG_FR_DF_ISP_DI_DT6_TipoImpositivo = ko.observable();
        self.REG_FR_DF_ISP_DI_DT6_BaseImponible = ko.observable();
        self.REG_FR_DF_ISP_DI_DT6_CuotaSoportada = ko.observable();
        self.REG_FR_DF_ISP_DI_DT6_TipoREquivalencia = ko.observable();
        self.REG_FR_DF_ISP_DI_DT6_CuotaREquivalencia = ko.observable();

        // IVA 1
        self.REG_FR_DF_DGI_DI_DT1_TipoImpositivo = ko.observable();
        self.REG_FR_DF_DGI_DI_DT1_BaseImponible = ko.observable();
        self.REG_FR_DF_DGI_DI_DT1_CuotaSoportada = ko.observable();
        self.REG_FR_DF_DGI_DI_DT1_TipoREquivalencia = ko.observable();
        self.REG_FR_DF_DGI_DI_DT1_CuotaREquivalencia = ko.observable();
        self.REG_FR_DF_DGI_DI_DT1_PorcentCompensacionREAGYP = ko.observable();
        self.REG_FR_DF_DGI_DI_DT1_ImporteCompensacionREAGYP = ko.observable();
        // IVA 2
        self.REG_FR_DF_DGI_DI_DT2_TipoImpositivo = ko.observable();
        self.REG_FR_DF_DGI_DI_DT2_BaseImponible = ko.observable();
        self.REG_FR_DF_DGI_DI_DT2_CuotaSoportada = ko.observable();
        self.REG_FR_DF_DGI_DI_DT2_TipoREquivalencia = ko.observable();
        self.REG_FR_DF_DGI_DI_DT2_CuotaREquivalencia = ko.observable();
        self.REG_FR_DF_DGI_DI_DT2_PorcentCompensacionREAGYP = ko.observable();
        self.REG_FR_DF_DGI_DI_DT2_ImporteCompensacionREAGYP = ko.observable();
        // IVA 3
        self.REG_FR_DF_DGI_DI_DT3_TipoImpositivo = ko.observable();
        self.REG_FR_DF_DGI_DI_DT3_BaseImponible = ko.observable();
        self.REG_FR_DF_DGI_DI_DT3_CuotaSoportada = ko.observable();
        self.REG_FR_DF_DGI_DI_DT3_TipoREquivalencia = ko.observable();
        self.REG_FR_DF_DGI_DI_DT3_CuotaREquivalencia = ko.observable();
        self.REG_FR_DF_DGI_DI_DT3_PorcentCompensacionREAGYP = ko.observable();
        self.REG_FR_DF_DGI_DI_DT3_ImporteCompensacionREAGYP = ko.observable();
        // IVA 4
        self.REG_FR_DF_DGI_DI_DT4_TipoImpositivo = ko.observable();
        self.REG_FR_DF_DGI_DI_DT4_BaseImponible = ko.observable();
        self.REG_FR_DF_DGI_DI_DT4_CuotaSoportada = ko.observable();
        self.REG_FR_DF_DGI_DI_DT4_TipoREquivalencia = ko.observable();
        self.REG_FR_DF_DGI_DI_DT4_CuotaREquivalencia = ko.observable();
        self.REG_FR_DF_DGI_DI_DT4_PorcentCompensacionREAGYP = ko.observable();
        self.REG_FR_DF_DGI_DI_DT4_ImporteCompensacionREAGYP = ko.observable();
        // IVA 5
        self.REG_FR_DF_DGI_DI_DT5_TipoImpositivo = ko.observable();
        self.REG_FR_DF_DGI_DI_DT5_BaseImponible = ko.observable();
        self.REG_FR_DF_DGI_DI_DT5_CuotaSoportada = ko.observable();
        self.REG_FR_DF_DGI_DI_DT5_TipoREquivalencia = ko.observable();
        self.REG_FR_DF_DGI_DI_DT5_CuotaREquivalencia = ko.observable();
        self.REG_FR_DF_DGI_DI_DT5_PorcentCompensacionREAGYP = ko.observable();
        self.REG_FR_DF_DGI_DI_DT5_ImporteCompensacionREAGYP = ko.observable();
        // IVA 6
        self.REG_FR_DF_DGI_DI_DT6_TipoImpositivo = ko.observable();
        self.REG_FR_DF_DGI_DI_DT6_BaseImponible = ko.observable();
        self.REG_FR_DF_DGI_DI_DT6_CuotaSoportada = ko.observable();
        self.REG_FR_DF_DGI_DI_DT6_TipoREquivalencia = ko.observable();
        self.REG_FR_DF_DGI_DI_DT6_CuotaREquivalencia = ko.observable();
        self.REG_FR_DF_DGI_DI_DT6_PorcentCompensacionREAGYP = ko.observable();
        self.REG_FR_DF_DGI_DI_DT6_ImporteCompensacionREAGYP = ko.observable();
        //
        self.REG_FR_FechaRegContable = ko.observable();
        self.REG_FR_CuotaDeducible = ko.observable();

        // TiposComunicacion
        self.optionsTipoComunicacion = ko.observableArray([]);
        self.selectedTipoComunicacion = ko.observableArray([]);
        self.sTipoComunicacion = ko.observable();
        // Periodo
        self.optionsPeriodo = ko.observableArray([]);
        self.selectedPeriodo = ko.observableArray([]);
        self.sPeriodo = ko.observable();
        // TipoRecibida
        self.optionsTipoRecibida = ko.observableArray([]);
        self.selectedTipoRecibida = ko.observableArray([]);
        self.sTipoRecibida = ko.observable();
        // Regimen
        self.optionsRegimen = ko.observableArray([]);
        self.selectedRegimen = ko.observableArray([]);
        self.sRegimen = ko.observable();
        // Regimen1
        self.optionsRegimen1 = ko.observableArray([]);
        self.selectedRegimen1 = ko.observableArray([]);
        self.sRegimen1 = ko.observable();
        // Regimen2
        self.optionsRegimen2 = ko.observableArray([]);
        self.selectedRegimen2 = ko.observableArray([]);
        self.sRegimen2 = ko.observable();
        // TipoRectificativa
        self.optionsTipoRectificativa = ko.observableArray([]);
        self.selectedTipoRectificativa = ko.observableArray([]);
        self.sTipoRectificativa = ko.observable();
    },
    aceptar: function (event, done) {
        if (!apiFacturasRecibidasDetalle.datosOk()) return;
        var data = {
            IDEnvioFacturasRecibidas: vm.IDEnvioFacturasRecibidas(),
            Origen: vm.Origen(),
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
            CAB_TipoComunicacion: vm.sTipoComunicacion(),
            REG_PI_Ejercicio: vm.REG_PI_Ejercicio(),
            REG_PI_Periodo: vm.sPeriodo(),
            REG_IDF_IDEF_NIF: vm.REG_IDF_IDEF_NIF(),
            REG_IDF_NumSerieFacturaEmisor: vm.REG_IDF_NumSerieFacturaEmisor(),
            REG_IDF_NumSerieFacturaEmisorResumenFin: vm.REG_IDF_NumSerieFacturaEmisorResumenFin(),
            REG_IDF_FechaExpedicionFacturaEmisor: vm.REG_IDF_FechaExpedicionFacturaEmisor(),
            REG_FR_TipoFactura: vm.sTipoRecibida(),
            REG_FR_TipoRectificativa: vm.sTipoRectificativa(),
            REG_FR_FR_IDR_NumSerieFacturaEmisor: vm.REG_FR_FR_IDR_NumSerieFacturaEmisor(),
            REG_FR_IR_BaseRectificada: vm.REG_FR_IR_BaseRectificada(),
            REG_FR_IR_CuotaRectificada: vm.REG_FR_IR_CuotaRectificada(),
            REG_FR_IR_CuotaRecargoRectificado: vm.REG_FR_IR_CuotaRecargoRectificado(),
            REG_FR_ClaveRegimenEspecialOTrascendencia: vm.sRegimen(),
            REG_FR_ClaveRegimenEspecialOTrascendenciaAdicional1: vm.sRegimen1(),
            REG_FR_ClaveRegimenEspecialOTrascendenciaAdicional2: vm.sRegimen2(),
            REG_FR_ImporteTotal: vm.REG_FR_ImporteTotal(),
            REG_FR_NumRegistroAcuerdoFacturacion: vm.REG_FR_NumRegistroAcuerdoFacturacion(),
            REG_FR_BaseImponibleACoste: vm.REG_FR_BaseImponibleACoste(),
            REG_FR_DescripcionOperacion: vm.REG_FR_DescripcionOperacion(),
            REG_FR_CNT_NombreRazon: vm.REG_FR_CNT_NombreRazon(),
            REG_FR_CNT_NIFRepresentante: vm.REG_FR_CNT_NIFRepresentante(),
            REG_FR_CNT_NIF: vm.REG_FR_CNT_NIF(),
            REG_FR_CNT_IDOtro_CodigoPais: vm.REG_FR_CNT_IDOtro_CodigoPais(),
            REG_FR_CNT_IDOtro_IDType: vm.REG_FR_CNT_IDOtro_IDType(),
            REG_FR_CNT_IDOtro_ID: vm.REG_FR_CNT_IDOtro_ID(),

            REG_IDF_IDEF_IDOtro_CodigoPais: vm.REG_IDF_IDEF_IDOtro_CodigoPais(),
            REG_IDF_IDEF_IDOtro_IDType: vm.REG_IDF_IDEF_IDOtro_IDType(),
            REG_IDF_IDEF_IDOtro_ID: vm.REG_IDF_IDEF_IDOtro_ID(),

            REG_FR_DF_ISP_DI_DT1_TipoImpositivo: vm.REG_FR_DF_ISP_DI_DT1_TipoImpositivo(),
            REG_FR_DF_ISP_DI_DT1_BaseImponible: vm.REG_FR_DF_ISP_DI_DT1_BaseImponible(),
            REG_FR_DF_ISP_DI_DT1_CuotaSoportada: vm.REG_FR_DF_ISP_DI_DT1_CuotaSoportada(),
            REG_FR_DF_ISP_DI_DT1_TipoREquivalencia: vm.REG_FR_DF_ISP_DI_DT1_TipoREquivalencia(),
            REG_FR_DF_ISP_DI_DT1_CuotaREquivalencia: vm.REG_FR_DF_ISP_DI_DT1_CuotaREquivalencia(),

            REG_FR_DF_ISP_DI_DT2_TipoImpositivo: vm.REG_FR_DF_ISP_DI_DT2_TipoImpositivo(),
            REG_FR_DF_ISP_DI_DT2_BaseImponible: vm.REG_FR_DF_ISP_DI_DT2_BaseImponible(),
            REG_FR_DF_ISP_DI_DT2_CuotaSoportada: vm.REG_FR_DF_ISP_DI_DT2_CuotaSoportada(),
            REG_FR_DF_ISP_DI_DT2_TipoREquivalencia: vm.REG_FR_DF_ISP_DI_DT2_TipoREquivalencia(),
            REG_FR_DF_ISP_DI_DT2_CuotaREquivalencia: vm.REG_FR_DF_ISP_DI_DT2_CuotaREquivalencia(),

            REG_FR_DF_ISP_DI_DT3_TipoImpositivo: vm.REG_FR_DF_ISP_DI_DT3_TipoImpositivo(),
            REG_FR_DF_ISP_DI_DT3_BaseImponible: vm.REG_FR_DF_ISP_DI_DT3_BaseImponible(),
            REG_FR_DF_ISP_DI_DT3_CuotaSoportada: vm.REG_FR_DF_ISP_DI_DT3_CuotaSoportada(),
            REG_FR_DF_ISP_DI_DT3_TipoREquivalencia: vm.REG_FR_DF_ISP_DI_DT3_TipoREquivalencia(),
            REG_FR_DF_ISP_DI_DT3_CuotaREquivalencia: vm.REG_FR_DF_ISP_DI_DT3_CuotaREquivalencia(),

            REG_FR_DF_ISP_DI_DT4_TipoImpositivo: vm.REG_FR_DF_ISP_DI_DT4_TipoImpositivo(),
            REG_FR_DF_ISP_DI_DT4_BaseImponible: vm.REG_FR_DF_ISP_DI_DT4_BaseImponible(),
            REG_FR_DF_ISP_DI_DT4_CuotaSoportada: vm.REG_FR_DF_ISP_DI_DT4_CuotaSoportada(),
            REG_FR_DF_ISP_DI_DT4_TipoREquivalencia: vm.REG_FR_DF_ISP_DI_DT4_TipoREquivalencia(),
            REG_FR_DF_ISP_DI_DT4_CuotaREquivalencia: vm.REG_FR_DF_ISP_DI_DT4_CuotaREquivalencia(),

            REG_FR_DF_ISP_DI_DT5_TipoImpositivo: vm.REG_FR_DF_ISP_DI_DT5_TipoImpositivo(),
            REG_FR_DF_ISP_DI_DT5_BaseImponible: vm.REG_FR_DF_ISP_DI_DT5_BaseImponible(),
            REG_FR_DF_ISP_DI_DT5_CuotaSoportada: vm.REG_FR_DF_ISP_DI_DT5_CuotaSoportada(),
            REG_FR_DF_ISP_DI_DT5_TipoREquivalencia: vm.REG_FR_DF_ISP_DI_DT5_TipoREquivalencia(),
            REG_FR_DF_ISP_DI_DT5_CuotaREquivalencia: vm.REG_FR_DF_ISP_DI_DT5_CuotaREquivalencia(),

            REG_FR_DF_ISP_DI_DT6_TipoImpositivo: vm.REG_FR_DF_ISP_DI_DT6_TipoImpositivo(),

            REG_FR_DF_ISP_DI_DT6_BaseImponible: vm.REG_FR_DF_ISP_DI_DT6_BaseImponible(),
            REG_FR_DF_ISP_DI_DT6_CuotaSoportada: vm.REG_FR_DF_ISP_DI_DT6_CuotaSoportada(),
            REG_FR_DF_ISP_DI_DT6_TipoREquivalencia: vm.REG_FR_DF_ISP_DI_DT6_TipoREquivalencia(),
            REG_FR_DF_ISP_DI_DT6_CuotaREquivalencia: vm.REG_FR_DF_ISP_DI_DT6_CuotaREquivalencia(),


            REG_FR_DF_DGI_DI_DT1_TipoImpositivo: vm.REG_FR_DF_DGI_DI_DT1_TipoImpositivo(),
            REG_FR_DF_DGI_DI_DT1_BaseImponible: vm.REG_FR_DF_DGI_DI_DT1_BaseImponible(),
            REG_FR_DF_DGI_DI_DT1_CuotaSoportada: vm.REG_FR_DF_DGI_DI_DT1_CuotaSoportada(),
            REG_FR_DF_DGI_DI_DT1_TipoREquivalencia: vm.REG_FR_DF_DGI_DI_DT1_TipoREquivalencia(),
            REG_FR_DF_DGI_DI_DT1_CuotaREquivalencia: vm.REG_FR_DF_DGI_DI_DT1_CuotaREquivalencia(),
            REG_FR_DF_DGI_DI_DT1_PorcentCompensacionREAGYP: vm.REG_FR_DF_DGI_DI_DT1_PorcentCompensacionREAGYP(),
            REG_FR_DF_DGI_DI_DT1_ImporteCompensacionREAGYP: vm.REG_FR_DF_DGI_DI_DT1_ImporteCompensacionREAGYP(),

            REG_FR_DF_DGI_DI_DT2_TipoImpositivo: vm.REG_FR_DF_DGI_DI_DT2_TipoImpositivo(),
            REG_FR_DF_DGI_DI_DT2_BaseImponible: vm.REG_FR_DF_DGI_DI_DT2_BaseImponible(),
            REG_FR_DF_DGI_DI_DT2_CuotaSoportada: vm.REG_FR_DF_DGI_DI_DT2_CuotaSoportada(),
            REG_FR_DF_DGI_DI_DT2_TipoREquivalencia: vm.REG_FR_DF_DGI_DI_DT2_TipoREquivalencia(),
            REG_FR_DF_DGI_DI_DT2_CuotaREquivalencia: vm.REG_FR_DF_DGI_DI_DT2_CuotaREquivalencia(),
            REG_FR_DF_DGI_DI_DT2_PorcentCompensacionREAGYP: vm.REG_FR_DF_DGI_DI_DT2_PorcentCompensacionREAGYP(),
            REG_FR_DF_DGI_DI_DT2_ImporteCompensacionREAGYP: vm.REG_FR_DF_DGI_DI_DT2_ImporteCompensacionREAGYP(),

            REG_FR_DF_DGI_DI_DT3_TipoImpositivo: vm.REG_FR_DF_DGI_DI_DT3_TipoImpositivo(),
            REG_FR_DF_DGI_DI_DT3_BaseImponible: vm.REG_FR_DF_DGI_DI_DT3_BaseImponible(),
            REG_FR_DF_DGI_DI_DT3_CuotaSoportada: vm.REG_FR_DF_DGI_DI_DT3_CuotaSoportada(),
            REG_FR_DF_DGI_DI_DT3_TipoREquivalencia: vm.REG_FR_DF_DGI_DI_DT3_TipoREquivalencia(),
            REG_FR_DF_DGI_DI_DT3_CuotaREquivalencia: vm.REG_FR_DF_DGI_DI_DT3_CuotaREquivalencia(),
            REG_FR_DF_DGI_DI_DT3_PorcentCompensacionREAGYP: vm.REG_FR_DF_DGI_DI_DT3_PorcentCompensacionREAGYP(),
            REG_FR_DF_DGI_DI_DT3_ImporteCompensacionREAGYP: vm.REG_FR_DF_DGI_DI_DT3_ImporteCompensacionREAGYP(),

            REG_FR_DF_DGI_DI_DT4_TipoImpositivo: vm.REG_FR_DF_DGI_DI_DT4_TipoImpositivo(),
            REG_FR_DF_DGI_DI_DT4_BaseImponible: vm.REG_FR_DF_DGI_DI_DT4_BaseImponible(),
            REG_FR_DF_DGI_DI_DT4_CuotaSoportada: vm.REG_FR_DF_DGI_DI_DT4_CuotaSoportada(),
            REG_FR_DF_DGI_DI_DT4_TipoREquivalencia: vm.REG_FR_DF_DGI_DI_DT4_TipoREquivalencia(),
            REG_FR_DF_DGI_DI_DT4_CuotaREquivalencia: vm.REG_FR_DF_DGI_DI_DT4_CuotaREquivalencia(),
            REG_FR_DF_DGI_DI_DT4_PorcentCompensacionREAGYP: vm.REG_FR_DF_DGI_DI_DT4_PorcentCompensacionREAGYP(),
            REG_FR_DF_DGI_DI_DT4_ImporteCompensacionREAGYP: vm.REG_FR_DF_DGI_DI_DT4_ImporteCompensacionREAGYP(),

            REG_FR_DF_DGI_DI_DT5_TipoImpositivo: vm.REG_FR_DF_DGI_DI_DT5_TipoImpositivo(),
            REG_FR_DF_DGI_DI_DT5_BaseImponible: vm.REG_FR_DF_DGI_DI_DT5_BaseImponible(),
            REG_FR_DF_DGI_DI_DT5_CuotaSoportada: vm.REG_FR_DF_DGI_DI_DT5_CuotaSoportada(),
            REG_FR_DF_DGI_DI_DT5_TipoREquivalencia: vm.REG_FR_DF_DGI_DI_DT5_TipoREquivalencia(),
            REG_FR_DF_DGI_DI_DT5_CuotaREquivalencia: vm.REG_FR_DF_DGI_DI_DT5_CuotaREquivalencia(),
            REG_FR_DF_DGI_DI_DT5_PorcentCompensacionREAGYP: vm.REG_FR_DF_DGI_DI_DT5_PorcentCompensacionREAGYP(),
            REG_FR_DF_DGI_DI_DT5_ImporteCompensacionREAGYP: vm.REG_FR_DF_DGI_DI_DT5_ImporteCompensacionREAGYP(),

            REG_FR_DF_DGI_DI_DT6_TipoImpositivo: vm.REG_FR_DF_DGI_DI_DT6_TipoImpositivo(),
            REG_FR_DF_DGI_DI_DT6_BaseImponible: vm.REG_FR_DF_DGI_DI_DT6_BaseImponible(),
            REG_FR_DF_DGI_DI_DT6_CuotaSoportada: vm.REG_FR_DF_DGI_DI_DT6_CuotaSoportada(),
            REG_FR_DF_DGI_DI_DT6_TipoREquivalencia: vm.REG_FR_DF_DGI_DI_DT6_TipoREquivalencia(),
            REG_FR_DF_DGI_DI_DT6_CuotaREquivalencia: vm.REG_FR_DF_DGI_DI_DT6_CuotaREquivalencia(),
            REG_FR_DF_DGI_DI_DT6_PorcentCompensacionREAGYP: vm.REG_FR_DF_DGI_DI_DT6_PorcentCompensacionREAGYP(),
            REG_FR_DF_DGI_DI_DT6_ImporteCompensacionREAGYP: vm.REG_FR_DF_DGI_DI_DT6_ImporteCompensacionREAGYP(),

            REG_FR_CuotaDeducible: vm.REG_FR_CuotaDeducible(),
            REG_FR_FechaRegContable: vm.REG_FR_FechaRegContable()
        };

        if (vm.FechaHoraCreacion()) data.FechaHoraCreacion = moment(vm.FechaHoraCreacion(), i18n.t('util.date_format')).format(i18n.t('util.date_iso'));
        if (vm.REG_IDF_FechaExpedicionFacturaEmisor()) data.REG_IDF_FechaExpedicionFacturaEmisor = moment(vm.REG_IDF_FechaExpedicionFacturaEmisor(), i18n.t('util.date_format')).format(i18n.t('util.date_iso'));

        if (vm.REG_FR_FechaOperacion()) data.REG_FR_FechaOperacion = moment(vm.REG_FR_FechaOperacion(), i18n.t('util.date_format')).format(i18n.t('util.date_iso'));
        if (vm.REG_FR_FechaRegContable()) data.REG_FR_FechaRegContable = moment(vm.REG_FR_FechaRegContable(), i18n.t('util.date_format')).format(i18n.t('util.date_iso'));

        var verb = "PUT";
        if (vm.IDEnvioFacturasRecibidas() == 0) verb = "POST";
        apiComunAjax.llamadaGeneral(verb, myconfig.apiUrl + "/api/facturasRecibidas", data, function (err, data) {
            if (err) return;
            if (done) {
                done();
            } else {
                apiFacturasRecibidasDetalle.salir();
            }
        });
    },
    datosOk: function () {
        var options = {
            rules: {
                txtFechaHoraCreacion: { required: true },
                txtCAB_Titular_NombreRazon: { required: true },
                txtCAB_Titular_NIF: { required: true },
                txtCAB_TipoComunicacion: { required: true },
                txtREG_PI_Ejercicio: { required: true },
                txtREG_PI_Periodo: { required: true },
                txtREG_IDF_IDEF_NIF: { required: true },
                txtREG_IDF_NumSerieFacturaEmisor: { required: true },
                txtREG_IDF_FechaExpedicionFacturaEmisor: { required: true },
                txtREG_FR_TipoFactura: { required: true },
                txtREG_FR_ClaveRegimenEspecialOTrascendencia: { required: true },
                txtREG_FR_DescripcionOperacion: { required: true },
                txtREG_FR_CNT_NombreRazon: { required: true },
                txtREG_FR_CNT_NIF: { required: true },
                cmbTipoComunicacion: { required: true },
                cmbPeriodo: { required: true },
                cmbTipoRecibida: { required: true },
                cmbRegimen: { required: true },
                txtREG_FR_FechaRegContable: { required: true },
                txtREG_FR_CuotaDeducible: { required: true }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        };
        if (vm.REG_IDF_IDEF_IDOtro_ID()) {
            options.rules.txtREG_IDF_IDEF_NIF.required = false;
        }
        if (vm.REG_FR_CNT_IDOtro_ID()) {
            options.rules.txtREG_FR_CNT_NIF.required = false;
        }
        $('#facturaEmitida-form').validate(options);
        return $('#facturaEmitida-form').valid();
    },
    salir: function () {
        window.open(sprintf('FacturasRecibidasGeneral.html'), '_self');
    },
    enviar: function () {
        if (vm.Enviada() == 1) {
            mensNormal("No se puede enviar una registro ya enviado");
            return;
        }
        if (!apiFacturasRecibidasDetalle.datosOk()) return;
        apiFacturasRecibidasDetalle.aceptar(null, function () {
            // Guardamos el registro antes del envío
            var verb = "POST";
            var url = myconfig.apiUrl + "/api/facturasRecibidas/envDb/" + vm.IDEnvioFacturasRecibidas();
            apiComunAjax.llamadaGeneral(verb, url, null, function (err, data) {
                if (err) return;
                window.open(sprintf('FacturasRecibidasGeneral.html?id=' + vm.IDEnvioFacturasRecibidas()), '_self');
            });

        });
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
            var options = [{ emisorId: 0, nombre: " " }].concat(data);
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
    },
    cargarTipoComunicacion: function (codigo) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/tipoComunicacion", null, function (err, data) {
            if (err) return;
            //var options = [{ codigo: "", nombre: " " }].concat(data);
            vm.optionsTipoComunicacion(data);
            $("#cmbTipoComunicacion").val([codigo]).trigger('change');
        });
    },
    cargarPeriodo: function (codigo) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/periodo", null, function (err, data) {
            if (err) return;
            //var options = [{ codigo: "", nombre: " " }].concat(data);
            vm.optionsPeriodo(data);
            $("#cmbPeriodo").val([codigo]).trigger('change');
        });
    },
    cargarTipoRecibida: function (codigo) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/tiporecibida", null, function (err, data) {
            if (err) return;
            //var options = [{ codigo: "", nombre: " " }].concat(data);
            vm.optionsTipoRecibida(data);
            $("#cmbTipoRecibida").val([codigo]).trigger('change');
        });
    },
    cargarRegimen: function (codigo) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/regimenrecibida", null, function (err, data) {
            if (err) return;
            //var options = [{ codigo: "", nombre: " " }].concat(data);
            vm.optionsRegimen(data);
            $("#cmbRegimen").val([codigo]).trigger('change');
        });
    },
    cargarRegimen1: function (codigo) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/regimenrecibida", null, function (err, data) {
            if (err) return;
            //var options = [{ codigo: "", nombre: " " }].concat(data);
            vm.optionsRegimen1(data);
            $("#cmbRegimen1").val([codigo]).trigger('change');
        });
    },
    cargarRegimen2: function (codigo) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/regimenrecibida", null, function (err, data) {
            if (err) return;
            //var options = [{ codigo: "", nombre: " " }].concat(data);
            vm.optionsRegimen2(data);
            $("#cmbRegimen2").val([codigo]).trigger('change');
        });
    },
    cargarTipoRectificativa: function (codigo) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/tiporectificativa", null, function (err, data) {
            if (err) return;
            //var options = [{ codigo: "", nombre: " " }].concat(data);
            vm.optionsTipoRectificativa(data);
            $("#cmbTipoRectificativa").val([codigo]).trigger('change');
        });
    },
    cargarSituacionInmueble: function (codigo) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/situacionInmueble", null, function (err, data) {
            if (err) return;
            //var options = [{ codigo: "", nombre: " " }].concat(data);
            vm.optionsSituacionInmueble(data);
            $("#cmbSituacionInmueble").val([codigo]).trigger('change');
        });
    }
}


