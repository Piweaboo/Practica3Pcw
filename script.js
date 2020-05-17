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

//El bucle del juego? xdxdxdd
function jugar(){
  document.getElementById("lista").disabled = true;
  document.getElementById("Boton").disabled = true;
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
        console.log("i: "+i+" j: "+j+" valor: "+partida[i][j]);
        ctx.beginPath();
        ctx.fillStyle ='#d4d6cf';
        ctx.fillRect(subancho*j+1,subalto*i+1,subancho-2,subalto-2);
      }
    }
  }
}
