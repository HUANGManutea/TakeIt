
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
var col = {value: "#f00"}; //allow us to copy easily
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
	
	context.strokeStyle = col;
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

function paintShapes(array){
	for (var i = 0; i < array.length; i++) {
		if(array[i] instanceof Circle){
			paintCircle(array[i].x,array[i].y,array[i].d,array[i].col);
		}else if(array[i] instanceof Rectangle){
			paintRect(array[i].x,array[i].y,array[i].w,array[i].h,array[i].col);
		}
	}
}
//paint a circle with the given parameters
function paintCircle(x,y,d,col){
	context.strokeStyle = col;
	context.beginPath();
	context.arc(x,y,d/2,0*Math.PI,2*Math.PI);
	context.closePath();
	context.stroke();
}
//paint a rectangle with the given parameters
function paintRect(x,y,w,h,col){
	context.strokeStyle = col;
	context.beginPath();
	context.rect(x,y,w,h);
	context.closePath();
	context.stroke();
}

//will return the index values of the points with the x max and y max
function decomposeCircleArray(arrayX , arrayY){
	var maxX= arrayX.get(0);
	var maxY = arrayY.get(0);
	var indexMax= {X : 0 , Y : 0}; //not a point, index values of the points with the x max and y max
	for(var i=0;i<arrayX.length();i++){
		if(arrayX.get(i)>maxX){
			maxX = arrayX.get(i);
			indexMax.X = i;
		}
	}
	for(var j=0;j<arrayY.length();j++){
		if(arrayY.get(j)>maxY){
			maxY = arrayY.get(j);
			indexMax.Y = j;
		}
	}
	return indexMax;
}

//will return the important points NORTH-WEST and SOUTH-EAST
function decomposeRectArray(arrayX , arrayY){
	var mindist = 1000000; //mindistance from origin (0,0)
	var pointNW = {X : 0,Y : 0}; //indexes point NORTH-WEST
	var maxdist = 0; //maxdistance from origin (0,0)
	var pointSE = {X : 0,Y : 0}; //indexes point SOUTH-EAST
	for(var i=0;i<arrayX.length();i++){
		var curdist = Math.sqrt(Math.pow(arrayX.get(i),2)+Math.pow(arrayY.get(i),2));
		if(curdist<mindist){
			pointNW.X = i; //indexes of the NW point
			pointNW.Y = i;
			mindist = curdist;
		}
	}
	for(var i=0;i<arrayX.length();i++){
		var curdist = Math.sqrt(Math.pow(arrayX.get(i),2)+Math.pow(arrayY.get(i),2));
		if(curdist>maxdist){
			pointSE.X = i; //indexes of the SE point
			pointSE.Y = i;
			maxdist = curdist;
		}
	}
	var points = {pSE : pointSE, pNW: pointNW};
	
	return points;
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
	var colo = {value: col.value};
	
	if(isCirc(clickX)){
		var pX=0 ; //p = point from where we draw the circle
		var pY=0 ;
		var diamX = 0; //we will take the biggest
		var diamY = 0;
		var cD=0 ;//diameter of the circle
		var indexMax = decomposeCircleArray(boundsX,boundsY); //we need the location of the max X and the max Y points, so we need their index
		//getting the coordinates
		pX = boundsX.get(indexMax.Y); 
        pY = boundsY.get(indexMax.Y);
        //getting the biggest diameter
        diamX = Math.abs(boundsX.get(indexMax.X) - boundsX.get((indexMax.X)-2));
        diamY = Math.abs(boundsY.get(indexMax.Y) - boundsY.get((indexMax.Y)-2));
        cD = Math.max(diamY,diamX);

        pY = pY - cD/2;//update the y coordinate

        listShapes.push(new Circle(pX,pY,cD,colo));
        clean();
        paintShapes(listShapes);
	}else if(isRect(clickX)){

		var points = decomposeRectArray(boundsX,boundsY); //we need the location of the max X and the max Y points, so we need their index
		var pointNW = {X : points.pNW.X,Y : points.pNW.Y}; //indexes point NORTH-WEST
		var pointSE = {X : points.pSE.X,Y : points.pSE.Y}; //indexes point SOUTH-EAST
		console.log(pointNW);
		console.log(pointSE);
		var height = boundsY.get(pointSE.Y) - boundsY.get(pointNW.Y);
		var width = boundsX.get(pointSE.X) - boundsX.get(pointNW.X);
		if(isSquare(width,height)){
			var cote = Math.max(height,width);
			listShapes.push(new Rectangle(boundsX.get(pointNW.X),boundsY.get(pointNW.Y),cote,cote,colo.value));
		}else{
			listShapes.push(new Rectangle(boundsX.get(pointNW.X),boundsY.get(pointNW.Y),width,height,colo.value));
		}
        clean();
        paintShapes(listShapes);
    }
	
	clickX = [];
	clickY = [];
	clickDrag = [];
});