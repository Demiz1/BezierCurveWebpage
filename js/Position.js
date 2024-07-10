  /**
   * A simple position data class with open variables.
   */
  export class Position{
    /**
     * @type {Number} x x-position
     * @type {Number} y y-position
     * @type {Number} yaw yaw-rotation in radiands
     */
    x = 0;
    y = 0;
    yaw = 0;
    /**
     * 
     * @param {Number} x
     * @param {Number} y 
     * @param {Number} yaw 
     */
    constructor(x,y,yaw=0){
      this.x = x;
      this.y = y;
      this.yaw = yaw
    }


    /**
     * 
     * @param {Position} compare 
     * @returns Boolean
     */
    equals(compare){
      if(this.x == compare.x && this.y == compare.y && this.yaw == this.yaw){
        return true
      } else{
        return false
      }
    }
}