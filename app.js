const lineWidth = document.querySelector("#line-width");
const color = document.querySelector("#color");
const colorOptions = Array.from(document.querySelectorAll(".color-option"));
const modeBtn = document.querySelector("#mode-btn");
const destroyBtn = document.querySelector("#destroy-btn");
const eraserBtn = document.querySelector("#eraser-btn");
const fileInput = document.querySelector("#file");
const textInput = document.querySelector("#text");
const saveBtn = document.querySelector("#save");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

//beginPath()                           새로운 경로로 시작
//moveTo(x,y)                           위치 이동
//lineTo(x,y)                           위치에서 부터 선 긋기
//stroke()                              선 보이기
//fill()                                색 채우기
//rect(x,y,w,h)                         사각형 그리기
//strokeRect(x,y,w,h)                   사각형 그리고 선 보이기
//fillRect(x,y,w,h)                     사각형 그리고 색 채우기
//arc(x,y,radius,startAngle,endAngle)   원 그리기

ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round"

let isPainting = false;
let isFilling = false;
let isErasing = false;
let FILLING_COLOR = "white";

function onMove(e) {
    if (isPainting) {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        return;
    }
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

function startPainting() {
    isPainting = true;
}

function canclePainting() {
    isPainting = false;
}

function onCanvasClick() {
    if (isFilling) {
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = color.value;
        ctx.beginPath();
        FILLING_COLOR = color.value;
    }
}

function onLineWidthChange(e) {
    ctx.lineWidth = e.target.value;
}

function onColorChange(e) {
    ctx.strokeStyle = e.target.value;
    ctx.fillStyle = e.target.value;
}

function onColorClick(e) {
    const colorValue = e.target.dataset.color;
    ctx.strokeStyle = colorValue;
    ctx.fillStyle = colorValue;
    color.value = colorValue;

}

function onModeClick() {
    if (isFilling) {
        isFilling = false;
        modeBtn.innerText = "Fill";
    } else {
        isFilling = true;
        modeBtn.innerText = "Draw";
    }
}

function onDestroyClick() {
    isFilling = false;
    isErasing = false;
    FILLING_COLOR = "white";
    modeBtn.innerText = "Fill";
    ctx.strokeStyle = color.value;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onEraserClick() {
    if (isErasing) {
        isErasing = false;
        ctx.strokeStyle = color.value;
    } else {
        isErasing = true;
        ctx.strokeStyle = FILLING_COLOR;
        isFilling = false;
        modeBtn.innerText = "Fill";
    }
}

function onFileChange(e) {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;
    image.onload = function() {
        ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}

function onDoubleClick(e) {
    const text = textInput.value;

    if (text !== "") {
        ctx.save();
        ctx.lineWidth = 1;
        ctx.font = "48px serif";
        ctx.fillText(text, e.offsetX, e.offsetY);
        ctx.restore();        
    }
}

function onSaveClick() {
    const url = canvas.toDataURL();
    const a = document.createElement("a");
    a.href = url;
    a.download = "myDrawing.png";
    a.click();
}

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", canclePainting);
canvas.addEventListener("mouseleave", canclePainting);
canvas.addEventListener("click", onCanvasClick);
canvas.addEventListener("dblclick", onDoubleClick);

lineWidth.addEventListener("change", onLineWidthChange);

color.addEventListener("change", onColorChange);

colorOptions.forEach(color => color.addEventListener("click", onColorClick));

modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);