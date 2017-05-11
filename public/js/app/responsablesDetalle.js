/*
 responsables.js
 Funciones propias de la página Responsables.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;
var responsableId = 0;
var vm;

var apiPaginaResponsablesDetalle = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);

        vm = new apiPaginaResponsablesDetalle.datosPagina();
        ko.applyBindings(vm);

        $('#responsables').attr('class', 'active');
        $('#responsable-form').submit(function () { return false; });
        $('#btnAceptar').click(apiPaginaResponsablesDetalle.aceptar);
        $('#btnSalir').click(apiPaginaResponsablesDetalle.salir);
        $('#cmbUsuarios').select2(select2_languages[usuario.codigoIdioma]);
        apiPaginaResponsablesDetalle.cargarUsuarios();

        responsableId = apiComunGeneral.gup("id");
        if (responsableId == 0) {
            vm.responsableId(0);
        } else {
            apiPaginaResponsablesDetalle.cargarResponsable(responsableId);
        }
    },
    cargarUsuarios: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/usuarios", null, function (err, data) {
            if (err) return;
            var options = [{ usuarioIdId: 0, nombre: " " }].concat(data);
            vm.optionsUsuarios(options);
            $("#cmbUsuarios").val([id]).trigger('change');
        });
    },
    cargarResponsable: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/responsables/" + id, null, function (err, data) {
            if (err) return;
            apiPaginaResponsablesDetalle.cargarDatosPagina(data);
        });
    },
    cargarDatosPagina: function (data) {
        vm.responsableId(data.responsableId);
        vm.nombre(data.nombre);
        apiPaginaResponsablesDetalle.cargarUsuarios(data.usuarioId);
    },
    datosPagina: function () {
        var self = this;
        self.responsableId = ko.observable();
        self.nombre = ko.observable();
        self.optionsUsuarios = ko.observableArray([]);
        self.selectedUsuarios = ko.observableArray([]);
        self.sUsuario = ko.observable();
    },
    aceptar: function () {
        if (!apiPaginaResponsablesDetalle.datosOk()) return;
        var data = {
            responsableId: vm.responsableId(),
            nombre: vm.nombre(),
            usuarioId: vm.sUsuario()
        };
        var verb = "PUT";
        if (vm.responsableId() == 0) verb = "POST";
        apiComunAjax.llamadaGeneral(verb, myconfig.apiUrl + "/api/responsables", data, function (err, data) {
            if (err) return;
            apiPaginaResponsablesDetalle.salir();
        });
    },
    datosOk: function () {
        $('#responsable-form').validate({
            rules: {
                txtNombre: { required: true },
                cmbUsuarios: { required: true }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#responsable-form').valid();
    },
    salir: function () {
        window.open(sprintf('ResponsablesGeneral.html'), '_self');
    }
}


