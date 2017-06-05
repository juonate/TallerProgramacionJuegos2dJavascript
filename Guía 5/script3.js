var canvas = null,
    contexto = null,
    nave = null,
    lastpress = null,
    puntaje = 0,
    pause = true,
    gameover = false,
    dir = 0,
    KEY_ENTER = 13,
    KEY_LEFT = 37,
    KEY_UP = 38,
    KEY_RIGHT = 39,
    KEY_DOWN = 40,
    KEY_SPACE = 32,
    naveImagen = new Image(),
    background = new Image(),
    sonidoDisparo = new Audio(),
    teclasPresionadas = new Array(),
    disparo = new Array();


document.addEventListener('keydown', function(evt){
    lastpress = evt.keyCode;
    teclasPresionadas[evt.keyCode]  = true;
}, false);

document.addEventListener('keyup', function(evt){
    teclasPresionadas[evt.keyCode] = false;
}, false);

function Rectangulo(x, y, width, height){
    this.x = (x == null) ? 0 : x;
    this.y = (y == null) ? 0 : y;
    this.width = (width == null) ? 0 : width;
    this.height = (height == null) ? this.width : height;

    this.fill = function(contexto){
        if(contexto == null){
            window.console.warn('Parametros incorrectos de la función fill');
        } else {
            //contexto.fillStyle = '#f54';
            contexto.fillRect(this.x, this.y, this.width, this.height);
        }
    };
}

function paint(contexto){
    var i = 0;
    //Limpiar el canvas
    contexto.drawImage(background, 0, 0);

    //Dibujar la nave
    contexto.drawImage(naveImagen, nave.x, nave.y, 50, 50);

    //Dibujar disparos
    contexto.fillStyle = '#f00';
    for(i = 0; i < disparo.length; i++){
        disparo[i].fill(contexto);
    }

    //Dibujar Pause
    if(pause){
        contexto.textAlign = 'center';
        if(gameover){
            contexto.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        } else {
            contexto.fillText('PAUSE', canvas.width / 2, canvas.height / 2);
        }
        contexto.textAlign = 'left';
    }
}

function act(){
    var i = 0;
    if(!pause){
        
        //Movimiento recto
        if(teclasPresionadas[KEY_UP]){
            nave.y -= 10;
        }
        if(teclasPresionadas[KEY_RIGHT]){
            nave.x += 10;
        }
        if(teclasPresionadas[KEY_DOWN]){
            nave.y += 10;
        }
        if(teclasPresionadas[KEY_LEFT]){
            nave.x -= 10;
        }
        if(lastpress == KEY_SPACE){
            disparo.push(new Rectangulo(nave.x+3, nave.y, 5, 5));
            sonidoDisparo.play();
            lastpress = null;
        }

        //Mover disparos
        for(i = 0; i < disparo.length; i++){
            disparo[i].y -= 10;
        }

        //Fuera del canvas
        if(nave.x > canvas.width){
            nave.x  = 0;
        }
        if(nave.y > canvas.height){
            nave.y = 0;
        }
        if(nave.x < 0){
            nave.x = canvas.width;
        }
        if(nave.y < 0){
            nave.y = canvas.height;
        }
        
    }
    //Pause // Start
    if(lastpress == KEY_ENTER){
        pause = !pause;
        lastpress = null;
    }
}

function repaint(){
    window.requestAnimationFrame(repaint);
    paint(contexto);
}

function run(){
    setTimeout(run, 50);
    act();
}

function init(){
    //Se obtiene el canvas y el contexto
    canvas = document.getElementById('lienzo');
    contexto = canvas.getContext('2d');

    //Creación de imagenes y sonidos
    naveImagen.src = 'nave.png';
    background.src = 'space.jpg';
    sonidoDisparo.src = 'disparo2.mp3';

    //Se crea el rectangulo que contendrá a la nave
    nave = new Rectangulo((canvas.width / 2), (canvas.height / 2), 20, 20);

    //Comienzo del juego
    run();
    repaint();
}

window.addEventListener('load', init, false);