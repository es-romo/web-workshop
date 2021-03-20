const ratio = 10;
const width = 50;
const height = 50;

const canvas = document.getElementById("canvas")
const context = canvas.getContext('2d')
const size = document.getElementById('size')

const inputWidth = document.getElementById('width')
const inputHeight = document.getElementById('height')


canvas.addEventListener('click', (e)=>{
    const {x,y} = getPixelOrigin(e.pageX,e.pageY)
    drawPixel(x,y)
}, false)

canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    console.log('Right click')
    const {x,y} = getPixelOrigin(e.pageX,e.pageY)
    fill(x,y,{R: 128,G:0,B:0})
    return false;
}, false);

render()

function render(){
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    wipeCanvas()
}

function setSquare(canvasData, pos, color = {R:0,G:0,B:0}){

    for(let j = pos, step = 0; step < ratio; j += canvas.width * 4, step++){
        for(let i = j; i < j + (ratio * 4); i += 4 ){
            canvasData.data[i] = color.R;
            canvasData.data[i+1] = color.G;
            canvasData.data[i+2] = color.B;
            canvasData.data[i+3] = 255;
        }
    }
    return canvasData
}

function getPixelOrigin(x,y){
    const rect = canvas.getBoundingClientRect()

    const left   = rect.left   + window.scrollX;
    const top    = rect.top    + window.scrollY;
    const right  = rect.right  + window.scrollX;
    const bottom = rect.bottom + window.scrollY;

    const originX = Math.trunc(((x - left) / (right - left) * canvas.width) / ratio) * ratio
    const originY = Math.trunc(((y - top) / (bottom - top) * canvas.height) / ratio) * ratio
    return {
        x: originX,
        y: originY
    }
}

function getColor(x,y){
    const colorData = context.getImageData(x,y,1,1).data
    return { 
        R: colorData[0],
        G: colorData[1],
        B: colorData[2],
        A: colorData[3],
    }
}

function matchColor(colora,colorb) {
    return colora.R === colorb.R
        && colora.G === colorb.G
        && colora.B === colorb.B
}

function wipeCanvas() {
    context.globalCompositeOperation = 'destination-over'
    context.fillStyle = 'white'
    context.fillRect(0,0,canvas.width,canvas.height)
    context.globalCompositeOperation = 'source-over'
}

function drawPixel(x,y,color = {R:0,G:0,B:0}) {
    const {R,G,B} = color
    context.fillStyle = `rgb(${R},${G},${B})`
    context.fillRect(x,y,ratio,ratio)
}

function drawLine(start,end,color = {R:0,G:0,B:0}) {
    const {R,G,B} = color
    context.fillStyle = `rgb(${R},${G},${B})`
    context.fillRect(start.x,start.y,end.x + ratio, end.y + ratio)
}

/*
    Adapted from "William's Fill" 
    http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
*/
function fill(tx,ty,color = {R:0 ,G:0, B:0}) {
    
    const baseColor = getColor(tx,ty)
    let canvasData = context.getImageData(0,0,canvas.width,canvas.height)
    let pixelStack = [[tx, ty]];
    let x, y, newPos, pos, left, right
    while(pixelStack.length){
        newPos = pixelStack.pop();
        x = newPos[0];
        y = newPos[1];
        
        pos = (y* canvas.width + x) * 4;

        let upPos = pos - (canvas.width * ratio * 4)
        while(y - ratio >= 0 && matchColor(baseColor,{
            R: canvasData.data[upPos],
            G: canvasData.data[upPos+1],
            B: canvasData.data[upPos+2]}))
        {
          y -= ratio
          pos -= canvas.width * ratio * 4;
          upPos = pos - (canvas.width * ratio * 4)
        }
        left = false;
        right = false;
        //traverse down
        while(y < canvas.height && matchColor(baseColor,{
            R: canvasData.data[pos],
            G: canvasData.data[pos+1],
            B: canvasData.data[pos+2]}))
        {
            canvasData = setSquare(canvasData,pos,color);
            
            if(x > ratio - 1){
                let curColor = {
                    R: canvasData.data[pos - (4 * ratio)],
                    G: canvasData.data[pos - (3 * ratio)],
                    B: canvasData.data[pos - (2 * ratio)]}
                if(matchColor(baseColor,curColor))
                    {
                    if(!left){
                        pixelStack.push([x - ratio, y]);
                        left = true;
                    }
                }
                else if(left)
                {
                    left = false;
                }
            }
            
            if(x < canvas.width - ratio)
            {
                let curColor = {
                    R: canvasData.data[pos + (4 * ratio)],
                    G: canvasData.data[pos + (5 * ratio)],
                    B: canvasData.data[pos + (6 * ratio)]
                }
                if(matchColor(baseColor,curColor))
                {
                    if(!right){
                        pixelStack.push([x + ratio, y]);
                        right = true;
                    }
                }
                else if(right){
                    right = false;
                }
            }
                    
            pos += canvas.width * ratio * 4;
            y+= ratio
        }
    }
    context.putImageData(canvasData, 0, 0);
}