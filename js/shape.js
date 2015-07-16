var circleShape = {
	RIGHT_DOWN:"RIGHT_DOWN", 
	LEFT_DOWN:"LEFT_DOWN", 
	LEFT_UP:"LEFT_UP",
	RIGHT_UP:"RIGHT_UP"
};
var boundsX;
var boundsY;
function getType(dx,dy) {
	var result;
    if (dx > 0 && dy < 0) {
        result = circleShape.RIGHT_DOWN;
    } else if (dx < 0 && dy < 0) {
        result = circleShape.LEFT_DOWN;
    } else if (dx < 0 && dy > 0) {
        result = circleShape.LEFT_UP;
    } else if (dx > 0 && dy > 0) {
        result = circleShape.RIGHT_UP;
    }
    return result;
}

function isCircle(points) {
    var result = false;
    var shape = new Array(circleShape.RIGHT_DOWN,circleShape.LEFT_DOWN,circleShape.LEFT_UP,circleShape.RIGHT_UP);
    var detected = new Array();
    boundsX = new Array();
    boundsY = new Array();
    var step = 5;

    var index = 0;       
    var currentX = clickX[0];
    var currentY = clickY[0];
    var type = null;

    for (var i = step; i < points.length; i += step) {
        var dx = clickX[i] - currentX;
        var dy = -(clickY[i] - currentY);

        if(dx == 0 || dy == 0) {
        	continue;
        }

        var newType = getType(dx, dy);
        if(type == null || type != newType) {
            if(newType != shape[index]) {
                break;
            }
            boundsX[index] = currentX;
            boundsY[index] = currentY;
            detected[index++] = newType;
        }
        type = newType;            
        currentX = clickX[i];
        currentY = clickY[i];

        if (index >= shape.length) {
            result = true;
            break;
        }
    }

    return result;
}