/*
 responsables.js
 Funciones propias de la página Responsables.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;

var apiPaginaResponsablesGeneral = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);
        $('#responsables').attr('class', 'active');
        $('#responsables-form').submit(function () { return false; });
        apiPaginaResponsablesGeneral.iniResponsablesTabla();
        apiPaginaResponsablesGeneral.cargarResponsables();
        $('#btnNuevo').click(apiPaginaResponsablesGeneral.nuevo);
    },
    iniResponsablesTabla: function () {
        var options = apiComunGeneral.initTableOptions('dt_responsables', usuario.codigoIdioma);
        options.data = data;
        options.columns = [{
            data: "responsableId"
        }, {
            data: "nombre"
        }, {
            data: "usuario"
        }, {
            data: "responsableId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='apiPaginaResponsablesGeneral.eliminar(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='apiPaginaResponsablesGeneral.editar(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        var tabla = $('#dt_responsables').DataTable(options);
        tabla.columns(0).visible(false);
    },
    cargarResponsables: function () {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/responsables", null, function (err, data) {
            if (err) return;
            apiPaginaResponsablesGeneral.cargarResponsablesTabla(data);
        });
    },
    cargarResponsablesTabla: function (data) {
        var dt = $('#dt_responsables').dataTable();
        dt.fnClearTable();
        if (data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },
    nuevo: function(){
        window.open(sprintf('ResponsablesDetalle.html?id=%s', 0), '_self');
    },
    editar: function(id){
        window.open(sprintf('ResponsablesDetalle.html?id=%s', id), '_self');
    },
    eliminar: function(id){
        apiComunNotificaciones.mensajeAceptarCancelar(i18n.t("eliminar_pregunta"),function(){
            apiComunAjax.llamadaGeneral("DELETE", myconfig.apiUrl + "/api/responsables/" + id, null, function(err){
                if (err) return;
                apiPaginaResponsablesGeneral.cargarResponsables();
            })
        }, function(){})
    }
}


