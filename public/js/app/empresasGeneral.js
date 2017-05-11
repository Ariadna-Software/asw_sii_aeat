/*
 empresas.js
 Funciones propias de la página Empresas.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;

var apiPaginaEmpresasGeneral = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);
        $('#empresas').attr('class', 'active');
        $('#empresas-form').submit(function () { return false; });
        apiPaginaEmpresasGeneral.iniEmpresasTabla();
        apiPaginaEmpresasGeneral.cargarEmpresas();
        $('#btnNuevo').click(apiPaginaEmpresasGeneral.nuevo);
    },
    iniEmpresasTabla: function () {
        var options = apiComunGeneral.initTableOptions('dt_empresas', usuario.codigoIdioma);
        options.data = data;
        options.columns = [{
            data: "empresaId"
        }, {
            data: "nombre"
        }, {
            data: "empresaId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='apiPaginaEmpresasGeneral.eliminar(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='apiPaginaEmpresasGeneral.editar(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        var tabla = $('#dt_empresas').DataTable(options);
        tabla.columns(0).visible(false);
    },
    cargarEmpresas: function () {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/api/empresas", null, function (err, data) {
            if (err) return;
            apiPaginaEmpresasGeneral.cargarEmpresasTabla(data);
        });
    },
    cargarEmpresasTabla: function (data) {
        var dt = $('#dt_empresas').dataTable();
        dt.fnClearTable();
        if (data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },
    nuevo: function(){
        window.open(sprintf('EmpresasDetalle.html?id=%s', 0), '_self');
    },
    editar: function(id){
        window.open(sprintf('EmpresasDetalle.html?id=%s', id), '_self');
    },
    eliminar: function(id){
        apiComunNotificaciones.mensajeAceptarCancelar(i18n.t("eliminar_pregunta"),function(){
            apiComunAjax.llamadaGeneral("DELETE", myconfig.apiUrl + "/api/empresas/" + id, null, function(err){
                if (err) return;
                apiPaginaEmpresasGeneral.cargarEmpresas();
            })
        }, function(){})
    }
}


