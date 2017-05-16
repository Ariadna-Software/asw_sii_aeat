/*
 titulares.js
 Funciones propias de la página Titulares.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;

var apiTitularesGeneral = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);
        $('#titulares').attr('class', 'active');
        $('#titulares-form').submit(function () { return false; });
        apiTitularesGeneral.iniTitularesTabla();
        apiTitularesGeneral.cargarTitulares();
        $('#btnNuevo').click(apiTitularesGeneral.nuevo);
    },
    iniTitularesTabla: function () {
        var options = apiComunGeneral.initTableOptions('dt_titulares', usuario.codigoIdioma);
        options.data = data;
        options.columns = [{
            data: "titularId"
        }, {
            data: "nombreRazon"
        }, {
            data: "nifTitular"
        }, {
            data: "titularId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='apiTitularesGeneral.eliminar(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='apiTitularesGeneral.editar(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        var tabla = $('#dt_titulares').DataTable(options);
        tabla.columns(0).visible(false);
    },
    cargarTitulares: function () {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/titulares", null, function (err, data) {
            if (err) return;
            apiTitularesGeneral.cargarTitularesTabla(data);
        });
    },
    cargarTitularesTabla: function (data) {
        var dt = $('#dt_titulares').dataTable();
        dt.fnClearTable();
        if (data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },
    nuevo: function(){
        window.open(sprintf('TitularesDetalle.html?id=%s', 0), '_self');
    },
    editar: function(id){
        window.open(sprintf('TitularesDetalle.html?id=%s', id), '_self');
    },
    eliminar: function(id){
        apiComunNotificaciones.mensajeAceptarCancelar(i18n.t("eliminar_pregunta"),function(){
            apiComunAjax.llamadaGeneral("DELETE", myconfig.apiUrl + "/api/titulares/" + id, null, function(err){
                if (err) return;
                apiTitularesGeneral.cargarTitulares();
            })
        }, function(){})
    }
}


