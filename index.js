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
            getPlayerPos(game);
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
        addBullet("black", 10, 2, game.p.x+25, game.p.y-25-(((bulletId+1)%3)*5), e.clientX-240, e.clientY-75-bulletIdOffsetY());
        /**!!!Need to make this dynamic!!! */
        /** Need to add offsets to game.p vars for top/bottom and left/right */
        /** X seems to be -200 for half of gameScreen margin left (-400px) and -40 for ?*/
        /** Y seems to be -75 for some reason? gameScreenmargin top is (-300px) so -300/4? */

    });
    
   

    /* Key Listeners */
    document.body.addEventListener("keydown", function (e) {
        keys[e.keyCode] = true;
        
    });

    document.body.addEventListener("keyup", function (e) {
        keys[e.keyCode] = false;
        if (e.keyCode == 32 || (e.keyCode >= 37 && e.keyCode <= 40)){
            console.log(game.p.x);
            console.log(game.p.y);
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
            addBullet("black", 10, 2, game.p.x+25, game.p.y-25-bulletIdOffsetY(), game.p.x+25-1, game.p.y-25-bulletIdOffsetY()); }
        if (keys[39]&& canShoot) {canShoot = false;
            addBullet("black", 10, 2, game.p.x+25, game.p.y-25-bulletIdOffsetY(), game.p.x+25+1, game.p.y-25-bulletIdOffsetY()); }
        if (keys[38]&& canShoot) {canShoot = false;
            addBullet("black", 10, 2, game.p.x+25, game.p.y-25-bulletIdOffsetY(), game.p.x+25, game.p.y-1-25-bulletIdOffsetY()); }
        if (keys[40]&& canShoot) {canShoot = false;
            addBullet("black", 10, 2, game.p.x+25, game.p.y-25-bulletIdOffsetY(), game.p.x+25, game.p.y+1-25-bulletIdOffsetY()); }

        if ((keys[32]) && canShoot){/**Space Bar Shooting */
            canShoot = false;
            addBullet("black", 10, 2, game.p.x+25, game.p.y-25-bulletIdOffsetY(), game.p.x+25+1, game.p.y-25-bulletIdOffsetY());
        }

        /** Update Values */
        if (self.x + self.speedX >= 0 && self.x + self.speedX + self.width <= 800) 
            self.x += self.speedX;
        if (self.y + self.speedY >= 0 && self.y + self.speedY + self.height <= 600)
            self.y += self.speedY;

        /** Draw */
        $("#player").css("left",self.x);
        $("#player").css("top",self.y);
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

bulletIdOffsetY = function(){
    return (((bulletId+1)%3)*5);
}

function bulletUpdate(self, player){
    /*Update Values*/             
    
    self.x += self.velocityX;
    self.y += self.velocityY;
    /*Draw*/
    if (self.id == 0){
        $("#bullet1").css("left",self.x);
        $("#bullet1").css("top",self.y);
    } else if (self.id == 1){
        $("#bullet2").css("left",self.x);
        $("#bullet2").css("top",self.y);
    } else if (self.id == 2){
        $("#bullet3").css("left",self.x);
        $("#bullet3").css("top",self.y);
    }
}

function addBullet(color, bsize, bspeed, x, y, eX, eY) {
    bulletId = (bulletId + 1)%3;
    bulletList[bulletId] = new bullet(bulletId, color, bsize, bspeed, x, y, eX, eY);
    
}

function getPlayerX(){
    player_x = game.player.x;
    mid_x =  player_x + (game.player.width / 2);
    return mid_x;
}

function getPlayerY(){
    player_y = game.player.y;
    mid_y =  player_y + (game.player.height / 2);
    return mid_y;
}

function enemyComponent(width, height, x, y){
    var self = this;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.moveInc = 2;
    this.x = x;
    this.y = y;

    this.update = function() {
        self.speedX = 0;
        self.speedY = 0;
        var player_x = getPlayerX();
        var player_y = getPlayerY();
        var left = false, right = false, up = false, down = false; // Set booleans

        //Try manhatten distance ... 
        var x_mid = self.x + self.width/2;
        var y_mid = self.y + self.height/2;
        var x_distance = x_mid - player_x;
        var y_distance = y_mid - player_y;

        if(Math.abs(x_distance) >= Math.abs(y_distance)){
            // Move x direction
            if(x_mid > player_x) { self.speedX = 0 - self.moveInc; } // Move left
            else if(x_mid < player_x) { self.speedX = self.moveInc; } // Move right
            // Check the bounds
            if (self.x + self.speedX >= 0 && self.x + self.speedX + self.height <= 800)          
                self.x += self.speedX;
        }
        else{
            // Move y direction
            if(y_mid > player_y) { self.speedY = 0 - self.moveInc; } // Move down
            else if(y_mid < player_y) { self.speedY = self.moveInc; } // Move up
            // Check the bounds
            if (self.y + self.speedY >= 0 && self.y + self.speedY + self.height <= 600)
                self.y += self.speedY;
        }
         
        // Update the css to show the movement
        $("#enemy").css("left",self.x);
        $("#enemy").css("top",self.y);
    }
}