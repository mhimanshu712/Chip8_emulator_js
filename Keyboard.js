class Keyboard {
    constructor() {
        this.keymap = {
            49: 0x1, // 1
            50: 0x2, // 2
            51: 0x3, // 3
            52: 0xc, // 4
            65: 0x4, // Q 81 a
            87: 0x5, // W 87
            68: 0x6, // E 69 d
            82: 0xD, // R
            81: 0x7, // A 65 q
            83: 0x8, // S
            69: 0x9, // D 68 e
            70: 0xE, // F
            90: 0xA, // Z
            88: 0x0, // X
            67: 0xB, // C
            86: 0xF  // V
        }

        this.keysPressed = [];
        this.onNextKeyPress = null;

        window.addEventListener('keydown', this.onKeyDown.bind(this), false);
        window.addEventListener('keyup', this.onKeyUp.bind(this), false);
        
    }

    isKeyPressed(keyCode) {
        return this.keysPressed[keyCode];
    }

    onKeyDown(event) {
        let key = this.keymap[event.which];
        this.keysPressed[key] = true;

        if(this.onNextKeyPress !== null && key) {
            this.onNextKeyPress(parseInt(key));
            this.onNextKeyPress = null;
        }
    }

    onKeyUp(event) {
        let key = this.keymap[event.which];
        this.keysPressed[key] = false;
    }
}

export default Keyboard;