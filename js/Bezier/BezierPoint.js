export class BezierPoint{
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