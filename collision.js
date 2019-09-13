function checkCollision(x1, y1, w1, h1, x2, y2, w2, h2){
    // Check if x is within x
    var collision = false;
    if(x2 >= x1 && x2 <= x1 + w1 ){
        if(y2 >= y1 && y2 <= y1 + h1){
            collision = true;
        }
    }
    if(x1 >= x2 && x1 <= x2 + w2 ){
        if(y1 >= y2 && y1 <= y2 + h2){
            collision = true;
        }
    }
    return collision;
}