/*
 index.js
 Funciones propias de la página index.html
*/

var usuario = apiComunGeneral.obtenerUsuario();

var apiPaginaIndex = {
    ini: function(){
        apiComunGeneral.initPage(usuario);
        $('#inicio').attr('class', 'active');
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/version", null, function (err, data) {
            if (err) return;
            if (data.tipo == "PROD"){
                $("#prodMsg").show();
                $("#testMsg").hide();
            }else{
                $("#prodMsg").hide();
                $("#testMsg").show();
            }
        });
    }
}


