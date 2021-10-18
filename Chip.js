const MEMORY_SIZE = 4096;
const NUM_REGISTERS = 16;

class Chip {
    constructor(monitor) {
        this.memory = new Uint8Array(MEMORY_SIZE);
        this.v = new Uint8Array(NUM_REGISTERS);

        this.index = 0;
        this.pc = 0x200;
        this.stack = [];
        this.sp = 0;
        this.delayTimer = 0;
        this.soundTimer = 0;

        this.monitor = monitor;

        this.paused = false;
        this.speed = 10;
    }

    interpretInstruction(instruction) {
        this.pc += 2;
        const x = (instruction & 0x0F00) >> 8;
        const y = (instruction & 0x00F0) >> 4;

        switch(instruction & 0xF000) {
            case 0x0000:
                switch(instruction) {
                    case 0x00E0:
                        this.monitor.clear();
                        break;
                     
                    case 0x0EE:
                        this.pc = this.stack.pop();
                }
                break;

            case 0x1000:

            case 0x2000:

            case 0x3000:

            case 0x4000:

            case 0x5000:
        }
    }
}