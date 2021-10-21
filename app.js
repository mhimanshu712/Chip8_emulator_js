import Chip from "./Chip";
import Display from "./Display";
import Keyboard from "./Keyboard";
import Buzzer from "./Buzzer";

let display = new Display(document.querySelector("#screen"), 10);
let keyboard = new Keyboard();
let buzzer = new Buzzer(440);
let chip = new Chip(display, keyboard, buzzer);
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

loadROM('spaceInvaders.ch8')
