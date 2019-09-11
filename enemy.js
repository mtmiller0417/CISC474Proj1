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

function enemyComponent(width, height, x, y){
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
        //Move where the player is...
    }
}