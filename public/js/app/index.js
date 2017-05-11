/*
 index.js
 Funciones propias de la página index.html
*/

var usuario = apiComunGeneral.obtenerUsuario();

var apiPaginaIndex = {
    ini: function(){
        apiComunGeneral.initPage(usuario);
        $('#inicio').attr('class', 'active');
    }
}


