/*
 proyectos.js
 Funciones propias de la página Proyectos.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;
var proyectoId = 0;
var vm;

var apiPaginaProyectosDetalle = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);

        vm = new apiPaginaProyectosDetalle.datosPagina();
        ko.applyBindings(vm);

        $('#proyectos').attr('class', 'active');
        $('#proyecto-form').submit(function () { return false; });
        $('#btnAceptar').click(apiPaginaProyectosDetalle.aceptar);
        $('#btnSalir').click(apiPaginaProyectosDetalle.salir);

        proyectoId = apiComunGeneral.gup("id");
        if (proyectoId == 0){
            vm.proyectoId(0);
        }else{
            apiPaginaProyectosDetalle.cargarProyecto(proyectoId);
        }
    },
    cargarProyecto: function(id){
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/proyectos/" + id, null, function(err, data){
            if (err) return;
            apiPaginaProyectosDetalle.cargarDatosPagina(data);
        });
    },
    cargarDatosPagina: function(data){
        vm.proyectoId(data.proyectoId);
        vm.nombre(data.nombre);
        vm.referencia(data.referencia);
        vm.numeroProyecto(data.numeroProyecto);
    },
    datosPagina: function () {
        var self = this;
        self.proyectoId = ko.observable();
        self.nombre = ko.observable();
        self.referencia = ko.observable();
        self.numeroProyecto = ko.observable();
    },
    aceptar: function () {
        if (!apiPaginaProyectosDetalle.datosOk()) return;
        var data = {
            proyectoId: vm.proyectoId(),
            nombre: vm.nombre(),
            referencia: vm.referencia(),
            numeroProyecto: vm.numeroProyecto()
        };
        var verb = "PUT";
        if (vm.proyectoId() == 0) verb = "POST";
        apiComunAjax.llamadaGeneral(verb, myconfig.apiUrl + "/api/proyectos", data, function(err, data){
            if (err) return;
            apiPaginaProyectosDetalle.salir();
        });
    },
    datosOk: function(){
        $('#proyecto-form').validate({
            rules: {
                txtNombre: { required: true }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#proyecto-form').valid();
    },
    salir: function () {
        window.open(sprintf('ProyectosGeneral.html'), '_self');
    }
}


