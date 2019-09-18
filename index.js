/* Global Vars */
keys = [];
bulletList = new Map();
removeBullets = new Map();
var game = undefined;
bulletId = 0;
numBulletsRemoved = 0;
bulletSpeed = 10;
canShoot = true;
var olde;

function returnToMain(){
    clearInterval(game.interval);
        $("#gameScreen").fadeOut("medium",function(){
            $("#mainMenu").slideDown();
        });
}

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

    this.initGame = function() {
        self.running = true;

        self.p = new player(50, 50, 400, 300);
        var pctHealth = Math.round(self.p.currHealth * (100/self.p.maxHealth));
        $("#playerHealthText").html(pctHealth + "%");
        $("#playerDamageBar").css("width", pctHealth + "%");
        $("#playerHealthBar").css("width", pctHealth + "%");

        // Create the first enemy
        self.enemy = new enemy(75, 75, 0, 0, 25, 200); // This enemy does 25 dmg per hit and 200 health
        var enemyPctHealth = Math.round(self.enemy.currHealth * (100/self.enemy.maxHealth));
        $("#enemyHealthText").html(enemyPctHealth + "%");
        $("#enemyDamageBar").css("width", enemyPctHealth + "%");
        $("#enemyHealthBar").css("width", enemyPctHealth + "%");
    }

    this.update = function() {
        self.p.update();

        self.enemy.update();

        for (var [i, b] of bulletList ) {
            
            updateBullet(b);

             /**Adding Bullet Check Collision */
            if (checkCollision(b.x, b.y, b.width, b.height, self.enemy.x, self.enemy.y, self.enemy.width, self.enemy.height)){
                //console.log("Hit!");
                removeBullets.set(b.id, b);
                self.enemy.takeDamage(5);
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
    this.currHealth = 100;
    this.maxHealth = this.currHealth;
    this.invulnerableFrames = 0;

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
            addBullet(game.p.x+25, game.p.y+25, -1, 0); }
        if (keys[39]&& canShoot) {canShoot = false;
            addBullet(game.p.x+25, game.p.y+25, 1, 0); }
        if (keys[38]&& canShoot) {canShoot = false;
            addBullet(game.p.x+25, game.p.y+25, 0, -1); }
        if (keys[40]&& canShoot) {canShoot = false;
            addBullet(game.p.x+25, game.p.y+25, 0, 1); }

        if ((keys[32]) && canShoot){/**Space Bar Shooting */
            canShoot = false;
            addBullet(game.p.x+25, game.p.y-25, 1, 0);
        }

        /** Update Values */
        if (self.x + self.speedX >= 0 && self.x + self.speedX + self.width <= 800) 
            self.x += self.speedX;
        if (self.y + self.speedY >= 0 && self.y + self.speedY + self.height <= 600)
            self.y += self.speedY;

        /** Draw */
        $("#player").css("left",self.x);
        $("#player").css("top",self.y);

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
        if (self.invulnerableFrames > 0)
            return;

        /** Otherwise take damage, draw HealthBox elements */
        if (self.currHealth - dmg < 0) {
            self.currHealth = 0;
        }
        else {
            self.currHealth = self.currHealth - dmg;
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

function enemy(width, height, x, y, dmg, health){
    var self = this;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.moveInc = 2;
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

function bullet(ref, id, x, y, xDir, yDir) {
    var self = this;
    this.ref = ref
    this.id = id;           
    this.x = x;
    this.y = y;
    this.xDir = xDir;
    this.yDir = yDir;
    this.width = 5;
    this.height = 5;

    
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
                        bulletId, x, y, xDir, yDir));
    $(bulletList.get(bulletId).ref).css("left", x);
    $(bulletList.get(bulletId).ref).css("top", y);
    bulletId++;
    
}