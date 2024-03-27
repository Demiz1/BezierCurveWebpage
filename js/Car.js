import { BicycleModel } from "./MotionModels/MotionModels.js";
import { Position } from "./Position.js";
export class Car {
  /**
   * @type {Position} position of the car
   * @type {Function} dataChangedCallback
   */
  #position = new Position(0, 0, 0);
  #dataChangedCallback = function () { }

  /**
   * @param {canvas} canvas the canvas to paint on
   * @param {String} imagePath
   */
  constructor(canvas, imagePath, initialPosition = Position(0, 0, 0)) {

    this.canvas = canvas;
    this.base_image = new Image();
    this.base_image.src = imagePath;
    this.#position = initialPosition;

    this.base_image.onload = () => {
      this.#dataChangedCallback()
    }
  }

  /**
   * @param {Function} callback
   */
  setDataChangedCallback(callback) {
    this.#dataChangedCallback = callback;
  }

  /**
   * 
   * @returns {Position}
   */
  getPosition() {
    return this.#position;
  }

  /**
   * update the position of the car
   * @param {Position} newPos 
   */
  setPosition(newPos) {
    this.#position = newPos
    this.#dataChangedCallback()
  }

  paint() {
    this.canvas.setTransform(
      Math.cos(this.#position.yaw),
      Math.sin(this.#position.yaw),
      -Math.sin(this.#position.yaw),
      Math.cos(this.#position.yaw),
      this.#position.x,
      this.#position.y
    );
    this.paintCar()
    this.canvas.resetTransform();
  }

  paintCar() {
    let scaleFactor = 0.1;
    this.canvas.drawImage(
      this.base_image,
      -this.base_image.width * scaleFactor / 2,
      -this.base_image.height * scaleFactor * 0.90,
      (this.base_image.width * scaleFactor),
      (this.base_image.height * scaleFactor)
    )

  }
}

export class CarKeyboardController {

  /**
   * @param {Map} #keyStatus
   * @param {BicycleModel} #CarMotionModel
   * @param {Number} #intervalHandle
   */
  
  #keyStatus = new Map();
  #CarMotionModel;
  #intervalHandle;
  
  /**
   * @param {BicycleModel} CarMotionModel 
   */
  constructor(CarMotionModel) {
    this.#CarMotionModel = CarMotionModel;
    this.#intervalHandle = setInterval(()=>this.#triggerKeyboardMove(),10)
  }

  #triggerKeyboardMove(){
    let turn = 0
    let drive = 0
    if(this.#hasGet("w")){
      drive += 10;
    }
    if(this.#hasGet("s")){
      drive -= 10;
    }
    if(this.#hasGet("a")){
      turn -= Math.PI/30*Math.sign(drive);
    }
    if(this.#hasGet("d")){
      turn += Math.PI/30*Math.sign(drive);
    }
    this.#CarMotionModel.drive(drive,turn);
  }

  /**
   * @param {KeyboardEvent} event 
   * @param {Boolean} state
   */
  keyboardEvent(event,state){
    this.#keyStatus.set(event.key,state)
  }

  /**
   * @param {String} char key character.
   * @returns {boolean} If this button is currently pressed
   */
  #hasGet(char){
    return this.#keyStatus.has(char) && this.#keyStatus.get(char);
  }
}