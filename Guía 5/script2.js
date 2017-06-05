var canvas = null,
    contexto = null,
    cuncuna = new Array(),
    comida = null,
    ultimoPresionado = null,
    puntaje = 0,
    pause = true,
    gameover = false,
    dir = 0,
    KEY_ENTER = 13,
    KEY_LEFT = 37,
    KEY_UP = 38,
    KEY_RIGHT = 39,
    KEY_DOWN = 40,
    muros = new Array(),
    iBody = new Image(),
    iFood = new Image(),
    eEat = new Audio(),
    eDie = new Audio();


document.addEventListener('keydown', function(evt){
    ultimoPresionado = evt.which;
}, false);

function resize(){
    var w = window.innerWidth / canvas.width;
    var h = window.innerHeight / canvas.height;
    var scale = Math.min(h,w);

    canvas.style.width = (canvas.width * scale) + 'px';
    canvas.style.height = (canvas.height * scale ) + 'px';
}

function Rectangulo(x, y, width, height){
    this.x = (x == null) ? 0 : x;
    this.y = (y == null) ? 0 : y;
    this.width = (width == null) ? 0 : width;
    this.height = (height == null) ? this.width : height;

    this.intersect = function (rect){
        if(rect == null){
            window.console.warn('Parametros incorrectos de la función intersect');
        } else {
            return (this.x < rect.x + rect.width &&
            this.x + this.width > rect.x &&
            this.y < rect.y + rect.height &&
            this.y + this.height > rect.y);
        }
    };
    this.fill = function(contexto){
        if(contexto == null){
            window.console.warn('Parametros incorrectos de la función fill');
        } else {
            contexto.fillRect(this.x, this.y, this.width, this.height);
        }
    };
    this.intersectWithWall = function(){
        return (this.x == 0 || this.x == canvas.width || this.y == 0 || this.y == canvas.height);
    };

}

function random(max){
    return Math.floor(Math.random() * max);
}

function reset(){
    puntaje = 0;
    dir = 1;
    cuncuna.length = 0;
    cuncuna.push(new Rectangulo(canvas.width / 2, canvas.height /2, 10, 10));
    //cuncuna.push(new Rectangulo(0, 0, 10, 10));
    //cuncuna.push(new Rectangulo(0, 0, 10, 10));
    comida.x = random(canvas.width / 10 -1 ) * 10;
    comida.y = random(canvas.height / 10 - 1) * 10;
    gameover = false;
    muros = [];
    for(var i = 0; i < 10; i++){
        muros.push(new Rectangulo(random(canvas.width / 10 -1 ) * 10, random(canvas.height / 10 -1 ) * 10, 10, 10));
    }
    
}
function paint(contexto){
    var i = 0;
    //Limpiar el canvas
    contexto.fillStyle = '#000';
    contexto.fillRect(0, 0, canvas.width, canvas.height);

    //Dibujar la cuncuna
   for(i = 0; i < cuncuna.length; i++){
       contexto.drawImage(iBody, cuncuna[i].x, cuncuna[i].y);
   }

     //Dibujar muros
    for(i = 0; i < muros.length; i++){
        contexto.fillStyle = '#657';
        muros[i].fill(contexto);
    }

    //Dibujar comida
    contexto.drawImage(iFood, comida.x, comida.y);

    //Dibujar debug tecla presionada
    //contexto.fillText('tecla presionada: ' + ultimoPresionado, 0, 40);


    //Dibujar puntaje
    contexto.fillStyle = '#f56';
    contexto.fillText('Puntaje: ' + puntaje, 0, 10);

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
        if(gameover){
            reset();
        }

        //Mover cuncuna[0]
        for(i = cuncuna.length -1 ; i > 0; i--){
            cuncuna[i].x = cuncuna[i - 1].x;
            cuncuna[i].y = cuncuna[i - 1].y;
        }

        //Cambiar direccion
        if(ultimoPresionado == KEY_UP && dir != 2){
            dir = 0;
        }
        if(ultimoPresionado == KEY_RIGHT && dir != 3){
            dir = 1;
        }
        if(ultimoPresionado == KEY_DOWN && dir != 0){
            dir = 2;
        }
        if(ultimoPresionado == KEY_LEFT && dir != 1){
            dir = 3;
        }
        
        //Movimiento recto
        if(dir == 0){
            cuncuna[0].y -= 10;
        }
        if(dir == 1){
            cuncuna[0].x += 10;
        }
        if(dir == 2){
            cuncuna[0].y += 10;
        }
        if(dir == 3){
            cuncuna[0].x -= 10;
        }

        //Fuera del canvas
        if(cuncuna[0].x > canvas.width){
            cuncuna[0].x  = 0;
        }
        if(cuncuna[0].y > canvas.height){
            cuncuna[0].y = 0;
        }
        if(cuncuna[0].x < 0){
            cuncuna[0].x = canvas.width;
        }
        if(cuncuna[0].y < 0){
            cuncuna[0].y = canvas.height;
        }

        //Interccion de comida con cuncuna[0]
        if(cuncuna[0].intersect(comida)){
            cuncuna.push(new Rectangulo(comida.x, comida.y, 10, 10));
            puntaje += 1;
            comida.x = random(canvas.width / 10 -1 ) * 10;
            comida.y = random(canvas.height / 10 - 1) * 10;
            eEat.play();
        }

        //Interseccion de la cuncuna[0] con los muros
        for(i = 0; i < muros.length; i++){
            if(comida.intersect(muros[i])){
                comida.x = random(canvas.width / 10 -1 ) * 10;
                comida.y = random(canvas.height / 10 - 1) * 10;
            }
            if(cuncuna[0].intersect(muros[i])){
                gameover = true;
                pause = true;
                eDie.play();
            }
        }

        //Intersección con límites
        if(cuncuna[0].intersectWithWall()){
            gameover = true;
            pause = true;
            eDie.play();
        }
        
    }
    //Pause // Start
    if(ultimoPresionado == KEY_ENTER){
        pause = !pause;
        ultimoPresionado = null;
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

    iBody.src = 'body.png';
    iFood.src = 'fruit.png';
    eEat.src = 'chomp.oga';
    eDie.src = 'dies.oga';

    //Se crea el la cuncuna[0] y la comida
    cuncuna[0] = new Rectangulo((canvas.width / 2), (canvas.height / 2) + 200, 10, 10);
    comida = new Rectangulo(80, 80, 10, 10);

    //Se crean los muros
    //muros.push(new Rectangulo((canvas.width / 2) - 100, (canvas.height / 2) - 100, 10, 10));
    //muros.push(new Rectangulo((canvas.width / 2) + 100, (canvas.height / 2) - 100, 10, 10));
    //muros.push(new Rectangulo((canvas.width / 2) - 100, (canvas.height / 2) + 100, 10, 10));
    //muros.push(new Rectangulo((canvas.width / 2) + 100, (canvas.height / 2) + 100, 10, 10));

    for(var i = 0; i < 10; i++){
        muros.push(new Rectangulo(random(canvas.width / 10 -1 ) * 10, random(canvas.height / 10 -1 ) * 10, 10, 10));
    }

    //Comienzo del juego
    run();
    repaint();

}

window.addEventListener('resize', resize, false);
window.addEventListener('load', init, false);