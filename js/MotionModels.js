export class BicycleModel{
    /**
     * @param {Number} x initial x position
     * @param {Number} y initial y position
     * @param {Number} v initial speed of the car in m/s
     * @param {Number} yaw initial angle of the car in radians
     */
    constructor(x,y,v,yaw){
      this.x = x
      this.y = y
      this.v = v
      this.yaw = yaw
    }
  
    /**
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
}