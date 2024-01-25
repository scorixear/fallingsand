export default class Model {
    constructor() {
        this.defaultColor = [0, 0, 0];
    }
    reset() {}
    setup(canvas, amount, calculations) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.calculations = calculations;
        this.amount = amount;
        this.grid = [...Array(this.width)].map(_ => Array(this.height).fill(0));
        this.hueValue = 200;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = `rgb(${this.defaultColor[0]}, ${this.defaultColor[1]}, ${this.defaultColor[2]})`;
        ctx.fillRect(0, 0, this.width, this.height);
    }

    withinCols(x) {
        return x >= 0 && x < this.width;
    }

    withinRows(y) {
        return y >= 0 && y < this.height;
    }

    async onMouseDragged(event) {
        const x = event.offsetX;
        const y = event.offsetY;
        let extent = Math.floor(this.amount / 2);
        for(let i = -extent; i <= extent; i++) {
            for(let j = -extent; j <= extent; j++) {
                if (this.withinCols(x+i) && this.withinRows(y+j)) {
                    this.grid[x+i][y+j] = this.hueValue;
                }
            }
        }

        this.hueValue += 1;
        if (this.hueValue > 360) {
            this.hueValue = 0;
        }
    }

    async simulate() {
        let nextGrid = [...Array(this.width)].map(_ => Array(this.height).fill(0));
        
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height;y++) {
                let state = this.grid[x][y];
                if (state > 0) {
                    let below = this.grid[x][y + 1];
                    let dir = 1;
                    if (Math.random() < 0.5) {
                        dir = -1;
                    }

                    let belowA = -1;
                    let belowB = -1;
                    if (this.withinCols(x+dir)) {
                        belowA = this.grid[x+dir][y+1];
                    }
                    if (this.withinCols(x-dir)) {
                        belowB = this.grid[x-dir][y+1];
                    }
                    if (below === 0) {
                        nextGrid[x][y+1] = state;
                    } else if (belowA === 0) {
                        nextGrid[x+dir][y+1] = state;
                    } else if (belowB === 0) {
                        nextGrid[x-dir][y+1] = state;
                    } else {
                        nextGrid[x][y] = state;
                    }
                }
            }
        }

        this.grid = nextGrid;
    }

    async render() {
        const ctx = this.canvas.getContext("2d");
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let color = this.defaultColor;
                if (this.grid[x][y] > 0) { 
                    color = [this.grid[x][y], 100, 50];
                }
                ctx.fillStyle = `HSL(${color[0]}, ${color[1]}%, ${color[2]}%)`;
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }

    async draw() {
        await this.render();
        for (let i = 0; i < this.calculations; i++) {
            await this.simulate();
        }
    }
}