class KDRAW {
    constructor() {
        this.canvas = document.getElementById("kdraw")
        this.ctx = this.canvas.getContext("2d")

        // constants
        this.ctx.lineCap = 'round';
        this.ctx.font = "12px Arial";
        this.initTime = new Date()
        this.frameRate = 30

        // listeners
        window.addEventListener("keydown", (e)=>{this.keydown(e)});
        window.addEventListener("keyup", (e)=>{this.keyup(e)});
        this.canvas.addEventListener("mousemove", (e)=>{this.mousemove(e)});
        this.canvas.addEventListener("mousedown", (e)=>{this.mousedown(e)});
        this.canvas.addEventListener("mouseup", (e)=>{this.mouseup(e)});
        this.canvas.addEventListener("drag", (e)=>{this.drag(e)});
        this.canvas.addEventListener("mouseout", (e)=>{this.mouseout(e)});
        this.canvas.addEventListener("mouseover", (e)=>{this.mouseover(e)});
        this.canvas.addEventListener("click", (e)=>{this.click(e)});

        this.draw()
    }

    defined(d) {
        return typeof d !== 'undefined'
    }

    draw() {      
        frameCount++

        if(typeof draw === "function") {
            draw()
        }

        // reset every frame
        pmouseX = mouseX
        pmouseY = mouseY

        setTimeout(()=>{this.draw()},1000/this.frameRate)
    }

    keydown(e) {
        keyCode = e.which || e.keyCode
        key.code = e.which || e.keyCode
        key.toString = () => {return e.key}

        keyIsPressed = true

        if(typeof keyPressed === "function") {
            keyPressed()
        }

        if(typeof keyTyped === "function") {
            keyTyped()
        }
    }

    keyup(e) {
        keyCode = e.which || e.keyCode
        key.code = e.which || e.keyCode

        keyIsPressed = false

        if(typeof keyReleased === "function") {
            keyReleased()
        }
    }

    mousemove(e) {
        var rect = this.canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left
        mouseY = e.clientY - rect.top

        if(typeof mouseMoved === "function") {
            mouseMoved()
        }
    }

    mousedown(e) {
        mouseButton = e.buttons
        mouseIsPressed = true

        if(typeof mousePressed === "function") {
            mousePressed()
        }
    }

    mouseup(e) {
        mouseButton = e.buttons
        mouseIsPressed = false

        if(typeof mouseReleased === "function") {
            mouseReleased()
        }
    }

    drag(e) {
        if(typeof mouseDragged === "function") {
            mouseDragged()
        }
    }

    mouseout(e) {
        if(typeof mouseOut === "function") {
            mouseOut()
        }
    }

    mouseover(e) {
        if(typeof mouseOver === "function") {
            mouseOver()
        }
    }

    click(e) {
        mouseButton = e.buttons
        if(typeof mouseClicked === "function") {
            mouseClicked()
        }
    }
}
var kdraw = new KDRAW()

// Shapes
function rect(x,y,w,h,r) {
    if(kdraw.defined(r)) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        kdraw.ctx.beginPath();
        kdraw.ctx.moveTo(x+r, y);
        kdraw.ctx.arcTo(x+w, y,   x+w, y+h, r);
        kdraw.ctx.arcTo(x+w, y+h, x,   y+h, r);
        kdraw.ctx.arcTo(x,   y+h, x,   y,   r);
        kdraw.ctx.arcTo(x,   y,   x+w, y,   r);
        kdraw.ctx.closePath();

        kdraw.ctx.fill()
        kdraw.ctx.stroke()
    } else {
        kdraw.ctx.fillRect(x,y,w,h)
        kdraw.ctx.strokeRect(x,y,w,h)
    }
}

function triangle(x1,y1,x2,y2,x3,y3) {
    kdraw.ctx.beginPath();
    kdraw.ctx.moveTo(x1, y1);
    kdraw.ctx.lineTo(x2, y2);
    kdraw.ctx.lineTo(x3, y3);
    kdraw.ctx.lineTo(x1, y1);
    kdraw.ctx.stroke();
}

function point(x,y){
    kdraw.ctx.beginPath();
    kdraw.ctx.ellipse(x, y, 1, 1, 0, 0, Math.PI*2);
    kdraw.ctx.stroke();
}

function ellipse(x,y,w,h) {
    kdraw.ctx.beginPath();
    kdraw.ctx.ellipse(x,y,Math.abs(w/2),Math.abs(h/2), 0, 0, 2 * Math.PI)
    kdraw.ctx.fill()
    kdraw.ctx.stroke()
}

function line(x1,y1,x2,y2) {
    kdraw.ctx.beginPath();
    kdraw.ctx.moveTo(x1, y1);
    kdraw.ctx.lineTo(x2, y2);
    kdraw.ctx.stroke();
}

function arc(x,y,w,h,startA,endA){
    kdraw.ctx.beginPath();
    if(angleMode==="degrees") {
        kdraw.ctx.ellipse(x, y, Math.abs(w/2), Math.abs(h/2), 0, radians(startA), radians(endA));
    }else if(angleMode==="radians") {
        kdraw.ctx.ellipse(x, y, Math.abs(w/2), Math.abs(h/2), 0, startA, endA);
    }
    kdraw.ctx.fill();
    kdraw.ctx.stroke();
}

function quad(x1,y1,x2,y2,x3,y3,x4,y4){
    kdraw.ctx.beginPath();
    kdraw.ctx.moveTo(x1, y1);
    kdraw.ctx.lineTo(x2, y2);
    kdraw.ctx.lineTo(x3, y3);
    kdraw.ctx.lineTo(x4, y4);
    kdraw.ctx.lineTo(x1, y1);
    kdraw.ctx.fill();
    kdraw.ctx.stroke();
}

// Complex Shapes

// Colors

function background(r,g,b) {
    let fillStyle = kdraw.ctx.fillStyle

    fill(r,g,b)
    kdraw.ctx.fillRect(0,0,kdraw.canvas.width,kdraw.canvas.height)


    kdraw.ctx.fillStyle = fillStyle
}

function noFill() {
    kdraw.ctx.fillStyle='rgba(0,0,0,0)'
}

function strokeWeight(w) {
    kdraw.ctx.lineWidth = w
}

function color(r,g,b,a) {
    return {red:r,green:kdraw.defined(b)?g:r,blue:kdraw.defined(b)?b:r,alpha:kdraw.defined(a)?a:255}
}

function fill(r,g,b,a) {
    if(typeof r === 'object') {
        kdraw.ctx.fillStyle = `rgba(${r.red},${r.green},${r.blue},${r.alpha/255})`
    } else {
        if(kdraw.defined(a)) {
            console.log(a)
            kdraw.ctx.fillStyle = `rgba(${r},${g},${b},${a/255})`
        } else if(kdraw.defined(b)) {
            kdraw.ctx.fillStyle = `rgb(${r},${g},${b})`
        } else {
            kdraw.ctx.fillStyle = `rgb(${r},${r},${r})`
        }
    }
}

function stroke(r,g,b,a) {
    if(typeof r === 'object') {
        kdraw.ctx.strokeStyle = `rgba(${r.red},${r.green},${r.blue},${r.alpha/255})`
    } else {
        if(kdraw.defined(a)) {
            kdraw.ctx.strokeStyle = `rgba(${r},${g},${b},${a/255})`
        } else if(kdraw.defined(b)) {
            kdraw.ctx.strokeStyle = `rgb(${r},${g},${b})`
        } else {
            kdraw.ctx.strokeStyle = `rgb(${r},${r},${r})`
        }
    }
}

function noStroke() {
    kdraw.ctx.strokeStyle='rgba(0,0,0,0)'
}

function red(c){
    return c.red;
}

function green(c){
    return c.green;
}

function blue(c){
    return c.blue;
}

function alpha(c){
    return c.alpha;
}

// Text

function text(text, x, y) {

    if(typeof text === "string") {
        let split = text.split("\n")

        split.forEach((txt, i) => {
            kdraw.ctx.fillText(txt, x, y + (i*parseInt(kdraw.ctx.font.split("px")[0])))
        });
    }
}

function textSize(s) {
    kdraw.ctx.font = s+"px Arial";
}

function textWidth(txt) {
    return kdraw.ctx.measureText(txt).width
}

// Transform

function rotate(a){
    if(angleMode==="degrees") {
        kdraw.ctx.rotate(radians(a))
    }else if(angleMode==="radians") {
        kdraw.ctx.rotate(a)
    }
}

function translate(x,y){
    kdraw.ctx.translate(x, y);
}

function scale(x,y){
    if(kdraw.defined(y)){
        kdraw.ctx.scale(x, y);
    }else{
        kdraw.ctx.scale(x, x);
    }
}

function pushMatrix(){
    kdraw.ctx.save();
}

function popMatrix(){
    kdraw.ctx.restore();
}

function resetMatrix(){
    kdraw.ctx.resetTransform();
}

// Environment

var width = kdraw.canvas.width

var height = kdraw.canvas.height

function frameRate(n){
    kdraw.frameRate=n;
}

var frameCount = 0;

// Mouse

var mouseX = 0

var mouseY = 0

var mouseButton = 0

var pmouseX = 0

var pmouseY = 0

var mouseIsPressed = false

// Keyboard

var key = {code:0, toString:()=>{return ""}}

var keyIsPressed = false

var keyCode = 0

// Math

function random(start, end) {
    return map(Math.random(), 0, 1,start,end)
}

function constrain(v, min, max) {
    if(v<min) {
        return min
    } else if(v>max) {
        return max
    } else {
        return v
    }
}

function max(v1,v2) {
    return Math.max(v1, v2)
}

function log(v) {
    return Math.log(v)
}

function sq(v) {
    return v*v
}

function round(val) {
    return Math.round(val)
}

function floor(val) {
    return Math.floor(val)
}

function dist(x1,y1,x2,y2) {
    return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2))
}

function min(v1,v2) {
    return Math.min(v1, v2)
}

function abs(v) {
    return Math.abs(v)
}

function pow(v1,v2) {
    return Math.pow(v1, v2)
}

function sqrt(v) {
    return Math.sqrt(v)
}

function ceil(val) {
    return Math.ceil(val)
}

class PVector {
    constructor(x,y) {
        this.x = x
        this.y = y
    }

    get() {
        return new PVector(this.x, this.y)
    }

    set(x, y) {
        if(kdraw.defined(y)) {
            this.x = x
            this.y = y
        } else {
            if(x.constructor === Array) {
                this.x = x[0]
                this.y = y[0]
            } else {
                this.x = x.x
                this.x = x.y
            }
        }
    }

    mag() {
        return mag(this.x, this.y)
    }

    add(x, y) {
        if(kdraw.defined(y)) {
            if(y instanceof PVector) {
                return new PVector(x.x+y.x,x.y+y.y)
            } else {
                this.x += x
                this.y += y
            }
        } else {
            this.x += x.x
            this.y += x.y
        }
    }

    sub(x, y) {
        if(kdraw.defined(y)) {
            if(y instanceof PVector) {
                return new PVector(x.x-y.x,x.y-y.y)
            } else {
                this.x -= x
                this.y -= y
            }
        } else {
            this.x -= x.x
            this.y -= x.y
        }
    }

    mult(x, y) {
        if(kdraw.defined(y)) {
            if(y instanceof PVector) {
                return new PVector(x.x*y.x, x.y*y.y)
            } else {
                return new PVector(x.x*y, x.y*y)
            }
        } else {
            if(x instanceof PVector) {
                this.x *= x.x
                this.y *= x.y
            } else {
                this.x *= x
                this.y *= y
            }
        }
    }

    div(x, y) {
        if(kdraw.defined(y)) {
            if(y instanceof PVector) {
                return new PVector(x.x/y.x, x.y/y.y)
            } else {
                return new PVector(x.x/y, x.y/y)
            }
        } else {
            if(x instanceof PVector) {
                this.x /= x.x
                this.y /= x.y
            } else {
                this.x /= x
                this.y /= y
            }
        }
    }

    dist(v1, v2) {
        if(kdraw.defined(v2)) {
            return Math.sqrt(Math.pow(v2.x-v1.x,2) + Math.pow(v2.y-v1.y,2))
        } else {
            return Math.sqrt(Math.pow(this.x-v1.x,2) + Math.pow(this.y-v1.y,2))
        }
    }

    dot(v) {
        return this.mag() * v.mag() * Math.cos(this.angleBetween(this, v))
    }

    normalize() {
        let length = sqrt(this.x * this.x + this.y * this.y);

        this.x /= length
        this.y /= length
    }

    limit(m) {
        this.normalize()
        this.x *=m
        this.y *=m
    }

    array() {
        return [this.x, this.y]
    }

    rotate(a) {
        // this.x =
        // this.y =
    }

    angleBetween(v1, v2) {
        return Math.abs(v1.heading()-v2.heading())
    }

    heading() {
        return atan2(this.y, this.x)
    }
}

function mag(x, y) {
    return dist(0,0,x,y)
}

function exp(p) {
    return pow(Math.E,p)
}

function map(value, min, max, start, end) {
    return start + (end - start) * ((value - min) / (max - min))
}

function norm(value, low, high) {
    return map(value, low, high, 0, 1)
}

function lerp(x1, x2, amount) {
    return x1 + ((x1-x2)*amount)
}


// Trigonometry

function cos(v) {
    if(angleMode==="degrees") {
        return Math.cos(radians(v))
    }else if(angleMode==="radians") {
        return Math.cos(v)
    }
}

function tan(v) {
    if(angleMode==="degrees") {
        return Math.tan(radians(v))
    }else if(angleMode==="radians") {
        return Math.tan(v)
    }
}

function sin(v) {
    if(angleMode==="degrees") {
        return Math.sin(radians(v))
    }else if(angleMode==="radians") {
        return Math.sin(v)
    }
}

function acos(v) {
    if(angleMode==="degrees") {
        return degrees(Math.acos(v))
    }else if(angleMode==="radians") {
        return Math.acos(v)
    }
}

function asin(v) {
    if(angleMode==="degrees") {
        return degrees(Math.asin(v))
    }else if(angleMode==="radians") {
        return Math.asin(v)
    }
}

function atan(v) {
    if(angleMode==="degrees") {
        return Math.atan(v) * 180 / Math.PI
    }else if(angleMode==="radians") {
        return Math.atan(v)
    }
}

function atan2(y, x) {
    if(angleMode==="degrees") {
        return degrees(Math.atan2(y, x))
    }else if(angleMode==="radians") {
        return Math.atan2(y, x)
    }
}

function radians(a) {
    return a * Math.PI / 180
}

function degrees(a) {
    return a * 180 / Math.PI
}

var angleMode = "degrees"

// Date & Time

function day() {
    return (new Date()).getDay()
}

function month() {
    return (new Date()).getMonth()
}

function year() {
    return (new Date()).getFullYear()
}

function millis() {
    return new Date() - kdraw.initTime
}

function hour() {
    return (new Date()).getHours()
}

function minute() {
    return (new Date()).getMinutes()
}

function second() {
    return (new Date()).getSeconds()
}

// Debugging
function debug() {
    console.log(...args)
}

function print(data) {
    console.log(data)
}

function println(data) {
    console.log(data)
}

// Undocumented (Other functions/constants that aren't directly linked in khan's docs)

const UP = 38
const DOWN = 40
const LEFT = 37
const RIGHT = 39
const ALT = 18
const CONTROL = 17
const SHIFT = 16

function cursor(type){
    if(kdraw.defined(type)){
        kdraw.canvas.style.cursor=type
    }else{
        kdraw.canvas.style.cursor="default"
    }
}

function noCursor(){
    kdraw.canvas.style.cursor="none"
}
