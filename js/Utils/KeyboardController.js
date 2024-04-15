import { BicycleModel,Signal } from "../MotionModels/MotionModels.js";
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
      let steering = 0
      let acceleration = 0
      if(this.#hasGet("w")){
        acceleration += 40;
      }
      if(this.#hasGet("s")){
        acceleration -= 40;
      }
      let sign = 1;
      if(acceleration!=0) sign = Math.sign(acceleration)
      if(this.#hasGet("a")){  
        steering -= Math.PI/100*sign;
      }
      if(this.#hasGet("d")){
        steering += Math.PI/100*sign;
      }
      if(acceleration !=0 || steering !=0) this.#CarMotionModel.update(new Signal(acceleration,steering));
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