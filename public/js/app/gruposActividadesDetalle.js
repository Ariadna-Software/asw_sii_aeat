/*
 gruposActividades.js
 Funciones propias de la página GruposActividades.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;
var gruposActividadId = 0;
var vm;

var apiPaginaGruposActividadesDetalle = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);

        vm = new apiPaginaGruposActividadesDetalle.datosPagina();
        ko.applyBindings(vm);

        $('#gruposActividades').attr('class', 'active');
        $('#grupoActividad-form').submit(function () { return false; });
        $('#btnAceptar').click(apiPaginaGruposActividadesDetalle.aceptar);
        $('#btnSalir').click(apiPaginaGruposActividadesDetalle.salir);

        grupoActividadId = apiComunGeneral.gup("id");
        if (grupoActividadId == 0){
            vm.grupoActividadId(0);
        }else{
            apiPaginaGruposActividadesDetalle.cargarGrupoActividad(grupoActividadId);
        }
    },
    cargarGrupoActividad: function(id){
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/grupos-actividades/" + id, null, function(err, data){
            if (err) return;
            apiPaginaGruposActividadesDetalle.cargarDatosPagina(data);
        });
    },
    cargarDatosPagina: function(data){
        vm.grupoActividadId(data.grupoActividadId);
        vm.nombre(data.nombre);
    },
    datosPagina: function () {
        var self = this;
        self.grupoActividadId = ko.observable();
        self.nombre = ko.observable();
    },
    aceptar: function () {
        if (!apiPaginaGruposActividadesDetalle.datosOk()) return;
        var data = {
            grupoActividadId: vm.grupoActividadId(),
            nombre: vm.nombre()
        };
        var verb = "PUT";
        if (vm.grupoActividadId() == 0) verb = "POST";
        apiComunAjax.llamadaGeneral(verb, myconfig.apiUrl + "/api/grupos-actividades", data, function(err, data){
            if (err) return;
            apiPaginaGruposActividadesDetalle.salir();
        });
    },
    datosOk: function(){
        $('#grupoActividad-form').validate({
            rules: {
                txtNombre: { required: true }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#grupoActividad-form').valid();
    },
    salir: function () {
        window.open(sprintf('GruposActividadesGeneral.html'), '_self');
    }
}


