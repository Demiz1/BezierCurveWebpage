import { Position } from "../Position.js";

export class PurePersuite{
    /**
     * @type {Number} #ICR
     * @type {HTMLCanvasElement} #canvas
     */
    #canvas;
    #enablePainting = true;
    #originGetter;
    #origin;
    #targetPointGetter
    #targetPoint;
    #lookAheadDistance;
    #yawToTarget = 0;
    #error = 0;

    /**
     * @param {canvas} canvas 
     * @param {()=>Position} originGetter
     * @param {()=>Position} targetPointGetter
     */
    constructor(canvas,originGetter = function(){},targetPointGetter = function(){},lookAheadDistance=100){
      this.#canvas = canvas;
      this.#originGetter = originGetter;
      this.#targetPointGetter = targetPointGetter;
      this.#targetPoint = this.#targetPointGetter();
      this.#lookAheadDistance = lookAheadDistance;
    }

    performPurePersuite(){
      /**
       * @type {Position} origin
       * @type {Position} targetPoint Yaw will be ignored
       */
      this.#origin = this.#originGetter();
      let distance = Math.sqrt(Math.pow(this.#origin.x - this.#targetPoint.x,2) + Math.pow(this.#origin.y - this.#targetPoint.y,2))

      this.#yawToTarget =  Math.atan2(this.#targetPoint.y-this.#origin.y,this.#targetPoint.x-this.#origin.x) - this.#origin.yaw;
      let error_temp = -(Math.atan2((this.#targetPoint.y-this.#origin.y),(this.#targetPoint.x-this.#origin.x)) - this.#origin.yaw)
      error_temp = error_temp % (2*Math.PI)
      error_temp = error_temp>Math.PI ? -2*Math.PI+error_temp : error_temp
      error_temp = error_temp<-Math.PI ? 2*Math.PI+error_temp : error_temp

      this.#error = error_temp
      //this.#yawToTarget = Math.atan2(this.#targetPoint.y-this.#origin.y,this.#targetPoint.x-this.#origin.x) - this.#origin.yaw

      if(distance<this.#lookAheadDistance){
        //get next point.
        this.#targetPoint=this.#targetPointGetter();
      }
      return {
        distance : distance,
        yawToTarget : this.#yawToTarget,
        error : this.#error
      }
    }
    
    nextTarget(){
      return {x:1,y:2}
    }

    paint(){
      if(!this.#enablePainting) return;

      let oldStrokeStyle = this.#canvas.strokeStyle;
      let oldFillStyle = this.#canvas.fillStyle;

      let currentSolution = this.performPurePersuite();

      //set transform of the origin point.
      this.#canvas.setTransform(
        Math.cos(this.#origin.yaw),
        Math.sin(this.#origin.yaw),
        -Math.sin(this.#origin.yaw),
        Math.cos(this.#origin.yaw),
        this.#origin.x,
        this.#origin.y
      );
      this.#canvas.moveTo(0,0);

      //origin
      let originPaint = new Path2D();
      this.#canvas.fillStyle = 'green';
      originPaint.arc(0,0,20,0,2*Math.PI);
      this.#canvas.stroke(originPaint)

      //LookaheadRadie
      let circle = new Path2D();
      this.#canvas.strokeStyle = 'blue'
      circle.arc(0, 0, this.#lookAheadDistance, 0, 2 * Math.PI);
      this.#canvas.stroke(circle);

      //Error
      let errorArch = new Path2D();
      this.#canvas.strokeStyle = 'orange'
      errorArch.arc(0,0,this.#lookAheadDistance * 2/3,0, -this.#error,this.#error<0?false:true);
      this.#canvas.stroke(errorArch);

      //horisontal line
      this.#canvas.strokeStyle = 'blue'
      this.#canvas.moveTo(0,-this.#lookAheadDistance/2);
      this.#canvas.lineTo(0,this.#lookAheadDistance/2);
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
}
