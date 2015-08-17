var canvasDiv = document.getElementById('canvasDiv');

var width = 700;
var height = 500;

var svg = SVG('canvasDiv').size(width, height).attr({id: 'svg', class: 'svg'});
var groupShapes = svg.group().attr({id: 'group', class: 'group'});
var canvas = document.createElement('canvas');
canvas.setAttribute('width', width);
canvas.setAttribute('height', height);
canvas.setAttribute('id', 'canvas');
canvas.setAttribute('class', 'canvas');

var foreign = svg.foreignObject(width,height).attr({id: 'foreign', class: 'foreign'});
foreign.appendChild(canvas);

svg.add(foreign);
context = canvas.getContext("2d");

var listShapes = [];
clickX = [];
clickY = [];
clickDrag = [];
var paint;
var col = {value: "#f00"}; //allow us to copy easily
var d = $('#svg').offset();


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

  context.clearRect(0, 0, canvas.width, canvas.height);
  console.log("hi");
}

function paintShapes(array){
  for (var i = 0; i < array.length; i++) {
    if(array[i] instanceof Rectangle){
      paintRect(array[i].x,array[i].y,array[i].w,array[i].h,array[i].col);
    }
  }
}

//paint a rectangle with the given parameters
function paintRect(x,y,w,h,col){
  var rect = svg.rect(w, h);
  rect.x(x);
  rect.y(y);
  rect.stroke({ color: col, opacity: 1, width: 5 })
  var group = svg.group();
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
  addClick(e.pageX-d.left, e.pageY-(d.top/2));
  redraw();
});

$('#canvas').mousemove(function(e){
  //document.getElementById("text").innerHTML=""+(e.pageX - d.left)+" "+(e.pageY - d.top);
  if(paint){
    addClick(e.pageX - d.left, e.pageY - (d.top/2), true);
    redraw();
  }
});

$('#canvas').mouseup(function(e){
  paint=false;
  var colo = {value: col.value};
  /*
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
        paintShapes(listShapes);}*/
  if(isRect(clickX)){

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