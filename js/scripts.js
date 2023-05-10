const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const slider = document.getElementById('progressRange')
const checkboxDOM = document.getElementById('subsetVisibilityEnabled')


canvas.width = 2000;
canvas.height = 1000;
canvas.style.width = "100%";
canvas.style.height = "50%";

slider.addEventListener("input", function() {
  curvePercentage = slider.value;
  bezierSets.length = 0;
  refreshCanvas();
}, false);

checkboxDOM.addEventListener('click',function(){
  subsetVisibilityEnabled=checkboxDOM.checked
});

/**
 * @type {bezierPoint[]} anchorPoints
 * @type {bezierSet[]} bezierSets
 * @type {Number} curvePercentage
 */
const anchorPoints = [];
const bezierSets = [];
let curvePercentage = 0.30;
let finalLinePositions = [];
let subsetVisibilityEnabled = true;

/*
// Create circle
const circle = new Path2D();
circle.arc(700, 505, 15, 0, 2 * Math.PI);
ctx.fillStyle = 'red';
ctx.fill(circle);

ctx.beginPath(); // Start a new path
ctx.moveTo(30, 50); // Move the pen to (30, 50)
ctx.lineTo(150, 100); // Draw a line to (150, 100)
ctx.stroke(); // Render the path
*/

function createBezierSets(percentage, array){
  array.push(new bezierSet(ctx,anchorPoints,percentage,5,"red"));
  // while the last bezierSet have two or more points
  while (array[array.length-1].points.length>1) {
    array.push(new bezierSet(ctx,array[array.length-1].points,percentage,5,"red"));
  }
}

function createFinalCurveTrajectory(){
  finalLinePositions.length = 0;
  const original_curvePercentage = curvePercentage;
  if(anchorPoints.length<2) return;
  const pointsResolution = 1000
  for(let i=0;i<pointsResolution;i++){
    let array = [];
    createBezierSets(i/pointsResolution,array);
    finalLinePositions[i]={x: array[array.length-1].points[0].x, y: array[array.length-1].points[0].y};
  }
  curvePercentage = original_curvePercentage;
}

function removeBezierPoints(){
  anchorPoints.length = 0;
  bezierSets.length = 0;
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

function paintBezierCurve(){
  const original_LineWidth = ctx.lineWidth;
  ctx.lineWidth = 5;
  if(finalLinePositions.length!=0){
    ctx.beginPath();
    ctx.moveTo(finalLinePositions[0].x,finalLinePositions[0].y);
    finalLinePositions.forEach(element =>{
      ctx.lineTo(element.x,element.y);
    });
    ctx.stroke();
  }
  ctx.lineWidth = original_LineWidth;
  

  anchorPoints.forEach(element => {
    element.paint();
  });
  if(subsetVisibilityEnabled){
    bezierSets.forEach(set => {
      set.paint();
    });
  }

  bezierSets[bezierSets.length-1].points.forEach(finalPoint =>{
    let circle = new Path2D();
    circle.arc(finalPoint.x, finalPoint.y, 15, 0, 2 * Math.PI);
    ctx.fillStyle = 'green';
    ctx.fill(circle);
  });
}

function refreshCanvas(){
  if(anchorPoints.length<2) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  createBezierSets(curvePercentage, bezierSets);
  paintBezierCurve();
}


canvas.addEventListener('click', function(event) {
  var x = event.offsetX/canvas.offsetWidth * canvas.width;
  var y = event.offsetY/canvas.offsetHeight * canvas.height;
  var new_circle = new bezierPoint(ctx,x,y,5,"red")
  anchorPoints.push(new_circle);
  new_circle.paint();
  createFinalCurveTrajectory();
});

class bezierPoint{
  /**
   * Creates an instance of Circle.
   *
   * @author: Gustav L
   * @constructor
   * @param {canvas} canvas The canvas this bezier point is mounted on.
   * @param {Number} x
   * @param {Number} y
   * @param {Number} r
   * @param {String} colour
   */
   constructor(canvas, x,y,r, colour){
      this.canvas = canvas;
      this.x = x;
      this.y = y;
      this.r = r;
      this.circle = new Path2D();
      this.circle.arc(x,y,r,0,2*Math.PI);
      this.colour = colour;
   }
   /**
    * paints the path into the canvas.
    * 
    * @author: Gustav L
    */
   paint(){
    var old_fillstyle = this.canvas.fillStyle;
    this.canvas.fillStyle = this.canvas.fillStyle = this.colour;
    this.canvas.fill(this.circle);
    this.canvas.fillStyle = old_fillstyle;
   }
}

/**
 * A bezierSet creates the lines connecting the parent points, and creates 
 * a set of points (n parentpoints -1)
 * 
 * @author Gustav Lindström
 */
class bezierSet{
  /**
   * @type {bezierPoint[]} childPoints
   */
  points = [];
  /**
   * @param {canvas} canvas the canvas to paint on
   * @param {bezierPoint[]} ParentBezierPintSet the parent-points
   * @param {Number} p the progress-percentage the bezier curve has
   * @param {Number} pointRadius
   * @param {String} pointColour
   */
  constructor(canvas,ParentBezierPintSet,p,pointRadius,pointColour){
    this.canvas = canvas;
    this.ParentBezierPintSet = ParentBezierPintSet;
    this.p = p;
    this.pointRadius = pointRadius;
    this.pointColour = pointColour;

    //create this objects points
    if(ParentBezierPintSet.length<2) return;
    for(let i=1;i<ParentBezierPintSet.length;i++){
      //take this and the previouse point, find midpoint, and create a bezierPoint.
      //push this to points
      let prevP = ParentBezierPintSet[i-1];
      let thisP = ParentBezierPintSet[i];
      let x = prevP.x*(1-this.p) + thisP.x*this.p;
      let y = prevP.y*(1-this.p) + thisP.y*this.p;
      let newPoint = new bezierPoint(this.canvas,x,y,this.pointRadius,this.pointColour);
      this.points.push(newPoint);
    }
  }

  /**
   * Paints the connecting lines between the parentPoints, and 
   * paints this sets points
   */
  paint(){
    //paint the lines connecting the parent points
    this.canvas.beginPath();
    this.canvas.moveTo(this.ParentBezierPintSet[0].x,this.ParentBezierPintSet[0].y);
    this.ParentBezierPintSet.forEach(parentPoint=>{
      this.canvas.lineTo(parentPoint.x,parentPoint.y);
    });
    this.canvas.stroke();
    //paint this objects points.
    this.points.forEach(childPoint=>{
      childPoint.paint();
    });
  }
}