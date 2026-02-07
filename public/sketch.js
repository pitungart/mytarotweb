// Sacred Geometry Generator for Card Backs (p5.js)
// This script renders a breathing mandala pattern

let canvasWidth = 300;
let canvasHeight = 450;
let angle = 0;
// We'll only run the loop when the container is visible to save performance
let isRunning = false;

function setup() {
    let cnv = createCanvas(canvasWidth, canvasHeight);
    cnv.parent('p5-canvas-container');
    angleMode(DEGREES);
    noFill();
    stroke(212, 175, 55, 100); // Gold with low opacity
    strokeWeight(1);
    frameRate(30);
}

function draw() {
    // Only draw if we are in the "Ritual" phase
    if (!document.getElementById('shuffle-container') || document.getElementById('shuffle-container').classList.contains('hidden')) {
        return;
    }

    clear(); // Transparent background
    translate(width / 2, height / 2);

    // Rotating Geometry
    let r = 80 + sin(frameCount * 2) * 20; // Breathing radius

    // Layer 1: Hexagon
    push();
    rotate(angle);
    stroke(165, 125, 255, 50); // Muted purple
    beginShape();
    for (let i = 0; i < 6; i++) {
        let x = r * cos(i * 60);
        let y = r * sin(i * 60);
        vertex(x, y);
    }
    endShape(CLOSE);
    pop();

    // Layer 2: Connecting Lines
    push();
    rotate(-angle * 0.5);
    stroke(212, 175, 55, 80); // Gold
    for (let i = 0; i < 12; i++) {
        let x1 = r * 0.5 * cos(i * 30);
        let y1 = r * 0.5 * sin(i * 30);
        let x2 = r * 1.5 * cos(i * 30 + angle);
        let y2 = r * 1.5 * sin(i * 30 + angle);
        line(x1, y1, x2, y2);
    }
    pop();

    // Particles (simulated)
    for (let i = 0; i < 5; i++) {
        let px = cos(frameCount * 3 + i * 72) * r * 1.2;
        let py = sin(frameCount * 2 + i * 72) * r * 1.2;
        strokeWeight(2);
        point(px, py);
    }

    angle += 0.5;
}

function windowResized() {
    // Optional: Responsive resize logic could go here
}
