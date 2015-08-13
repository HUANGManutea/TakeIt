
/*------------------------------------------------------------------\
|																	|
|																	|
|						INITIALIZE THE CANVAS						|
|																	|
|																	|
--------------------------------------------------------------------*/
var canvasDiv = document.getElementById('canvasDiv');
canvas = document.createElement('canvas');
var canvasWidth = 700;
var canvasHeight = 500;
canvas.setAttribute('width', canvasWidth);
canvas.setAttribute('height', canvasHeight);
canvas.setAttribute('id', 'canvas');
canvas.setAttribute('class', 'canvas');
canvasDiv.appendChild(canvas);

if(typeof G_vmlCanvasManager != 'undefined') {
	canvas = G_vmlCanvasManager.initElement(canvas);
}
context = canvas.getContext("2d");

var listShapes = [];
clickX = [];
clickY = [];
clickDrag = [];
var paint;

/*------------------------------------------------------------------\
|																	|
|																	|
|						DRAW FUNCTIONS								|
|																	|
|																	|
--------------------------------------------------------------------*/


function addClick(x,y,dragging){
	clickX.push(x);
	clickY.push(y);
	clickDrag.push(dragging);
}

function redraw(){
	
	context.strokeStyle = "#008080";
	context.lineJoin = "round";
	context.lineWidth = 5;

	i = clickX.length;
	if(i===0){
		context.beginPath();
	}else{
		if(clickDrag[i-1] && i-1){
			context.moveTo(clickX[i-2], clickY[i-2]);
		}else{
		context.moveTo(clickX[i-1]-1, clickY[i-1]);
		}
		context.lineTo(clickX[i-1], clickY[i-1]);
		context.closePath();
		context.stroke();
	}
}

function clean(){
	context.clearRect(0,0,canvasWidth,canvasHeight);
}

function paintCircles(array){
	for (var i = 0; i < array.length; i++) {
		if(array[i] instanceof Circle){
			paintCircle(array[i].x,array[i].y,array[i].d);
		}else if(array[i] instanceof Rectangle){
			paintRect(array[i].x,array[i].y,array[i].w,array[i].h);
		}
	}
}

function paintCircle(x,y,d){
	context.beginPath();
	context.arc(x,y,d/2,0*Math.PI,2*Math.PI);
	context.closePath();
	context.stroke();
}
function paintRect(x,y,w,h){
	context.beginPath();
	context.rect(x,y,w,h);
	context.closePath();
	context.stroke();
}

function decomposeArray(arrayX , arrayY){
	var maxX= arrayX.get(0);
	var maxY = arrayY.get(0);
	var indexMax= {X : 0 , Y : 0}; //not a point, index values of the points with the x max and y max
	for(var i=1;i<arrayX.length();i++){
		if(arrayX.get(i)>maxX){
			maxX = arrayX.get(i);
			indexMax.X = i;
		}
	}
	for(var j=1;j<arrayY.length();j++){
		if(arrayY.get(j)>maxY){
			maxY = arrayY.get(j);
			indexMax.Y = j;
		}
	}
	return indexMax;
}

//listeners
$('#canvas').mousedown(function(e){
	paint = true;
	addClick(e.pageX-this.offsetLeft, e.pageY-this.offsetTop);
	redraw();
});

$('#canvas').mousemove(function(e){
	//document.getElementById("text").innerHTML=""+(e.pageX - this.offsetLeft)+" "+(e.pageY - this.offsetTop);
	if(paint){
		addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
		redraw();
	}
});

$('#canvas').mouseup(function(e){
	paint=false;
	if(isRect(clickX)){
		var indexMax = decomposeArray(boundsX,boundsY); //we need the location of the max X and the max Y points, so we need their index

	}
	if(isCirc(clickX)){
		var cX=0 ; //c = point from where we draw the circle
		var cY=0 ;
		var diamX = 0; //we will take the biggest
		var diamY = 0;
		var cD=0 ;//diameter of the circle
		var indexMax = decomposeArray(boundsX,boundsY); //we need the location of the max X and the max Y points, so we need their index
		cX = boundsX.get(indexMax.Y);
        cY = boundsY.get(indexMax.Y);
        diamX = Math.abs(boundsX.get(indexMax.X) - boundsX.get((indexMax.X)-2));
        diamY = Math.abs(boundsY.get(indexMax.Y) - boundsY.get((indexMax.Y)-2));
        cD = Math.max(diamY,diamX);
        cY = cY - cD/2;
        listShapes.push(new Circle(cX,cY,cD));
        clean();
        paintCircles(listShapes);
	}
	
	clickX = [];
	clickY = [];
	clickDrag = [];
});