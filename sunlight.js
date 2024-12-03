let pollen = [];
let bgImage;
let sound;
let sound2;
let lightButton;
let pixelationFactor = 20;
let noiseOffset = 0;

function preload() {
    bgImage = loadImage('float.jpeg');
    sound = loadSound('blip.wav');
    sound2 = loadSound('sunlight.wav');
    lightButton = loadImage('light.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < 50; i++) {
        pollen.push(new Pollen());
    }
    sound2.loop();
}

function draw() {
    background(0);

    // Dynamic pixelation factor
    let noiseValue = noise(noiseOffset);
    pixelationFactor = map(noiseValue, 0, 1, 10, 50);
    noiseOffset += 0.0004; // Faster speed for dynamic pixelation

    displayPixelatedBackground();

    for (let p of pollen) {
        p.move();
        p.display();
    }

    image(lightButton, width - 110, 10, 100, 100);
}

function displayPixelatedBackground() {
    bgImage.loadPixels();
    let stepSize = floor(pixelationFactor);
    for (let y = 0; y < bgImage.height; y += stepSize) {
        for (let x = 0; x < bgImage.width; x += stepSize) {
            let index = (x + y * bgImage.width) * 4;
            let r = bgImage.pixels[index];
            let g = bgImage.pixels[index + 1];
            let b = bgImage.pixels[index + 2];
            fill(r, g, b);
            noStroke();
            rect(
                (x / bgImage.width) * width,
                (y / bgImage.height) * height,
                (stepSize / bgImage.width) * width,
                (stepSize / bgImage.height) * height
            );
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

class Pollen {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.size = random(5, 10);
        this.speedX = random(-1, 1);
        this.speedY = random(-1, 1);
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > width) this.x = 0;
        if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        if (this.y < 0) this.y = height;
    }

    display() {
        noStroke();
        fill(255, 255, 255, 150);
        ellipse(this.x, this.y, this.size);
    }
}

function mousePressed() {
    if (mouseX > width - 110 && mouseX < width - 10 && mouseY > 10 && mouseY < 110) {
        window.location.href = 'index.html';
        return;
    }
    if (!sound.isPlaying() && getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }
    for (let p of pollen) {
        let d = dist(mouseX, mouseY, p.x, p.y);
        if (d < p.size / 2) {
            if (sound.isLoaded()) {
                const melodicRates = [0.5, 0.75, 1, 1.25, 1.5, 2];
                const randomRate = random(melodicRates);
                sound.rate(randomRate);
                sound.play();
            }
            p.x = random(width);
            p.y = random(height);
        }
    }
}
