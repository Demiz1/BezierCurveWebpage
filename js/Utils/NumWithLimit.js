export class NumWithLimit{
  /**
   * @param {Number} #num
   * @param {Number} #upperLimit
   * @param {Number} #lowerLimit
   */
  #num;
  #upperLimit;
  #lowerLimit;
  /**
   * @param {Number} initialValue 
   * @param {Number} upperLimit 
   * @param {Number} lowerLimit 
   */
  constructor(initialValue = 0, upperLimit = 0,lowerLimit=0){
    if(!(upperLimit>=lowerLimit)){
      throw new Error("upper limit not >= than lower limit")
    }
    this.#upperLimit = upperLimit;
    this.#lowerLimit = lowerLimit;
    this.setValue(initialValue)
  }

  /**
   * @param {Number} newValue 
   */
  setValue(newValue){
    this.#num = Math.min(Math.max(newValue,this.#lowerLimit),this.#upperLimit);
  }

  /**
   * @returns Number
   */
  getValue(){return this.#num}
}