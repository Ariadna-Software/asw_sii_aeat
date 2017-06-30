/*
 index.js
 Funciones propias de la página index.html
*/

var usuario = apiComunGeneral.obtenerUsuario();

var apiUploadCsv = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        vm = new apiUploadCsv.datosPagina();
        ko.applyBindings(vm);

        $('#inicio').attr('class', 'active');
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/version", null, function (err, data) {
            if (err) return;
        });
        $('#cmbTipos').select2(select2_languages[usuario.codigoIdioma]);
        apiUploadCsv.cargarTipos();
    },
    datosPagina: function () {
        var self = this;
        self.optionsTipos = ko.observableArray([]);
        self.selectedTipos = ko.observableArray([]);
        self.sTipo = ko.observable();
    },    
    cargarTipos: function () {
        options = [
            { "codigo": 1, "nombre": "Facturas emitidas" },
            { "codigo": 2, "nombre": "Facturas recibidas" }
        ];
        vm.optionsTipos(options);
        $("#cmbTipos").val([1]).trigger('change');
    }    
}


