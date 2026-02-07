// Tarot Card Shuffle Animation (Instance Mode)

const shuffleSketch = (p) => {
    let cards = [];
    let cardCount = 5;

    p.setup = () => {
        let cnv = p.createCanvas(400, 400);
        cnv.parent('mandala-canvas');
        p.rectMode(p.CENTER);

        for (let i = 0; i < cardCount; i++) {
            cards.push(new ShuffleCard(p, i));
        }
    };

    p.draw = () => {
        p.clear();

        // Stack behavior: Sort cards based on their perceived z-index (offset from center)
        // For simplicity, we just draw them in their designated positions
        for (let card of cards) {
            card.update();
            card.show();
        }
    };

    class ShuffleCard {
        constructor(p, index) {
            this.p = p;
            this.index = index;
            this.baseX = p.width / 2;
            this.baseY = p.height / 2;
            this.w = 120;
            this.h = 200;
            this.offset = 0;
            this.speed = 0.05 + index * 0.01;
            this.time = index * 10;
        }

        update() {
            this.time += 0.05;
            // Smooth horizontal oscillation
            this.offset = this.p.sin(this.time) * 40;
            // Slight tilt
            this.rotation = this.p.sin(this.time * 0.8) * 0.1;
        }

        show() {
            this.p.push();
            this.p.translate(this.baseX + this.offset, this.baseY);
            this.p.rotate(this.rotation);

            // 1. Shadow/Glow
            this.p.noStroke();
            this.p.fill(30, 11, 54, 100);
            this.p.rect(5, 5, this.w, this.h, 10);

            // 2. Card Base
            this.p.fill(15, 10, 25);
            this.p.stroke(255, 255, 255, 40);
            this.p.strokeWeight(2);
            this.p.rect(0, 0, this.w, this.h, 10);

            // 3. Ornate Design (Card Back)
            this.p.noFill();
            this.p.stroke(157, 129, 76, 150); // Gold accent
            this.p.strokeWeight(1.2);

            // Central Geometry
            this.p.ellipse(0, 0, 40);
            this.p.ellipse(0, 0, 30);

            // Lines to corners
            this.p.stroke(157, 129, 76, 60);
            this.p.line(-this.w / 2 + 10, -this.h / 2 + 10, this.w / 2 - 10, this.h / 2 - 10);
            this.p.line(this.w / 2 - 10, -this.h / 2 + 10, -this.w / 2 + 10, this.h / 2 - 10);

            // Inner Diamond
            this.p.stroke(157, 129, 76, 100);
            this.p.beginShape();
            this.p.vertex(0, -this.h / 2 + 20);
            this.p.vertex(this.w / 2 - 15, 0);
            this.p.vertex(0, this.h / 2 - 20);
            this.p.vertex(-this.w / 2 + 15, 0);
            this.p.endShape(this.p.CLOSE);

            // Subtle Texture / Pattern
            for (let y = -this.h / 2 + 30; y < this.h / 2 - 20; y += 20) {
                this.p.stroke(157, 129, 76, 30);
                this.p.line(-10, y, 10, y);
            }

            this.p.pop();
        }
    }
};

new p5(shuffleSketch);
