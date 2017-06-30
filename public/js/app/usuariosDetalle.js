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
        $('#cmbTitulares').select2(select2_languages[usuario.codigoIdioma]);
        apiPaginaUsuariosDetalle.cargarTitulares();

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
    cargarTitulares: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/titulares", null, function (err, data) {
            if (err) return;
            var options = [{ titularId: 0, nombre: " " }].concat(data);
            vm.optionsTitulares(options);
            $("#cmbTitulares").val([id]).trigger('change');
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
        vm.esAdministrador(data.esAdministrador);
        apiPaginaUsuariosDetalle.cargarTitulares(data.titularId);
        vm.verFacEmitidas(data.verFacEmitidas);
        vm.verFacRecibidas(data.verFacRecibidas);
        vm.password(data.password);
        vm.login(data.login);
    },
    datosPagina: function () {
        var self = this;
        self.usuarioId = ko.observable();
        self.nombre = ko.observable();
        self.codigoIdioma = ko.observable();
        self.esAdministrador = ko.observable();
        self.verFacEmitidas = ko.observable();
        self.verFacRecibidas = ko.observable();
        self.optionsGrupos = ko.observableArray([]);
        self.selectedGrupos = ko.observableArray([]);
        self.sGrupo = ko.observable();
        self.password = ko.observable();
        self.login = ko.observable();

        self.optionsTitulares = ko.observableArray([]);
        self.selectedTitulares = ko.observableArray([]);
        self.sTitular = ko.observable();


    },
    aceptar: function () {
        if (!apiPaginaUsuariosDetalle.datosOk()) return;
        var data = {
            usuarioId: vm.usuarioId(),
            nombre: vm.nombre(),
            esAdministrador: vm.esAdministrador(),
            grupoUsuarioId: vm.sGrupo(),
            codigoIdioma: vm.codigoIdioma(),
            titularId: vm.sTitular(),
            verFacEmitidas: vm.verFacEmitidas(),
            verFacRecibidas: vm.verFacRecibidas(),
            password: vm.password(),
            login: vm.login()
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


