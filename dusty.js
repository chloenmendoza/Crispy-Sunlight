let fallingParticles = [];
let settledParticles = [];
let gravity;
let pouringSound;

function setup() {
  createCanvas(windowWidth, windowHeight); // Make the canvas full screen
  background(0, 0);  // Make the background transparent
  gravity = createVector(0, 0.2); // Gentle gravity
  pouringSound = document.getElementById("pour-audio"); // Get the pouring sound element
  noSmooth(); // Optionally, improve performance by disabling smoothing

  // Ensure instructions are visible at first
  document.getElementById("instruction-dialog").classList.remove("hidden");
}

function draw() {
  clear();  // Make the canvas fully transparent, showing the HTML background

  // Add particles when the mouse is pressed
  if (mouseIsPressed) {
    for (let i = 0; i < 50; i++) { // Create more particles for faster filling
      fallingParticles.push(new DustParticle(mouseX, mouseY, false));
    }
    if (pouringSound.paused) {
      pouringSound.play(); // Play the sound when particles are added
    }
  }

  // Update and display falling particles
  for (let i = fallingParticles.length - 1; i >= 0; i--) {
    let p = fallingParticles[i];
    p.applyForce(gravity); // Apply gravity to falling particles
    p.update();

    // Check if the particle has landed
    if (p.isOnGround()) {
      fallingParticles.splice(i, 1);
      settledParticles.push(new DustParticle(p.pos.x, p.pos.y, true));
    } else {
      p.display();
    }
  }

  // Handle settled particles (lifting in the direction of the mouse)
  for (let p of settledParticles) {
    if (!mouseIsPressed) {
      let liftForce = createVector(mouseX - p.pos.x, mouseY - p.pos.y);
      liftForce.setMag(0.2); // Moderate lifting force

      // Add a slight randomness to the direction to prevent clustering
      liftForce.add(p5.Vector.random2D().mult(0.1)); // Random horizontal spread

      p.applyForce(liftForce);
    }
    p.update();
    p.display();
  }

  // If no more particles exist, stop the sound
  if (fallingParticles.length === 0 && settledParticles.length === 0) {
    pouringSound.pause(); // Pause the pouring sound once all particles disappear
  }
}

class DustParticle {
  constructor(x, y, settled) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-2, 0)); // Random velocity for fall
    this.acc = createVector(0, 0);
    this.settled = settled;
    this.size = random(2, 6); // Adjusted for slightly bigger particles for realistic look

    // Color based on monochromatic tones
    let gray = random(100, 160); // Grayscale tones for monochrome effect
    this.color = color(gray); // Monochrome color
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0); // Reset acceleration after applying the force

    // Stop particles at the bottom of the canvas
    if (this.pos.y >= height - this.size) {
      this.pos.y = height - this.size;
      this.vel.y = 0; // Stop vertical motion
    }
  }

  display() {
    noStroke();
    fill(this.color); // Display with the monochrome color
    ellipse(this.pos.x, this.pos.y, this.size, this.size); // Draw particle
  }

  isOnGround() {
    return this.pos.y >= height - this.size;
  }
}

// Function to hide the instructions when clicked
function hideInstructions() {
  document.getElementById("instruction-dialog").classList.add("hidden");
}

// Function to remove dust particles when Delete or Backspace key is pressed
function keyPressed() {
  if (keyCode === BACKSPACE || keyCode === DELETE) {
    fallingParticles = [];  // Clear falling particles
    settledParticles = [];  // Clear settled particles
  }
}