/*
 facturasEmitidas.js
 Funciones propias de la página FacturasEmitidas.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;
var gruposUsuarioId = 0;
var vm;

var apiFacturasEmitidasDetalle = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);

        vm = new apiFacturasEmitidasDetalle.datosPagina();
        ko.applyBindings(vm);

        $('#facturasEmitidas').attr('class', 'active');
        $('#facturaEmitida-form').submit(function () { return false; });
        $('#btnAceptar').click(apiFacturasEmitidasDetalle.aceptar);
        $('#btnSalir').click(apiFacturasEmitidasDetalle.salir);

        IDEnvioFacturasEmitidas = apiComunGeneral.gup("id");
        if (IDEnvioFacturasEmitidas == 0){
            vm.IDEnvioFacturasEmitidas(0);
        }else{
            apiFacturasEmitidasDetalle.cargarGrupoUsuario(IDEnvioFacturasEmitidas);
        }
    },
    cargarGrupoUsuario: function(id){
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/facturasEmitidas/" + id, null, function(err, data){
            if (err) return;
            apiFacturasEmitidasDetalle.cargarDatosPagina(data);
        });
    },
    cargarDatosPagina: function(data){
        vm.IDEnvioFacturasEmitidas(data.IDEnvioFacturasEmitidas);
        vm.nombre(data.nombre);
    },
    datosPagina: function () {
        var self = this;
        self.IDEnvioFacturasEmitidas = ko.observable();
        self.nombre = ko.observable();
    },
    aceptar: function () {
        if (!apiFacturasEmitidasDetalle.datosOk()) return;
        var data = {
            IDEnvioFacturasEmitidas: vm.IDEnvioFacturasEmitidas(),
            nombre: vm.nombre()
        };
        var verb = "PUT";
        if (vm.IDEnvioFacturasEmitidas() == 0) verb = "POST";
        apiComunAjax.llamadaGeneral(verb, myconfig.apiUrl + "/api/facturasEmitidas", data, function(err, data){
            if (err) return;
            apiFacturasEmitidasDetalle.salir();
        });
    },
    datosOk: function(){
        $('#facturaEmitida-form').validate({
            rules: {
                txtNombre: { required: true }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#facturaEmitida-form').valid();
    },
    salir: function () {
        window.open(sprintf('FacturasEmitidasGeneral.html'), '_self');
    }
}


