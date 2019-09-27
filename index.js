/* Global Vars */
keys = [];
bulletList = new Map();
removeBullets = new Map();
obstacleList = [];
var game = undefined;
bulletId = 0;
explosionId = 0;
numBulletsRemoved = 0;
bulletSpeed = 10;
canShoot = true;
heart = undefined;

enemyList = new Map(); // A list of all the enemies that will be on the screen at a time

moveLeft = false; // For determining directions.
moveRight = false;
moveUp = false;
moveDown = false;

idlePicNum = 0;                     //number for which idle pic is being used
imageTimer = 0;                     //timer to prevent sprite from updating too fast
turnTimer = 0;                      //timer used to prioritize looking in shooting dir before moving dir
turnTimerConstant = 80;             //constant time used for turnTimer
var olde;

var playerMaxHP = 100;
var playerHP = playerMaxHP;                 //set the player to have 100 hp to start

function returnToMain(){
    console.log("ReturnToMain")
    clearInterval(game.interval);
    obstacleList.forEach(function(b){
        $("#obstacle"+b.id).remove();
    });
    obstacleList = [];
        $("#gameScreen").fadeOut("medium",function(){
            $("#mainMenu").slideDown();
            $("#floorText").html("Floor 1");
            playerHP = playerMaxHP;
        });
}

function nextLevel(floor){
    //$("#gameScreen").fadeOut();
    clearGame(); // Clear the bullets from the game
    //$("#gameScreen").fadeIn();
    game.initGame(floor);
    if (floor <= 4){
        $("#floorText").html('Floor ' + floor);
    }
}

function clearGame(){
    for (var [i, b] of bulletList ) {
        /**Remove dead bullets */
       $("#bullet"+b.id).remove();
       bulletList.delete(b.id);
   }
   removeBullets.clear();
}

$(function(){
    //this code runs after page is fully loaded
    $("#helpMenu").hide();
    $("#gameScreen").hide();

    /* Button Functionality */
    $("#playBtn").click(function(){
        $("#mainMenu").slideUp("medium",function(){
            game = new gameInstance();
            game.initGame(1);
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
        returnToMain();
    });

    /* Key Listeners */
    document.body.addEventListener("keydown", function (e) {
        if ((e.keyCode >= 37 && e.keyCode <= 40) && (keys[37]||keys[38]||keys[39]||keys[40])){
            /**do nothing */
        }else {
            keys[e.keyCode] = true;
            olde = e.keyCode;
        }
    });

    document.body.addEventListener("keyup", function (e) {
        keys[e.keyCode] = false;
        if ((e.keyCode == 32 || (e.keyCode >= 37 && e.keyCode <= 40)) && e.keyCode==olde){
            canShoot = true;
        }
    });
});

function gameInstance(){
    var self = this;
    this.p = undefined; /**Player */
    this.running = false;
    this.interval = undefined;

    this.initGame = function(floor) {
        self.running = true;
        self.floor = floor;
        // Get players hp from prior floor
        self.p = new player(50, 50, 400, 300); // Instantiate the player
        var pctHealth = Math.round(self.p.currHealth * (100/self.p.maxHealth));
        $("#playerHealthText").html(pctHealth + "%");
        $("#playerDamageBar").css("width", pctHealth + "%");
        $("#playerHealthBar").css("width", pctHealth + "%");

        // Create the enemy based on the floor
        switch(floor) {
            case 1:
                // Create the first enemy
                self.enemy = new enemy(123, 80, 0, 0, 25, 50, 1); // This enemy does 25 dmg per hit and 50 health with a speed of 1
                heart = new bullet($("<div class='heart' id= 'heart0'></div>").appendTo('#gameScreen'),
                0, 175, 275, 0, 0, 25, 25);
                $(heart.ref).css("left", 175);
                $(heart.ref).css("top", 275);
                
                break;
            case 2:
                // Create the first enemy
                self.enemy = new enemy(123, 80, 0, 0, 25, 50, 2); // This enemy does 25 dmg per hit and 50 health with a speed of 2
                obstacleList.push(new bullet ($("<div class='obstacle' id= 'obstacle0'></div>").appendTo('#gameScreen'),
                0, 525, 100, 0, 0, 75, 125));
                $(obstacleList[0].ref).css("left", 525);
                $(obstacleList[0].ref).css("top", 100);
                break;
            case 3:
                // Create the first enemy
                self.enemy = new enemy(123, 80, 0, 0, 30, 100, 2); // This enemy does 30 dmg per hit and 100 health with a speed of 2
                obstacleList.push(new bullet ($("<div class='obstacle' id= 'obstacle1'></div>").appendTo('#gameScreen'),
                1, 125, 400, 0, 0, 75, 125));
                $(obstacleList[1].ref).css("left", 125);
                $(obstacleList[1].ref).css("top", 400);
                break;
            case 4:
                self.enemy = new enemy(123, 80, 0, 0, 30, 100, 3); // This enemy does 30 dmg per hit and 100 health with a speed of 3
                obstacleList.push(new bullet ($("<div class='obstacle' id= 'obstacle2'></div>").appendTo('#gameScreen'),
                2, 525, 400, 0, 0, 75, 125));
                $(obstacleList[2].ref).css("left", 525);
                $(obstacleList[2].ref).css("top", 400);
                obstacleList.push(new bullet ($("<div class='obstacle' id= 'obstacle3'></div>").appendTo('#gameScreen'),
                3, 125, 100, 0, 0, 75, 125));
                $(obstacleList[3].ref).css("left", 125);
                $(obstacleList[3].ref).css("top", 100);
                break;
            default:
                // Create the first enemy
                returnToMain();
                break;
        }

        
        var enemyPctHealth = Math.round(self.enemy.currHealth * (100/self.enemy.maxHealth));
        $("#enemyHealthText").html(enemyPctHealth + "%");
        $("#enemyDamageBar").css("width", enemyPctHealth + "%");
        $("#enemyHealthBar").css("width", enemyPctHealth + "%");
    }

    this.update = function() {

        if (checkCollision(heart.x, heart.y, heart.width, heart.height, self.p.x, self.p.y, self.p.width, self.p.height)){
            self.p.takeDamage(-25);
            $("#heart0").remove();
            heart = [];
        }

        obstacleList.forEach(function(b){
            /** Add a for each loop for the enemylist here */
            if (checkCollision(b.x, b.y, b.width, b.height, self.enemy.x, self.enemy.y, self.enemy.width, self.enemy.height)){
                self.enemy.movePenalty = true;
            }
            if (checkCollision(b.x, b.y, b.width, b.height, self.p.x, self.p.y, self.p.width, self.p.height)){
                self.p.takeDamage(5);

                if(self.p.currHealth <= 0){
                    // Possibly show death screen?
                    returnToMain();
                }
            }
        });

        self.p.update();
        self.enemy.update();

        self.enemy.movePenalty = false;

        for (var [i, b] of bulletList ) {
            
            updateBullet(b);

             /**Adding Bullet Check Collision */
            if (checkCollision(b.x, b.y, b.width, b.height, self.enemy.x, self.enemy.y, self.enemy.width, self.enemy.height)){
                removeBullets.set(b.id, b);
                self.enemy.takeDamage(5);
                var ref = $("<div class='explosion' id= 'exp"+explosionId+"'></div>").appendTo('#gameScreen');
                $(ref).css("left", b.x-10);
                $(ref).css("top", b.y-20);
                $(ref).bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
                    $(ref).remove();
               });
                explosionId += (explosionId+1)%25;
                if(self.enemy.currHealth <= 0){
                    nextLevel(self.floor + 1);
                }
            }
        }

        for (var [i, b] of removeBullets ) {
             /**Remove dead bullets */
            $("#bullet"+b.id).remove();
            bulletList.delete(b.id);
        }
        removeBullets.clear();

        var collision = checkCollision(self.p.x, self.p.y, self.p.width, self.p.height, self.enemy.x, self.enemy.y, self.enemy.width, self.enemy.height);
        if(collision){
            // Take damage OR send to end game screen OR send to start
            self.p.takeDamage(self.enemy.dmg);

            if(self.p.currHealth <= 0){
                // Possibly show death screen?
                returnToMain();
            }
        }
       
    }
}

// CODE FOR THE PLAYER
function player(width, height, x, y) {
    var self = this;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.maxHealth = 100;
    this.currHealth = playerHP;
    this.invulnerableFrames = 0;

    this.update = function(){ 
        self.speedX = 0;
        self.speedY = 0;


/*if(imageTimer == 0){    //prevents image from changing every update b/c it was too fast
        var str1 = '';
        var idlePic = str1.concat("url('Images/Top_Down_Survivor/rifle/idle/survivor-idle_rifle_", idlePicNum, ".png')");

        idlePicNum += 1;
        idlePicNum = idlePicNum % 20;

        $("#player").css('background-image', idlePic);
    }*/

        /** ADWS Keys in order */
        if (keys[65]) {
            self.speedX = -5; 
            if(turnTimer <= turnTimerConstant){
            $("#player").css('transform', 'rotate(180deg)');
            }
        }
        if (keys[68]) {
            self.speedX = 5;
            if(turnTimer <= turnTimerConstant){
            $("#player").css('transform', 'rotate(0deg)');
            }
        }
        if (keys[87]) {
            self.speedY = -5; 
            if(turnTimer <= turnTimerConstant){
            $("#player").css('transform', 'rotate(270deg)');
            }
        }
        if (keys[83]) {
            self.speedY = 5; 
            if(turnTimer <= turnTimerConstant){
            $("#player").css('transform', 'rotate(90deg)');
            }
        }

        if (keys[65] && keys[83]){
            if(turnTimer <= turnTimerConstant){
                $("#player").css('transform', 'rotate(120deg)');
            }
        }
        if (keys[65] && keys[87]){
            if(turnTimer <= turnTimerConstant){
                $("#player").css('transform', 'rotate(240deg)');
            }
        }
        if (keys[68] && keys[83]){
            if(turnTimer <= turnTimerConstant){
                $("#player").css('transform', 'rotate(60deg)');
            }
        }
        if (keys[68] && keys[87]){
            if(turnTimer <= turnTimerConstant){
                $("#player").css('transform', 'rotate(300deg)');
            }
        }

        /** Directional Keys */
        if (keys[37] && canShoot) {canShoot = false; turnTimer = 100;
            addBullet(game.p.x+25, game.p.y+25, -1, 0);
            $("#player").css('transform', 'rotate(180deg)');
         }
        if (keys[39] && canShoot) {canShoot = false; turnTimer = 100;
            addBullet(game.p.x+25, game.p.y+25, 1, 0);
            $("#player").css('transform', 'rotate(0deg)');
        }
        if (keys[38] && canShoot) {canShoot = false; turnTimer = 100;
            addBullet(game.p.x+25, game.p.y+25, 0, -1);
            $("#player").css('transform', 'rotate(270deg)');
        }
        if (keys[40] && canShoot) {canShoot = false; turnTimer = 100;
            addBullet(game.p.x+25, game.p.y+25, 0, 1);
            $("#player").css('transform', 'rotate(90deg)');
        }

        if ((keys[32]) && canShoot){/**Space Bar Shooting */
            canShoot = false;
            addBullet(game.p.x+25, game.p.y+25, 1, 0);

        }

        /** Update Values */
        if (self.x + self.speedX >= 0 && self.x + self.speedX + self.width <= 800) 
            self.x += self.speedX;
        if (self.y + self.speedY >= 0 && self.y + self.speedY + self.height <= 600)
            self.y += self.speedY;

        /** Draw */
        $("#player").css("left",self.x);
        $("#player").css("top",self.y);



        imageTimer += 1;
        imageTimer = imageTimer%4;
        if(turnTimer != 0){
            turnTimer -= 1;
        }


        $("#playerHealthBox").css("left",self.x);
        $("#playerHealthBox").css("top",self.y - 15);

        /** Invulnerability Indicators */
        if (self.invulnerableFrames > 0) {
            self.invulnerableFrames -= 1;
            $("#playerHealthBox").css("outline","solid 4px gold");
        }
        else {
            $("#playerHealthBox").css("outline","none");
        }

        if (self.invulnerableFrames % 20 < 10) {
            $("#player").css("opacity",1);
        }
        else {
            $("#player").css("opacity",0);
        }
    
    }
    this.takeDamage = function(dmg) {
        /** If invulnerable, don't do anything */
        if (self.invulnerableFrames > 0 && !(dmg < 0))
            return;

        /** Otherwise take damage, draw HealthBox elements */
        if (self.currHealth - dmg < 0 ) {
            self.currHealth = 0;
        } else if (self.currHealth - dmg > self.maxHealth){
            self.currHealth = self.maxHealth;
        }else {
            self.currHealth = self.currHealth - dmg;
            playerHP -= dmg;
        }

        var pctHealth = Math.round(self.currHealth * (100/self.maxHealth));
        $("#playerHealthText").html(pctHealth + "%");
        $("#playerDamageBar").animate({
            width: pctHealth + "%"
        },
        1000);
        $("#playerHealthBar").css("width", pctHealth + "%");

        self.invulnerableFrames = 100;
    }

}
// Enemy code here

function getPlayerX(){
    player_x = game.p.x;
    mid_x =  player_x + (game.p.width / 2);
    return mid_x;
}

function getPlayerY(){
    player_y = game.p.y;
    mid_y =  player_y + (game.p.height / 2);
    return mid_y;
}

function enemy(width, height, x, y, dmg, health, speed){
    var self = this;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.moveInc = speed;
    this.movePenalty = false;
    this.x = x;
    this.y = y;
    this.dmg = dmg;
    this.currHealth = health;
    this.maxHealth = this.currHealth;

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

        if (self.movePenalty){
            var offset = self.moveInc/2;
            console.log(offset);
        } else {
            var offset = 0;
        }

        if(Math.abs(x_distance) >= Math.abs(y_distance)){
            // Move x direction
            if(x_mid > player_x) { self.speedX = 0 - (self.moveInc-offset); moveLeft = true;} // Move left
            else {moveLeft = false;}
            if(x_mid < player_x) { self.speedX = (self.moveInc-offset); moveRight = true; } // Move right
            else {moveRight = false;}
            // Check the bounds
            if (self.x + self.speedX >= 0 && self.x + self.speedX + self.height <= 800)          
                self.x += self.speedX;
        }
        else{
            // Move y direction
            if(y_mid > player_y) { self.speedY = 0 - (self.moveInc-offset); moveUp = true; } // Move up
            else {moveUp = false;}
            if(y_mid < player_y) { self.speedY = (self.moveInc-offset); moveDown = true; } // Move down
            else {moveDown = false;}
            // Check the bounds
            if (self.y + self.speedY >= 0 && self.y + self.speedY + self.height <= 600)
                self.y += self.speedY;
        }
        
        if (moveRight && moveDown) { // Facing right and down
            document.getElementById("enemy").style.animation = "enemy-move-right 0.6s steps(6) infinite";
            document.getElementById("enemy").style.transform = "rotate(45deg)";
        }
        if (moveLeft && moveDown) { // Facing left and down 
            document.getElementById("enemy").style.animation = "enemy-move-right 0.6s steps(6) infinite";
            document.getElementById("enemy").style.transform = "rotate(135deg)";
        }
        if (moveRight && moveUp) { // Facing right and up
            document.getElementById("enemy").style.animation = "enemy-move-right 0.6s steps(6) infinite";
            document.getElementById("enemy").style.transform = "rotate(-45deg)";
        }
        if (moveLeft && moveUp) { // Facing left and up
            document.getElementById("enemy").style.animation = "enemy-move-right 0.6s steps(6) infinite";
            document.getElementById("enemy").style.transform = "rotate(-135deg)";
        }
         
        // Update the css to show the movement
        $("#enemy").css("left",self.x);
        $("#enemy").css("top",self.y);

        $("#enemyHealthBox").css("left",self.x);
        $("#enemyHealthBox").css("top",self.y - 15);
    }

    this.takeDamage = function(dmg) {
        /** Otherwise take damage, draw HealthBox elements */
        if (self.currHealth - dmg < 0) {
            self.currHealth = 0;
        }
        else {
            self.currHealth = self.currHealth - dmg;
        }

        var pctHealth = Math.round(self.currHealth * (100/self.maxHealth));
        $("#enemyHealthText").html(pctHealth + "%");
        $("#enemyDamageBar").animate({
            width: pctHealth + "%"
        },
        1000);
        $("#enemyHealthBar").css("width", pctHealth + "%");
    }
    
}

function bullet(ref, id, x, y, xDir, yDir, height, width) {
    var self = this;
    this.ref = ref
    this.id = id;           
    this.x = x;
    this.y = y;
    this.xDir = xDir;
    this.yDir = yDir;
    this.width = width;
    this.height = height;

    
}

function updateBullet(b){
    
    /** Update Values */
    /*console.log(b.id);*/
    if (b.x + b.xDir*bulletSpeed >= 0 && b.x + b.xDir*bulletSpeed + 5 <= 800) {
        b.x += b.xDir*bulletSpeed;

        if (b.y + b.yDir*bulletSpeed >= 0 && b.y + b.yDir*bulletSpeed + 5 <= 600){
            b.y += b.yDir*bulletSpeed;

            /*Draw*/
            $(b.ref).css("left",b.x);
            $(b.ref).css("top",b.y);

        }else{
            // console.log("#bullet"+b.id);
            removeBullets.set(b.id, b);
        } 

    }else {
        // console.log("#bullet"+b.id);
        removeBullets.set(b.id, b);
    }
}

function addBullet(x, y, xDir, yDir) {
    // console.log("<div class='bullet' id= 'bullet"+bulletId+"'></div>");
    bulletList.set(bulletId, new bullet ($("<div class='bullet' id= 'bullet"+bulletId+"'></div>").appendTo('#gameScreen'),
                        bulletId, x, y, xDir, yDir, 5, 5));
    $(bulletList.get(bulletId).ref).css("left", x);
    $(bulletList.get(bulletId).ref).css("top", y);
    bulletId = (bulletId+1)%25;
    
}