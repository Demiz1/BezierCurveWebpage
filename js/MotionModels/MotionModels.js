import { Position } from "../Position.js";
import { NumWithLimit } from "../Utils/NumWithLimit.js";

export class Signal {
  /**
   * @param {Number} acceleration
   * @param {Number} steeringAngle
   */
  acceleration
  steeringAngle

  /**
   * 
   * @param {Number} acceleration in m/s
   * @param {Number} steeringAngle in radians
   */
  constructor(acceleration, steeringAngle) {
    this.acceleration = acceleration
    this.steeringAngle = steeringAngle
  }
}

export class BicycleModel {
  /**
   * @param {Position} #position the state
   * @param {NumWithLimit} #velocity
   * @param {NumWithLimit} #steering
   * @param {Number} #wheelBase
   * @param {Function} #onUpdatedState callback when the state is updated.
   * @param {Number} #loopId
   * 
   */
  #position;
  #velocity;
  #acceleration;
  #steering;
  #wheelBase;
  #onStateUpdated;
  #timeStamp;
  #loopId = null;
  /**
   * @param {Position} initialPosition 
   * @param {(Position) => void} [onStateUpdated=function(){}] 
   * @param {NumWithLimit} velocity 
   * @param {NumWithLimit} steering 
   * @param {NumWithLimit} acceleration 
   * @param {Number} wheelBase 
   */
  constructor(initialPosition, velocity, acceleration, steering, wheelBase, onStateUpdated = function (updatedState) { }) {
    this.#position = initialPosition;
    this.#velocity = velocity;
    this.#acceleration = acceleration
    this.#wheelBase = wheelBase
    this.#steering = steering
    this.#onStateUpdated = onStateUpdated;
    this.startLoop();
  }

  startLoop(){
    if(this.#loopId != null) return;
    this.#loopId = requestAnimationFrame(this.spinner.bind(this))
  }

  stopLoop(){
    if(this.#loopId == null) return;
    cancelAnimationFrame(this.#loopId)
    this.#loopId = NaN;
  }

  spinner(t){
    this.#step(t)
    this.#loopId = requestAnimationFrame(this.spinner.bind(this))
  }

  /**
   * 
   * @param {() => void} [callback=function(){}] 
   */
  setOnStateUpdatedFunction(callback) {
    this.#onStateUpdated = callback;
  }

  /**
 * @param {Signal} input
 */
  update(input) {
    this.#steering.setValue(this.#steering.getValue() + input.steeringAngle)
    this.#acceleration.setValue(this.#acceleration.getValue() + input.acceleration)
  }

  /**
   * 
   * @param {DOMHighResTimeStamp} timeStamp 
   */
  #step(timeStamp) {
    if((timeStamp - this.#timeStamp)<200){
      let delta = (timeStamp - this.#timeStamp) /1000;
      let newX = this.#position.x + this.#velocity.getValue() * Math.cos(this.#position.yaw) * delta;
      let newY = this.#position.y + this.#velocity.getValue() * Math.sin(this.#position.yaw) * delta;
      let newAngle = this.#position.yaw + this.#velocity.getValue() * Math.tan(this.#steering.getValue()) / this.#wheelBase * delta;
      let newV = this.#velocity.getValue() + this.#acceleration.getValue() * delta
      
      let np = new Position(newX, newY,newAngle)
      if (!this.#position.equals(np)) this.overrideState(np)
      this.#velocity.setValue(newV)

      //Make velocity slowly aproach zero. Same for acceleration
      
    }
    this.#timeStamp = timeStamp;
  }

  /**
   * @param {Position} newPosition 
   */
  overrideState(newPosition) {
    this.#position = newPosition;
    this.#onStateUpdated(this.#position)
  }
}