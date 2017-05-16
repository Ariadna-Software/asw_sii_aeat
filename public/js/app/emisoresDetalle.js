/*
 emisores.js
 Funciones propias de la página Emisores.html
*/

var emisor = apiComunGeneral.obtenerUsuario();
var data = null;
var gruposEmisorId = 0;
var vm;

var apiEmisoresDetalle = {
    ini: function () {
        apiComunGeneral.initPage(emisor);
        apiComunAjax.establecerClave(emisor.apiKey);

        vm = new apiEmisoresDetalle.datosPagina();
        ko.applyBindings(vm);

        $('#emisores').attr('class', 'active');
        $('#emisor-form').submit(function () { return false; });
        $('#btnAceptar').click(apiEmisoresDetalle.aceptar);
        $('#btnSalir').click(apiEmisoresDetalle.salir);

        emisorId = apiComunGeneral.gup("id");
        if (emisorId == 0) {
            vm.emisorId(0);
        } else {
            apiEmisoresDetalle.cargarEmisor(emisorId);
        }
    },
    cargarEmisor: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/emisores/" + id, null, function (err, data) {
            if (err) return;
            apiEmisoresDetalle.cargarDatosPagina(data);
        });
    },
    cargarDatosPagina: function (data) {
        vm.emisorId(data.emisorId);
        vm.nombre(data.nombre);
        vm.nif(data.nif);
    },
    datosPagina: function () {
        var self = this;
        self.emisorId = ko.observable();
        self.nombre = ko.observable();
        self.nif = ko.observable();
    },
    aceptar: function () {
        if (!apiEmisoresDetalle.datosOk()) return;
        var data = {
            emisorId: vm.emisorId(),
            nombre: vm.nombre(),
            nif: vm.nif()
        };
        var verb = "PUT";
        if (vm.emisorId() == 0) verb = "POST";
        apiComunAjax.llamadaGeneral(verb, myconfig.apiUrl + "/api/emisores", data, function (err, data) {
            if (err) return;
            apiEmisoresDetalle.salir();
        });
    },
    datosOk: function () {
        $('#emisor-form').validate({
            rules: {
                txtNombre: { required: true }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#emisor-form').valid();
    },
    salir: function () {
        window.open(sprintf('EmisoresGeneral.html'), '_self');
    }
}


