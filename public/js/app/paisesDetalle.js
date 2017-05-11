/*
 paises.js
 Funciones propias de la página Paises.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;
var paisId = 0;
var vm;

var apiPaginaPaisesDetalle = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);

        vm = new apiPaginaPaisesDetalle.datosPagina();
        ko.applyBindings(vm);

        $('#paises').attr('class', 'active');
        $('#pais-form').submit(function () { return false; });
        $('#btnAceptar').click(apiPaginaPaisesDetalle.aceptar);
        $('#btnSalir').click(apiPaginaPaisesDetalle.salir);

        paisId = apiComunGeneral.gup("id");
        if (paisId == 0) {
            vm.paisId(0);
        } else {
            apiPaginaPaisesDetalle.cargarPais(paisId);
        }
    },
    cargarPais: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/paises/" + id, null, function (err, data) {
            if (err) return;
            apiPaginaPaisesDetalle.cargarDatosPagina(data);
        });
    },
    cargarDatosPagina: function (data) {
        vm.paisId(data.paisId);
        vm.nombre(data.nombre);
        vm.codPais(data.codPais);
    },
    datosPagina: function () {
        var self = this;
        self.paisId = ko.observable();
        self.nombre = ko.observable();
        self.codPais = ko.observable();
    },
    aceptar: function () {
        if (!apiPaginaPaisesDetalle.datosOk()) return;
        var data = {
            paisId: vm.paisId(),
            nombre: vm.nombre(),
            codPais: vm.codPais()
        };
        var verb = "PUT";
        if (vm.paisId() == 0) verb = "POST";
        apiComunAjax.llamadaGeneral(verb, myconfig.apiUrl + "/api/paises", data, function (err, data) {
            if (err) return;
            apiPaginaPaisesDetalle.salir();
        });
    },
    datosOk: function () {
        $('#pais-form').validate({
            rules: {
                txtNombre: { required: true },
                txtCodPais: { required: true }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#pais-form').valid();
    },
    salir: function () {
        window.open(sprintf('PaisesGeneral.html'), '_self');
    }
}


