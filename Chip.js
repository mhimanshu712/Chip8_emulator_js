const MEMORY_SIZE = 4096;
const NUM_REGISTERS = 16;

class Chip {
    constructor(display, keyboard) {
        this.memory = new Uint8Array(MEMORY_SIZE);
        this.v = new Uint8Array(NUM_REGISTERS);

        this.index = 0;
        this.pc = 0x200;
        this.stack = [];
        this.sp = 0;
        this.delayTimer = 0;
        this.soundTimer = 0;

        this.display = display;

        this.paused = false;
        this.speed = 10;
    }

    loadSpritesIntoMemory() {
        // Load default sprites 0-9 into the memory

        const sprites = [
            0xF0, 0x90, 0x90, 0x90, 0xF0,
            0x20, 0x60, 0x20, 0x20, 0x70,
            0xF0, 0x10, 0xF0, 0x80, 0xF0,
            0xF0, 0x10, 0xF0, 0x10, 0xF0,
            0x90, 0x90, 0xF0, 0x10, 0x10,
            0xF0, 0x80, 0xF0, 0x10, 0xF0,
            0xF0, 0x80, 0xF0, 0x90, 0xF0,
            0xF0, 0x10, 0x20, 0x40, 0x40,
            0xF0, 0x90, 0xF0, 0x90, 0xF0,
            0xF0, 0x90, 0xF0, 0x10, 0xF0,
            0xF0, 0x90, 0xF0, 0x90, 0x90,
            0xE0, 0x90, 0xE0, 0x90, 0xE0,
            0xF0, 0x80, 0x80, 0x80, 0xF0,
            0xE0, 0x90, 0x90, 0x90, 0xE0,
            0xF0, 0x80, 0xF0, 0x80, 0xF0,
            0xF0, 0x80, 0xF0, 0x80, 0x80
        ];
        for (let i = 0; i < sprites.length; i++) {
            this.memory[i] = sprites[i];
        }
    }

    loadProgramIntoMemory(program) {
        for(let i=0; i < program.length; i++){
            this.memory[0x200 + i] = program[i];
        }
    }

    updateTimers() {
        if(this.delayTimer > 0)
            this.delayTimer -= 1;

        if(this.soundTimer > 0)
            this.soundTimer -= 1;
    }

    cycle() {
        for(let i=0; i<this.speed; i++){
            if(!this.paused) {
                let opcode = (this.memory[this.pc] << 8 | this.memory[this.pc + 1]);
                this.interpretopcode(opcode);
            }
        }

        if(!this.paused)
            this.updateTimers();

        this.display.render();
    }

    interpretopcode(opcode) {
        this.pc += 2;
        const x = (opcode & 0x0F00) >> 8;
        const y = (opcode & 0x00F0) >> 4;

        switch(opcode & 0xF000) {
            case 0x0000:
                switch(opcode) {
                    case 0x00E0:
                        this.display.clear();
                        break;
                     
                    case 0x00EE:
                        this.pc = this.stack.pop();
                }
                break;

            case 0x1000:
                // JP addr
                this.pc = (opcode & 0xFFF);
                break;

            case 0x2000:
                // Call addr
                this.stack.push(this.pc);
                this.pc = (opcode & 0xFFF);
                break;

            case 0x3000:
                // Skip Vx, byte
                if(this.v[x] === (opcode & 0xFF))
                    this.pc += 2;
                
                break;

            case 0x4000:
                // Skip
                if(this.v[x] !== (opcode & 0xFF))
                    this.pc += 2;
                
                break;

            case 0x5000:
                //Skip if Vx == Vy

                if(this.v[x] === this.v[y])
                    this.pc += 2;
                
                break;

            case 0x6000:
                // Set Vx = kk
                this.v[x] = (opcode & 0xFF);
                break;

            case 0x7000:
                // ADD Vx
                this.v[x] += (opcode & 0xFF);
                break;

            case 0x8000:
                switch(opcode & 0xF){
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
                        this.v[0xF] = (this.v[x] & 0x1);
                        this.v[x] >>= 1;
                    break;

                    case 0x7:
                        this.v[0xF] = 0;

                        if(this.v[y] > this.v[x])
                            this.v[0xF] = 1;

                        this.v[x] = this.v[y] - this.v[x];
                        break;

                    case 0xE:
                        this.v[0xF] = (this.v[x] & 0x80);
                        this.v[x] <<= 1;
                        break;

                    default:
                        throw new Error('Bad 0x8 Opcode');

                }
                break;

            case 0x9000:
                if(this.v[x] != this.v[y])
                    this.pc += 2;
                break;
            
            case 0xA000:
                this.index = (opcode & 0xFFF)
                break;

            case 0xB000:
                this.pc = (opcode & 0xFFF) + this.v[0];
                break;
            
            case 0xC000:
                const rand = Math.floor(Math.random() * 0xFF);
                this.v[x] = rand & (opcode & 0xFF);
                break;

            case 0xD000:
                const width = 8;
                const height = (opcode & 0xF);

                this.v[0xF] = 0;

                for(let row=0; row < height; row++) {
                    let sprite = this.memory[this.index + row];

                    for(let col=0; col < width; col++) {
                        if( (sprite & 0x80) > 0 ) {
                            if(this.display.setPixel(this.v[x] + col, this.v[y] + row))
                                this.v[0xF] = 1;
                        }

                        sprite <<= 1;
                    }
                }
                break;

            case 0xE000:
                switch(opcode & 0xFF) {
                    case 0x9E:
                        if ( this.keyboard.isKeyPressed(this.v[x]) )
                            this.pc += 2;
                        break;

                    case 0xA1:
                        if ( !this.keyboard.isKeyPressed(this.v[x]) )
                            this.pc += 2;
                        break;
                        

                    default:
                        throw new Error('Bad Opcode');
                }
                break;

            case 0xF000:
                switch(opcode & 0xFF) {
                    case 0x07:
                        this.v[x] = this.delayTimer;
                        break;

                    case 0x0A:
                        this.keyboard.onNextKeyPress = function(key) {
                            this.v[x] = key;
                            this.paused = false;
                        }.bind(this);
                        break;

                    case 0x15:
                        this.delayTimer = this.v[x];
                        break;

                    case 0x18:
                        this.soundTimer = this.v[x];
                        break;

                    case 0x1E:
                        this.index += this.v[x];
                        break;

                    case 0x29:
                        this.index = this.v[x] * 5;
                        break;

                    case 0x33:
                        this.memory[this.index] = parseInt(this.v[x] / 100);
                        this.memory[this.index + 1] = parseInt((this.v[x] % 100) /10);
                        this.memory[this.index + 2] = parseInt(this.v[x] % 10);
                        break;

                    case 0x55:
                        for(let i=0; i<=x; i++)
                            this.memory[this.index + i] = this.v[i];
                        break;

                    case 0x65:
                        for(let i=0; i<=x; i++)
                            this.v[i] = this.memory[this.index + i];
                        break;

                    default:
                        throw new Error('BAD OPCODE');
                }
            break;
        }
    }
}

export default Chip;