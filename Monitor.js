const ROWS = 32
const COLS = 64
const SCALE = 15

class Monitor {
    constructor(canvas) {
        this.display = new Array(COLS);
        for(let i=0; i<COLS; i++) this.display[i] = new Array(ROWS);

        this.canvas = canvas;
        this.canvas.width = COLS * SCALE;
        this.canvas.height = ROWS * SCALE;

        this.canvasCtx = this.canvas.getContext('2d');
    }

    setPixel(x, y) {
        x = (x + COLS) % COLS;
        y = (y + ROWS) % ROWS;

        this.display[x][y] ^= 1;

        return !this.display[x][y];
    }

    clear(){
        this.display = new Array(COLS);
        for(let i=0; i<COLS; i++) this.display[i] = new Array(ROWS);
    }

    paint() {
        this.canvasCtx.fillStyle = '#000'
        this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
    }

    test() {

    }
}

export default Monitor