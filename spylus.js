'use strict';

class Canvas{
    X = null;
    Y = null;
    drawing = false;
    constructor({canvas}){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d", {desynchronized: true});
        canvas.style.touchAction = 'none';
        canvas.addEventListener("pointerup", (e)=>{this.up(e)});
        canvas.addEventListener("pointerdown", (e)=>{this.down(e)});
        canvas.addEventListener("pointermove", (e)=>{this.move(e)});
    }
    move(e){
        if(this.drawing){
            this.ctx.beginPath();
            this.ctx.moveTo(this.X, this.Y);
            this.ctx.lineTo(e.offsetX, e.offsetY);
            this.ctx.lineCap = "round";
            this.ctx.lineWidth = 5;
            if(e.pointerType == "pen"){
                this.ctx.lineWidth *= e.pressure;
            }
            this.ctx.strokeStyle = "black";
            this.ctx.stroke();
            this.X = e.offsetX;
            this.Y = e.offsetY;
        }
    }
    down(e){
        this.X = e.offsetX;
        this.Y = e.offsetY;
        this.drawing = true;
    }
    up(e){
        this.X = null;
        this.Y = null;
        this.drawing = false;
    }
}

let Save = Canvas => class extends Canvas{
    constructor({
        save_button,
        save_input,
    }){
        super(arguments[0]);
        this.save_button = save_button;
        this.save_input = save_input;

        save_button.addEventListener("click", (e)=>{this.save(e)});
    }
    save(e){
        this.save_input.value = this.canvas.toDataURL();
        let event = new Event('change', {bubbles: true});
        this.save_input.dispatchEvent(event);
    };
}

function find_element(xpath, i){
    let results = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    ).snapshotItem(i);
    return results;
};
