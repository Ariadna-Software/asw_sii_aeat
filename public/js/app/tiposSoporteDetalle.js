/*
 tiposSoporte.js
 Funciones propias de la página TiposSoporte.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;
var tipoSoporteId = 0;
var vm;

var apiPaginaTiposSoportesDetalle = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);

        vm = new apiPaginaTiposSoportesDetalle.datosPagina();
        ko.applyBindings(vm);

        $('#tiposSoporte').attr('class', 'active');
        // $('#tipoSoporte-form').submit(function () { return false; });
        $('#btnAceptar').click(apiPaginaTiposSoportesDetalle.aceptar);
        $('#btnSalir').click(apiPaginaTiposSoportesDetalle.salir);

        tipoSoporteId = apiComunGeneral.gup("id");
        if (tipoSoporteId == 0){
            vm.tipoSoporteId(0);
        }else{
            apiPaginaTiposSoportesDetalle.cargarTipoSoporte(tipoSoporteId);
        }
    },
    cargarTipoSoporte: function(id){
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/tipos-soporte/" + id, null, function(err, data){
            if (err) return;
            apiPaginaTiposSoportesDetalle.cargarDatosPagina(data);
        });
    },
    cargarDatosPagina: function(data){
        vm.tipoSoporteId(data.tipoSoporteId);
        vm.nombre(data.nombre);
    },
    datosPagina: function () {
        var self = this;
        self.tipoSoporteId = ko.observable();
        self.nombre = ko.observable();
    },
    aceptar: function () {
        if (!apiPaginaTiposSoportesDetalle.datosOk()) return;
        var data = {
            tipoSoporteId: vm.tipoSoporteId(),
            nombre: vm.nombre()
        };
        var verb = "PUT";
        if (vm.tipoSoporteId() == 0) verb = "POST";
        apiComunAjax.llamadaGeneral(verb, myconfig.apiUrl + "/api/tipos-soporte", data, function(err, data){
            if (err) return;
            apiPaginaTiposSoportesDetalle.salir();
        });
    },
    datosOk: function(){
        $('#tipoSoporte-form').validate({
            rules: {
                txtNombre: { required: true }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#tipoSoporte-form').valid();
    },
    salir: function () {
        window.open(sprintf('TiposSoporteGeneral.html'), '_self');
    }
}


