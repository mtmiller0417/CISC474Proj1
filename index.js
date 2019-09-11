/* Global Vars */
keys = [];
var game = undefined;

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
            game.interval = setInterval(game.player.update, 10);
            game.interval = setInterval(game.enemy.update, 10);     
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
    this.player = undefined;
    // keep below?

    this.enemy = undefined;

    // keep above?
    this.running = false;
    this.interval = undefined;

    this.initGame = function() {
        self.running = true;
        self.player = new gameComponent(50, 50, 400, 300);
        self.enemy = new enemyComponent(75, 75, 200, 100);
    }
}


function gameComponent(width, height, x, y) {
    var self = this;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    

    this.update = function() {
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

// Enemy code below this

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