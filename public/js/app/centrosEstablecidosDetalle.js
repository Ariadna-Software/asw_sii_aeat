/*
 centrosEstablecidos.js
 Funciones propias de la página Centros.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;
var centroEstablecidoId = 0;
var vm;

var apiPaginaCentrosEstablecidosDetalle = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);

        vm = new apiPaginaCentrosEstablecidosDetalle.datosPagina();
        ko.applyBindings(vm);

        $('#centrosEstablecidos').attr('class', 'active');
        $('#centroEstablecido-form').submit(function () { return false; });
        $('#btnAceptar').click(apiPaginaCentrosEstablecidosDetalle.aceptar);
        $('#btnSalir').click(apiPaginaCentrosEstablecidosDetalle.salir);

        centroEstablecidoId = apiComunGeneral.gup("id");
        if (centroEstablecidoId == 0){
            vm.centroEstablecidoId(0);
        }else{
            apiPaginaCentrosEstablecidosDetalle.cargarCentro(centroEstablecidoId);
        }
    },
    cargarCentro: function(id){
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/centrosEstablecidos/" + id, null, function(err, data){
            if (err) return;
            apiPaginaCentrosEstablecidosDetalle.cargarDatosPagina(data);
        });
    },
    cargarDatosPagina: function(data){
        vm.centroEstablecidoId(data.centroEstablecidoId);
        vm.nombre(data.nombre);
    },
    datosPagina: function () {
        var self = this;
        self.centroEstablecidoId = ko.observable();
        self.nombre = ko.observable();
    },
    aceptar: function () {
        if (!apiPaginaCentrosEstablecidosDetalle.datosOk()) return;
        var data = {
            centroEstablecidoId: vm.centroEstablecidoId(),
            nombre: vm.nombre()
        };
        var verb = "PUT";
        if (vm.centroEstablecidoId() == 0) verb = "POST";
        apiComunAjax.llamadaGeneral(verb, myconfig.apiUrl + "/api/centrosEstablecidos", data, function(err, data){
            if (err) return;
            apiPaginaCentrosEstablecidosDetalle.salir();
        });
    },
    datosOk: function(){
        $('#centroEstablecido-form').validate({
            rules: {
                txtNombre: { required: true }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#centroEstablecido-form').valid();
    },
    salir: function () {
        window.open(sprintf('CentrosEstablecidosGeneral.html'), '_self');
    }
}


