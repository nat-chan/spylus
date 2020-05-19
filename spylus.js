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

let Paste = Canvas => class extends Canvas{
    constructor({
        paste_button,
    }){
        super(arguments[0]);
        this.paste_button = paste_button;

        paste_button.addEventListener("click", (e)=>{this.paste(e)});
    }
    paste(e){
        read_clipboard(b=>{
            let img = new Image();
            img.onload = () => {
                this.ctx.drawImage(img,0,0);
            };
            img.src = b;
        })
    }
    read_clipboard(f){
        navigator.clipboard.read()
        .then(clipboardItems => {
            const clipboardItem = clipboardItems[0];
            let type = clipboardItem.types[0]
            if (type == "image/png"){
                clipboardItem.getType(type)
                .then(blob => {
                    var reader = new FileReader();
                    reader.onload = function(event){
                        f(event.target.result)
                    };
                    var source = reader.readAsDataURL(blob);
                })
                .catch(err => {
                    console.error('blob error', err);
                });
            }
            else{
                console.error("unknown type");
            }
        })
        .catch(err => {
            console.error('permission denied', err);
        });
    }
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
