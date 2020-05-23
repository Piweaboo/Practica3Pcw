//Empezamos con las globales weeeee
var regiones;
var subregiones;
//Aqui nos guardamos el sudoku con solo los valores que nos dan
var partidaOriginal;
//En partida esta el sudoku
var partida;
//Aqui estarán las posiciones de los errores del sudoku
var erroresF = [];
var erroresC = [];
//Esto es para los eventos de move y click
var bloqueado = false;
//Los valores x e y del cuadrado seleccionado
var seleccionX;
var seleccionY;

//Esto dibuja la rejilla en el canvas.Modularidad bro...
function rejilla(){
  let cv = document.querySelector('canvas'),
      ctx = cv.getContext('2d');

      let ancho = cv.width/regiones,
          alto = cv.height/regiones,
          subancho = cv.width/subregiones,
          subalto = cv.height/subregiones;

      //ctx.fillStyle = '#ffffff';
      //ctx.fillRect(0,0,cv.width,cv.height);

      for(let i = 0; i<=regiones; i++){
        for(let j = 0;j<=subregiones;j++){
          ctx.beginPath();
          ctx.lineWidth = 1;
          ctx.strokeStyle ='#696969';

          //Verticales
          ctx.moveTo(j*subancho,0);
          ctx.lineTo(j*subancho,cv.height);

          //Horizontales
          ctx.moveTo(0,j*subalto);
          ctx.lineTo(cv.width,j*subalto);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle ='#000000';
        //Verticales
        ctx.moveTo(i*ancho,0);
        ctx.lineTo(i*ancho,cv.height);

        //Horizontales
        ctx.moveTo(0,i*alto);
        ctx.lineTo(cv.width,i*alto);
        ctx.stroke();
      }
}

//Esto para establecer el tamaño del canvas por js y llama a hacer la rejilla
function prepararCanvas(tamaño){
  let cv = document.querySelector('canvas'),
      ctx = cv.getContext('2d');

  if(tamaño == 4){
    regiones = 2,
    subregiones = 4;
    cv.width = 400;
    cv.height = 400;
  }else{
    regiones = 3,
    subregiones = 9;
    cv.width = 500;
    cv.height = 500;
  }
  limpiar();
  rejilla();
}

function cambiarCanvas(valor){
  console.log(valor);
  if(valor == 4){
    prepararCanvas(4);
  }
  else if(valor == 9){
    prepararCanvas(9);
  }
}

//Ya ni sé para que he hecho este método xddddxdxd
function mensaje(valor){
  console.log(valor);
}

function limpiar(){
  let cv = document.querySelector('canvas'),
      ctx = cv.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0,0,cv.width,cv.height);
}

//El bucle del juego? xdxdxdd
function jugar(){
  document.getElementById("lista").disabled = true;
  //Quitamos el boton de jaguar y mostramos el de comprobar y finalizar
  let html  = '';
      html += '<output class="crono" id="crono-si">00:00:00</output>';
      html += '<br>';
      //html += '<button onclick="valorCronometro();">Prueba</button>';
      html += '<button onclick="comprobarErrores();">Comprobar</button>';
      html += '<button onclick="detenerPartida();">Finalizar</button>';
  document.querySelector('#botonera').innerHTML = html;
  //Iniciamos el cronometro
  IniciarSI();

  let cv = document.querySelector('canvas'),
      ctx = cv.getContext('2d');

  console.log("Valor :" + document.getElementById("lista").value);
  //Hacemos peicion POST para obtener un sudoku y un token
  let xhr = new XMLHttpRequest(),
      tamaño = document.getElementById("lista").value,
      url = 'api/sudoku/generar/'+tamaño;

  xhr.open('POST',url,true);
  xhr.onload = function(){
    let r = JSON.parse(xhr.responseText);
    console.log(r);
    if(r.RESULTADO == 'OK'){
      //console.log("sudoku");
      let soku = JSON.stringify(r.SUDOKU);
      //console.log(JSON.parse(JSON.stringify(r.SUDOKU)));
      //console.log(r.TOKEN);

      partidaOriginal = JSON.parse(soku);
      partida = r.SUDOKU;
      for(let i = 0; i<partidaOriginal.length;i++){
        for(let j = 0; j<partidaOriginal[0].length;j++){
          partida[i][j] = partidaOriginal[i][j];
        }
      }
      //console.log(partida);
      sessionStorage['token'] = r.TOKEN;
      sessionStorage['id'] = r.ID;

      //Pinta los numeros en el sudoku
      pintarSudoku();
      rejilla();
      manejarEventos();
    }
  };
  xhr.send();
}

//Modulariza bro... parte 2
function manejarEventos(){
  let cv = document.querySelector('canvas'),
      ctx = cv.getContext('2d');

  //Se activa cuando se mueve el raton
  cv.onmousemove = function(event){
    if(bloqueado == false){
      //console.log(bloqueado);
      pintarSudoku();
      rejilla();
      //console.log(event.offsetX + '-' + event.offsetY);
      let ancho = cv.width/regiones,
          alto = cv.height/regiones,
          subancho = cv.width/subregiones,
          subalto = cv.height/subregiones,
          fila,columna,
          subfila,subcolumna;

      fila = Math.floor(event.offsetY/alto);
      columna = Math.floor(event.offsetX/ancho);
      subfila = Math.floor(event.offsetY/subalto);
      subcolumna = Math.floor(event.offsetX/subancho);

      //console.log('Move');
      //console.log('Zona ' + fila + '-' + columna);
      //console.log('Subzona ' + subfila + '-' + subcolumna);

      if(subfila >=0 && subfila <9 && subcolumna >=0 && subcolumna <9){
        //No hay que colorear las casillas que ya nos daban
        if(partidaOriginal[subfila][subcolumna] == 0){
          cv.style="cursor: pointer";
          ctx.fillStyle = '#8de8f6';
          //ctx.fillRect(0,0,cv.width,cv.height);
          ctx.fillRect(subancho*subcolumna,subalto*subfila,subancho,subalto);
          if(partida[subfila][subcolumna] != 0){
            ctx.fillStyle = '#000000';
            ctx.font = ' 45px sans-serif, arial';
            let posX = (subancho*subcolumna+subancho/2)-13,
                posY = (subalto*subfila+subalto/2)+13;
            ctx.fillText(partida[subfila][subcolumna],posX,posY);
          }
          rejilla();
        }else{
          cv.style="cursor: default";
        }
      }
    }
  }

  //Desde aqui manejaremos cuando clickas en el canvas
  cv.onclick = function(event){
    //console.log('Click:' + event.offsetX + '-' + event.offsetY);
    let ancho = cv.width/regiones,
        alto = cv.height/regiones,
        subancho = cv.width/subregiones,
        subalto = cv.height/subregiones,
        fila,columna,
        subfila,subcolumna;

    fila = Math.floor(event.offsetY/alto);
    columna = Math.floor(event.offsetX/ancho);
    subfila = Math.floor(event.offsetY/subalto);
    subcolumna = Math.floor(event.offsetX/subancho);

    console.log('Click');
    console.log('Zona ' + fila + '-' + columna);
    console.log('Subzona ' + subfila + '-' + subcolumna);

    if(document.querySelector('#lista').value == 4){
      if(subfila >=0 && subfila <4 && subcolumna >=0 && subcolumna <4){
        //No hay que colorear las casillas que ya nos daban
        if(partidaOriginal[subfila][subcolumna] == 0){
          //Mostramos las cartas del sudoku
          let html  = '';
              html += '<h4>Numeros disponibles</h4>';
              html += '<ul>';
              html += '<li onclick="introducirNumero(1);">1</li>';
              html += '<li onclick="introducirNumero(2);">2</li>';
              html += '<li onclick="introducirNumero(3);">3</li>';
              html += '<li onclick="introducirNumero(4);">4</li>';
              html += '<ul>';
          document.querySelector('#numeros').innerHTML = html;

          //Nos guardamos en un par de variables las posiciones en la maytiz de la casilla seleccionada
          //Porque es más facil hacer 8 veces la misma cosa mal que buscar un manera de no hacerlo pr variables globales, pero eh ¯\_(ツ)_/¯
          seleccionX = subfila;//ancho
          seleccionY = subcolumna;//alto

          pintarSudoku();
          rejilla();
          bloqueado = true;

          ctx.fillStyle = '#5566fe';
          //ctx.fillRect(posX,posY,tamX,tamY);
          ctx.fillRect(subancho*subcolumna+1,subalto*subfila+1,subancho-2,subalto-2);
          ctx.strokeStyle = '#e92a52';
          ctx.lineWidth = 6;
          ctx.strokeRect(subancho*subcolumna+3,subalto*subfila+3,subancho-5,subalto-5);

          //Bueno Alba, te dejo con este embrollo
          //Ahora pintamos los cuadrados en la misma fila, columna y caja
          //Vertical
          /*
          for(let i = 0; i<cv.height;i++){
            if(i != seleccionY && partidaOriginal[seleccionX][i] == 0){
              //cv.style="cursor: pointer";
              ctx.fillStyle = '#8de8f6';
              //ctx.fillRect(0,0,cv.width,cv.height);
              ctx.fillRect(subancho*subcolumna+1,subalto*i+1,subancho,subalto);
              rejilla();
            }
          }
          */

          rejilla();
        }
      }
    }else if(document.querySelector('#lista').value == 9){
      if(subfila >=0 && subfila <9 && subcolumna >=0 && subcolumna <9){
        //No hay que colorear las casillas que ya nos daban
        if(partidaOriginal[subfila][subcolumna] == 0){
          //Mostramos las cartas del sudoku
          let html  = '';
              html += '<h4>Numeros disponibles</h4>';
              html += '<ul>';
              html += '<li onclick="introducirNumero(1);">1</li>';
              html += '<li onclick="introducirNumero(2);">2</li>';
              html += '<li onclick="introducirNumero(3);">3</li>';
              html += '<li onclick="introducirNumero(4);">4</li>';
              html += '<li onclick="introducirNumero(5);">5</li>';
              html += '<li onclick="introducirNumero(6);">6</li>';
              html += '<li onclick="introducirNumero(7);">7</li>';
              html += '<li onclick="introducirNumero(8);">8</li>';
              html += '<li onclick="introducirNumero(9);">9</li>';
              html += '<ul>';
          document.querySelector('#numeros').innerHTML = html;

          //Nos guardamos en un par de variables las posiciones en la maytiz de la casilla seleccionada
          //Porque es más facil hacer 8 veces la misma cosa mal que buscar un manera de no hacerlo pr variables globales, pero eh ¯\_(ツ)_/¯
          seleccionX = subfila;//ancho
          seleccionY = subcolumna;//alto

          pintarSudoku();
          rejilla();
          bloqueado = true;

          ctx.fillStyle = '#5566fe';
          //ctx.fillRect(posX,posY,tamX,tamY);
          ctx.fillRect(subancho*subcolumna+1,subalto*subfila+1,subancho-2,subalto-2);
          ctx.strokeStyle = '#e92a52';
          ctx.lineWidth = 6;
          ctx.strokeRect(subancho*subcolumna+3,subalto*subfila+3,subancho-5,subalto-5);

          //Bueno Alba, te dejo con este embrollo
          //Ahora pintamos los cuadrados en la misma fila, columna y caja
          //Vertical
          /*
          for(let i = 0; i<cv.height;i++){
            if(i != seleccionY && partidaOriginal[seleccionX][i] == 0){
              //cv.style="cursor: pointer";
              ctx.fillStyle = '#8de8f6';
              //ctx.fillRect(0,0,cv.width,cv.height);
              ctx.fillRect(subancho*subcolumna+1,subalto*i+1,subancho,subalto);
              rejilla();
            }
          }
          */

          rejilla();
        }
      }
    }
  }
}

//Esto para meter el número seleccionado en la casilla seleccionada(jaja)
function introducirNumero(numero){
  //console.log(numero+":"+seleccionX+"-"+seleccionY);
  let html  = '';
  document.querySelector('#numeros').innerHTML = html;
  partida[seleccionX][seleccionY] = numero;
  pintarSudoku();
  rejilla();
  comprobarVictoria();
}

//Compruebas que estan todos los número y que están bien
function comprobarVictoria(){
  let lleno = true;
  for(let i = 0; i<partida.length;i++){
    for(let j = 0; j<partida[i].length;j++){
      if(partida[i][j] == 0){
        lleno = false;
        break;
      }
    }
  }
  if(lleno == true){
    //Llamamos a la misma peticion de comprobar errores
    let xhr = new XMLHttpRequest(),
        tamaño = document.getElementById("lista").value,
        url = 'api/sudoku/'+sessionStorage['id']+'/comprobar',
        fd = new FormData();

    fd.append("juego",JSON.stringify(partida));
    xhr.open('POST',url,true);
    xhr.onload = function(){
      //console.log(xhr.responseText);
      let r = JSON.parse(xhr.responseText);
      console.log(r);
      if(r.RESULTADO == 'OK'){
        if(r.FALLOS.length == 0){
          //No hay Fallos, ha ganado. Detener cronometro y sacar mensaje modal
          pararSI();
          let html= '';
              html += '<article>';
              html += '<h2>¡Enhorabuena!</h2>';
              html += '<p>Te has pasado el sudoku. Eres to listo bro';
              html += '<p>Lo has completado en un tiempo de '+document.querySelector('#crono-si').innerHTML;
              html += '<footer><button onclick = "cerrarMensajeModal(0);">Continuar</button>';
              html += '</article>';
              mensajeModal(html);
        }else{
          let html= '';
              html += '<article>';
              html += '<h2>¡Ya queda poco!</h2>';
              if(r.FALLOS.length = 1){
                html += '<p>Hay ' + r.FALLOS.length +' fallo crack. ¿Quieres intentar corregirlo?';
              }else{
                html += '<p>Hay ' + r.FALLOS.length +' errores crack. ¿Quieres intentar corregirlos?';
              }
              html += '<footer><button onclick = "cerrarMensajeModal(1);">Si</button></footer>';
              html += '<footer><button onclick = "cerrarMensajeModal(0);">No</button></footer>';
              html += '</article>';
              mensajeModal(html);
        }
      }
    };
    xhr.setRequestHeader('Authorization',sessionStorage['token']);
    xhr.send(fd);
  }
  /*
  let html= '';
        html += '<article>';
        html += '<h2>Error al eleccionar archivo</h2>';
        html += '<p>La imagen seleccionada pesa demasiado. Por favor, seleccione otra';
        html += '<footer><button onclick = "cerrarMensajeModal(-1);">Acceder</button>';
        html += '</article>';
        mensajeModal(html);
  */
}

//Coge el array partida, limpia el canvas y dibuja conforme este en el array
function pintarSudoku(){
  let cv = document.querySelector('canvas'),
      ctx = cv.getContext('2d');

  bloqueado = false;

  limpiar();
  rejilla();

  let ancho = cv.width/regiones,
      alto = cv.height/regiones,
      subancho = cv.width/subregiones,
      subalto = cv.height/subregiones;

  console.log("partida:");
  console.log(partida);

  console.log("partidaOriginal:");
  console.log(partidaOriginal);

  for(let i = 0;i<partida.length;i++){
    for(let j = 0;j<partida[0].length;j++){
      if(partida[i][j] != 0){
        //console.log("i: "+i+" j: "+j+" valor: "+partida[i][j]);
        //ctx.beginPath();
        if(partidaOriginal[i][j] != 0){
          ctx.fillStyle ='#d4d6cf';
          //fillRect(x,y.ancho,alto)
          ctx.fillRect(subancho*j+1,subalto*i+1,subancho-1,subalto-1);
        }
        ctx.fillStyle = '#000000';
        ctx.font = '45px sans-serif, arial';
        //fillText(palabra,x,y)
        let posX = (subancho*j+subancho/2)-13,
            posY = (subalto*i+subalto/2)+13;
        ctx.fillText(partida[i][j],posX,posY);
      }
    }
  }
}

//Limpia, wow
function limpiarSeleccion(){
  let html  = '';
  document.querySelector('#numeros').innerHTML = html;
  pintarSudoku();
  rejilla();
}

//Cuando le das al boton Finalizar
function detenerPartida(){
  let xhr = new XMLHttpRequest(),
      url = 'api/sudoku/'+sessionStorage['id'];

  xhr.open('DELETE',url,true);
  xhr.onload = function(){
    let r = JSON.parse(xhr.responseText);
    if(r.RESULTADO == 'OK'){
      pararSI();
      window.location.href="index.html";
    }
  };
  xhr.setRequestHeader('Authorization',sessionStorage['token']);
  xhr.send();
}

//Comprueba los errores del Sudoku
function comprobarErrores(){
  //console.log("id: "+sessionStorage['id']);
  let xhr = new XMLHttpRequest(),
      tamaño = document.getElementById("lista").value,
      url = 'api/sudoku/'+sessionStorage['id']+'/comprobar',
      fd = new FormData();

      //let juego = JSON.stringify(partida);
      //console.log(juego);

  fd.append("juego",JSON.stringify(partida));
  xhr.open('POST',url,true);
  xhr.onload = function(){
    //console.log(xhr.responseText);
    let r = JSON.parse(xhr.responseText);
    console.log(r);
    if(r.RESULTADO == 'OK'){
      if(r.FALLOS.length != 0){
        r.FALLOS.forEach(function(e){
          erroresF.push(e.fila);
          erroresC.push(e.columna);
          colorearErrores();
        });
      }
    }
  };
  xhr.setRequestHeader('Authorization',sessionStorage['token']);
  xhr.send(fd);
}

//Pinta los cuadrados donde hay errores
function colorearErrores(){
  let cv = document.querySelector('canvas'),
      ctx = cv.getContext('2d');

  let subancho = cv.width/subregiones,
      subalto = cv.height/subregiones,
      x,y;

  //Recorremos todos las parejas de valors en los arrays de errores
  while(erroresF.length > 0 && erroresC.length > 0){
    x = erroresF[0];
    y = erroresC[0];

    //Pintamos de rojo el hueco
    ctx.fillStyle = '#dd7a7a';
    ctx.fillRect(y*subancho,x*subalto,subancho,subalto);

    ctx.fillStyle = '#000000';
    ctx.font = ' 45px sans-serif, arial';
    //fillText(palabra,x,y)
    let posX = (subancho*y+subancho/2)-13,
        posY = (subalto*x+subalto/2)+13;
    ctx.fillText(partida[x][y],posX,posY);
    erroresF.shift();
    erroresC.shift();
  }

  rejilla();
}

//La parte del mensaje modal =====================================
//Mensaje emergente (mensajes modales) al hacer login
function mensajeModal(html){//El contenido que recibes sy que mostrarás en el mensaje modal
  //Primero una capa semitransparente para bloquear todo lo que no sea la capa del mensaje, con css le ponemos color y demás
  let we = document.createElement('div');
  //div.id = 'capa-fondo';
  we.setAttribute('id','capa-fondo');
  we.innerHTML = html;//La variable recibida por parámetro

  //document.body.appendChild(we);
  document.querySelector('body').appendChild(we);
}

//En funcion del valor que recibes, te envia a index, refresca o tal
/* Valor
0: refrescar
*/
function cerrarMensajeModal(valor){
  document.querySelector('#capa-fondo').remove();
  if(valor == 0){
    window.location.reload();
  }else if(valor == 1){

  }
}

//La parte del cronómetro ========================================
function actualizarCronoSI(){

  let valor = parseInt(document.querySelector('#crono-si').getAttribute('data-valor')) +1,
    horas = Math.floor(valor/3600),
    minutos = Math.floor((valor - horas * 3600)/60),
    segundos = valor - horas *3600 - minutos *60;

    horas = (horas < 10?'0':'')+horas;
    minutos = (minutos < 10?'0':'')+minutos;
    segundos = (segundos < 10?'0':'')+segundos;

    //Recuerda que esto va con la tilde al revés ``
    document.querySelector('#crono-si').innerHTML= `${horas}:${minutos}:${segundos}`;
    document.querySelector('#crono-si').setAttribute('data-valor',valor);
}

function pararSI(){
  let idTemp = document.querySelector('#crono-si').getAttribute('data-idTemp');
  clearInterval(idTemp);
}

function IniciarSI(){
  document.querySelector('#crono-si').innerHTML= '00:00:00';
  document.querySelector('#crono-si').setAttribute('data-valor','0');

  let id_temporizador = setInterval(actualizarCronoSI,1000);//Ejecutará la funcion cada segundo
  document.querySelector('#crono-si').setAttribute('data-idTemp',id_temporizador);
}
