let portals = [];
let maxPortals = 8;
let speed = 2;
let centerX, centerY;
let colorMode = 0;
let shapeMode = 0;
let showPopup = false;
let sound;
let soundPlayed = false;

function preload() {
    sound = loadSound('portal.wav');
}

function setup() {
    const canvas = createCanvas(1, 1);
    canvas.parent('sketch-container');
    resizeCanvasToContainer();

    const portalIcon = document.getElementById('portal-icon');
    portalIcon.addEventListener('click', () => {
        showPopup = !showPopup;
    });

    for (let i = 0; i < maxPortals; i++) {
        portals.push({
            radius: (i + 1) * 50,
            color: getColorForMode(),
        });
    }

    if (!soundPlayed) {
        userStartAudio();
    }
}

function draw() {
    background(0);
    noStroke();

    for (let i = portals.length - 1; i >= 0; i--) {
        let portal = portals[i];
        portal.radius -= speed;
        if (portal.radius < 0) {
            portal.radius = height;
            portal.color = getColorForMode();
        }

        fill(portal.color);
        drawShape(portal.radius);
    }

    if (showPopup) {
        drawPopup();
    }
}

function mousePressed() {
    if (!soundPlayed && sound) {
        sound.setLoop(true);
        sound.play();
        soundPlayed = true;
    }

    if (showPopup) {
        showPopup = false;
    }
}

function drawPopup() {
    fill(34);
    rectMode(CENTER);
    rect(width / 2, height / 2, width * 0.5, height * 0.4, 10);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(18);
    text("Controls", width / 2, height / 2 - 70);

    textSize(14);
    text(
        "Left/Right Arrows: Toggle color modes\n" +
            "Up/Down Arrows: Adjust speed\n" +
            "Shift: Change portal shape\n" +
            "Click anywhere to close",
        width / 2,
        height / 2
    );
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        speed = min(20, speed + 1);
    } else if (keyCode === DOWN_ARROW) {
        speed = max(0.5, speed - 1);
    } else if (keyCode === LEFT_ARROW) {
        colorMode = (colorMode - 1 + 5) % 5;
    } else if (keyCode === RIGHT_ARROW) {
        colorMode = (colorMode + 1) % 5;
    } else if (keyCode === SHIFT) {
        shapeMode = (shapeMode + 1) % 4;
    }
}

function getColorForMode() {
    switch (colorMode) {
        case 0:
            return color(random(100, 255), random(100, 255), random(100, 255), 100);
        case 1:
            let gray = random(50, 255);
            return color(gray, gray, gray, 100);
        case 2:
            return color(random(150, 255), random(0, 50), random(0, 50), 100);
        case 3:
            return color(random(0, 50), random(150, 255), random(0, 50), 100);
        case 4:
            return color(random(0, 50), random(0, 50), random(150, 255), 100);
    }
}

function drawShape(radius) {
    push();
    translate(centerX, centerY);
    switch (shapeMode) {
        case 0:
            ellipse(0, 0, radius, radius);
            break;
        case 1:
            drawStar(0, 0, radius * 0.3, radius * 0.6, 5);
            break;
        case 2:
            drawHeart(0, 0, radius);
            break;
        case 3:
            rectMode(CENTER);
            rect(0, 0, radius, radius);
            break;
    }
    pop();
}

function drawStar(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + cos(a) * radius2;
        let sy = y + sin(a) * radius2;
        vertex(sx, sy);
        sx = x + cos(a + halfAngle) * radius1;
        sy = y + sin(a + halfAngle) * radius1;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}

function drawHeart(x, y, size) {
    beginShape();
    vertex(x, y - size * 0.3);
    bezierVertex(
        x - size * 0.5,
        y - size,
        x - size,
        y + size * 0.3,
        x,
        y + size
    );
    bezierVertex(
        x + size,
        y + size * 0.3,
        x + size * 0.5,
        y - size,
        x,
        y - size * 0.3
    );
    endShape(CLOSE);
}

function windowResized() {
    resizeCanvasToContainer();
}

function resizeCanvasToContainer() {
    const sketchContainer = document.getElementById('sketch-container');
    const width = sketchContainer.offsetWidth;
    const height = sketchContainer.offsetHeight;
    resizeCanvas(width, height);
    centerX = width / 2;
    centerY = height / 2;
}
