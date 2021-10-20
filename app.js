import Monitor from "./Monitor";
import Chip from "./Chip"

const mon = new Monitor(document.getElementById('screen'));
const chip = new Chip(mon);
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

//mon.test();
loadROM('logo.ch8')
