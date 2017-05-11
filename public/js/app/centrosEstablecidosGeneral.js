/*
 centrosEstablecidos.js
 Funciones propias de la página Centros.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;

var apiPaginaCentrosEstablecidosGeneral = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);
        $('#centrosEstablecidos').attr('class', 'active');
        $('#centrosEstablecidos-form').submit(function () { return false; });
        apiPaginaCentrosEstablecidosGeneral.iniCentrosTabla();
        apiPaginaCentrosEstablecidosGeneral.cargarCentros();
        $('#btnNuevo').click(apiPaginaCentrosEstablecidosGeneral.nuevo);
    },
    iniCentrosTabla: function () {
        var options = apiComunGeneral.initTableOptions('dt_centrosEstablecidos', usuario.codigoIdioma);
        options.data = data;
        options.columns = [{
            data: "centroEstablecidoId"
        }, {
            data: "nombre"
        }, {
            data: "centroEstablecidoId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='apiPaginaCentrosEstablecidosGeneral.eliminar(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='apiPaginaCentrosEstablecidosGeneral.editar(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        var tabla = $('#dt_centrosEstablecidos').DataTable(options);
        tabla.columns(0).visible(false);
    },
    cargarCentros: function () {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/centrosEstablecidos", null, function (err, data) {
            if (err) return;
            apiPaginaCentrosEstablecidosGeneral.cargarCentrosTabla(data);
        });
    },
    cargarCentrosTabla: function (data) {
        var dt = $('#dt_centrosEstablecidos').dataTable();
        dt.fnClearTable();
        if (data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },
    nuevo: function(){
        window.open(sprintf('CentrosEstablecidosDetalle.html?id=%s', 0), '_self');
    },
    editar: function(id){
        window.open(sprintf('CentrosEstablecidosDetalle.html?id=%s', id), '_self');
    },
    eliminar: function(id){
        apiComunNotificaciones.mensajeAceptarCancelar(i18n.t("eliminar_pregunta"),function(){
            apiComunAjax.llamadaGeneral("DELETE", myconfig.apiUrl + "/api/centrosEstablecidos/" + id, null, function(err){
                if (err) return;
                apiPaginaCentrosEstablecidosGeneral.cargarCentros();
            })
        }, function(){})
    }
}


