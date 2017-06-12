var KEY_ENTER = 13;
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
var canvas = null;
var ctx = null;
var nave = null;
var x = 675;
var y = 500;
var lastpress = null;
var pause = true;
var dir = 0;
var naveImagen = new Image();
var background = new Image();
var teclasPresionadas = new Array();
var KEY_SPACE = 32;
var disparo = new Array();
var puntaje = 0;
var sonidoDisparo = new Audio();
var gameover = false;

    document.addEventListener("keydown",function(evt){
        lastpress = evt.keyCode;
        teclasPresionadas[evt.keyCode] = true;
    },false)

        document.addEventListener("keyup",function(evt){
        teclasPresionadas[evt.keyCode] = false;
    },false)

    function Rectangulo(x, y, width, height){
        this.x = (x == null) ? 0 : x;
        this.y = (y == null) ? 0 : y;
        this.width = (width == null) ? 0 : width;
        this.height = (height == null) ? 0 : height;

        this.fill = function(ctx){
            if(ctx == null){
                window.console.warn("Parametros incorrectos de la funcion fill");
            } else {
                //ctx.fillStyle = "#f54";
                ctx.fillRect(this.x, this.t, this.width, this.height);
                //Dibujar disparos
                ctx.fillStyle = "#f00";
                for((i = 0); i < disparo.length; i++){
                    disparo[i].fill(ctx);
                }
            }
        };
    }
    
    function paint(ctx){
        var i = 0;
        //Limpiar el canvas
        ctx.drawImage(background, 0, 0);

        //Dibujar la nave
        ctx.drawImage(naveImagen, nave.x, nave.y, 50,50);
        
        //Dibujar Pause
        if(pause){
            ctx.textAlign = "center";
            ctx.fillText("PAUSE", canvas.width / 2, canvas.height / 2);
            ctx.textAlign = "left";
        }
    }

    function act(){
        var i = 0;
        if (!pause) {
            //Movimiento recto
            if(teclasPresionadas[KEY_UP]) {
                nave.y -= 5;
            }
            if(teclasPresionadas[KEY_RIGHT]) {
                nave.x += 5;
            }
            if(teclasPresionadas[KEY_DOWN]) {
                nave.y += 5;
            }
            if(teclasPresionadas[KEY_LEFT]) {
                nave.x -= 5;
            }
            // Fuera del canvas
            if (nave.x > canvas.width) {
                nave.x = 0;
            }
            if (nave.y > canvas.height) {
                nave.y = 0;
            }
            if (nave.x < 0) {
                nave.x = canvas.width;
            }
            if (nave.y < 0) {
                nave.y = canvas.height;
            }
        }
        // Pause // Start
        if (lastpress == KEY_ENTER) {
            pause = !pause;
            lastpress = null;
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
    }
    function repaint() {
        window.requestAnimationFrame(repaint);
        paint(ctx);
    }

    function run(){
        window.requestAnimationFrame(run);
        act();
        paint(ctx)
    }

    function init(){
        //Se obtiene el canvas y el contexto
        canvas = document.getElementById("lienzo")
        ctx = canvas.getContext("2d");

        //Creaciòn de imagenes y sonidos
        naveImagen.src = "nave.png";
        background.src = "space.jpg";
        sonidoDisparo.src = "chomp.oga"

        //Se crea el rectangulo que contendrá a la nave
        nave = new Rectangulo((canvas.width / 2), (canvas.height / 2), 20, 20);

        //Comienzo del juego
        run();
        repaint();
    }
    window.addEventListener("load", init, false);