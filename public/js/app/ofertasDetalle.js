/*
 ofertas.js
 Funciones propias de la página Ofertas.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;
var ofertaId = 0;
var vm;
var anteriorMultiplicador = 0;
var anteriorEstado = "";

var apiPaginaOfertasDetalle = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);
        apiPaginaOfertasDetalle.controDeCamposEditables();

        vm = new apiPaginaOfertasDetalle.datosPagina();
        ko.applyBindings(vm);

        $('#ofertas').attr('class', 'active');
        $('#oferta-form').submit(function () { return false; });
        $('#btnAceptar').click(apiPaginaOfertasDetalle.aceptar);
        $('#btnSalir').click(apiPaginaOfertasDetalle.salir);
        $('#cmbTipoOfertas').select2(select2_languages[usuario.codigoIdioma]);
        apiPaginaOfertasDetalle.cargarTipoOfertas();
        $('#cmbResponsables').select2(select2_languages[usuario.codigoIdioma]);
        apiPaginaOfertasDetalle.cargarResponsables();

        $('#cmbPaiss').select2(select2_languages[usuario.codigoIdioma]);
        apiPaginaOfertasDetalle.cargarPaiss();
        $('#cmbEmpresas').select2(select2_languages[usuario.codigoIdioma]);
        apiPaginaOfertasDetalle.cargarEmpresas();
        $('#cmbAreas').select2(select2_languages[usuario.codigoIdioma]);
        apiPaginaOfertasDetalle.cargarAreas();
        $('#cmbCentros').select2(select2_languages[usuario.codigoIdioma]);
        apiPaginaOfertasDetalle.cargarCentros();

        $('#cmbEstados').select2(select2_languages[usuario.codigoIdioma]);
        apiPaginaOfertasDetalle.cargarEstados();
        $("#cmbEstados").select2().on('change', function (e) {
            if (e.added && (e.added.id != anteriorEstado)){
                vm.fechaUltimoEstado(moment(new Date()).format('DD/MM/YYYY'));
            }
        });

        $('#cmbProyectos').select2(select2_languages[usuario.codigoIdioma]);
        apiPaginaOfertasDetalle.cargarProyectos();
        $('#cmbTipoActividads').select2(select2_languages[usuario.codigoIdioma]);
        apiPaginaOfertasDetalle.cargarTipoActividads();
        $('#cmbTipoSoportes').select2(select2_languages[usuario.codigoIdioma]);
        apiPaginaOfertasDetalle.cargarTipoSoportes();

        $('#cmbDivisas').select2(select2_languages[usuario.codigoIdioma]);
        apiPaginaOfertasDetalle.cargarDivisas();
        $('#cmbCentroEstablecidos').select2(select2_languages[usuario.codigoIdioma]);
        apiPaginaOfertasDetalle.cargarCentroEstablecidos();

        $('#txtImportePresupuesto').on('blur', apiPaginaOfertasDetalle.cambioImporte);
        $('#txtMargenContribucion').on('blur', apiPaginaOfertasDetalle.cambioMargen);
        $('#txtMultiplicador').on('blur', apiPaginaOfertasDetalle.cambioMultiplicador);
        $('#txtImportePresupuestoDivisa').on('blur', apiPaginaOfertasDetalle.calcularImporteDesdeDivisa);
        $('#txtImporteInversion').on('blur', apiPaginaOfertasDetalle.calcularDivisaDesdeInversion);
        $('#txtImporteInversionDivisa').on('blur', apiPaginaOfertasDetalle.calcularInversionDesdeDivisa);

        ofertaId = apiComunGeneral.gup("id");
        if (ofertaId == 0) {
            vm.ofertaId(0);
            vm.version(0);
            vm.fechaOferta(moment(new Date()).format("DD/MM/YYYY"));
            vm.fechaUltimoEstado(moment(new Date()).format("DD/MM/YYYY"));
            apiPaginaOfertasDetalle.cargarEstados(1);

            apiPaginaOfertasDetalle.cargarPaiss(usuario.paisId);
            apiPaginaOfertasDetalle.cargarEmpresas(usuario.empresaId);
            apiPaginaOfertasDetalle.cargarAreas(usuario.areaId);
            apiPaginaOfertasDetalle.cargarCentros(usuario.centroId);
            apiPaginaOfertasDetalle.cargarResponsables(usuario.responsableId);
        } else {
            apiPaginaOfertasDetalle.cargarOferta(ofertaId);
        }
    },
    cargarOferta: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/ofertas/" + id, null, function (err, data) {
            if (err) return;
            apiPaginaOfertasDetalle.cargarDatosPagina(data);
        });
    },
    cargarDatosPagina: function (data) {
        vm.ofertaId(data.ofertaId);
        vm.numeroOferta(data.numeroOferta);
        vm.fechaOferta(moment(data.fechaOferta).format(i18n.t('util.date_format')));
        if (data.fechaUltimoEstado) vm.fechaUltimoEstado(moment(data.fechaUltimoEstado).format(i18n.t('util.date_format')));
        if (data.fechaLimiteProyecto) vm.fechaLimiteProyecto(moment(data.fechaLimiteProyecto).format(i18n.t('util.date_format')));
        if (data.fechaEntrega) vm.fechaEntrega(moment(data.fechaEntrega).format(i18n.t('util.date_format')));
        if (data.fechaDivisa) vm.fechaDivisa(moment(data.fechaEntrega).format(i18n.t('util.date_format')));
        vm.numeroPedido(data.numeroPedido);
        apiPaginaOfertasDetalle.cargarTipoOfertas(data.tipoOfertaId);
        apiPaginaOfertasDetalle.cargarResponsables(data.responsableId);

        apiPaginaOfertasDetalle.cargarPaiss(data.paisId);
        apiPaginaOfertasDetalle.cargarEmpresas(data.empresaId);
        apiPaginaOfertasDetalle.cargarAreas(data.areaId);
        apiPaginaOfertasDetalle.cargarCentros(data.centroId);

        apiPaginaOfertasDetalle.cargarEstados(data.estadoId);
        apiPaginaOfertasDetalle.cargarProyectos(data.proyectoId);
        apiPaginaOfertasDetalle.cargarTipoSoportes(data.tipoSoporteId);
        apiPaginaOfertasDetalle.cargarTipoActividads(data.tipoActividadId);

        apiPaginaOfertasDetalle.cargarDivisas(data.divisaId);
        apiPaginaOfertasDetalle.cargarCentroEstablecidos(data.centroEstablecidoId);
        vm.importePresupuesto(data.importePresupuesto);
        vm.importePresupuestoDivisa(data.importePresupuestoDivisa);
        vm.codigoDivisa(data.codigoDivisa);
        vm.importeInversion(data.importeInversion);
        vm.importeRetorno(data.importeRetorno);
        vm.tiempoEmpleado(data.tiempoEmpleado);
        vm.personaContacto(data.personaContacto);
        vm.descripcion(data.descripcion);
        vm.observaciones(data.observaciones);
        vm.autorizaciones(data.autorizaciones);
        vm.ofertaSingular(data.ofertaSingular);
        vm.periodo(data.periodo);
        vm.colaboradores(data.colaboradores);
        vm.margenContribucion(data.margenContribucion);
        vm.importeContribucion(data.importeContribucion);
        vm.numeroLicitacion(data.numeroLicitacion);
        vm.codigoGdes(data.codigoGdes);
        vm.importeInversionDivisa(data.importeInversionDivisa);
        vm.nombreCorto(data.nombreCorto);
        vm.cliente(data.cliente);
        vm.version(data.version);
        vm.multiplicador(data.multiplicador);
        anteriorMultiplicador = vm.multiplicador();
        anteriorEstado = vm.sEstado();
    },
    datosPagina: function () {
        var self = this;
        self.ofertaId = ko.observable();
        self.numeroOferta = ko.observable();
        self.fechaOferta = ko.observable();
        self.fechaUltimoEstado = ko.observable();
        self.fechaLimiteProyecto = ko.observable();
        self.numeroPedido = ko.observable();
        self.importePresupuesto = ko.observable();
        self.importePresupuestoDivisa = ko.observable();
        self.codigoDivisa = ko.observable();
        self.importeInversion = ko.observable();
        self.importeRetorno = ko.observable();
        self.tiempoEmpleado = ko.observable();
        self.personaContacto = ko.observable();
        self.descripcion = ko.observable();
        self.observaciones = ko.observable();
        self.autorizaciones = ko.observable();
        self.periodo = ko.observable();
        self.fechaEntrega = ko.observable();
        self.colaboradores = ko.observable();
        self.margenContribucion = ko.observable();
        self.importeContribucion = ko.observable();
        self.numeroLicitacion = ko.observable();
        self.codigoGdes = ko.observable();
        self.importeInversionDivisa = ko.observable();
        self.cliente = ko.observable();
        self.multiplicador = ko.observable();
        self.fechaDivisa = ko.observable();

        self.optionsTipoOfertas = ko.observableArray([]);
        self.selectedTipoOfertas = ko.observableArray([]);
        self.sTipoOferta = ko.observable();
        self.ofertaSingular = ko.observable();
        self.nombreCorto = ko.observable();
        self.version = ko.observable();

        self.optionsResponsables = ko.observableArray([]);
        self.selectedResponsables = ko.observableArray([]);
        self.sResponsable = ko.observable();

        self.optionsPaiss = ko.observableArray([]);
        self.selectedPaiss = ko.observableArray([]);
        self.sPais = ko.observable();

        self.optionsEmpresas = ko.observableArray([]);
        self.selectedEmpresas = ko.observableArray([]);
        self.sEmpresa = ko.observable();

        self.optionsAreas = ko.observableArray([]);
        self.selectedAreas = ko.observableArray([]);
        self.sArea = ko.observable();

        self.optionsCentros = ko.observableArray([]);
        self.selectedCentros = ko.observableArray([]);
        self.sCentro = ko.observable();

        self.optionsEstados = ko.observableArray([]);
        self.selectedEstados = ko.observableArray([]);
        self.sEstado = ko.observable();

        self.optionsProyectos = ko.observableArray([]);
        self.selectedProyectos = ko.observableArray([]);
        self.sProyecto = ko.observable();

        self.optionsTipoActividads = ko.observableArray([]);
        self.selectedTipoActividads = ko.observableArray([]);
        self.sTipoActividad = ko.observable();

        self.optionsTipoSoportes = ko.observableArray([]);
        self.selectedTipoSoportes = ko.observableArray([]);
        self.sTipoSoporte = ko.observable();

        self.optionsDivisas = ko.observableArray([]);
        self.selectedDivisas = ko.observableArray([]);
        self.sDivisa = ko.observable();

        self.optionsCentroEstablecidos = ko.observableArray([]);
        self.selectedCentroEstablecidos = ko.observableArray([]);
        self.sCentroEstablecido = ko.observable();
    },
    aceptar: function () {
        if (!apiPaginaOfertasDetalle.datosOk()) return;
        var data = {
            ofertaId: vm.ofertaId(),
            numeroOferta: vm.numeroOferta(),
            tipoOfertaId: vm.sTipoOferta(),
            responsableId: vm.sResponsable(),
            paisId: vm.sPais(),
            empresaId: vm.sEmpresa(),
            areaId: vm.sArea(),
            centroId: vm.sCentro(),
            estadoId: vm.sEstado(),
            proyectoId: vm.sProyecto(),
            tipoActividadId: vm.sTipoActividad(),
            tipoSoporteId: vm.sTipoSoporte(),
            numeroPedido: vm.numeroPedido(),
            importePresupuesto: vm.importePresupuesto(),
            importePresupuestoDivisa: vm.importePresupuestoDivisa(),
            codigoDivisa: vm.codigoDivisa(),
            importeInversion: vm.importeInversion(),
            importeRetorno: vm.importeRetorno(),
            tiempoEmpleado: vm.tiempoEmpleado(),
            personaContacto: vm.personaContacto(),
            descripcion: vm.descripcion(),
            observaciones: vm.observaciones(),
            autorizaciones: vm.autorizaciones(),
            ofertaSingular: vm.ofertaSingular(),
            periodo: vm.periodo(),
            colaboradores: vm.colaboradores(),
            margenContribucion: vm.margenContribucion(),
            importeContribucion: vm.importeContribucion(),
            numeroLicitacion: vm.numeroLicitacion(),
            codigoGdes: vm.codigoGdes(),
            importeInversionDivisa: vm.importeInversionDivisa(),
            divisaId: vm.sDivisa(),
            centroEstablecidoId: vm.sCentroEstablecido(),
            nombreCorto: vm.nombreCorto(),
            cliente: vm.cliente(),
            version: vm.version(),
            multiplicador: vm.multiplicador()
        };
        if (vm.fechaOferta()) data.fechaOferta = moment(vm.fechaOferta(), i18n.t('util.date_format')).format(i18n.t('util.date_iso'));
        if (vm.fechaUltimoEstado()) data.fechaUltimoEstado = moment(vm.fechaUltimoEstado(), i18n.t('util.date_format')).format(i18n.t('util.date_iso'));
        if (vm.fechaLimiteProyecto()) data.fechaLimiteProyecto = moment(vm.fechaLimiteProyecto(), i18n.t('util.date_format')).format(i18n.t('util.date_iso'));
        if (vm.fechaEntrega()) data.fechaEntrega = moment(vm.fechaEntrega(), i18n.t('util.date_format')).format(i18n.t('util.date_iso'));
        if (vm.fechaDivisa()) data.fechaDivisa = moment(vm.fechaDivisa(), i18n.t('util.date_format')).format(i18n.t('util.date_iso'));
        var verb = "PUT";
        data.version += 1;
        if (vm.ofertaId() == 0) {
            verb = "POST";
            data.version = 0;
        }
        apiComunAjax.llamadaGeneral(verb, myconfig.apiUrl + "/api/ofertas", data, function (err, data) {
            if (err) return;
            if (vm.sEstado() != anteriorEstado) {
                var data = {
                    asunto: "Cambio estado OFERTA: " + vm.nombreCorto(),
                    texto: "La oferta cambió el " + vm.fechaUltimoEstado() + " a " + $('#cmbEstados').select2('data').text
                };
                apiComunAjax.llamadaGeneral("POST", myconfig.apiUrl + "/api/correoElectronico", data, function (err) {
                    return;
                });
            }
            apiPaginaOfertasDetalle.salir();
        });
    },
    datosOk: function () {
        $('#oferta-form').validate({
            rules: {
                txtNumeroOferta: { required: true },
                txtFechaEntrega: { required: true },
                cmbTipoOfertas: { required: true },
                cmbResponsables: { required: true },
                cmbEstados: { required: true },
                cmbPaiss: { required: true },
                cmbEmpresas: { required: true },
                cmbAreas: { required: true },
                cmbCentros: { required: true },
                cmbProyectos: { required: true },
                txtImportePresupuesto: { required: true, number: true },
                txtDescripcion: { required: true },
                txtMultiplicador: { number: true },
                txtImportePresupuestoDivisa: { number: true },
                txtMargenContribucion: { number: true },
                txtImporteContribucion: { number: true },
                txtImporteInversion: { number: true },
                txtImporteImversionDivisa: { number: true },
                txtImporteRetorno: { number: true }
            },
            errorPlacement: function (error, element) {
                if (element.parent('.input-group').length) {
                    error.insertAfter(element.parent());      // radio/checkbox?
                } else if (element.hasClass('aswselect2')) {
                    error.insertAfter(element);  // select2
                } else {
                    error.insertAfter(element.parent());               // default
                }
            }
        });
        return $('#oferta-form').valid();
    },
    salir: function () {
        window.open(sprintf('OfertasGeneral.html'), '_self');
    },
    cargarTipoOfertas: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/tipos-oferta", null, function (err, data) {
            if (err) return;
            var options = [{ tipoOfertaId: 0, nombre: " " }].concat(data);
            vm.optionsTipoOfertas(options);
            $("#cmbTipoOfertas").val([id]).trigger('change');
        });
    },
    cargarResponsables: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/responsables", null, function (err, data) {
            if (err) return;
            var options = [{ responsableId: 0, nombre: " " }].concat(data);
            vm.optionsResponsables(options);
            $("#cmbResponsables").val([id]).trigger('change');
        });
    },
    cargarPaiss: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/paises", null, function (err, data) {
            if (err) return;
            var options = [{ paisId: 0, nombre: " " }].concat(data);
            vm.optionsPaiss(options);
            $("#cmbPaiss").val([id]).trigger('change');
        });
    },
    cargarEmpresas: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/empresas", null, function (err, data) {
            if (err) return;
            var options = [{ empresaId: 0, nombre: " " }].concat(data);
            vm.optionsEmpresas(options);
            $("#cmbEmpresas").val([id]).trigger('change');
        });
    },
    cargarAreas: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/areas", null, function (err, data) {
            if (err) return;
            var options = [{ areaId: 0, nombre: " " }].concat(data);
            vm.optionsAreas(options);
            $("#cmbAreas").val([id]).trigger('change');
        });
    },
    cargarCentros: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/centros", null, function (err, data) {
            if (err) return;
            var options = [{ centroId: 0, nombre: " " }].concat(data);
            vm.optionsCentros(options);
            $("#cmbCentros").val([id]).trigger('change');
        });
    },
    cargarEstados: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/estados", null, function (err, data) {
            if (err) return;
            var options = [{ estadoId: 0, nombre: " " }].concat(data);
            vm.optionsEstados(options);
            $("#cmbEstados").val([id]).trigger('change');
        });
    },
    cargarTipoActividads: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/tipos-actividades", null, function (err, data) {
            if (err) return;
            var options = [{ tipoActividadId: 0, nombre: " " }].concat(data);
            vm.optionsTipoActividads(options);
            $("#cmbTipoActividads").val([id]).trigger('change');
        });
    },
    cargarProyectos: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/proyectos", null, function (err, data) {
            if (err) return;
            var options = [{ proyectoId: 0, nombre: " " }].concat(data);
            vm.optionsProyectos(options);
            $("#cmbProyectos").val([id]).trigger('change');
        });
    },
    cargarTipoSoportes: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/tipos-soporte", null, function (err, data) {
            if (err) return;
            var options = [{ tipoSoporteId: 0, nombre: " " }].concat(data);
            vm.optionsTipoSoportes(options);
            $("#cmbTipoSoportes").val([id]).trigger('change');
        });
    },
    cargarDivisas: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/divisas", null, function (err, data) {
            if (err) return;
            var options = [{ divisaId: 0, nombre: " " }].concat(data);
            vm.optionsDivisas(options);
            $("#cmbDivisas").val([id]).trigger('change');
        });
    },
    cargarCentroEstablecidos: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/centrosEstablecidos", null, function (err, data) {
            if (err) return;
            var options = [{ centroEstablecidoId: 0, nombre: " " }].concat(data);
            vm.optionsCentroEstablecidos(options);
            $("#cmbCentroEstablecidos").val([id]).trigger('change');
        });
    },
    lanzarMensajeAyuda: function (mensaje) {
        apiComunNotificaciones.mensajeAyuda(mensaje);
    },
    controDeCamposEditables: function () {
        if (!usuario.esAdministrador) {
            $("#cmbTipoSoportes").attr('disabled', 'disabled');
            $("#txtTiempoEmpleado").attr('disabled', 'disabled');
            $("#txtAutorizaciones").attr('disabled', 'disabled');
        }
    },
    cambioPais: function () {
        apiPaginaOfertasDetalle.textoAutorizacion();
    },
    cambioTipoOferta: function () {
        apiPaginaOfertasDetalle.textoAutorizacion();
    },
    cambioImporte: function () {
        apiPaginaOfertasDetalle.calcularDivisaDesdeImporte();
        apiPaginaOfertasDetalle.textoAutorizacion();
    },
    textoAutorizacion: function () {
        var text = i18n.t('ofertas.autorizacionX');
        var tipoAutorizacion = apiPaginaOfertasDetalle.calculoAutorizacion();
        if (tipoAutorizacion != null) {
            text = i18n.t('ofertas.autorizacion' + tipoAutorizacion);
            if (tipoAutorizacion == 4) {
                text = i18n.t('ofertas.autorizacion1');
                text += '\n';
                text += i18n.t('ofertas.autorizacion3');
            }
        }
        vm.autorizaciones(text);
    },
    calculoAutorizacion: function () {
        if (!vm.importePresupuesto() || vm.importePresupuesto() == 0) return null;
        var tAut = 0;
        if (vm.importePresupuesto() > 150000) {
            tAut = 1;
        }
        if (vm.importePresupuesto() > 300000) {
            tAut = 2;
            if (vm.sPais() != 1) tAut = 3;
        }
        if (vm.importePresupuesto() > 1000000) {
            tAut = 3;
        }
        if (vm.ofertaSingular()) {
            tAut = 3;
            if (vm.sTipoOferta() == 1) tAut = 4;
        }
        return tAut;
    },
    cambioMargen: function () {
        var importeContribucion = (vm.importePresupuesto() * vm.margenContribucion()) / 100;
        importeContribucion = apiComunGeneral.redondeo2Decimales(importeContribucion);
        vm.importeContribucion(importeContribucion);
    },
    calcularDivisaDesdeImporte: function () {
        if (vm.importePresupuesto() && vm.importePresupuesto() != 0) {
            if (vm.multiplicador()) {
                var importeDivisa = vm.importePresupuesto() * vm.multiplicador();
                vm.importePresupuestoDivisa(apiComunGeneral.redondeo2Decimales(importeDivisa));
                apiPaginaOfertasDetalle.actualizarFechaDivisa();
            }
        }
    },
    calcularDivisaDesdeInversion: function () {
        if (vm.importeInversion() && vm.importeInversion() != 0) {
            if (vm.multiplicador()) {
                var importeDivisa = vm.importeInversion() * vm.multiplicador();
                vm.importeInversionDivisa(apiComunGeneral.redondeo2Decimales(importeDivisa));
                apiPaginaOfertasDetalle.actualizarFechaDivisa();
            }
        }
    },
    calcularImporteDesdeDivisa: function () {
        if (vm.multiplicador() && vm.importePresupuestoDivisa()) {
            var importe = vm.importePresupuestoDivisa() / vm.multiplicador();
            vm.importePresupuesto(apiComunGeneral.redondeo2Decimales(importe));
            apiPaginaOfertasDetalle.textoAutorizacion();
            apiPaginaOfertasDetalle.actualizarFechaDivisa();
        }
    },
    calcularInversionDesdeDivisa: function () {
        if (vm.importeInversionDivisa() && vm.importeInversionDivisa() != 0) {
            if (vm.multiplicador()) {
                var importe = vm.importeInversionDivisa() / vm.multiplicador();
                vm.importeInversion(apiComunGeneral.redondeo2Decimales(importe));
                apiPaginaOfertasDetalle.actualizarFechaDivisa();
            }
        }
    },
    actualizarFechaDivisa: function () {
        if (anteriorMultiplicador != vm.multiplicador()) vm.fechaDivisa(moment(new Date()).format('DD/MM/YYYY'));
    },
    cambioMultiplicador: function () {
        apiPaginaOfertasDetalle.calcularDivisaDesdeImporte();
        apiPaginaOfertasDetalle.calcularDivisaDesdeInversion();
    }
}


