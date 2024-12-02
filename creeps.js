let video; // To hold the video
let speedFactor = 1; // Controls video speed
let creepAudio; // To hold the creep audio
let floorboardAudio; // To hold the floorboard audio

function preload() {
  video = createVideo("creeps.mp4"); // Load the video file
  creepAudio = document.getElementById("creeps-audio"); // Get the "creeps.mp3" audio element
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Fullscreen canvas
  video.hide(); // Hide the default HTML video element
  video.loop(); // Loop the video
  video.size(windowWidth, windowHeight); // Ensure the video fits the screen
  video.speed(speedFactor); // Start with normal speed
}

function draw() {
  background(0); // Black background
  image(video, 0, 0, width, height); // Draw the video across the canvas
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    // Increase video speed
    speedFactor = min(speedFactor + 0.25, 4); // Maximum speed 4x
    video.speed(speedFactor);
  } else if (keyCode === DOWN_ARROW) {
    // Decrease video speed
    speedFactor = max(speedFactor - 0.25, 0.1); // Minimum speed 0.1x
    video.speed(speedFactor);
  }
}

function mousePressed() {
  // Hide the instruction dialog and start the video
  document.getElementById("instruction-dialog").classList.add("hidden");

  // Play the video and audio after clicking the dialog box
  video.play();

  // Play the "creep" audio at normal volume
  if (creepAudio.paused) {
    creepAudio.play();  
  }

  // Play the "floorboard" audio at half volume
  if (floorboardAudio.paused) {
    floorboardAudio.volume = 0.5;  // Set the volume to half
    floorboardAudio.play();
  }
}
