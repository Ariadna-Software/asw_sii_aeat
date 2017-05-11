/*
 areas.js
 Funciones propias de la página Areas.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;

var apiPaginaAreasGeneral = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);
        $('#areas').attr('class', 'active');
        $('#areas-form').submit(function () { return false; });
        apiPaginaAreasGeneral.iniAreasTabla();
        apiPaginaAreasGeneral.cargarAreas();
        $('#btnNuevo').click(apiPaginaAreasGeneral.nuevo);
    },
    iniAreasTabla: function () {
        var options = apiComunGeneral.initTableOptions('dt_areas', usuario.codigoIdioma);
        options.data = data;
        options.columns = [{
            data: "areaId"
        }, {
            data: "nombre"
        }, {
            data: "areaId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='apiPaginaAreasGeneral.eliminar(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='apiPaginaAreasGeneral.editar(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        var tabla = $('#dt_areas').DataTable(options);
        tabla.columns(0).visible(false);
    },
    cargarAreas: function () {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/areas", null, function (err, data) {
            if (err) return;
            apiPaginaAreasGeneral.cargarAreasTabla(data);
        });
    },
    cargarAreasTabla: function (data) {
        var dt = $('#dt_areas').dataTable();
        dt.fnClearTable();
        if (data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },
    nuevo: function(){
        window.open(sprintf('AreasDetalle.html?id=%s', 0), '_self');
    },
    editar: function(id){
        window.open(sprintf('AreasDetalle.html?id=%s', id), '_self');
    },
    eliminar: function(id){
        apiComunNotificaciones.mensajeAceptarCancelar(i18n.t("eliminar_pregunta"),function(){
            apiComunAjax.llamadaGeneral("DELETE", myconfig.apiUrl + "/api/areas/" + id, null, function(err){
                if (err) return;
                apiPaginaAreasGeneral.cargarAreas();
            })
        }, function(){})
    }
}


