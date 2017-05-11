/*
 divisas.js
 Funciones propias de la página Divisas.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;

var apiPaginaDivisasGeneral = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);
        $('#divisas').attr('class', 'active');
        $('#divisas-form').submit(function () { return false; });
        apiPaginaDivisasGeneral.iniDivisasTabla();
        apiPaginaDivisasGeneral.cargarDivisas();
        $('#btnNuevo').click(apiPaginaDivisasGeneral.nuevo);
    },
    iniDivisasTabla: function () {
        var options = apiComunGeneral.initTableOptions('dt_divisas', usuario.codigoIdioma);
        options.data = data;
        options.columns = [{
            data: "divisaId"
        }, {
            data: "nombre"
        }, {
            data: "divisaId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='apiPaginaDivisasGeneral.eliminar(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='apiPaginaDivisasGeneral.editar(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        var tabla = $('#dt_divisas').DataTable(options);
        tabla.columns(0).visible(false);
    },
    cargarDivisas: function () {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/divisas", null, function (err, data) {
            if (err) return;
            apiPaginaDivisasGeneral.cargarDivisasTabla(data);
        });
    },
    cargarDivisasTabla: function (data) {
        var dt = $('#dt_divisas').dataTable();
        dt.fnClearTable();
        if (data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },
    nuevo: function(){
        window.open(sprintf('DivisasDetalle.html?id=%s', 0), '_self');
    },
    editar: function(id){
        window.open(sprintf('DivisasDetalle.html?id=%s', id), '_self');
    },
    eliminar: function(id){
        apiComunNotificaciones.mensajeAceptarCancelar(i18n.t("eliminar_pregunta"),function(){
            apiComunAjax.llamadaGeneral("DELETE", myconfig.apiUrl + "/api/divisas/" + id, null, function(err){
                if (err) return;
                apiPaginaDivisasGeneral.cargarDivisas();
            })
        }, function(){})
    }
}


