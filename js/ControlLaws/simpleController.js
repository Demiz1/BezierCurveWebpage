import { BicycleModel, Signal } from "../MotionModels/MotionModels.js"

export class SimpleController {
    /**
     * @param {()=>Signal} #sampleFunction 
     * @param {BicycleModel} #motionModel
     */

    #intervalHandle
    #sampleFunction
    #motionModel
    #enabledLoop
    #loopId

    /**
     * @param {()=>Signal} sampleFunction 
     * @param {BicycleModel} motionModel
     * @param {Boolean} enabledLoop 
     */
    constructor(sampleFunction, motionModel, enabledLoop = false) {
        this.#sampleFunction = sampleFunction;
        this.#motionModel = motionModel;
        this.#enabledLoop = enabledLoop;

        this.#intervalHandle = setInterval(() => {
            if (this.#enabledLoop) {
                this.#spinn()
            }
        }, 10)
    }

    startLoop() {
        if (this.#loopId != NaN) return;
        this.#loopId = requestAnimationFrame(this.spinner)
    }

    stopLoop() {
        if (this.#loopId == NaN) return;
        cancelAnimationFrame(this.#loopId)
        this.#loopId = NaN;
    }

    spinner(t) {
        this.#spinn(t)
        this.#loopId = requestAnimationFrame(this.spinner)
    }

    #spinn() {
        let newSample = this.#sampleFunction()
        this.#motionModel.update(newSample)
    }
    /**
     * @param {Boolean} enabled
    */
    setEnable(enabled) {
        this.#enabledLoop = enabled
    }
}