export class Car{

    /**
     * @param {canvas} canvas the canvas to paint on
     * @param {bicycleMotionModel} motionModel 
     * @param {String} imagePath
     */
    constructor(canvas,motionModel,imagePath){
    
      this.canvas = canvas;
      this.motionModel = motionModel;
      this.base_image = new Image();
      this.base_image.src = imagePath;
      this.x = function() {return this.motionModel.x}
      this.y = function() {return this.motionModel.y}
      this.yaw = function() {return this.motionModel.yaw}
    }

    /**
     * @param {Function} callback
     */
    onImageLoadComplete(callback){
        this.base_image.onload = () => {
            callback()
          }
    }
  
    carStep(...args){
      this.motionModel.step(...args)
    }
  
    paint(){
      this.canvas.setTransform(Math.cos(this.yaw()),Math.sin(this.yaw()),-Math.sin(this.yaw()),Math.cos(this.yaw()),this.x(),this.y());
      this.paintCar()
      this.canvas.resetTransform();
    }
  
    paintCar(){
      let scaleFactor = 0.1;
      this.canvas.drawImage(
        this.base_image,
        -this.base_image.width*scaleFactor/2,
        -this.base_image.height*scaleFactor*0.90,
        (this.base_image.width*scaleFactor),
        (this.base_image.height*scaleFactor)
      )
      
    }

    restOfPaint(){
        //LookaheadRadie
      let Lradie = 200;
      let circle = new Path2D();
      circle.arc(0, 0, Lradie, 0, 2 * Math.PI);
      this.canvas.stroke(circle);
      // R point
      //let ICR = -300;
      circle = new Path2D();
      this.canvas.fillStyle = 'yellow';
      circle.arc(ICR, 0, 20, 0, 2 * Math.PI);
      this.canvas.fill(circle);
      // R baseLine
      this.canvas.beginPath(); // Start a new path
      this.canvas.moveTo(0, 0); // Move the pen to (30, 50)
      this.canvas.lineTo(ICR, 0); // Draw a line to (150, 100)
      this.canvas.stroke();
      // R AngleAnchor
      this.canvas.beginPath(); // Start a new path
      this.canvas.moveTo(0, 0); // Move the pen to (30, 50)
      this.canvas.lineTo(ICR, 0); // Draw a line to (150, 100)
      this.canvas.stroke();
      // R value
      
      // Turn Arc
      let circle2 = new Path2D();
      let arcRadian = 2*Math.asin(Lradie/2/Math.abs(ICR))
      let turnAngle = Math.PI/2 - (Math.PI - arcRadian)/2
      if(ICR>0){
        circle2.arc(ICR, 0, Math.abs(ICR), Math.PI,Math.PI+arcRadian);
      }else{
        circle2.arc(ICR, 0, Math.abs(ICR), -arcRadian, 0);
      }
      let oldStyle = this.canvas.strokeStyle
      this.canvas.strokeStyle = 'red';
      this.canvas.stroke(circle2);
      this.canvas.strokeStyle = oldStyle;
      this.canvas.font = "30px serif";
      this.canvas.strokeText("TurnAngle:" + Math.round(turnAngle/Math.PI*180), -100, 60)
    }
  }