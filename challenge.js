(()=>{

    class Helper {
        static getRandomNumber(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min;
        }
    }

    class Player {
        minLeft = 2;
        maxLeft = 91;
        minBottom = 2;
        maxBottom = 48; //88
        health = 100;
        bullet = 100;
        score = 0;
        left = 0;
        bottom = 0;
        status = false;
    }

    class Controls {
        //keyCodes
        up = 87;
        left = 65;
        right = 68;
        down = 83;
        fire = 32;
    }

    class Enemy {
        static minLeft = 2;
        static maxLeft = 91;
        static minBottom = 0;
        static maxBottom = 88; //88
        element = document.createElement("div");

        constructor() {
            const left = `${Helper.getRandomNumber(Enemy.minLeft , Enemy.maxLeft)}%`;
            const bottom =`600%`;
            this.element.className = "enemy";
            this.element.style.position = 'absolute';
            this.element.style.left = left;
            this.element.style.bottom = bottom;
        }

        animate() {
            let actualBottomPos = parseInt(this.element.style.bottom.replace("px", ''));
            const enemyAction = setInterval(()=> {
                    if (actualBottomPos > Enemy.minBottom) {
                        console.log(actualBottomPos, Enemy.maxBottom);
                        this.element.style.bottom = actualBottomPos - .5 + "px";

                        actualBottomPos = parseInt(this.element.style.bottom.replace("%", ''));
                    } else {
                        this.element.remove();
                        clearInterval(enemyAction);
                    }
            })

        }

    }

    class Bullet {
        minLeft = 2;
        maxLeft = 91;
        minBottom = 2;
        maxBottom = 88;
        element = document.createElement("div");
        shootSound = new Audio("../assets/pew.wav");

        constructor(position) {
            this.element.className = "bullet fire";
            this.element.style.left = position.left + "%";
            this.element.style.bottom = position.bottom + "%";
            this.left = position.left;
            this.bottom = position.bottom;
            this.shootSound.play().then();
        }

        animate(){
            let actualBottomPos = parseInt(this.element.style.bottom.replace("%", ''));
            const shootAnimation =  setInterval(() => {
                if (actualBottomPos <= this.maxBottom) {
                    this.element.style.bottom = actualBottomPos + 2 + "%"; //bullet speed
                    actualBottomPos = parseInt(this.element.style.bottom.replace("%", ''));
                } else {
                    this.shootSound.pause();
                    this.element.remove();
                    clearInterval(shootAnimation);
                }
            }, 10);
        }
    }

    const content = document.getElementById('content');
    const player = document.getElementById('player');
    const key = new Controls();
    const player1 = new Player();
    const bullets = document.getElementById('bullets-text');
    bullets.children[0].textContent = player1.bullet;
    const level = 1;
    let fire_cooldown = false;
    const keyState = {};

    document.addEventListener('keydown',function(e){
        keyState[e.keyCode || e.which] = true;
    },true);

    document.addEventListener('keyup',function(e){
        keyState[e.keyCode || e.which] = false;
    },true);

    function enemiesSpawn() {
        const enemy = new Enemy();
        enemy.animate();
        content.insertBefore(enemy.element, player);
        setTimeout(enemiesSpawn, 2000);
    }

    function gameLoop() {
        player.className = "";
        //Controls
        if (keyState[key.down]){
            if(player1.bottom >= player1.minBottom) player1.bottom-=2
        } else if (keyState[key.up]){
            if(player1.bottom <= player1.maxBottom) player1.bottom+=2
        } else if (keyState[key.left]){
            if(player1.left >= player1.minLeft) {
                player1.left-=2
                player.className = "turn-left";
            }
        } else if (keyState[key.right]){
            if(player1.left <= player1.maxLeft) {
                player1.left+=2
                player.className = "turn-right";
            }
        } else if (keyState[key.fire]) {
            if((player1.bullet >= 1) && (!fire_cooldown) ) {
                fire_cooldown = true
                player1.bullet -= 1;
                bullets.children[0].textContent = player1.bullet;
                const fire = new Bullet({left: player1.left + 3.4 , bottom: player1.bottom + 5});
                if(player1.bottom >= player1.minBottom) player1.bottom-=0.5
                content.insertBefore(fire.element, player);
                fire.animate();
                setTimeout(() => {
                    fire_cooldown = false;
                }, (300)); //Fire cooldown
            }
        }


        player.style.bottom = player1.bottom + "%";
        player.style.left = player1.left +  "%";

        setTimeout(gameLoop, 30);
    }

    gameLoop();
    enemiesSpawn();
})();

