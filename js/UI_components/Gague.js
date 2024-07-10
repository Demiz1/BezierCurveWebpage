import { NumWithLimit } from "../Utils/NumWithLimit.js";

export class Gague{
    
    
    /**
     * @type {NumWithLimit} #value
     * @type {Number} #gagueCurveAngle
     * @type {HTMLElement} #gagueContainerDiv
     * @type {HTMLElement} #gagueNeedle
     * @type {HTMLElement} #gagueValueReadout
     */
    #value 
    #gagueCurveAngle = 240;
    #gagueContainerDiv
    #gagueNeedle
    #gagueValueReadout

    /** 
     * @param {NumWithLimit} limits
     * @param {String} gagueId 
     */
    constructor(limits=NumWithLimit(0,0,240),gagueId){
        this.#value = limits;
        this.#gagueContainerDiv = document.getElementById(gagueId)
        if(this.#gagueContainerDiv == null) throw new Error(`Could not find the gague container div. Searched for ${gagueId}`)
        this.#gagueNeedle = this.#gagueContainerDiv.querySelector(`#needle`)
        if(this.#gagueContainerDiv == null) throw new Error(`Could not find the gague needle div. Searched for "needle" inside the container ${gagueId}`)
        this.#gagueValueReadout = this.#gagueContainerDiv.querySelector(`#valueReadout`)
        
        this.#build_speed_gauge();
        this.set_gauge_speed(this.#value.getValue())
    }

    #build_speed_gauge(){
        let speed_markers = ["│", "╵", "╹", "╵"];

        let marker_count = (this.#value.getUpperLimit() / 5) + 1; //+1 for the last marker

        let angle_between_markers = this.#gagueCurveAngle / (marker_count - 1); //-1 because we're back to the space between markers
        let angle_offset = this.#gagueCurveAngle / -2;

        for(let m_index = 0; m_index < marker_count; m_index++){

            /* MARKER */
                let marker = document.createElement('p');
                marker.classList.add("marker");
                marker.innerHTML = speed_markers[m_index % 4];
                marker.style.transform = "translateX(-50%) rotate("+ (angle_offset + angle_between_markers * m_index) +"deg)";
                this.#gagueContainerDiv.appendChild(marker);
            /*----*/

            /* LABEL each major marker */
                if(!(m_index % 4)){
                    let label_wrapper = document.createElement('div'); //wrapper to rotate around gauge axis

                    let label = document.createElement('p'); //inner label to rotate back around label axis
                    label.innerHTML = m_index * 5;
                    label.style.transform = "rotate("+ (angle_offset + angle_between_markers * m_index) * -1 +"deg)";
                    label_wrapper.appendChild(label);

                    label_wrapper.classList.add("label_wrapper");
                    label_wrapper.style.transform = "translateX(-50%) rotate("+ (angle_offset + angle_between_markers * m_index) +"deg)";
                    this.#gagueContainerDiv.appendChild(label_wrapper);
                }
            /*----*/
        }
    }

    /**
     * @param {Number} speed 
     */
    set_gauge_speed(speed){
        this.#gagueNeedle.style.transform = "translateX(-50%) rotate("+ ((speed/this.#value.getUpperLimit()-1/2) * this.#gagueCurveAngle) +"deg)";
        this.#gagueValueReadout.innerHTML =`${Math.round(speed * 100)/100}`
    }
}