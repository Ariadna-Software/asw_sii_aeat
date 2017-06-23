/*
 facEmitidas.js
 Funciones propias de la página FacEmitidas.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;
var gruposUsuarioId = 0;
var vm;

var apiFacEmitidasDetalle = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);

        vm = new apiFacEmitidasDetalle.datosPagina();
        ko.applyBindings(vm);
        $('#facEmitidas').attr('class', 'active');
        $('#facEmitida-form').submit(function () { return false; });

        $('#btnAceptar').click(apiFacEmitidasDetalle.aceptar);
        $('#btnSalir').click(apiFacEmitidasDetalle.salir);

        FacEmitidaId = apiComunGeneral.gup("id");
        if (FacEmitidaId == 0) {

        } else {
            apiFacEmitidasDetalle.cargarFacEmitidas(FacEmitidaId);
        }
        apiFacEmitidasDetalle.iniFacturasEmitidasTabla();
    },
    cargarFacEmitidas: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/facemitidas/" + id, null, function (err, data) {
            if (err) return;
            apiFacEmitidasDetalle.cargarDatosPagina(data);
        });
    },
    cargarDatosPagina: function (data) {
        vm.FacEmitidaId(data.FacEmitidaId);
        vm.NifEmisor(data.NifEmisor);
        vm.NombreEmisor(data.NombreEmisor);
        vm.NifReceptor(data.NifReceptor);
        vm.NombreReceptor(data.NombreReceptor);
        vm.NumFactura(data.NumFactura);
        if (data.FechaFactura)
            vm.FechaFactura(moment(data.FechaFactura).format("DD/MM/YYYY"));
        if (data.FechaOperacion)
            vm.FechaOperacion(moment(data.FechaOperacion).format("DD/MM/YYYY"));
        vm.Importe(data.Importe);
        vm.Enviada(data.Enviada);
        vm.Resultado(data.Resultado);
        vm.CSV(data.CSV);
        vm.Mensaje(data.Mensaje);
        vm.UltRegistroID(data.UltRegistroID);
        apiFacEmitidasDetalle.cargarFacturasEmitidas();
    },
    datosPagina: function () {
        var self = this;
        self.FacEmitidaId = ko.observable();
        self.NifEmisor = ko.observable();
        self.NombreEmisor = ko.observable();
        self.NifReceptor = ko.observable();
        self.NombreReceptor = ko.observable();
        self.NumFactura = ko.observable();
        self.FechaFactura = ko.observable();
        self.FechaOperacion = ko.observable();
        self.Importe = ko.observable();
        self.Enviada = ko.observable();
        self.Resultado = ko.observable();
        self.CSV = ko.observable();
        self.Mensaje = ko.observable();
        self.UltRegistroID = ko.observable();
    },
    aceptar: function (id) {
        window.open(sprintf('FacturasEmitidasDetalle.html?id=' + vm.UltRegistroID()), '_new');
    },
    aceptar2: function (id) {
        window.open(sprintf('FacturasEmitidasDetalle.html?id=' + id), '_new');
    },
    datosOk: function () {

    },
    salir: function () {
        window.open(sprintf('FacEmitidasGeneral.html'), '_self');
    },
    iniFacturasEmitidasTabla: function () {
        var options = apiComunGeneral.initTableOptions('dt_facturasEmitidas', usuario.codigoIdioma);
        options.data = data;
        options.columns = [{
            data: "IDEnvioFacturasEmitidas"
        }, {
            data: "Origen"
        }, {
            data: "REG_PI_Ejercicio"
        }, {
            data: "REG_PI_Periodo"
        }, {
            data: "REG_IDF_IDEF_NIF"
        }, {
            data: "REG_IDF_NumSerieFacturaEmisor"
        }, {
            data: "FechaHoraCreacion",
            render: function (data, type, row) {
                var html = moment(data).format("DD/MM/YYYY");
                return html;
            }
        }, {
            data: "EnvioInmediato"
        }, {
            data: "Enviada"
        }, {
            data: "Resultado"
        }, {
            data: "CSV"
        }, {
            data: "Mensaje"
        }, {
            data: "IDEnvioFacturasEmitidas",
            render: function (data, type, row) {
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='apiFacEmitidasDetalle.aceptar2(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt2 + "</div>";
                return html;
            }
        }];
        var tabla = $('#dt_facturasEmitidas').DataTable(options);
        tabla.columns(0).visible(false);
    },
    cargarFacturasEmitidasTabla: function (data) {
        var dt = $('#dt_facturasEmitidas').dataTable();
        dt.fnClearTable();
        if (data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },
    cargarFacturasEmitidas: function () {
        var nifEmisor = vm.NifEmisor();
        var numFactura = vm.NumFactura();
        var fechaFactura = moment(vm.FechaFactura(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        var url = myconfig.apiUrl + "/api/facturasEmitidas/relacionados/" + nifEmisor + "/" + numFactura + "/" + fechaFactura;
        apiComunAjax.llamadaGeneral("GET", url, null, function (err, data) {
            if (err) return;
            apiFacEmitidasDetalle.cargarFacturasEmitidasTabla(data);
        });
    }
}


