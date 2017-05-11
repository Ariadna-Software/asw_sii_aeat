/*
 paises.js
 Funciones propias de la página Paises.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;

var apiPaginaPaisesGeneral = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);
        $('#paises').attr('class', 'active');
        $('#paises-form').submit(function () { return false; });
        apiPaginaPaisesGeneral.iniPaisesTabla();
        apiPaginaPaisesGeneral.cargarPaises();
        $('#btnNuevo').click(apiPaginaPaisesGeneral.nuevo);
    },
    iniPaisesTabla: function () {
        var options = apiComunGeneral.initTableOptions('dt_paises', usuario.codigoIdioma);
        options.data = data;
        options.columns = [{
            data: "paisId"
        }, {
            data: "nombre"
        }, {
            data: "paisId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='apiPaginaPaisesGeneral.eliminar(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='apiPaginaPaisesGeneral.editar(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        var tabla = $('#dt_paises').DataTable(options);
        tabla.columns(0).visible(false);
    },
    cargarPaises: function () {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/paises", null, function (err, data) {
            if (err) return;
            apiPaginaPaisesGeneral.cargarPaisesTabla(data);
        });
    },
    cargarPaisesTabla: function (data) {
        var dt = $('#dt_paises').dataTable();
        dt.fnClearTable();
        if (data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },
    nuevo: function(){
        window.open(sprintf('PaisesDetalle.html?id=%s', 0), '_self');
    },
    editar: function(id){
        window.open(sprintf('PaisesDetalle.html?id=%s', id), '_self');
    },
    eliminar: function(id){
        apiComunNotificaciones.mensajeAceptarCancelar(i18n.t("eliminar_pregunta"),function(){
            apiComunAjax.llamadaGeneral("DELETE", myconfig.apiUrl + "/api/paises/" + id, null, function(err){
                if (err) return;
                apiPaginaPaisesGeneral.cargarPaises();
            })
        }, function(){})
    }
}


