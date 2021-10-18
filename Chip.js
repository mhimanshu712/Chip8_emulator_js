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
                // JP addr
                //this.pc = this.stack.pop();
                break;

            case 0x2000:
                // Call addr

                this.stack.push(this.pc);
                this.pc = (instruction & 0xFFF);
                break;

            case 0x3000:
                // Skip Vx, byte
                if(this.v[x] === (instruction & 0xFF))
                    this.pc += 2;
                
                break;

            case 0x4000:
                // Skip
                if(this.v[x] != (instruction & 0xFF))
                    this.pc += 2;
                
                break;

            case 0x5000:
                //Skip if Vx == Vy

                if(this.v[x] === this.v[y])
                    this.pc += 2;
                
                break;

            case 0x6000:
                // Set Vx = kk
                this.v[x] = (instruction & 0xFF);
                break;

            case 0x7000:
                // ADD Vx
                this.v[x] += (instruction & 0xFF);
                break;

            case 0x8000:
                switch(instruction & 0xF){
                    case 0x0:
                        this.v[x] = this.v[y];
                        break;
                    
                    case 0x1:
                        this.v[x] = this.v[x] | this.v[y];
                        break;

                    case 0x2:
                        this.v[x] = this.v[x] & this.v[y];
                        break;

                    case 0x3:
                        this.v[x] = this.v[x] ^ this.v[y];
                        break;
                    
                    case 0x4:
                        let sum = (this.v[x] + this.v[y]);
                        this.v[0xF] = 0;
                        if(sum > 0xFF) this.v[0xF] = 1;
                        this.v[x] = sum;
                        break;

                    case 0x5:
                        if(this.v[x] > this.v[y])
                            this.v[0xF] = 1;
                        else
                            this.v[0xF] = 0;

                        this.v[x] = this.v[x] - this.v[y];
                        break;

                    case 0x6:
                    break;

                    default:
                        throw new Error('Bad Opcode');

                }
                break;

            case 0x9000:
                break;
            
            case 0xA000:
                break;

            case 0xB000:
                break;
            
            case 0xC000:
                break;
        }
    }
}