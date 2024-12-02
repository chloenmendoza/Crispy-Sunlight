let pollen = []; 
let bgImage;
let sound;

function preload() {
    bgImage = loadImage('sunlight.jpg'); 
    sound = loadSound('sound.mp3'); 
}

function setup() {
    createCanvas(windowWidth, windowHeight); 
    for (let i = 0; i < 50; i++) {
        pollen.push(new Pollen());
    }
}

function draw() {
    background(bgImage);
    for (let p of pollen) {
        p.move();
        p.display();
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
    // Unlock the audio context on the first user interaction
    if (!sound.isPlaying() && getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }

    for (let p of pollen) {
        let d = dist(mouseX, mouseY, p.x, p.y);
        if (d < p.size / 2) {
            if (sound.isLoaded()) {
                sound.play(); // Play sound
            }
            p.x = random(width); // Randomly reposition particle
            p.y = random(height);
        }
    }
}

