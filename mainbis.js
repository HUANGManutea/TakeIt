
/*------------------------------------------------------------------\
|																	|
|																	|
|						INITIALIZE THE svg						|
|																	|
|																	|
--------------------------------------------------------------------*/
var svgDiv = document.getElementById('svgDiv');
var svg = SVG('svgDiv').size(svgWidth,svgHeight);
svg.setAttribute('id', 'svg');
svg.setAttribute('class', 'svg');

var nested = draw.nested();

var cX=0 ; //c = point from where we draw the circle
var cY=0 ;
var diamX = 0; //we will take the biggest
var diamY = 0;
var cD=0 ;//diameter of the circle
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
	context.clearRect(0,0,svgWidth,svgHeight);
}

function paintCircle(){
	context.beginPath();
	context.arc(cX,cY,cD/2,0*Math.PI,2*Math.PI);
	context.closePath();
	context.stroke();
}

function decomposeArray(arrayX , arrayY){
	var maxX= arrayX.get(0);
	var maxY = arrayY.get(0);
	indexMaxY = 0;
	indexMaxX = 0;
	for(var i=1;i<arrayX.length();i++){
		if(arrayX.get(i)>maxX){
			maxX = arrayX.get(i);
			indexMaxX = i;
		}
	}
	for(var j=1;j<arrayY.length();j++){
		if(arrayY.get(j)>maxY){
			maxY = arrayY.get(j);
			indexMaxY = j;
		}
	}

}

//listeners
$('#svg').mousedown(function(e){
	paint = true;
	addClick(e.pageX-this.offsetLeft, e.pageY-this.offsetTop);
	redraw();
});

$('#svg').mousemove(function(e){
	//document.getElementById("text").innerHTML=""+(e.pageX - this.offsetLeft)+" "+(e.pageY - this.offsetTop);
	if(paint){
		addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
		redraw();
	}
});

$('#svg').mouseup(function(e){
	paint=false;
	if(isCirc(clickX)){
		decomposeArray(boundsX,boundsY);
		cX = boundsX.get(indexMaxY);
        cY = boundsY.get(indexMaxY);
        diamX = Math.abs(boundsX.get(indexMaxX) - boundsX.get(indexMaxX-2));
        diamY = Math.abs(boundsY.get(indexMaxY) - boundsY.get(indexMaxY-2));
        cD = Math.max(diamY,diamX);
        cY = cY - cD/2;
        paintCircle();
	}
	
	clickX = [];
	clickY = [];
	clickDrag = [];
});