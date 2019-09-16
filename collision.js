function checkCollision(x1, y1, w1, h1, x2, y2, w2, h2){
    // Check if it matches in the x plane
    if((x1 <= x2 && x1 + w1 >= x2) || (x2 <= x1 && x2 + w2 >= x1)){
        // Check if it matches in the y plane
        if((y1 <= y2 && y1 + h1 >= y2) || (y2 <= y1 && y2 + h2 >= y1)){
            return true; // Collision has occurred
        }
    }
    return false;
}