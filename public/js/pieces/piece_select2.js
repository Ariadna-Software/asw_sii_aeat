// -- html links --
// <script src="js/plugin/select2/select2.min.js"></script>
// -- html control --
/*
    <label class="label" data-i18n="usuarios.grupo">Grupo:</label>
    <select style="width:100%;" id="cmbGrupos" name="cmbGrupos" data-bind="options: optionsGrupos, optionsText: 'nombre', optionsValue: 'grupoUsuarioId', 
        value: sGrupo, valueAllowUnset: true, selectedOptions: selectedGrupos, selected2:{}">
    </select>
*/
// -- js --

// INI
$('#cmbGrupos').select2(select2_languages[usuario.codigoIdioma]);
insideApi.cargarGrupos();
$("#cmbGrupos").select2().on('change', function (e) {
    insideApi.cambioGrupo(e.added);
});

// PageData

// BOOTOM PAGE
insideApi = {
    datosPagina: function () {
        var self = this;
        self.optionsGrupos = ko.observableArray([]);
        self.selectedGrupos = ko.observableArray([]);
        self.sGrupo = ko.observable();
    },
    cargarGrupos: function (id) {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/grupos-usuarios", null, function (err, data) {
            if (err) return;
            var options = [{ grupoUsuarioId: 0, nombre: " " }].concat(data);
            vm.optionsGrupos(options);
            $("#cmbGrupos").val([id]).trigger('change');
        });
    },
    cambioGrupo: function (data) {
        if (!data) return;
        var grupoUsuarioId = data.id;
        llamadaAjax('GET', "/api/grupos-usuarios/" + grupoUsuarioId, null, function (err, data) {
            if (err) return;
            // Code here what you want to do...
        });
    }
}

