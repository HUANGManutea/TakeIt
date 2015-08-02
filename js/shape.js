var circleShape = new Circularlist("RIGHT_DOWN","LEFT_DOWN","LEFT_UP","RIGHT_UP");
var boundsX;
var boundsY;

//return String
function getType(dx,dy) {
	var result;
    if (dx > 0 && dy < 0) {
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

function isCircle(points) {
    var result = false;
    var shape = new Circularlist("RIGHT_DOWN","LEFT_DOWN","LEFT_UP","RIGHT_UP");
    var detected = [];
    boundsX = [];
    boundsY = [];
    var step = 5;

    var index = 0;
    var currentX = clickX[0];
    var currentY = clickY[0];
    var type = null;

    for (var i = step; i < points.length; i += step) {
        var dx = clickX[i] - currentX;
        var dy = -(clickY[i] - currentY);

        if(dx === 0 || dy === 0) {
            continue;
        }

        var newType = getType(dx, dy);
        if(type === null || type != newType){
            if(!circleShape.isNear(type,newType)) {
                break;
            }
            boundsX[index] = currentX;
            boundsY[index] = currentY;
            detected[index++] = newType;
        }
        type = newType;
        currentX = clickX[i];
        currentY = clickY[i];

        if (index >= shape.length()) {
            result = true;
            break;
        }
    }

    return result;
}

function isCirc(arraypoints){
    var result = false;
    var stocktype = null;
    var step = 10;
    var curX = clickX[0];
    var curY = clickY[0];
    var index = 0; //index = 0, 1, 2, 3 
    boundsX = new Circularlist();
    boundsY = new Circularlist();
    for(var i=step;i<arraypoints.length&&!result;i=i+step){

        var dx = clickX[i]-curX;
        var dy = clickY[i]-curY;

        if(!(dx===0 || dy===0)){

            var curtype = getType(dx,dy);

            if(stocktype===null){ //init we stock
                boundsX.push(curX);
                boundsY.push(curY);
                index++;
            }else{
                if(circleShape.isNear(stocktype,curtype)){ //near form so stock
                    boundsX.push(curX);
                    boundsY.push(curY);
                    index++;
                }
            }
            stocktype = curtype;
            curX = clickX[i];
            curY = clickY[i];

            if (index >= 4) {
                result = true;
            }
        }
    }
    return result;
}