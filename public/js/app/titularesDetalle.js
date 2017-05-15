/*
 titulares.js
 Funciones propias de la página Titulares.html
*/

var titular = apiComunGeneral.obtenerTitular();
var data = null;
var gruposTitularId = 0;
var vm;

var apiTitularesDetalle = {
    ini: function () {
        apiComunGeneral.initPage(titular);
        apiComunAjax.establecerClave(titular.apiKey);

        vm = new apiTitularesDetalle.datosPagina();
        ko.applyBindings(vm);

        $('#titulares').attr('class', 'active');
        $('#titular-form').submit(function () { return false; });
        $('#btnAceptar').click(apiTitularesDetalle.aceptar);
        $('#btnSalir').click(apiTitularesDetalle.salir);

        titularId = apiComunGeneral.gup("id");
        if (titularId == 0) {
            vm.titularId(0);
        } else {
            apiTitularesDetalle.cargarTitular(titularId);
        }
    },
    cargarTitular: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/titulares/" + id, null, function (err, data) {
            if (err) return;
            apiTitularesDetalle.cargarDatosPagina(data);
        });
    },
    cargarDatosPagina: function (data) {
        vm.titularId(data.titularId);
        vm.nombreRazon(data.nombreRazon);
        vm.nifTitular(data.nifTitular);
        vm.nifRepresentante(data.nifRepresentante);
    },
    datosPagina: function () {
        var self = this;
        self.titularId = ko.observable();
        self.nombreRazon = ko.observable();
        self.nifTitular = ko.observable();
        self.nifRepresentante = ko.observable();
    },
    aceptar: function () {
        if (!apiTitularesDetalle.datosOk()) return;
        var data = {
            titularId: vm.titularId(),
            nombreRazon: vm.nombreRazon(),
            nifTitular: vm.nifTitular(),
            nifRepresentante: vm.nifRepresentante()
        };
        var verb = "PUT";
        if (vm.titularId() == 0) verb = "POST";
        apiComunAjax.llamadaGeneral(verb, myconfig.apiUrl + "/api/titulares", data, function (err, data) {
            if (err) return;
            apiTitularesDetalle.salir();
        });
    },
    datosOk: function () {
        $('#titular-form').validate({
            rules: {
                txtNombreRazon: { required: true }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#titular-form').valid();
    },
    salir: function () {
        window.open(sprintf('TitularesGeneral.html'), '_self');
    }
}


