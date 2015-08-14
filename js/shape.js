var circleShape = new Circularlist("RIGHT_DOWN","LEFT_DOWN","LEFT_UP","RIGHT_UP");
var rectShape = new Circularlist("HORIZONTAL","VERTICAL");
var boundsX;
var boundsY;

//return the type of the tangent as String
function getType(dx,dy) {
	var result;
    if ((Math.abs(dy)/Math.abs(dx))>5){
        result = "VERTICAL";
    } else if ((Math.abs(dx)/Math.abs(dy))>5){
        result = "HORIZONTAL";
    } else if (dx > 0 && dy < 0) {
        result ="RIGHT_DOWN";
    } else if (dx < 0 && dy < 0) {
        result = "LEFT_DOWN";
    } else if (dx < 0 && dy > 0) {
        result = "LEFT_UP";
    } else if (dx > 0 && dy > 0) {
        result = "RIGHT_UP";
    } 
    return result;
}

function isRect(arraypoints){
    var result = false; //we will return result, it is also used as a loop condition
    var stocktype = null; //type of the previous tangent
    var step = 10; //every <step> point
    var curX = clickX[0]; //x value of current point, used to calculate dx
    var curY = clickY[0]; //y value of current point, used to calculate dy
    var index = 0; //index = 0, 1, 2, 3 : bounds iterator
    boundsX = new Circularlist(); //x values of noticeable points: NORTH-EAST, NORTH-WEST, SOUTH-EAST, SOUTH-WEST
    boundsY = new Circularlist();//y values of noticeable points: NORTH-EAST, NORTH-WEST, SOUTH-EAST, SOUTH-WEST
    //loop through the arraypoints while there isn't any result
    for(var i=step;i<arraypoints.length&&!result;i=i+step){
        //calculate dx and dy to find the tangeant type
        var dx = clickX[i]-curX;
        var dy = clickY[i]-curY;
        //not a vertical nor horizontal line
        var curtype = getType(dx,dy); //current type
        console.log(curtype);
        //operate only if we have straight horizontal or vertical lines
        if(curtype =="HORIZONTAL" ||curtype =="VERTICAL"){
            if(stocktype===null){ //init we stock the bounds points
                boundsX.push(curX);
                boundsY.push(curY);
                index++;
            }else{
                if(rectShape.isNear(stocktype,curtype)){ //previous tangent and current tangent are next to each other
                    boundsX.push(curX); //pick up this point because it's where the tangent shift
                    boundsY.push(curY);
                    index++;
                }
            }
            stocktype = curtype; //the current type of tangent become the previous
            curX = clickX[i]; //updating
            curY = clickY[i];

            //if we have 4 types of tangent then it's true
            if (index >= 4) {
                result = true;
            }
        }
    }
    return result;
}
function isSquare(x,y){
    if(((x/y)>0.8)&&((x/y)<1.2)){
        return true;
    }else{
        return false;
    }
}
function isCirc(arraypoints){
    var result = false; //we will return result, it is also used as a loop condition
    var stocktype = null; //type of the previous tangent
    var step = 10; //every <step> point
    var curX = clickX[0]; //x value of current point, used to calculate dx
    var curY = clickY[0]; //y value of current point, used to calculate dy
    var index = 0; //index = 0, 1, 2, 3 : bounds iterator
    boundsX = new Circularlist(); //x values of noticeable points: NORTH, SOUTH, EAST, WEST
    boundsY = new Circularlist();//y values of noticeable points: NORTH, SOUTH, EAST, WEST
    //loop through the arraypoints while there isn't any result
    for(var i=step;i<arraypoints.length&&!result;i=i+step){
        //calculate dx and dy to find the tangeant type
        var dx = clickX[i]-curX;
        var dy = clickY[i]-curY;
        //not a vertical nor horizontal line
        if(!(dx===0 || dy===0)){
            var curtype = getType(dx,dy); //current type

            if(stocktype===null){ //init we stock the bounds points
                boundsX.push(curX);
                boundsY.push(curY);
                index++;
            }else{
                if(circleShape.isNear(stocktype,curtype)){ //previous tangent and current tangent are next to each other
                    boundsX.push(curX); //pick up this point because it's where the tangent shift
                    boundsY.push(curY);
                    index++;
                }
            }
            stocktype = curtype; //the current type of tangent become the previous
            curX = clickX[i]; //updating
            curY = clickY[i];

            //if we have 4 types of tangent then it's true
            if (index >= 4) {
                result = true;
            }
        }
    }
    return result;
}