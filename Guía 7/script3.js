var KEY_ENTER=13,
    KEY_SPACE=32,
    KEY_LEFT=37,
    KEY_UP=38,
    KEY_RIGHT=39,
    KEY_DOWN=40;

var naveImagen = new Image(),
    background = new Image(),
    sonidoDisparo = new Audio(),
    enemigoImagen = new Image();

var canvas = null,
    contexto = null,
    lastpress = null,
    teclasPresionadas = [],
    pause = true,
    gameover = true,
    score = 0,
    nave = null,
    disparo = [],
    enemies = [];

function random(max){
    return ~~(Math.random()*max);
}

function init(){
    //Se obtiene el canvas y el contexto
    canvas = document.getElementById('lienzo');
    contexto = canvas.getContext('2d');

    //Creación de imagenes y sonidos
    naveImagen.src = 'nave.png';
    background.src = 'space.jpg';
    enemigoImagen.src = 'enemie.png';
    sonidoDisparo.src = 'disparo2.mp3';

    //Se crea el rectangulo que contendrá a la nave
    nave = new Rectangulo((canvas.width / 2), (canvas.height / 2), 50, 50);

    //Comienzo del juego
    run();
    repaint();
}

function run(){
    setTimeout(run, 50);
    act();
}

function repaint(){
    window.requestAnimationFrame(repaint);
    paint(contexto);
}

function reset(){
    score = 0;
    nave.x = 90;
    nave.y = 280;
    disparo.length = 0;
    enemies.length = 0;
    enemies.push(new Rectangulo(random(canvas.width/10)*10, 0, 50,50));
    gameover = false;
}

function act(){
    var i = 0;
    if(!pause){
        if(gameover){
            reset();
        }
        
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
        for(i = 0; l = disparo.length, i < l; i++){
            disparo[i].y -= 10;
            if(disparo[i].y<0){
                disparo.splice(i--,1);
                l--;
            }
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

        //Mover enemigos
        for(var i=0;l = enemies.length, i<l;i++){
            //Intersección de los enemigos con los disparos
            for(var j=0;ll = disparo.length, j<ll;j++){
                if(disparo[j].intersects(enemies[i])){
                    score++;
                    enemies[i].x = random(canvas.width/10)*10;
                    enemies[i].y = 0;
                    enemies.push(new Rectangulo(random(canvas.width/10)*10, 0, 50,50));
                    disparo.splice(j--,1);
                    ll--;
                }
            }
            enemies[i].y += 5;
            if(enemies[i].y > canvas.height){
                enemies[i].x =random(canvas.width/10)*10;
                enemies[i].y = 0;
            }

            //Si la nave choca con los enemigos
            if(nave.intersects(enemies[i])){
                gameover = true;
                pause = true;
            }
        }
    }
    //Pause // Start
    if(lastpress == KEY_ENTER){
        pause = !pause;
        lastpress = null;
    }
}

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

    this.intersects = function(rect){ 
        if(rect!=null){ 
            return(this.x<rect.x+rect.width&& 
            this.x+this.width>rect.x&& 
            this.y<rect.y+rect.height&& 
            this.y+this.height>rect.y); 
        } 
    }
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

    //Dibujar enemigos
    //contexto.fillStyle = '#00f';
    for(i = 0; i < enemies.length; i++){
        //enemies[i].fill(contexto);
        //enemies.push(new Rectangulo(random(canvas.width/10)*10, 0, 50,50));
        contexto.drawImage(enemigoImagen,enemies[i].x,enemies[i].y, 50,50);
    }

    //Dibujar Puntaje
    contexto.fillStyle = '#fff';
    contexto.fillText('Puntaje: ' + score, 0, 20);

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



document.addEventListener('keydown', function(evt){
    lastpress = evt.keyCode;
    teclasPresionadas[evt.keyCode]  = true;
}, false);

document.addEventListener('keyup', function(evt){
    teclasPresionadas[evt.keyCode] = false;
}, false);

window.addEventListener('load', init, false);