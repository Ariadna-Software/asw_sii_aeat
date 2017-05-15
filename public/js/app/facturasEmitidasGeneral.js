/*
 facturasEmitidas.js
 Funciones propias de la página FacturasEmitidas.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;

var apiFacturasEmitidasGeneral = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);
        $('#facturasEmitidas').attr('class', 'active');
        $('#facturasEmitidas-form').submit(function () { return false; });
        apiFacturasEmitidasGeneral.iniFacturasEmitidasTabla();
        apiFacturasEmitidasGeneral.cargarFacturasEmitidas();
        $('#btnNuevo').click(apiFacturasEmitidasGeneral.nuevo);
    },
    iniFacturasEmitidasTabla: function () {
        var options = apiComunGeneral.initTableOptions('dt_facturasEmitidas', usuario.codigoIdioma);
        options.data = data;
        options.columns = [{
            data: "IdEnvioFacturasEmitidas"
        }, {
            data: "Origen"
        }, {
            data: "REG_PI_Ejercicio"
        }, {
            data: "REG_PI_Periodo"
        }, {
            data: "REG_IDF_IDEF_NIF"
        }, {
            data: "REG_IDF_NumSerieFacturaEmisor"
        }, {
            data: "FechaHoraCreacion"
        }, {
            data: "EnvioInmediato"
        }, {
            data: "Enviada"
        }, {
            data: "Resultado"
        }, {
            data: "CSV"
        }, {
            data: "Mensaje"
        }, {
            data: "IdEnvioFacturasEmitidas",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='apiFacturasEmitidasGeneral.eliminar(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='apiFacturasEmitidasGeneral.editar(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        var tabla = $('#dt_facturasEmitidas').DataTable(options);
        tabla.columns(0).visible(false);
    },
    cargarFacturasEmitidas: function () {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/facturasEmitidas", null, function (err, data) {
            if (err) return;
            apiFacturasEmitidasGeneral.cargarFacturasEmitidasTabla(data);
        });
    },
    cargarFacturasEmitidasTabla: function (data) {
        var dt = $('#dt_facturasEmitidas').dataTable();
        dt.fnClearTable();
        if (data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },
    nuevo: function(){
        window.open(sprintf('FacturasEmitidasDetalle.html?id=%s', 0), '_self');
    },
    editar: function(id){
        window.open(sprintf('FacturasEmitidasDetalle.html?id=%s', id), '_self');
    },
    eliminar: function(id){
        apiComunNotificaciones.mensajeAceptarCancelar(i18n.t("eliminar_pregunta"),function(){
            apiComunAjax.llamadaGeneral("DELETE", myconfig.apiUrl + "/api/facturasEmitidas/" + id, null, function(err){
                if (err) return;
                apiFacturasEmitidasGeneral.cargarFacturasEmitidas();
            })
        }, function(){})
    }
}


