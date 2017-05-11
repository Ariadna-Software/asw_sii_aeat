/*
 centros.js
 Funciones propias de la página Centros.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;

var apiPaginaCentrosGeneral = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);
        $('#centros').attr('class', 'active');
        $('#centros-form').submit(function () { return false; });
        apiPaginaCentrosGeneral.iniCentrosTabla();
        apiPaginaCentrosGeneral.cargarCentros();
        $('#btnNuevo').click(apiPaginaCentrosGeneral.nuevo);
    },
    iniCentrosTabla: function () {
        var options = apiComunGeneral.initTableOptions('dt_centros', usuario.codigoIdioma);
        options.data = data;
        options.columns = [{
            data: "centroId"
        }, {
            data: "nombre"
        }, {
            data: "centroId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='apiPaginaCentrosGeneral.eliminar(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='apiPaginaCentrosGeneral.editar(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        var tabla = $('#dt_centros').DataTable(options);
        tabla.columns(0).visible(false);
    },
    cargarCentros: function () {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/centros", null, function (err, data) {
            if (err) return;
            apiPaginaCentrosGeneral.cargarCentrosTabla(data);
        });
    },
    cargarCentrosTabla: function (data) {
        var dt = $('#dt_centros').dataTable();
        dt.fnClearTable();
        if (data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },
    nuevo: function(){
        window.open(sprintf('CentrosDetalle.html?id=%s', 0), '_self');
    },
    editar: function(id){
        window.open(sprintf('CentrosDetalle.html?id=%s', id), '_self');
    },
    eliminar: function(id){
        apiComunNotificaciones.mensajeAceptarCancelar(i18n.t("eliminar_pregunta"),function(){
            apiComunAjax.llamadaGeneral("DELETE", myconfig.apiUrl + "/api/centros/" + id, null, function(err){
                if (err) return;
                apiPaginaCentrosGeneral.cargarCentros();
            })
        }, function(){})
    }
}


