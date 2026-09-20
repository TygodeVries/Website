const killedPerYear = 518_364.6 * 1000;
const killedPerSecond = killedPerYear / 365 / 86400;
const msPerKill = 1000 / killedPerSecond;

const canvas = document.getElementById('sprite-canvas');
const pileCanvas = document.getElementById('pile-canvas');
const counter = document.getElementById('counter');

const ctx = canvas.getContext('2d');
const pileCtx = pileCanvas.getContext('2d');

const gridSize = 4;
const emojiSize = 300;
const introDuration = 800;

const yearStart = new Date(new Date().getFullYear(), 0, 1).getTime();
const pageStart = Date.now();

const sprites = [];
let floorHeights = [];
let processedCount = 0;

const emojiCanvas = document.createElement('canvas');
emojiCanvas.width = emojiSize * 1.5;
emojiCanvas.height = emojiSize * 1.5;

const emojiCtx = emojiCanvas.getContext('2d');
emojiCtx.font = `${emojiSize}px Arial, "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
emojiCtx.textAlign = 'center';
emojiCtx.textBaseline = 'middle';
emojiCtx.fillText('🐓', emojiCanvas.width / 2, emojiCanvas.height / 2);

function resize() {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    pileCanvas.width = width * dpr;
    pileCanvas.height = height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pileCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    floorHeights = new Array(Math.ceil(width / gridSize)).fill(height);
    pileCtx.clearRect(0, 0, width, height);
}

window.addEventListener('resize', resize);
resize();

class Chicken {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = -60;
        this.scale = Math.random() * 0.4 + 0.4;
        this.size = emojiSize * this.scale / 2;
        this.vy = Math.random() + 1;
        this.vx = (Math.random() - 0.5) * 1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
        this.grounded = false;
    }

    update() {
        this.vy += 0.05;
        this.y += this.vy;
        this.x += this.vx;
        this.rotation += this.rotationSpeed;

        const index = Math.floor(this.x / gridSize);

        if (index < 0 || index >= floorHeights.length) return;

        const floor = floorHeights[index];

        if (this.y + this.size / 3 < floor) return;

        this.grounded = true;
        this.y = floor - this.size / 6;
        this.addToPile(index);
    }

    addToPile(index) {
        pileCtx.save();
        pileCtx.translate(this.x, this.y);
        pileCtx.rotate(this.rotation);
        pileCtx.drawImage(
            emojiCanvas,
            -this.size / 2,
            -this.size / 2,
            this.size,
            this.size
        );
        pileCtx.restore();

        const radius = Math.ceil(this.size / 2 / gridSize);

        for (let i = -radius; i <= radius; i++) {
            const x = index + i;

            if (x < 0 || x >= floorHeights.length) continue;

            floorHeights[x] -=
                this.size / 6 * (1 - Math.abs(i) / radius);
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(
            emojiCanvas,
            -this.size / 2,
            -this.size / 2,
            this.size,
            this.size
        );
        ctx.restore();
    }
}

function easeOut(t) {
    return 1 - (1 - t) ** 3;
}

function getCurrentCount() {
    return Math.floor((Date.now() - yearStart) / msPerKill);
}
const startDelay = 400;

function updateCounter(count) {
    const elapsed = Date.now() - pageStart;

    if (elapsed < startDelay) {
        counter.textContent = 0;
        return;
    }

    const animationElapsed = elapsed - startDelay;
    const progress = Math.min(animationElapsed / introDuration, 1);
    
    counter.textContent = (Math.floor(count * easeOut(progress))).toLocaleString();
}

function spawn(count) {
    const amount = count - processedCount;

    for (let i = 0; i < amount; i++) {
        sprites.push(new Chicken());
    }

    processedCount = count;
}

function animate() {
    const count = getCurrentCount();

    updateCounter(count);

    if (processedCount === 0) processedCount = count;
    else spawn(count);

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = sprites.length - 1; i >= 0; i--) {
        const chicken = sprites[i];

        chicken.update();

        if (chicken.grounded || chicken.y > window.innerHeight) {
            sprites.splice(i, 1);
        } else {
            chicken.draw();
        }
    }

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
