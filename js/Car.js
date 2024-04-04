import { BicycleModel, Signal } from "./MotionModels/MotionModels.js";
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
      Math.cos(this.#position.yaw + Math.PI/2),
      Math.sin(this.#position.yaw + Math.PI/2),
      -Math.sin(this.#position.yaw + Math.PI/2),
      Math.cos(this.#position.yaw + Math.PI/2),
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
