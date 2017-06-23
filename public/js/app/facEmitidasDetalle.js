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
    aceptar: function (event, done) {
        window.open(sprintf('FacturasEmitidasDetalle.html?id' + vm.UltRegistroID()), '_new');
    },
    datosOk: function () {

    },
    salir: function () {
        window.open(sprintf('FacEmitidasGeneral.html'), '_self');
    }
}


