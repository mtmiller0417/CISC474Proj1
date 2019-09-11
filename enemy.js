function getPlayerPos(game){
    var self = this;
    //Gets top left of player
    var player_x = game.player.x;
    var player_y = game.player.y;
    var player_width = game.player.width;
    var player_height = game.player.height;
    var mid_x = player_x + (player_width / 2);
    var mid_y = player_y + (player_height / 2);
    console.log("PLAYER POSx: " + player_x + " y:" + player_y);
    console.log("PLAYER MID POSx: " + mid_x + " y:" + mid_y);
}
function getPlayerX(game){
    player_x = game.player.x;
    mid_x =  player_x + (game.player.width / 2);
    return mid_x;
}

function getPlayerY(game){
    player_y = game.player.x;
    mid_y =  player_y + (game.player.height / 2);
    return mid_y;
}

function enemyComponent(width, height, x, y, game){
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
        var player_x = getPlayerX(game);
        var player_y = getPlayerY(game);
        //Move where the player is ...
        if(x < player_x){ self.speedX = 2; }         // Move right
        else if(x > player_x){ self.speedX = -2; } // Move left
        if(y < player_y){ self.speedY = 2; }         // Move down
        else if(y > player_y){ self.speedY = -2; } // Move up

        self.x += self.speedX;
        self.y += self.speedY;

        console.log(player_x + " " + player_y);

        // Update the css to show the movement
        $("#enemy").css("left",self.x);
        $("#enemy").css("top",self.y);
    }
}