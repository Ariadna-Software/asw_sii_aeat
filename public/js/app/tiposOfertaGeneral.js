/*
 tiposOferta.js
 Funciones propias de la página TiposOferta.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;

var apiPaginaTiposOfertaGeneral = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);
        $('#tiposOferta').attr('class', 'active');
        $('#tiposOferta-form').submit(function () { return false; });
        apiPaginaTiposOfertaGeneral.iniTiposOfertaTabla();
        apiPaginaTiposOfertaGeneral.cargarTiposOferta();
        $('#btnNuevo').click(apiPaginaTiposOfertaGeneral.nuevo);
    },
    iniTiposOfertaTabla: function () {
        var options = apiComunGeneral.initTableOptions('dt_tiposOferta', usuario.codigoIdioma);
        options.data = data;
        options.columns = [{
            data: "tipoOfertaId"
        }, {
            data: "nombre"
        }, {
            data: "tipoOfertaId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='apiPaginaTiposOfertaGeneral.eliminar(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='apiPaginaTiposOfertaGeneral.editar(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        var tabla = $('#dt_tiposOferta').DataTable(options);
        tabla.columns(0).visible(false);
    },
    cargarTiposOferta: function () {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/tipos-oferta", null, function (err, data) {
            if (err) return;
            apiPaginaTiposOfertaGeneral.cargarTiposOfertaTabla(data);
        });
    },
    cargarTiposOfertaTabla: function (data) {
        var dt = $('#dt_tiposOferta').dataTable();
        dt.fnClearTable();
        if (data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },
    nuevo: function(){
        window.open(sprintf('TiposOfertaDetalle.html?id=%s', 0), '_self');
    },
    editar: function(id){
        window.open(sprintf('TiposOfertaDetalle.html?id=%s', id), '_self');
    },
    eliminar: function(id){
        apiComunNotificaciones.mensajeAceptarCancelar(i18n.t("eliminar_pregunta"),function(){
            apiComunAjax.llamadaGeneral("DELETE", myconfig.apiUrl + "/api/tipos-oferta/" + id, null, function(err){
                if (err) return;
                apiPaginaTiposOfertaGeneral.cargarTiposOferta();
            })
        }, function(){})
    }
}


