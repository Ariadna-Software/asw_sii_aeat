/*
 tiposActividadesDetalle.js
 Funciones propias de la página Usuarios.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;
var tipoActividadId = 0;
var vm;

var apiPaginaTiposActividadesDetalle = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);

        vm = new apiPaginaTiposActividadesDetalle.datosPagina();
        ko.applyBindings(vm);

        $('#usuarios').attr('class', 'active');
        $('#tipoActividades-form').submit(function () { return false; });
        $('#btnAceptar').click(apiPaginaTiposActividadesDetalle.aceptar);
        $('#btnSalir').click(apiPaginaTiposActividadesDetalle.salir);
        $('#cmbGrupos').select2(select2_languages[usuario.codigoIdioma]);
        apiPaginaTiposActividadesDetalle.cargarGrupos();

        tipoActividadId = apiComunGeneral.gup("id");
        if (tipoActividadId == 0) {
            vm.tipoActividadId(0);
        } else {
            apiPaginaTiposActividadesDetalle.cargarTipoActividad(tipoActividadId);
        }
    },
    cargarGrupos: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/grupos-actividades", null, function (err, data) {
            if (err) return;
            var options = [{ grupoActividadId: 0, nombre: " " }].concat(data);
            vm.optionsGrupos(options);
            $("#cmbGrupos").val([id]).trigger('change');
        });
    },
    cargarTipoActividad: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/tipos-actividades/" + id, null, function (err, data) {
            if (err) return;
            apiPaginaTiposActividadesDetalle.cargarDatosPagina(data);
        });
    },
    cargarDatosPagina: function (data) {
        vm.tipoActividadId(data.tipoActividadId);
        vm.nombre(data.nombre);
        apiPaginaTiposActividadesDetalle.cargarGrupos(data.grupoActividadId);
    },
    datosPagina: function () {
        var self = this;
        self.tipoActividadId = ko.observable();
        self.nombre = ko.observable();
        self.optionsGrupos = ko.observableArray([]);
        self.selectedGrupos = ko.observableArray([]);
        self.sGrupo = ko.observable();
    },
    aceptar: function () {
        if (!apiPaginaTiposActividadesDetalle.datosOk()) return;
        var data = {
            tipoActividadId: vm.tipoActividadId(),
            nombre: vm.nombre(),
            grupoActividadId: vm.sGrupo()
        };
        var verb = "PUT";
        if (vm.tipoActividadId() == 0) verb = "POST";
        apiComunAjax.llamadaGeneral(verb, myconfig.apiUrl + "/api/tipos-actividades", data, function (err, data) {
            if (err) return;
            apiPaginaTiposActividadesDetalle.salir();
        });
    },
    datosOk: function () {
        $('#tipoActividades-form').validate({
            rules: {
                txtNombre: { required: true },
                cmbGrupos: {required: true}
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#tipoActividades-form').valid();
    },
    salir: function () {
        window.open(sprintf('TiposActividadesGeneral.html'), '_self');
    }
}


