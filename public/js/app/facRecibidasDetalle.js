/*
 facRecibidas.js
 Funciones propias de la página FacRecibidas.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;
var gruposUsuarioId = 0;
var vm;

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var apiFacRecibidasDetalle = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);

        vm = new apiFacRecibidasDetalle.datosPagina();
        ko.applyBindings(vm);
        $('#facRecibidas').attr('class', 'active');
        $('#facEmitida-form').submit(function () { return false; });

        $('#btnAceptar').click(apiFacRecibidasDetalle.aceptar);
        $('#btnSalir').click(apiFacRecibidasDetalle.salir);

        FacRecibidaId = apiComunGeneral.gup("id");
        if (FacRecibidaId == 0) {

        } else {
            apiFacRecibidasDetalle.cargarFacRecibidas(FacRecibidaId);
        }
        apiFacRecibidasDetalle.iniFacturasRecibidasTabla();
    },
    cargarFacRecibidas: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/facrecibidas/" + id, null, function (err, data) {
            if (err) return;
            apiFacRecibidasDetalle.cargarDatosPagina(data);
        });
    },
    cargarDatosPagina: function (data) {
        vm.FacRecibidaId(data.FacRecibidaId);
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
        apiFacRecibidasDetalle.cargarFacturasRecibidas();
    },
    datosPagina: function () {
        var self = this;
        self.FacRecibidaId = ko.observable();
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
        window.open(sprintf('FacturasRecibidasDetalle.html?id=' + vm.UltRegistroID()), '_new');
    },
    aceptar2: function (id) {
        window.open(sprintf('FacturasRecibidasDetalle.html?id=' + id), '_new');
    },
    datosOk: function () {

    },
    salir: function () {
        window.open(sprintf('FacRecibidasGeneral.html'), '_self');
    },
    iniFacturasRecibidasTabla: function () {
        var options = apiComunGeneral.initTableOptions('dt_facturasRecibidas', usuario.codigoIdioma);
        options.data = data;
        options.columns = [{
            data: "IDEnvioFacturasRecibidas"
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
            data: "IDEnvioFacturasRecibidas",
            render: function (data, type, row) {
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='apiFacRecibidasDetalle.aceptar2(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt2 + "</div>";
                return html;
            }
        }];
        var tabla = $('#dt_facturasRecibidas').DataTable(options);
        tabla.columns(0).visible(false);
    },
    cargarFacturasRecibidasTabla: function (data) {
        var dt = $('#dt_facturasRecibidas').dataTable();
        dt.fnClearTable();
        if (data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },
    cargarFacturasRecibidas: function () {
        var nifEmisor = vm.NifEmisor();
        var numFactura = vm.NumFactura().replaceAll('/','@');
        var fechaFactura = moment(vm.FechaFactura(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        var url = myconfig.apiUrl + "/api/facturasRecibidas/relacionados/" + nifEmisor + "/" + numFactura + "/" + fechaFactura;
        apiComunAjax.llamadaGeneral("GET", url, null, function (err, data) {
            if (err) return;
            apiFacRecibidasDetalle.cargarFacturasRecibidasTabla(data);
        });
    }
}


