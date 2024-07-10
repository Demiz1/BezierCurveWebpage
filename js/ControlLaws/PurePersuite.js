import { Position } from "../Position.js";

export class PurePersuite{
    /**
     * @type {Number} #ICR
     * @type {HTMLCanvasElement} #canvas
     */
    #ICR = 300;
    #canvas;
    #enablePainting = true;
    origin = new Position(0,0,0)
    targetPoint = new Position(1,1,2)
    #originGetter;
    #targetPoint;

    /**
     * @param {canvas} canvas 
     * @param {()=>Position} originGetter
     * @param {()=>Position} targetPoint 
     */
    constructor(canvas,originGetter = function(){},targetPoint = function(){}){
      this.#canvas = canvas;
      this.#originGetter = originGetter;
      this.#targetPoint = targetPoint;
    }

    performPurePersuite(){
      /**
       * @type {Position} origin
       * @type {Position} targetPoint Yaw will be ignored
       */
      this.origin = this.#originGetter();
      this.targetPoint = this.#targetPoint();

      return {
        distance : Math.sqrt(Math.pow(this.origin.x - this.targetPoint.x,2) + Math.pow(this.origin.y - this.targetPoint.y,2)),
        yawToTarget : Math.atan2(this.targetPoint.y-this.origin.y,this.targetPoint.x-this.origin.x) - this.origin.yaw
      }
    }
    
    nextTarget(){
      return {x:1,y:2}
    }

    /**
     * @returns {Position}
     */
    getError(){
      return new Position(50,50,Math.PI/3)
    }

    paint(){
      if(!this.#enablePainting) return;

      let oldStrokeStyle = this.#canvas.strokeStyle;
      let oldFillStyle = this.#canvas.fillStyle;

      let currentSolution = this.performPurePersuite();

      //set transform of the origin point.
      this.#canvas.setTransform(
        Math.cos(this.origin.yaw),
        Math.sin(this.origin.yaw),
        -Math.sin(this.origin.yaw),
        Math.cos(this.origin.yaw),
        this.origin.x,
        this.origin.y
      );
      this.#canvas.moveTo(0,0);

      //origin
      let originPaint = new Path2D();
      this.#canvas.fillStyle = 'green';
      originPaint.arc(0,0,20,0,2*Math.PI);
      this.#canvas.stroke(originPaint)

      //LookaheadRadie
      let Lradie = 200;
      let circle = new Path2D();
      this.#canvas.strokeStyle = 'blue'
      circle.arc(0, 0, Lradie, 0, 2 * Math.PI);
      this.#canvas.stroke(circle);

      this.#canvas.moveTo(0,-Lradie/2);
      this.#canvas.lineTo(0,Lradie/2);
      this.#canvas.stroke();
      this.#canvas.moveTo(0,0);

      let relativeX = currentSolution.distance * Math.cos(currentSolution.yawToTarget);
      let relativeY = currentSolution.distance * Math.sin(currentSolution.yawToTarget);
      this.#canvas.lineTo(relativeX,relativeY);
      this.#canvas.stroke();

      //target
      let targetPaint = new Path2D();
      this.#canvas.fillStyle = 'yellow';
      targetPaint.arc(relativeX,relativeY,20,0,2*Math.PI)
      this.#canvas.stroke(targetPaint);
      
      this.#canvas.resetTransform();
      this.#canvas.fillStyle = oldFillStyle;
      this.#canvas.strokeStyle = oldStrokeStyle;
    }

    restOfPaint(){
      
      // R point
      circle = new Path2D();
      this.#canvas.fillStyle = 'yellow';
      circle.arc(this.#ICR, 0, 20, 0, 2 * Math.PI);
      this.#canvas.fill(circle);
      // R baseLine
      this.#canvas.beginPath(); // Start a new path
      this.#canvas.moveTo(0, 0); // Move the pen to (30, 50)
      this.#canvas.lineTo(this.#ICR, 0); // Draw a line to (150, 100)
      this.#canvas.stroke();
      // R AngleAnchor
      this.#canvas.beginPath(); // Start a new path
      this.#canvas.moveTo(0, 0); // Move the pen to (30, 50)
      this.#canvas.lineTo(this.#ICR, 0); // Draw a line to (150, 100)
      this.#canvas.stroke();
      // R value
      
      // Turn Arc
      let circle2 = new Path2D();
      let arcRadian = 2*Math.asin(Lradie/2/Math.abs(this.#ICR))
      let turnAngle = Math.PI/2 - (Math.PI - arcRadian)/2
      if(this.#ICR>0){
        circle2.arc(this.#ICR, 0, Math.abs(this.#ICR), Math.PI,Math.PI+arcRadian);
      }else{
        circle2.arc(this.#ICR, 0, Math.abs(this.#ICR), -arcRadian, 0);
      }
      let oldStyle = this.canvas.strokeStyle
      this.#canvas.strokeStyle = 'red';
      this.#canvas.stroke(circle2);
      this.#canvas.strokeStyle = oldStyle;
      this.#canvas.font = "30px serif";
      this.#canvas.strokeText("TurnAngle:" + Math.round(turnAngle/Math.PI*180), -100, 60)
    }
}
