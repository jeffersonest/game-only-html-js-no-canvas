(()=>{
    const content = document.getElementById('content');
    const player = document.getElementById('player');
    const bullets = document.getElementById('bullets-text');
    const playerLife = document.getElementById('player-life');

    class Helper {
        static getRandomNumber(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min;
        }

        static between(x, min, max) {
            return x >= min && x <= max;
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
        fire_cooldown = false;
        element = document.createElement("div");


        constructor() {
            const left = `${Helper.getRandomNumber(Enemy.minLeft , Enemy.maxLeft)}%`;
            const bottom =`600%`;
            this.element.className = "enemy";
            this.element.style.position = 'absolute';
            this.element.style.left = left;
            this.element.style.bottom = bottom;
        }

        fire(bottom, left){
            const fire = new Bullet({left: left+3, bottom: bottom+5 }, "px");
            content.insertBefore(fire.element, this.element);
            fire.animate(true);
        }

        animate() {
            let actualBottomPos = parseInt(this.element.style.bottom.replace("px", ''));
            let actualLeftPos = parseInt(this.element.style.left.replace("%", ''));
            const enemyAction = setInterval(()=> {
                const playerLeft = parseInt(player.style.left.replace("%", ''));
                if (actualBottomPos > Enemy.minBottom) {
                    this.element.style.bottom = actualBottomPos - 1 + "px";
                    actualBottomPos = parseInt(this.element.style.bottom.replace("px", ''));
                    if((Helper.between(actualLeftPos, playerLeft - 5, playerLeft + 5)) && (this.fire_cooldown===false)){
                        this.fire_cooldown = true;
                        this.fire(actualBottomPos, actualLeftPos);
                        setTimeout(() => {
                            this.fire_cooldown = false;
                        }, (1000)); //Fire cooldown
                    }
                } else {
                    this.element.remove();
                    clearInterval(enemyAction);
                }
            }, 10)
        }

    }

    class Bullet {
        minLeft = 2;
        maxLeft = 91;
        minBottom = 2;
        maxBottom = 88;
        element = document.createElement("div");
        shootSound = new Audio("../assets/pew.wav");

        constructor(position, positionType) {
            this.element.className = "bullet fire";
            if(positionType === "%"){
                this.element.style.left = position.left + "%";
                this.element.style.bottom = position.bottom + "%";
            } else {
                this.element.style.left = position.left + "%";
                this.element.style.bottom = position.bottom + "px";
            }
            this.left = position.left;
            this.bottom = position.bottom;
            this.shootSound.play();
        }

        animate(reverse= false){
            let actualBottomPos = parseInt(this.element.style.bottom.replace("%", ''));

            const shootAnimation =  setInterval(() => {
                if ((actualBottomPos <= this.maxBottom) && !reverse) {
                    this.element.style.bottom = actualBottomPos + 2 + "%"; //bullet speed
                    actualBottomPos = parseInt(this.element.style.bottom.replace("%", ''));
                } else if((actualBottomPos >= this.minBottom) && reverse){
                    this.element.className = "bullet fire reverse";
                    this.element.style.bottom = actualBottomPos - 10 + "px"; //bullet speed
                    actualBottomPos = parseInt(this.element.style.bottom.replace("px", ''));
                } else {
                    this.shootSound.pause();
                    this.element.remove();
                    clearInterval(shootAnimation);
                }

                if(reverse) {
                    const playerLeft = parseInt(player.style.left.replace("%", ''));
                    const playerBottom = parseInt(player.style.bottom.replace("%", ''));
                    const actualLeftPos = parseInt(this.element.style.left.replace("%", ''));

                    if(Helper.between(actualLeftPos, playerLeft - 2, playerLeft + 8) && (Helper.between(actualBottomPos, playerBottom - 5, playerBottom + 5))){
                        this.element.style.display = "none";
                        playerLife.value = playerLife.value - 26;
                        this.element.remove();
                        clearInterval(shootAnimation);
                    }
                }
            }, 10 );

        }
    }

    const key = new Controls();
    const player1 = new Player();

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

    function enemiesSpawn(player) {
        const enemy = new Enemy();
        enemy.animate(player);
        content.insertBefore(enemy.element, player);
        setTimeout(enemiesSpawn, 5000);
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
                const fire = new Bullet({left: player1.left + 3.4 , bottom: player1.bottom + 5}, "%");
                if(player1.bottom >= player1.minBottom) player1.bottom-=0.5
                content.insertBefore(fire.element, player);
                fire.animate();
                setTimeout(() => {
                    fire_cooldown = false;
                }, (300)); //Fire cooldown
            }
        }

        if(playerLife.value <= 0) {
            window.alert("GAME OVER");
        }

        player.style.bottom = player1.bottom + "%";
        player.style.left = player1.left +  "%";

        setTimeout(gameLoop, 30);
    }

    gameLoop();
    enemiesSpawn();
})();

