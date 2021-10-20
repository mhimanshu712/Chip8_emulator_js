
class Display {
    constructor(canvas,scale) {
        this.rows = 32;
        this.cols = 64;
        this.scale = scale;
        this.display = new Array(this.cols);
        for(let i=0; i<this.cols; i++) this.display[i] = new Array(this.rows);

        this.canvas = canvas;
        this.canvas.width = this.cols * this.scale;
        this.canvas.height = this.rows * this.scale;

        this.canvasCtx = this.canvas.getContext('2d');
    }

    setPixel(x, y) {
        x = (x + this.cols) % this.cols;
        y = (y + this.rows) % this.rows;

        this.display[x][y] ^= 1;

        return !this.display[x][y];
    }

    clear(){
        this.display = new Array(this.cols);
        for(let i=0; i<this.cols; i++) this.display[i] = new Array(this.rows);
    }

    render() {
        this.canvasCtx.fillStyle = '#000'
        this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        
        for(let i=0; i < this.cols; i++){
            for(let j=0; j < this.rows; j++){
                let x = i * this.scale;
                let y = j * this.scale;

                if(this.display[i][j] === 1){
                    this.canvasCtx.fillStyle = '#fff';
                    this.canvasCtx.fillRect(x, y, this.scale, this.scale);
                    
                }
            }
        }
    }

    test() {
        this.setPixel(0,0);
        this.setPixel(30,33);
        this.render();
    }
}

export default Display;