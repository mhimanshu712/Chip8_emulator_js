import Chip from "./Chip";
import Display from "./Display";
import Keyboard from "./Keyboard";

const display = new Display(document.getElementById('screen'), 15);
const keyboard = new Keyboard();
const chip = new Chip(display, keyboard);
const fps = 60;

let loop, fpsInterval, startTime, now, then, elapsed;

function loadROM(romName) {
    const url = `./roms/${romName}`;

    function step() {
         now = Date.now();
         elapsed = now - then;

         if(elapsed > fpsInterval){
             chip.cycle();
         }

         loop = requestAnimationFrame(step);
    }

    fetch(url).then(res => res.arrayBuffer())
        .then(buffer => {
            const program = new Uint8Array(buffer);
            fpsInterval = 1000/fps;
            then = Date.now();
            startTime = then;
            chip.loadSpritesIntoMemory();
            chip.loadProgramIntoMemory(program);
            loop = requestAnimationFrame(step);
        })
}

//display.test();
loadROM('ibm.ch8')
