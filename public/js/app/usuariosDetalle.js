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

        $('#cmbPaiss').select2(select2_languages[usuario.codigoIdioma]);
        apiPaginaUsuariosDetalle.cargarPaiss();
        $('#cmbEmpresas').select2(select2_languages[usuario.codigoIdioma]);
        apiPaginaUsuariosDetalle.cargarEmpresas();
        $('#cmbAreas').select2(select2_languages[usuario.codigoIdioma]);
        apiPaginaUsuariosDetalle.cargarAreas();
        $('#cmbCentros').select2(select2_languages[usuario.codigoIdioma]);
        apiPaginaUsuariosDetalle.cargarCentros();

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
        vm.esAdministrador(data.esAdministrador);
        vm.verOfertasGrupo(data.verOfertasGrupo);
        apiPaginaUsuariosDetalle.cargarGrupos(data.grupoUsuarioId);

        apiPaginaUsuariosDetalle.cargarPaiss(data.paisId);
        apiPaginaUsuariosDetalle.cargarEmpresas(data.empresaId);
        apiPaginaUsuariosDetalle.cargarAreas(data.areaId);
        apiPaginaUsuariosDetalle.cargarCentros(data.centroId);
    },
    datosPagina: function () {
        var self = this;
        self.usuarioId = ko.observable();
        self.nombre = ko.observable();
        self.codigoIdioma = ko.observable();
        self.esAdministrador = ko.observable();
        self.verOfertasGrupo = ko.observable();

        self.optionsGrupos = ko.observableArray([]);
        self.selectedGrupos = ko.observableArray([]);
        self.sGrupo = ko.observable();

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
    },
    aceptar: function () {
        if (!apiPaginaUsuariosDetalle.datosOk()) return;
        var data = {
            usuarioId: vm.usuarioId(),
            nombre: vm.nombre(),
            grupoUsuarioId: vm.sGrupo(),
            codigoIdioma: vm.codigoIdioma(),
            esAdministrador: vm.esAdministrador(),
            verOfertasGrupo: vm.verOfertasGrupo(),
            paisId: vm.sPais(),
            empresaId: vm.sEmpresa(),
            areaId: vm.sArea(),
            centroId: vm.sCentro()
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
    }
}


