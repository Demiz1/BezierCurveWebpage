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
   * @param {Boolean} w
   * @param {Boolean} a
   * @param {Boolean} s
   * @param {Boolean} d
   */
  w = false;
  a = false;
  s = false;
  d = false;
  
  constructor(carInstance) {
    this.carInstance = carInstance;
  }

  /**
   * @param {KeyboardEvent} event 
   */
  keyboardEvent(event){
    let turn = 0
    let drive = 0

    console.log(event.key)
  
    if(event.key.includes("w")){
      drive += 10;
    }
    if(event.key.includes("a")){
      turn -= Math.PI/70;
    }
    if(event.key.includes("s")){
      drive -= 10;
    }
    if(event.key.includes("d")){
      turn += Math.PI/70;
    }
    this.drive(turn,drive)
  }

  /**
   * @param {Number} turnAmout
   * @param {Number} driveDistance
   */
  drive(turnAmout, driveDistance) {
    let newx = this.carInstance.getPosition().x + Math.sin(this.carInstance.getPosition().yaw) * driveDistance
    let newy = this.carInstance.getPosition().y + -Math.cos(this.carInstance.getPosition().yaw) * driveDistance
    let newYaw = this.carInstance.getPosition().yaw + turnAmout;
    this.carInstance.setPosition(new Position(newx, newy, newYaw))
  }
}