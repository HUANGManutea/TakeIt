
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

var cX=0 ;
var cY=0 ;
var cD=0 ;
var indexMaxY = 0;
var indexMaxX = 0;

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
	
	context.strokeStyle = "#df4b26";
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

function paintCircle(){
	context.beginPath();
	context.arc(cX,cY,cD/2,0*Math.PI,2*Math.PI);
	context.closePath();
	context.stroke();
}

function decomposeArray(arrayX , arrayY){
	var maxX= arrayX[0];
	var maxY = arrayY[0];
	indexMaxY = 0;
	indexMaxX = 0;
	for(var i=1;i<arrayX.length;i++){
		if(arrayX[i]>maxX){
			maxX = arrayX[i];
			indexMaxX = i;
		}
	}
	for(var j=1;j<arrayY.length;j++){
		if(arrayY[j]>maxY){
			maxY = arrayY[j];
			indexMaxY = j;
		}
	}

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
	if(isCirc(clickX)){
		cX = boundsX.get(indexMaxY);
        cY = boundsY.get(indexMaxX);
        cD = boundsX.get(indexMaxY) - boundsX.get(indexMaxY-2);
		//cX = boundsX[0] + Math.abs((boundsX[2] - boundsX[0])/2);
        //cY = boundsY[0];
        //cD = boundsY[2] - boundsY[0];
        cY = cY + cD/2;
        clean();
        paintCircle();
	}
	
	clickX = [];
	clickY = [];
	clickDrag = [];
});