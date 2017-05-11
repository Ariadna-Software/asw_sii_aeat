/*
 proyectos.js
 Funciones propias de la página Proyectos.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;

var apiPaginaProyectosGeneral = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);
        $('#proyectos').attr('class', 'active');
        $('#proyectos-form').submit(function () { return false; });
        apiPaginaProyectosGeneral.iniProyectosTabla();
        apiPaginaProyectosGeneral.cargarProyectos();
        $('#btnNuevo').click(apiPaginaProyectosGeneral.nuevo);
    },
    iniProyectosTabla: function () {
        var options = apiComunGeneral.initTableOptions('dt_proyectos', usuario.codigoIdioma);
        options.data = data;
        options.columns = [{
            data: "proyectoId"
        }, {
            data: "nombre"
        }, {
            data: "referencia"
        }, {
            data: "numeroProyecto"
        }, {
            data: "proyectoId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='apiPaginaProyectosGeneral.eliminar(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='apiPaginaProyectosGeneral.editar(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        var tabla = $('#dt_proyectos').DataTable(options);
        tabla.columns(0).visible(false);
    },
    cargarProyectos: function () {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/proyectos", null, function (err, data) {
            if (err) return;
            apiPaginaProyectosGeneral.cargarProyectosTabla(data);
        });
    },
    cargarProyectosTabla: function (data) {
        var dt = $('#dt_proyectos').dataTable();
        dt.fnClearTable();
        if (data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },
    nuevo: function(){
        window.open(sprintf('ProyectosDetalle.html?id=%s', 0), '_self');
    },
    editar: function(id){
        window.open(sprintf('ProyectosDetalle.html?id=%s', id), '_self');
    },
    eliminar: function(id){
        apiComunNotificaciones.mensajeAceptarCancelar(i18n.t("eliminar_pregunta"),function(){
            apiComunAjax.llamadaGeneral("DELETE", myconfig.apiUrl + "/api/proyectos/" + id, null, function(err){
                if (err) return;
                apiPaginaProyectosGeneral.cargarProyectos();
            })
        }, function(){})
    }
}


