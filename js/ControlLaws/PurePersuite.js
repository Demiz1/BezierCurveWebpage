import { Position } from "../Position.js";

export class PurePersuite{
    /**
     * @type {Number} #ICR
     * @type {Canvas} #canvas
     */
    #ICR = 300;
    #canvas;
    #enablePainting = true;

    /**
     * @param {canvas} canvas 
     * @param {Function} originGetter
     * @param {Function} targetPoint 
     */
    constructor(canvas,originGetter = function(){},targetPoint = function(){}){
        this.#canvas = canvas;
        this.originGetter = originGetter;
        this.targetPoint = targetPoint;
    }

    performPurePersuite(){
      /**
       * @type {Position} origin
       * @type {Position} targetPoint Yaw will be ignored
       */
      let origin = this.originGetter();
      let targetPoint = this.targetPoint();

      return {
        distance : Math.sqrt((origin.x - targetPoint.x)^2 + (origin.y - targetPoint.y)^2),
        yawToTarget : Math.atan2(targetPoint.y-origin.y,targetPoint.x-origin.x)
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

    restOfPaint(){
        //LookaheadRadie
      let Lradie = 200;
      let circle = new Path2D();
      circle.arc(0, 0, Lradie, 0, 2 * Math.PI);
      this.#canvas.stroke(circle);
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
