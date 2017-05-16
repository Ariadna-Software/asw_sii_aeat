/*
 emisores.js
 Funciones propias de la página Emisores.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;

var apiEmisoresGeneral = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);
        $('#emisores').attr('class', 'active');
        $('#emisores-form').submit(function () { return false; });
        apiEmisoresGeneral.iniEmisoresTabla();
        apiEmisoresGeneral.cargarEmisores();
        $('#btnNuevo').click(apiEmisoresGeneral.nuevo);
    },
    iniEmisoresTabla: function () {
        var options = apiComunGeneral.initTableOptions('dt_emisores', usuario.codigoIdioma);
        options.data = data;
        options.columns = [{
            data: "emisorId"
        }, {
            data: "nombre"
        }, {
            data: "nif"
        }, {
            data: "emisorId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='apiEmisoresGeneral.eliminar(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='apiEmisoresGeneral.editar(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        var tabla = $('#dt_emisores').DataTable(options);
        tabla.columns(0).visible(false);
    },
    cargarEmisores: function () {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/emisores", null, function (err, data) {
            if (err) return;
            apiEmisoresGeneral.cargarEmisoresTabla(data);
        });
    },
    cargarEmisoresTabla: function (data) {
        var dt = $('#dt_emisores').dataTable();
        dt.fnClearTable();
        if (data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },
    nuevo: function(){
        window.open(sprintf('EmisoresDetalle.html?id=%s', 0), '_self');
    },
    editar: function(id){
        window.open(sprintf('EmisoresDetalle.html?id=%s', id), '_self');
    },
    eliminar: function(id){
        apiComunNotificaciones.mensajeAceptarCancelar(i18n.t("eliminar_pregunta"),function(){
            apiComunAjax.llamadaGeneral("DELETE", myconfig.apiUrl + "/api/emisores/" + id, null, function(err){
                if (err) return;
                apiEmisoresGeneral.cargarEmisores();
            })
        }, function(){})
    }
}


