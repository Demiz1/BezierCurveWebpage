import { BezierSet } from "./BezierSet.js";
import { BezierPoint } from "./BezierPoint.js";

export class BezierCurve{

    /**
     * @type {BezierPoint[]} bezierPointSet
     * @type {BezierPoint[]} anchorPoints the parent-points
     * @type {boolean} subsetVisible
     * @type {Function} dataChangedCallback
     * @type {canvas} canvas the canvas to paint on
     */
    #bezierPointSet = [];
    #subsetVisible = false;
    #finalLinePositions = [];
    #dataChangedCallback = function(){}
    #canvas;
    #anchorPoints = [];


    /**
     * @constructor
     * @param {canvas} canvas the canvas to paint on
     * @param {Number} p the progress-percentage the bezier curve has
     * @param {BezierPoint[]} anchorPoints the parent-points
     * 
     */
    constructor(canvas, p = 0.33, anchorPoints = []){
        this.#canvas = canvas;
        this.p = p;
        this.#anchorPoints = anchorPoints;
        //create curve
        this.createFinalCurveTrajectory();
    }

    setDataChangedCallback(callback){
      this.#dataChangedCallback = callback;
    }

    async createFinalCurveTrajectory(){
        const original_curvePercentage = this.p;
        if(this.#anchorPoints.length<2) return;

        // this should not be a constant. It should increase the progress untill a distance threashold, and only then save the new set.
        const pointsResolution = 20
        let newCurvePoints = [];
        let array = [];
        for(let i=0;i<pointsResolution;i++){
          this.#createBezierSets(i/pointsResolution,array);
          newCurvePoints[i]={x: array[array.length-1].points[0].x, y: array[array.length-1].points[0].y};
        }
        this.#bezierPointSet = array;
        this.#finalLinePositions.length = newCurvePoints.length;
        this.#finalLinePositions = newCurvePoints;
        this.p = original_curvePercentage;
        this.#dataChangedCallback();
    }

    #createBezierSets(percentage, array){
        array.push(new BezierSet(this.#canvas,this.#anchorPoints,percentage,5,"red"));
        // while the last bezierSet have two or more points
        while (array[array.length-1].points.length>1) {
          array.push(new BezierSet(this.#canvas,array[array.length-1].points,percentage,5,"red"));
        }
      }

    /**
     * @param {boolean} visible
     */
    setBezierSetsVisible(visible){
        this.#subsetVisible = visible
    }

    resetBezierCurve(){
        this.#anchorPoints.length = 0;
        this.#bezierPointSet.length = 0;
        this.#dataChangedCallback();
      }

    /**
     * @deprecated
     */
    updateBezierWithNewP(p){
        this.p = p
    }

    getFinalCurvePoints(){
      return this.#finalLinePositions;
    }

    
    addAnchor(newAnchor){
      this.#anchorPoints.push(newAnchor);
      this.createFinalCurveTrajectory();
    }

    paint(){
        if(this.#anchorPoints.length<2) return;

        const original_LineWidth = this.#canvas.lineWidth;
        this.#canvas.lineWidth = 5;
        if(this.#finalLinePositions.length!=0){
            this.#canvas.beginPath();
            this.#canvas.moveTo(this.#finalLinePositions[0].x,this.#finalLinePositions[0].y);
            this.#finalLinePositions.forEach(element =>{
                this.#canvas.lineTo(element.x,element.y);
            });
            this.#canvas.stroke();
        }
        this.#canvas.lineWidth = original_LineWidth;
      
        this.#anchorPoints.forEach(element => {
          element.paint();
        });
        if(this.#subsetVisible){
          this.#bezierPointSet.forEach(set => {
            set.paint();
          });
        }
    }
}
    