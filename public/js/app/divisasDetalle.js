/*
 divisas.js
 Funciones propias de la página Divisas.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;
var divisaId = 0;
var vm;

var apiPaginaDivisasDetalle = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);

        vm = new apiPaginaDivisasDetalle.datosPagina();
        ko.applyBindings(vm);

        $('#divisas').attr('class', 'active');
        $('#divisa-form').submit(function () { return false; });
        $('#btnAceptar').click(apiPaginaDivisasDetalle.aceptar);
        $('#btnSalir').click(apiPaginaDivisasDetalle.salir);

        divisaId = apiComunGeneral.gup("id");
        if (divisaId == 0){
            vm.divisaId(0);
        }else{
            apiPaginaDivisasDetalle.cargarDivisa(divisaId);
        }
    },
    cargarDivisa: function(id){
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/divisas/" + id, null, function(err, data){
            if (err) return;
            apiPaginaDivisasDetalle.cargarDatosPagina(data);
        });
    },
    cargarDatosPagina: function(data){
        vm.divisaId(data.divisaId);
        vm.nombre(data.nombre);
    },
    datosPagina: function () {
        var self = this;
        self.divisaId = ko.observable();
        self.nombre = ko.observable();
    },
    aceptar: function () {
        if (!apiPaginaDivisasDetalle.datosOk()) return;
        var data = {
            divisaId: vm.divisaId(),
            nombre: vm.nombre()
        };
        var verb = "PUT";
        if (vm.divisaId() == 0) verb = "POST";
        apiComunAjax.llamadaGeneral(verb, myconfig.apiUrl + "/api/divisas", data, function(err, data){
            if (err) return;
            apiPaginaDivisasDetalle.salir();
        });
    },
    datosOk: function(){
        $('#divisa-form').validate({
            rules: {
                txtNombre: { required: true }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#divisa-form').valid();
    },
    salir: function () {
        window.open(sprintf('DivisasGeneral.html'), '_self');
    }
}


