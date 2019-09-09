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
    this.running = false;
    this.interval = undefined;

    this.initGame = function() {
        self.running = true;
        self.player = new gameComponent(50, 50, 400, 300);
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

        if (keys[37]) {self.speedX = -5; }
        if (keys[39]) {self.speedX = 5; }
        if (keys[38]) {self.speedY = -5; }
        if (keys[40]) {self.speedY = 5; }

        if (self.x + self.speedX >= 0 && self.x + self.speedX + self.width <= 800) 
            self.x += self.speedX;
        if (self.y + self.speedY >= 0 && self.y + self.speedY + self.height <= 600)
            self.y += self.speedY;

        $("#player").css("left",self.x);
        $("#player").css("top",self.y);
    }
}