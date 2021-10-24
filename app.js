import Chip from "./Chip";
import Display from "./Display";
import Keyboard from "./Keyboard";
import Buzzer from "./Buzzer";
import SpaceInvader from './SpaceInvaders';

let canvas = document.querySelector('.screen');
let optionsButton = document.querySelector('.options-button');
let fileInp = document.querySelector('#fileInp');


let display = new Display(canvas, 10);
let keyboard = new Keyboard();
let buzzer = new Buzzer(440);
let chip = new Chip(display, keyboard, buzzer);
const fps = 60;

let loop, fpsInterval, startTime, now, then, elapsed;


function step() {
    now = Date.now();
    elapsed = now - then;

    if(elapsed > fpsInterval){
        chip.cycle();
    }

    loop = requestAnimationFrame(step);
}

function loadProgram(program){
    fpsInterval = 1000/fps;
    then = Date.now();
    startTime = then;
    chip.loadSpritesIntoMemory();
    chip.loadProgramIntoMemory(program);

    loop = requestAnimationFrame(step);
}

// function loadROM(romName) {
//     const url = `./roms/${romName}`;

//     fetch(url).then(res => res.arrayBuffer())
//         .then(buffer => {
//             const program = new Uint8Array(buffer);
//             loadProgram(program);
//         })
// }

// loadROM('spaceInvaders.ch8');

loadProgram(SpaceInvader)


canvas.addEventListener('click', (evt) => {
    const rect = canvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;

    console.log('x: ' + x + ' y: ' + y);
    console.log(rect)
})

optionsButton.addEventListener('click', (evt) => {
    // canvas.classList.toggle('big-canvas');
    fileInp.click();
})

fileInp.addEventListener('change', () => {
    fileInp.files[0].arrayBuffer()
    .then(buffer => {
        const program = new Uint8Array(buffer);
        chip.paused = true;
        chip.reset();
        display.clear();
        chip.loadProgramIntoMemory(program);
        chip.paused = false;
    })
})
