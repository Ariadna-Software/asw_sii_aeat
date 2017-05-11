/*
 tiposOferta.js
 Funciones propias de la página TiposOferta.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;
var tipoOfertaId = 0;
var vm;

var apiPaginaTiposOfertasDetalle = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);

        vm = new apiPaginaTiposOfertasDetalle.datosPagina();
        ko.applyBindings(vm);

        $('#tiposOferta').attr('class', 'active');
        $('#tipoOferta-form').submit(function () { return false; });
        $('#btnAceptar').click(apiPaginaTiposOfertasDetalle.aceptar);
        $('#btnSalir').click(apiPaginaTiposOfertasDetalle.salir);

        tipoOfertaId = apiComunGeneral.gup("id");
        if (tipoOfertaId == 0){
            vm.tipoOfertaId(0);
        }else{
            apiPaginaTiposOfertasDetalle.cargarTipoOferta(tipoOfertaId);
        }
    },
    cargarTipoOferta: function(id){
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/tipos-oferta/" + id, null, function(err, data){
            if (err) return;
            apiPaginaTiposOfertasDetalle.cargarDatosPagina(data);
        });
    },
    cargarDatosPagina: function(data){
        vm.tipoOfertaId(data.tipoOfertaId);
        vm.nombre(data.nombre);
    },
    datosPagina: function () {
        var self = this;
        self.tipoOfertaId = ko.observable();
        self.nombre = ko.observable();
    },
    aceptar: function () {
        if (!apiPaginaTiposOfertasDetalle.datosOk()) return;
        var data = {
            tipoOfertaId: vm.tipoOfertaId(),
            nombre: vm.nombre()
        };
        var verb = "PUT";
        if (vm.tipoOfertaId() == 0) verb = "POST";
        apiComunAjax.llamadaGeneral(verb, myconfig.apiUrl + "/api/tipos-oferta", data, function(err, data){
            if (err) return;
            apiPaginaTiposOfertasDetalle.salir();
        });
    },
    datosOk: function(){
        $('#tipoOferta-form').validate({
            rules: {
                txtNombre: { required: true }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#tipoOferta-form').valid();
    },
    salir: function () {
        window.open(sprintf('TiposOfertaGeneral.html'), '_self');
    }
}


