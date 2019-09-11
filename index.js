/* Global Vars */
keys = [];
bulletList = [3];/** Three bullets */
var game = undefined;
bulletId = -1;
canShoot = true;

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
        console.log(game.p.x);
        console.log(game.p.y);
        console.log(e.clientX);
        console.log(e.clientY);
        addBullet("black", 10, 2, game.p.x, game.p.y, e.clientX, e.clientY);
    });

    /* Key Listeners */
    document.body.addEventListener("keydown", function (e) {
        keys[e.keyCode] = true;
        
    });

    document.body.addEventListener("keyup", function (e) {
        keys[e.keyCode] = false;
        if (e.keyCode == 32 || (e.keyCode >= 37 && e.keyCode <= 40)){
            canShoot = true;
        }
    });
});

function gameInstance(){
    var self = this;
    this.p = undefined; /**Player */
    this.running = false;
    this.interval = undefined;

    this.initGame = function() {
        self.running = true;
        self.p = new player(50, 50, 400, 300);
    }

    this.update = function() {
        self.p.update();

        if (bulletId != -1){
            $.each(bulletList, function (index, bullet) {  
                bulletUpdate(bullet, self.p);
             });
        }
        
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

        /** ADWS Keys in order */
        if (keys[65]) {self.speedX = -5; }
        if (keys[68]) {self.speedX = 5; }
        if (keys[87]) {self.speedY = -5; }
        if (keys[83]) {self.speedY = 5; }

        /** Directional Keys */
        if (keys[37]&& canShoot) {canShoot = false;
            addBullet("black", 10, 2, game.p.x, game.p.y, game.p.x-1, game.p.y); }
        if (keys[39]&& canShoot) {canShoot = false;
            addBullet("black", 10, 2, game.p.x, game.p.y, game.p.x+1, game.p.y); }
        if (keys[38]&& canShoot) {canShoot = false;
            addBullet("black", 10, 2, game.p.x, game.p.y, game.p.x, game.p.y-1); }
        if (keys[40]&& canShoot) {canShoot = false;
            addBullet("black", 10, 2, game.p.x, game.p.y, game.p.x, game.p.y+1); }

        if ((keys[32]) && canShoot){/**Space Bar Shooting */
            canShoot = false;
            addBullet("black", 10, 2, game.p.x, game.p.y, game.p.x+1, game.p.y);
        }

        /** Update Values */
        if (self.x + self.speedX >= 0 && self.x + self.speedX + self.width <= 800) 
            self.x += self.speedX;
        if (self.y + self.speedY >= 0 && self.y + self.speedY + self.height <= 600)
            self.y += self.speedY;

        /** Draw */
        $("#player").css("left",self.x+40-25);
        $("#player").css("top",self.y-25-25);
    } 
}

function bullet(id, color, size, speed, x, y, eX, eY, dx, dy, mag) {
    var self = this;
    this.id = id;           
    this.color = color;
    this.size = size;
    this.x = x;
    this.y = y;
    this.eX = eX;
    this.eY = eY;
    var dx = (self.eX - self.x);
    var dy = (self.eY - self.y);
    var mag = Math.sqrt(dx * dx + dy * dy);
    this.speed = speed;
    this.velocityX = (dx / mag) * self.speed;
    this.velocityY = (dy / mag) * self.speed;
    
}

function bulletUpdate(self, player){
    /*Update Values*/             
    
    self.x += self.velocityX;
    self.y += self.velocityY;
    /*Draw*/
    if (self.id == 0){
        $("#bullet1").css("left",self.x+40);
        $("#bullet1").css("top",self.y-25-50-5);
    } else if (self.id == 1){
        $("#bullet2").css("left",self.x+40);
        $("#bullet2").css("top",self.y-25-50-10);
    } else if (self.id == 2){
        $("#bullet3").css("left",self.x+40);
        $("#bullet3").css("top",self.y-25-50-15);
    }
}

function addBullet(color, bsize, bspeed, x, y, eX, eY) {
    bulletId = (bulletId + 1)%3;
    bulletList[bulletId] = new bullet(bulletId, color, bsize, bspeed, x, y, eX, eY);
    
}