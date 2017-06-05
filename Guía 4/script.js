var KEY_ENTER = 13,
    KEY_LEFT = 37,
    KEY_UP = 38,
    KEY_RIGHT = 39,
    KEY_DOWN = 40;

var canvas = null,
    ctx = null,
    nave = null
    background = null,
    x = 350,
    y = 0,
    lastpress = null,
    pause = true,
    dir = 0;

    document.addEventListener('keydown', function(evt){
        lastpress = evt.which;
    }, false)

    function paint(ctx){
        if(pause){
            ctx.font = "20px Georgia";
            ctx.textAlign = 'center';
            ctx.fillText("PAUSA", 330, 230);
            ctx.textAlign = 'left';
        }
        background = new Image();
        background.src = "space.jpg";
        background.onload = function(){
            ctx.drawImage(background, 0,0);
        }

        nave = new Image();
        nave.src = "nave.png";
        nave.onload = function(){
            ctx.drawImage(nave, x,y, 50,50);
            
        }
        
    }

    function act(){ 
        if (!pause) { 
            // Cambiar dirección 
            if (lastpress == KEY_UP) { 
                dir = 0; 
            } 
            if (lastpress == KEY_RIGHT) { 
                dir = 1; 
            } 
            if (lastpress == KEY_DOWN) { 
                dir = 2; 
            } 
            if (lastpress == KEY_LEFT) { 
                dir = 3; 
            } 
            // Moviento recto
            if (dir == 0) { 
                y -= 5; 
            } 
            if (dir == 1) { 
                x += 5; 
            } 
            if (dir == 2) { 
                y += 5; 
            } 
            if (dir == 3) { 
                x -= 5; 
            } 
            // Fuera del canvas 
            if (x > canvas.width) { 
                x = 0; 
            } 
            if (y > canvas.height) { 
                y = 0; 
            } if (x < 0) { 
                x = canvas.width; 
            } if (y < 0) { 
                y = canvas.height; 
            } 
        } 
        // Pause/empezar
        if (lastpress == KEY_ENTER) { 
            pause = !pause; 
            lastpress = null; 
        } 
    }
    function repaint() { 
        window.requestAnimationFrame(repaint); 
        paint(ctx); 
    }

    function run(){
        window.requestAnimationFrame(run);
        act();
        paint(ctx);
    }

    function init(){
        canvas = document.getElementById('lienzo');
        ctx = canvas.getContext('2d');

        run();
        repaint();
    }
    window.addEventListener('load', init, false);