import { BicycleModel } from "./MotionModels/MotionModels.js";
import { BezierPoint } from "./Bezier/BezierPoint.js";
import { BezierCurve } from "./Bezier/BezierCurve.js";
import { Car, CarKeyboardController } from "./Car.js";
import { Position } from "./Position.js";

const canvas = document.getElementById('canvas');
canvas.width = 2500;
canvas.height = 1200;
const ctx = canvas.getContext('2d');

/**
 * @type {Function[]} drawFunctions
 */
let drawFunctions = [];

function addDrawFunction(drawFunction){
  drawFunctions.push(drawFunction);
}

function refreshCanvas(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawFunctions.forEach(f=>{f();})
}

//new BicycleModel(700,700,11,Math.PI/180 * 45)
let carInstance = new Car(ctx,"resources/car.png", new Position(700,700,Math.PI/180 * 45))
carInstance.setDataChangedCallback(refreshCanvas)
addDrawFunction(function(){carInstance.paint()})

/** 
 * @type {BezierCurve} bezierCurve
*/
let bezierCurve = new BezierCurve(ctx,0.33,[
new BezierPoint(ctx,599.5323981295926,862.8650904033381,5,"red"),
new BezierPoint(ctx,1384.4355377421512,171.90542420027816,5,"red"),
new BezierPoint(ctx,1753.5070140280561,911.2656467315717,5,"red"),
new BezierPoint(ctx,2401.4696058784234,68.42837273991655,5,"red"),
new BezierPoint(ctx,100.20040080160321,166.89847009735743,5,"red"),
new BezierPoint(ctx,599.5323981295926,862.8650904033381,5,"red")]);
bezierCurve.setDataChangedCallback(refreshCanvas)
addDrawFunction(function(){bezierCurve.paint()})

document.getElementById('Checkbox1').addEventListener('click',function(){
  bezierCurve.setBezierSetsVisible(document.getElementById('Checkbox1').checked)
});

document.getElementById('ResetBezierCurve').addEventListener("click",function(){
  bezierCurve.resetBezierCurve()
})

canvas.addEventListener('click', function(event) {
  var x = event.offsetX/canvas.offsetWidth * canvas.width;
  var y = event.offsetY/canvas.offsetHeight * canvas.height;
  if(document.getElementById('Checkbox2').checked){
    carInstance.setPosition(new Position(
      x,y,carInstance.getPosition().yaw))
  }else{
    var newAnchor = new BezierPoint(ctx,x,y,5,"red")
    bezierCurve.addAnchor(newAnchor);
    newAnchor.paint();
  }
});

document.getElementById('progressRange').addEventListener("input", function() {
  let newPosition = new Position(
    carInstance.getPosition().x,
    carInstance.getPosition().y,
    document.getElementById('progressRange').value/100 * 2*Math.PI
    );
  carInstance.setPosition(newPosition)
}, false);

let carcontroller = new CarKeyboardController(carInstance)
document.addEventListener('keypress',function(event){
carcontroller.keyboardEvent(event)
})