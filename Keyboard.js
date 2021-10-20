class Keyboard {
    constructor() {

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
}