import { Position } from "../Position.js";

export class BicycleModel{
    /**
     * @param {Position} #position the state
     * @param {Function} #onUpdatedState callback when the state is updated.
     */
    #position;
    #onStateUpdated;
    /**
     * @param {Position} initialPosition 
     * @param {(Position) => void} [onStateUpdated=function(){}] 
     */
    constructor(initialPosition, onStateUpdated = function(updatedState){}){
      this.#position = initialPosition;
      this.#onStateUpdated = onStateUpdated;
    }

    /**
     * 
     * @param {() => void} [callback=function(){}] 
     */
    setOnStateUpdatedFunction(callback){
      this.#onStateUpdated = callback;
    }

    /**
   * @param {Number} turnAmout
   * @param {Number} driveDistance
   */
  drive(driveDistance,turnAmout) {
    let newx = this.#position.x + Math.sin(this.#position.yaw) * driveDistance
    let newy = this.#position.y + -Math.cos(this.#position.yaw) * driveDistance
    let newYaw = this.#position.yaw + turnAmout;
    this.overrideState(new Position(newx, newy, newYaw))
  }

  /**
   * @param {Position} newPosition 
   */
  overrideState(newPosition){
    this.#position = newPosition;
    this.#onStateUpdated(this.#position)
  }
  
    /**
     * @deprecated
     * @param {Number} t timestep in sec (you probably want something low like 0.001)
     * @param {Number} a m/s^2
     * @param {Number} yawRate radians
     */
    step(t,a,yawRate){
      this.v = this.v + a*t
      this.yaw = this.yaw + yawRate*t
      this.x = this.x + this.v * Math.sin(this.yaw) * t
      this.y = this.y + this.v * -Math.cos(this.yaw) * t
    }

    /**
     * @deprecated
     * @param {Number} t timestep in sec (you probably want something low like 0.001)
     * @param {Number} a m/s^2
     * @param {Number} yaw radians
     */
    step(t,a,yaw){
      this.v = this.v + a*t
      this.yaw = yaw
      this.x = this.x + this.v * Math.sin(this.yaw) * t
      this.y = this.y + this.v * -Math.cos(this.yaw) * t
    }

    /**
     * @deprecated
     * @param {Number} t timestep in sec (you probably want something low like 0.001)
     * @param {Number} v m/s
     * @param {Number} yaw radians
     */
    step(t,v,yaw){
      this.v = v
      this.yaw = yaw
      this.x = this.x + this.v * Math.sin(this.yaw) * t
      this.y = this.y + this.v * -Math.cos(this.yaw) * t
    }
}