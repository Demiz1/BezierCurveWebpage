import { BezierPoint } from "./BezierPoint.js";
/**
 * A BezierSet creates the lines connecting the parent points, and creates 
 * a set of points (n parentpoints -1)
 * 
 * @author Gustav Lindström
 */
export class BezierSet{
    /**
     * @type {BezierPoint[]} childPoints
     */
    points = [];
    /**
     * @param {canvas} canvas the canvas to paint on
     * @param {BezierPoint[]} ParentBezierPintSet the parent-points
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
        let newPoint = new BezierPoint(this.canvas,x,y,this.pointRadius,this.pointColour);
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