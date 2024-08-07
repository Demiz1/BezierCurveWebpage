import { BicycleModel, Signal } from "./MotionModels/MotionModels.js";
import { BezierPoint } from "./Bezier/BezierPoint.js";
import { BezierCurve } from "./Bezier/BezierCurve.js";
import { Car } from "./Car.js";
import { CarKeyboardController } from "./Utils/KeyboardController.js"
import { Position } from "./Position.js";
import { PurePersuite } from "./ControlLaws/PurePersuite.js";
import { NumWithLimit } from "./Utils/NumWithLimit.js";
import { Gague } from "./UI_components/Gague.js";
import { LevelIndicator } from "./UI_components/LevelIndicator.js";

const canvas = document.getElementById('canvas');
canvas.width = 2500;
canvas.height = 1200;
const ctx = canvas.getContext('2d');

/**
 * @type {Function[]} drawFunctions
 */
let drawFunctions = [];

function addDrawFunction(drawFunction) {
  drawFunctions.push(drawFunction);
}

function refreshCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFunctions.forEach(f => { f(); })
}

let carInstance = new Car(ctx, "resources/car.png", new Position(700, 700))
carInstance.setDataChangedCallback(refreshCanvas)
addDrawFunction(function () { carInstance.paint() })

let speed_gauge = new Gague(new NumWithLimit(0,240,0),"speed_gauge")

/** 
 * @type {BezierCurve} bezierCurve
*/
let bezierCurve = new BezierCurve(ctx, 0.55, [
  new BezierPoint(ctx, 599.5323981295926, 862.8650904033381, 5, "red"),
  new BezierPoint(ctx, 1384.4355377421512, 171.90542420027816, 5, "red"),
  new BezierPoint(ctx, 1753.5070140280561, 911.2656467315717, 5, "red"),
  new BezierPoint(ctx, 2401.4696058784234, 68.42837273991655, 5, "red"),
  new BezierPoint(ctx, 100.20040080160321, 166.89847009735743, 5, "red"),
  new BezierPoint(ctx, 599.5323981295926, 862.8650904033381, 5, "red")]);
bezierCurve.setDataChangedCallback(refreshCanvas)
addDrawFunction(function () { bezierCurve.paint() })

let index = 0;
let lookAheadDistance = 200;
let purePersuite = new PurePersuite(ctx,carInstance.getPosition.bind(carInstance), ()=>{
  index=(index+1)%(bezierCurve.getFinalCurvePoints().length)
  return bezierCurve.getFinalCurvePoints()[index]
},lookAheadDistance)

/**
 * @param {BicycleModel} carState 
 * @returns Signal
 */
function runPurePersuit(carState){
  let currentErr = purePersuite.performPurePersuite();
    let currentVelocity = carState.getVelocity().getValue();
    carState.getSteeing().getLowerLimit()
    carState.getSteeing().getUpperLimit()
    let signal = new Signal(0,currentErr.error);
    if(currentVelocity<200){
      signal.acceleration = 10;
    }
    if(currentErr.distance < lookAheadDistance && currentVelocity>1){
      signal.acceleration = -100;
    }
    return signal;
}
addDrawFunction(()=>{purePersuite.paint()})

let steeringLimits = new NumWithLimit(0,Math.PI/6,-Math.PI/6);
let steeingGUI = new LevelIndicator(steeringLimits,"#bar_indicator",(n)=>{return Math.round(n*180/Math.PI)});

/**
 * @param {BicycleModel} newState 
 */
function newStateCallback(newState){
  carInstance.setPosition(newState.getPosition()) 
  speed_gauge.set_gauge_speed(Math.abs(newState.getVelocity().getValue()))
  steeingGUI.setValue(newState.getSteeing().getValue())
  carMotionModel.update(runPurePersuit(newState))
}

let carMotionModel = new BicycleModel(
  new Position(700, 700, 0),
  new NumWithLimit(0,100,-100),
  new NumWithLimit(0,20,-40),
  steeringLimits,
  50,
  0.001,
  newStateCallback
  )
let carcontroller = new CarKeyboardController(carMotionModel)

//kickoff the purepersuite
carMotionModel.update(runPurePersuit(carMotionModel))

document.getElementById('Checkbox1').addEventListener('click', function () {
  bezierCurve.setBezierSetsVisible(document.getElementById('Checkbox1').checked)
});

document.getElementById('ResetBezierCurve').addEventListener("click", function () {
  bezierCurve.resetBezierCurve()
})

canvas.addEventListener('click', function (event) {
  var x = event.offsetX / canvas.offsetWidth * canvas.width;
  var y = event.offsetY / canvas.offsetHeight * canvas.height;
  if (document.getElementById('Checkbox2').checked) {
    carMotionModel.overrideState(new Position(
      x, y, carInstance.getPosition().yaw))
  } else {
    var newAnchor = new BezierPoint(ctx, x, y, 5, "red")
    bezierCurve.addAnchor(newAnchor);
    newAnchor.paint();
  }
});

document.getElementById('progressRange').addEventListener("input", function () {
  let newPosition = new Position(
    carInstance.getPosition().x,
    carInstance.getPosition().y,
    document.getElementById('progressRange').value / 100 * 2 * Math.PI
  );
  carMotionModel.overrideState(newPosition)
}, false);


document.addEventListener('keydown', function (event) {
  carcontroller.keyboardEvent(event, true)
})

document.addEventListener('keyup', function (event) {
  carcontroller.keyboardEvent(event, false)
})

let toggle = true;
document.addEventListener('keyup',function(event){
  if(event.code == "Space"){
    toggle = !toggle;
    toggle ? carMotionModel.startLoop() : carMotionModel.stopLoop();
  }
})
