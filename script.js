//Empezamos con las globales weeeee
var regiones;
var subregiones;
//En partida esta el sudoku
var partida;

//Esto dibuja la rejilla en el canvas.Modularidad bro...
function rejilla(){
  let cv = document.querySelector('canvas'),
      ctx = cv.getContext('2d');

      let ancho = cv.width/regiones,
          alto = cv.height/regiones,
          subancho = cv.width/subregiones,
          subalto = cv.height/subregiones;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0,0,400,400);

      for(let i = 0; i<regiones; i++){
        for(let j = 0;j<subregiones;j++){
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
        ctx.lineWidth = 2;
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
  cv.width = 400;
  cv.height = 400;
  if(tamaño == 4){
    regiones = 2,
    subregiones = 4;
  }else{
    regiones = 3,
    subregiones = 9;
  }
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

function mensaje(valor){
  console.log(valor);
}

function limpiar(){
  let cv = document.querySelector('canvas'),
      ctx = cv.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0,0,400,400);
}

/*
<output class="crono" id="crono-si">00:00:00</output>
      <footer>
        <button onclick="IniciarSI();">Iniciar</button>
        <button onclick="pararSI();">Parar</button>
      </footer>
*/

//El bucle del juego? xdxdxdd
function jugar(){
  document.getElementById("lista").disabled = true;
  //Quitamos el boton de jaguar y mostramos el de comprobar y finalizar
  let html  = '';
      html += '<output class="crono" id="crono-si">00:00:00</output>';
      html += '<br>';
      html += '<button onclick="comprobarErrores();">Comprobar</button>';
      html += '<button onclick="detenerPartida();">Finalizar</button>';
  document.querySelector('#botonera').innerHTML = html;
  IniciarSI();

  let cv = document.querySelector('canvas');
  console.log("Valor :" + document.getElementById("lista").value);
  //Hacemos peicion POST para obtener un sudoku y un token
  let xhr = new XMLHttpRequest(),
      tamaño = document.getElementById("lista").value,
      url = 'api/sudoku/generar/'+tamaño;

  xhr.open('POST',url,false);
  xhr.onload = function(){
    let r = JSON.parse(xhr.responseText);
    console.log(r);
    if(r.RESULTADO == 'OK'){
      //console.log(r.SUDOKU);
      //console.log(r.TOKEN);
      partida = r.SUDOKU;
      //console.log(partida);
      sessionStorage['token'] = r.TOKEN;
      sessionStorage['id'] = r.ID;
    }
  };
  xhr.send();

  //Pinta los numeros en el sudoku
  pintarSudoku();

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

    console.log('Zona ' + fila + '-' + columna);
    console.log('Subzona ' + subfila + '-' + subcolumna);
  }
}

//Coge el array partida, limpia el canvas y dibuja conforme este en el array
function pintarSudoku(){
  let cv = document.querySelector('canvas'),
      ctx = cv.getContext('2d');

  limpiar();
  rejilla();

  let ancho = cv.width/regiones,
      alto = cv.height/regiones,
      subancho = cv.width/subregiones,
      subalto = cv.height/subregiones;

  console.log("partida:");
  console.log(partida);

  for(let i = 0;i<partida.length;i++){
    for(let j = 0;j<partida[0].length;j++){
      if(partida[i][j] != 0){
        //console.log("i: "+i+" j: "+j+" valor: "+partida[i][j]);
        ctx.beginPath();
        ctx.fillStyle ='#d4d6cf';
        //fillRect(x,y.ancho,alto)
        ctx.fillRect(subancho*j+1,subalto*i+1,subancho-2,subalto-2);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 45px sans-serif, arial';
        //fillText(palabra,x,y)
        let posX = (subancho*j+subancho/2)-13,
            posY = (subalto*i+subalto/2)+13;
        ctx.fillText(partida[i][j],posX,posY);
      }
    }
  }
}

//Cuando le das al boton Finalizar
function detenerPartida(){
  //Lo primero parar el cronometro
  pararSI();
}

//Comprueba los errores del Sudoku
function comprobarErrores(){
  //console.log("id: "+sessionStorage['id']);
  let xhr = new XMLHttpRequest(),
      tamaño = document.getElementById("lista").value,
      url = 'api/sudoku/'+sessionStorage['id']+'/comprobar',
      fd = new FormData();

  fd.append("juego",partida);

  fetch(url,
        {method:'POST',
        body:fd,
        headers:{'Authorization': sessionStorage['token']}}).then(function(respuesta){
          console.log("respuesta: ");
          console.log(respuesta);
          if(respuesta.ok){
            //console.log(respuesta.body);
          }
  });

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
