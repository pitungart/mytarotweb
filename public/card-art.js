// Procedural Tarot Card Art Generator - Constellation Divine Edition

const cardArtGenerator = (p, cardData, targetId) => {

    p.setup = () => {
        const container = document.getElementById(targetId);
        const w = container.offsetWidth || 240;
        const h = container.offsetHeight || 360;

        let cnv = p.createCanvas(w, h);
        cnv.parent(targetId);
        p.noLoop();
    };

    p.draw = () => {
        p.background(5, 2, 8); // Obsidian Background

        // Seed based on card unique ID
        p.randomSeed(cardData.id * 1337);

        drawCosmicFrame();
        drawConstellationArt();
    };

    function drawCosmicFrame() {
        p.push();
        // Thin gold border
        p.stroke(157, 129, 76, 80);
        p.strokeWeight(1);
        p.noFill();
        p.rect(10, 10, p.width - 20, p.height - 20, 15);

        // Corner accents
        p.stroke(157, 129, 76, 150);
        let s = 15;
        // TL
        p.line(10, 25, 10, 10); p.line(10, 10, 25, 10);
        // TR
        p.line(p.width - 25, 10, p.width - 10, 10); p.line(p.width - 10, 10, p.width - 10, 25);
        // BL
        p.line(10, p.height - 25, 10, p.height - 10); p.line(10, p.height - 10, 25, p.height - 10);
        // BR
        p.line(p.width - 25, p.height - 10, p.width - 10, p.height - 10); p.line(p.width - 10, p.height - 10, p.width - 10, p.height - 25);
        p.pop();
    }

    function drawConstellationArt() {
        p.push();
        let themeColor = getThemeColor();

        // Center of the card
        p.translate(p.width / 2, p.height / 2);

        // Glow backdrop
        for (let i = 8; i > 0; i--) {
            p.noStroke();
            p.fill(p.red(themeColor), p.green(themeColor), p.blue(themeColor), 5 / i);
            p.ellipse(0, 0, p.width * 0.4 + i * 20);
        }

        // Generate points for the "Constellation"
        let points = [];
        let numPoints = cardData.type === "Major Arcana" ? 12 : 5 + (cardData.value % 10);

        for (let i = 0; i < numPoints; i++) {
            let r = p.random(p.width * 0.15, p.width * 0.35);
            let angle = p.random(p.TWO_PI);
            points.push({
                x: r * p.cos(angle),
                y: r * p.sin(angle),
                size: p.random(2, 6)
            });
        }

        // Draw connecting lines (The Constellation Pattern)
        p.stroke(157, 129, 76, 100); // Gold lines
        p.strokeWeight(0.8);
        for (let i = 0; i < points.length; i++) {
            // Predictable but complex connections
            let next = (i + 1) % points.length;
            p.line(points[i].x, points[i].y, points[next].x, points[next].y);

            if (p.random() > 0.6 && i < points.length - 2) {
                let far = (i + 3) % points.length;
                p.stroke(157, 129, 76, 40);
                p.line(points[i].x, points[i].y, points[far].x, points[far].y);
            }
        }

        // Draw Stars (Points)
        p.noStroke();
        for (let pt of points) {
            // Inner Star
            p.fill(255);
            p.ellipse(pt.x, pt.y, pt.size);

            // Thematic Glow
            p.fill(p.red(themeColor), p.green(themeColor), p.blue(themeColor), 150);
            p.ellipse(pt.x, pt.y, pt.size * 1.5);

            // Outer Shine
            p.fill(p.red(themeColor), p.green(themeColor), p.blue(themeColor), 40);
            p.ellipse(pt.x, pt.y, pt.size * 4);
        }

        // Central Icon (The Soul of the card)
        drawCentralSpirit(themeColor, cardData.type);

        p.pop();
    }

    function drawCentralSpirit(col, type) {
        p.push();
        p.stroke(col);
        p.strokeWeight(1.5);
        p.noFill();

        // Aura rings
        for (let i = 1; i <= 2; i++) {
            p.stroke(p.red(col), p.green(col), p.blue(col), 80 / i);
            p.ellipse(0, 0, 30 * i);
        }

        p.stroke(col);
        p.strokeWeight(2);

        // Abstract icon based on type
        if (type === "Major Arcana") {
            p.ellipse(0, 0, 15);
            p.line(-15, 0, 15, 0);
            p.line(0, -15, 0, 15);
        } else if (type === "Wands") {
            p.line(-5, -15, 5, 15);
            p.line(5, -15, -5, 15);
        } else if (type === "Cups") {
            p.arc(0, 0, 20, 20, 0, p.PI);
            p.line(-10, 0, 10, 0);
        } else if (type === "Swords") {
            p.line(0, -20, 0, 10);
            p.line(-10, 0, 10, 0);
        } else if (type === "Pentacles") {
            p.rect(-8, -8, 16, 16);
            p.rotate(p.QUARTER_PI);
            p.rect(-8, -8, 16, 16);
        }
        p.pop();
    }

    function getThemeColor() {
        switch (cardData.type) {
            case "Major Arcana": return p.color(168, 85, 247); // Purple
            case "Wands": return p.color(251, 146, 60); // Orange
            case "Cups": return p.color(56, 189, 248); // Blue
            case "Swords": return p.color(148, 163, 184); // Silver
            case "Pentacles": return p.color(74, 222, 128); // Green
            default: return p.color(157, 129, 76); // Gold
        }
    }
};
