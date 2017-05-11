/*
 centros.js
 Funciones propias de la página Centros.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;
var centroId = 0;
var vm;

var apiPaginaCentrosDetalle = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);

        vm = new apiPaginaCentrosDetalle.datosPagina();
        ko.applyBindings(vm);

        $('#centros').attr('class', 'active');
        $('#centro-form').submit(function () { return false; });
        $('#btnAceptar').click(apiPaginaCentrosDetalle.aceptar);
        $('#btnSalir').click(apiPaginaCentrosDetalle.salir);

        centroId = apiComunGeneral.gup("id");
        if (centroId == 0){
            vm.centroId(0);
        }else{
            apiPaginaCentrosDetalle.cargarCentro(centroId);
        }
    },
    cargarCentro: function(id){
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/centros/" + id, null, function(err, data){
            if (err) return;
            apiPaginaCentrosDetalle.cargarDatosPagina(data);
        });
    },
    cargarDatosPagina: function(data){
        vm.centroId(data.centroId);
        vm.nombre(data.nombre);
    },
    datosPagina: function () {
        var self = this;
        self.centroId = ko.observable();
        self.nombre = ko.observable();
    },
    aceptar: function () {
        if (!apiPaginaCentrosDetalle.datosOk()) return;
        var data = {
            centroId: vm.centroId(),
            nombre: vm.nombre()
        };
        var verb = "PUT";
        if (vm.centroId() == 0) verb = "POST";
        apiComunAjax.llamadaGeneral(verb, myconfig.apiUrl + "/api/centros", data, function(err, data){
            if (err) return;
            apiPaginaCentrosDetalle.salir();
        });
    },
    datosOk: function(){
        $('#centro-form').validate({
            rules: {
                txtNombre: { required: true }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#centro-form').valid();
    },
    salir: function () {
        window.open(sprintf('CentrosGeneral.html'), '_self');
    }
}


