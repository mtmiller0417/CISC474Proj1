/* Global Vars */
keys = [];
bulletList = [];
var game = undefined;
bulletId = 0;
numBulletsRemoved = 0;
bulletSpeed = 2;
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
    var tmp;
    var tmp2 = bulletId;
    for (var i = 0; i < tmp2-numBulletsRemoved; i++){
        tmp = numBulletsRemoved;
        console.log(i + " "+tmp+" "+numBulletsRemoved);
        updateBullet(bulletList[i]);
        if (numBulletsRemoved > tmp) 
        console.log(i + " "+tmp+" "+numBulletsRemoved);
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
            console.log("#bullet"+b.id);
            $("#bullet"+b.id).remove();
            bulletList.splice(b.id-numBulletsRemoved, 1);
            numBulletsRemoved++;
        
        } 

    }else {
        console.log("#bullet"+b.id);
        $("#bullet"+b.id).remove();
        bulletList.splice(b.id-numBulletsRemoved, 1);
        numBulletsRemoved++;
    
    }
}

function addBullet(x, y, xDir, yDir) {
    console.log("<div class='bullet' id= 'bullet"+bulletId+"'></div>");
    bulletList[bulletId-numBulletsRemoved]= new bullet ($("<div class='bullet' id= 'bullet"+bulletId+"'></div>").appendTo('#gameScreen'),
                        bulletId, x, y, xDir, yDir);
    $(bulletList[bulletId-numBulletsRemoved].ref).css("left", x);
    $(bulletList[bulletId-numBulletsRemoved].ref).css("top", y);
    bulletId++;
}