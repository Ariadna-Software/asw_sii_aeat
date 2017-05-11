/*
 gruposUsuarios.js
 Funciones propias de la página GruposUsuarios.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;
var gruposUsuarioId = 0;
var vm;

var apiPaginaGruposUsuariosDetalle = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);

        vm = new apiPaginaGruposUsuariosDetalle.datosPagina();
        ko.applyBindings(vm);

        $('#gruposUsuarios').attr('class', 'active');
        $('#grupoUsuario-form').submit(function () { return false; });
        $('#btnAceptar').click(apiPaginaGruposUsuariosDetalle.aceptar);
        $('#btnSalir').click(apiPaginaGruposUsuariosDetalle.salir);

        grupoUsuarioId = apiComunGeneral.gup("id");
        if (grupoUsuarioId == 0){
            vm.grupoUsuarioId(0);
        }else{
            apiPaginaGruposUsuariosDetalle.cargarGrupoUsuario(grupoUsuarioId);
        }
    },
    cargarGrupoUsuario: function(id){
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/grupos-usuarios/" + id, null, function(err, data){
            if (err) return;
            apiPaginaGruposUsuariosDetalle.cargarDatosPagina(data);
        });
    },
    cargarDatosPagina: function(data){
        vm.grupoUsuarioId(data.grupoUsuarioId);
        vm.nombre(data.nombre);
    },
    datosPagina: function () {
        var self = this;
        self.grupoUsuarioId = ko.observable();
        self.nombre = ko.observable();
    },
    aceptar: function () {
        if (!apiPaginaGruposUsuariosDetalle.datosOk()) return;
        var data = {
            grupoUsuarioId: vm.grupoUsuarioId(),
            nombre: vm.nombre()
        };
        var verb = "PUT";
        if (vm.grupoUsuarioId() == 0) verb = "POST";
        apiComunAjax.llamadaGeneral(verb, myconfig.apiUrl + "/api/grupos-usuarios", data, function(err, data){
            if (err) return;
            apiPaginaGruposUsuariosDetalle.salir();
        });
    },
    datosOk: function(){
        $('#grupoUsuario-form').validate({
            rules: {
                txtNombre: { required: true }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#grupoUsuario-form').valid();
    },
    salir: function () {
        window.open(sprintf('GruposUsuariosGeneral.html'), '_self');
    }
}


