/* Global Vars */
keys = [];
bulletList = [];
var game = undefined;
bulletId = 0;

$(function(){
    //this code runs after page is fully loaded
    $("#helpMenu").hide();
    $("#gameScreen").hide();

    /* Button Functionality */
    $("#playBtn").click(function(){
        $("#mainMenu").slideUp("medium",function(){
            game = new gameInstance();
            game.initGame();
            // run update every 10 msec
            game.interval = setInterval(game.update, 10);
            $("#gameScreen").fadeIn();
        });
    });

    $("#helpBtn").click(function(){
        $("#helpMenu").slideDown();
    });

    $("#helpOkBtn").click(function(){
        $("#helpMenu").slideUp();
    });

    $("#returnBtn").click(function(){
        clearInterval(game.interval);
        $("#gameScreen").fadeOut("medium",function(){
            $("#mainMenu").slideDown();
        });
    });

    $("#gameScreen").mousedown(function (e) {
        addBullet("black", 10, 2, game.p.x, game.p.y, e.clientX, e.clientY);
    });

    /* Key Listeners */
    document.body.addEventListener("keydown", function (e) {
        keys[e.keyCode] = true;
    });

    document.body.addEventListener("keyup", function (e) {
        keys[e.keyCode] = false;
    });
});

function gameInstance(){
    var self = this;
    this.p = undefined;
    this.running = false;
    this.interval = undefined;

    this.initGame = function() {
        self.running = true;
        self.p = new player(50, 50, 400, 300);
    }

    this.update = function() {
        self.p.update();

        $.each(bulletList, function (index, bullet) {  
            updateBullet(bullet, self);
            $("#bullet").css("center",bullet.x);
            $("#bullet").css("center",bullet.y);
         });
    }
}


function player(width, height, x, y) {
    var self = this;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    

    this.update = function(){ 
        self.speedX = 0;
        self.speedY = 0;

        if (keys[37] || keys[65]) {self.speedX = -5; }
        if (keys[39] || keys[68]) {self.speedX = 5; }
        if (keys[38] || keys[87]) {self.speedY = -5; }
        if (keys[40] || keys[83]) {self.speedY = 5; }

        if (self.x + self.speedX >= 0 && self.x + self.speedX + self.width <= 800) 
            self.x += self.speedX;
        if (self.y + self.speedY >= 0 && self.y + self.speedY + self.height <= 600)
            self.y += self.speedY;

        $("#player").css("left",self.x);
        $("#player").css("top",self.y);
    } 
}

function updateBullet(bullet, player) {
    var dx = (bullet.eX - player.x);
    var dy = (bullet.eY - player.y);
    var mag = Math.sqrt(dx * dx + dy * dy);              
    bullet.velocityX = (dx / mag) * bullet.speed;
    bullet.velocityY = (dy / mag) * bullet.speed;
    bullet.x += bullet.velocityX;
    bullet.y += bullet.velocityY;
}

function bullet(id, color, size, speed, x, y, eX, eY) {
    this.id = id;           
    this.color = color;
    this.size = size;
    this.x = x;
    this.y = y;
    this.eX = eX;
    this.eY = eY;
    this.velocityX;
    this.velocityY;
    this.speed = speed;
}

function addBullet(color, bsize, bspeed, x, y, eX, eY) {
    bulletList[bulletId] = new bullet(bulletId, color, bsize, bspeed, x, y, eX, eY);
    bulletId = (bulletId + 1)%100;
}