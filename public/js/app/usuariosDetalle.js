/*
 usuarios.js
 Funciones propias de la página Usuarios.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;
var gruposUsuarioId = 0;
var vm;

var apiPaginaUsuariosDetalle = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);

        vm = new apiPaginaUsuariosDetalle.datosPagina();
        ko.applyBindings(vm);

        $('#usuarios').attr('class', 'active');
        $('#usuario-form').submit(function () { return false; });
        $('#btnAceptar').click(apiPaginaUsuariosDetalle.aceptar);
        $('#btnSalir').click(apiPaginaUsuariosDetalle.salir);
        $('#cmbGrupos').select2(select2_languages[usuario.codigoIdioma]);
        apiPaginaUsuariosDetalle.cargarGrupos();        

        usuarioId = apiComunGeneral.gup("id");
        if (usuarioId == 0) {
            vm.usuarioId(0);
        } else {
            apiPaginaUsuariosDetalle.cargarUsuario(usuarioId);
        }
    },
    cargarGrupos: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/grupos-usuarios", null, function (err, data) {
            if (err) return;
            var options = [{ grupoUsuarioId: 0, nombre: " " }].concat(data);
            vm.optionsGrupos(options);
            $("#cmbGrupos").val([id]).trigger('change');
        });
    },
    cargarUsuario: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/usuarios/" + id, null, function (err, data) {
            if (err) return;
            apiPaginaUsuariosDetalle.cargarDatosPagina(data);
        });
    },
    cargarDatosPagina: function (data) {
        vm.usuarioId(data.usuarioId);
        vm.nombre(data.nombre);
        vm.codigoIdioma(data.codigoIdioma);
        apiPaginaUsuariosDetalle.cargarGrupos(data.grupoUsuarioId);
    },
    datosPagina: function () {
        var self = this;
        self.usuarioId = ko.observable();
        self.nombre = ko.observable();
        self.codigoIdioma = ko.observable();

        self.optionsGrupos = ko.observableArray([]);
        self.selectedGrupos = ko.observableArray([]);
        self.sGrupo = ko.observable();

    },
    aceptar: function () {
        if (!apiPaginaUsuariosDetalle.datosOk()) return;
        var data = {
            usuarioId: vm.usuarioId(),
            nombre: vm.nombre(),
            grupoUsuarioId: vm.sGrupo(),
            codigoIdioma: vm.codigoIdioma()
        };
        var verb = "PUT";
        if (vm.usuarioId() == 0) verb = "POST";
        apiComunAjax.llamadaGeneral(verb, myconfig.apiUrl + "/api/usuarios", data, function (err, data) {
            if (err) return;
            apiPaginaUsuariosDetalle.salir();
        });
    },
    datosOk: function () {
        $('#usuario-form').validate({
            rules: {
                txtNombre: { required: true },
                cmbGrupos: { required: true }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#usuario-form').valid();
    },
    salir: function () {
        window.open(sprintf('UsuariosGeneral.html'), '_self');
    }
}


