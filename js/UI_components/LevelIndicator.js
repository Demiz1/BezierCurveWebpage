import { NumWithLimit } from "../Utils/NumWithLimit.js";

export class LevelIndicator{

    /**
     * @type {NumWithLimit} #value
     * @type {HTMLElement} #levelId
     */

    #value 
    #levelId

    /** 
     * @param {NumWithLimit} value
     * @param {String} levelId
     * @param {(Number)=>(Number)} numberFormatting
     */
    constructor(value=NumWithLimit(50,100,0),levelId, numberFormatting=function(num){return num}){
        this.#value = value;
        this.#levelId = levelId
        document.querySelector(`${this.#levelId} #left_value`).textContent = `${numberFormatting(this.#value.getLowerLimit())}`;
        document.querySelector(`${this.#levelId} #middle_value`).textContent = `${numberFormatting((this.#value.getLowerLimit()+this.#value.getUpperLimit())/2)}`;
        document.querySelector(`${this.#levelId} #right_value`).textContent = `${numberFormatting(this.#value.getUpperLimit())}`;
    }

    /**
     * @param {Number} value 
     */
    setValue(value){
        this.#value.setValue(value);
        document.querySelector(`${this.#levelId} #main_bar #marker`).style.left = `${((this.#value.getValue()-this.#value.getLowerLimit())/(this.#value.getUpperLimit()-this.#value.getLowerLimit()))*100}%`;
    }

}