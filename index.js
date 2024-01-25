import Model from './model.js';
let model;
let doDraw = false;
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const size = document.getElementById('settings').elements['size'].value;
    canvas.width = size;
    canvas.height = size;
    model = new Model();
    const form = document.getElementById('settings');
    form.addEventListener('submit', submitSettings);
    canvas.ondragstart = () => false;
    canvas.onmousedown = mouseDownEventHandler;
});

async function mouseDownEventHandler(event) {
    if(!doDraw) {
        return;
    }
    function onMouseMove(event) {
        model.onMouseDragged(event);
    }
    
    
    canvas.addEventListener('mousemove', onMouseMove);



    canvas.onmouseup = (event) => {
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.onmouseup = undefined;
    };

}

const drawPromise = (framePerSecond) => {
    return new Promise(async (resolve) => {
        const delay = 1000 / framePerSecond;
        while(doDraw) {
            await draw();
            await sleep(delay);
        }
        resolve();
    });
}

let drawThread = undefined;

async function submitSettings(event) {
    event.preventDefault();
    const button = document.getElementById('submitButton');
    if (doDraw) {
        doDraw = false;
        await drawThread;
        model.reset();
        button.innerHTML = 'Start';
    } else {
        const oForm = document.forms['settings'];
        const canvasSize= parseInt(oForm.elements['size'].value,10);
        const sandAmount = parseInt(oForm.elements['amount'].value,10);
        const calculations = parseInt(oForm.elements['speed'].value,10);
        const framePerSecond = parseInt(oForm.elements['framerate'].value,10);
        const canvas = document.getElementById('canvas');
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        model.setup(canvas, sandAmount, calculations)
        doDraw = true;
        button.innerHTML = 'Stop';
        drawThread = drawPromise(framePerSecond);
    }
}
async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, (ms) | 0))
}


async function draw() {
    await model.draw();
}