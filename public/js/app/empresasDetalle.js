/*
 empresas.js
 Funciones propias de la página Empresas.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;
var empresaId = 0;
var vm;

var apiPaginaEmpresasDetalle = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);

        vm = new apiPaginaEmpresasDetalle.datosPagina();
        ko.applyBindings(vm);

        $('#empresas').attr('class', 'active');
        $('#empresa-form').submit(function () { return false; });
        $('#btnAceptar').click(apiPaginaEmpresasDetalle.aceptar);
        $('#btnSalir').click(apiPaginaEmpresasDetalle.salir);

        empresaId = apiComunGeneral.gup("id");
        if (empresaId == 0){
            vm.empresaId(0);
        }else{
            apiPaginaEmpresasDetalle.cargarEmpresa(empresaId);
        }
    },
    cargarEmpresa: function(id){
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/empresas/" + id, null, function(err, data){
            if (err) return;
            apiPaginaEmpresasDetalle.cargarDatosPagina(data);
        });
    },
    cargarDatosPagina: function(data){
        vm.empresaId(data.empresaId);
        vm.nombre(data.nombre);
    },
    datosPagina: function () {
        var self = this;
        self.empresaId = ko.observable();
        self.nombre = ko.observable();
    },
    aceptar: function () {
        if (!apiPaginaEmpresasDetalle.datosOk()) return;
        var data = {
            empresaId: vm.empresaId(),
            nombre: vm.nombre()
        };
        var verb = "PUT";
        if (vm.empresaId() == 0) verb = "POST";
        apiComunAjax.llamadaGeneral(verb, myconfig.apiUrl + "/api/empresas", data, function(err, data){
            if (err) return;
            apiPaginaEmpresasDetalle.salir();
        });
    },
    datosOk: function(){
        $('#empresa-form').validate({
            rules: {
                txtNombre: { required: true }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#empresa-form').valid();
    },
    salir: function () {
        window.open(sprintf('EmpresasGeneral.html'), '_self');
    }
}


