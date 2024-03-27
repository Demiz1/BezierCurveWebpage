import { Car } from "../Car.js"

export class simpleController{
    /**
     * @param {Function} #sampleFunction 
     * @param {Function} #limitFunction 
     * @param {SimpleCarMotion} #motionModel
     * @param {Car} #carInstance
     */

    #intervalHandle
    #sampleFunction
    #limitFunction
    #motionModel
    #enabledLoop
    #carInstance

    /**
     * @param {Function} sampleFunction 
     * @param {Function} limitFunction 
     * @param {SimpleCarMotion} motionModel
     * @param {Boolean} enabledLoop 
     */
    constructor(sampleFunction, limitFunction, motionModel, enabledLoop = false, carInstance){
        this.#sampleFunction = sampleFunction;
        this.#limitFunction = limitFunction;
        this.#motionModel = motionModel;
        this.#enabledLoop = enabledLoop;
        this.#carInstance = carInstance;

        this.#intervalHandle = setInterval(()=>{this.#spinn()})
    }
    #spinn(){
        let newSample = this.#sampleFunction()
        let controlSignal = this.#limitFunction()
        this.#motionModel.update(limitedSample)
        this.#carInstance.setPosition(this.#motionModel.getPosition())
    }
    /**
     * @param {Boolean} enabled
    */
    setEnable(enabled){
        this.#enabledLoop = enabled
    }
}