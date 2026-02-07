const fs = require('fs');
const path = require('path');

const cardsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'cards.json'), 'utf8'));
const outputDir = path.join(__dirname, 'public', 'images');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function getThemeColor(type) {
    switch (type) {
        case "Major Arcana": return '#A855F7'; // Purple
        case "Wands": return '#FB923C'; // Orange
        case "Cups": return '#38BDF8'; // Blue
        case "Swords": return '#94A3B8'; // Silver
        case "Pentacles": return '#4ADE80'; // Green
        default: return '#9D814C'; // Gold
    }
}

function generateSVG(card) {
    const color = getThemeColor(card.type);
    const gold = '#9D814C';
    const width = 240;
    const height = 360;
    const centerX = width / 2;
    const centerY = height / 2;

    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#050208" />
    
    <!-- Cosmic Frame -->
    <rect x="10" y="10" width="${width - 20}" height="${height - 20}" rx="15" fill="none" stroke="${gold}" stroke-opacity="0.3" stroke-width="1" />
    <path d="M10 25 V10 H25 M${width - 25} 10 H${width - 10} V25 M10 ${height - 25} V${height - 10} H25 M${width - 25} ${height - 10} H${width - 10} V${height - 25}" fill="none" stroke="${gold}" stroke-opacity="0.6" stroke-width="1.5" />
    
    <!-- Glow Backdrop -->
    <defs>
        <radialGradient id="glow-${card.id}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.15" />
            <stop offset="100%" stop-color="${color}" stop-opacity="0" />
        </radialGradient>
    </defs>
    <circle cx="${centerX}" cy="${centerY}" r="${width * 0.4}" fill="url(#glow-${card.id})" />`;

    // Content specialized by Type
    if (card.type === "Major Arcana") {
        svg += drawMajorArcanaContent(card, centerX, centerY, color, gold);
    } else {
        svg += drawMinorArcanaContent(card, centerX, centerY, color, gold);
    }

    svg += `\n</svg>`;
    return svg;
}

function drawMajorArcanaContent(card, cx, cy, col, gold) {
    let content = `\n    <g stroke="${col}" stroke-width="2" fill="none" stroke-linecap="round">`;
    const name = card.name.toLowerCase();

    if (name.includes("fool")) {
        content += `<circle cx="0" cy="-60" r="30" transform="translate(${cx}, ${cy})" /> <!-- Sun -->
                    <path d="M-60 40 L0 10 L60 80" transform="translate(${cx}, ${cy})" /> <!-- Cliff -->
                    <circle cx="20" cy="-10" r="5" transform="translate(${cx}, ${cy})" /> <!-- Spirit -->`;
    } else if (name.includes("magician")) {
        content += `<path d="M-30 0 C-30 -20, -5 -20, 0 0 C5 20, 30 20, 30 0 C30 -20, 5 -20, 0 0 C-5 20, -30 20, -30 0" transform="translate(${cx}, ${cy}) scale(1.5)" /> <!-- Infinity -->
                    <rect x="-40" y="40" width="80" height="5" transform="translate(${cx}, ${cy})" /> <!-- Table -->`;
    } else if (name.includes("priestess")) {
        content += `<circle cx="0" cy="0" r="40" transform="translate(${cx}, ${cy})" />
                    <rect x="-60" y="-80" width="20" height="160" transform="translate(${cx}, ${cy})" /> <!-- Pillars -->
                    <rect x="40" y="-80" width="20" height="160" transform="translate(${cx}, ${cy})" />`;
    } else if (name.includes("empress")) {
        content += `<path d="M0 -60 L40 20 L-40 20 Z" transform="translate(${cx}, ${cy})" /> <!-- Shield -->
                    <circle cx="0" cy="0" r="50" stroke-dasharray="5,5" transform="translate(${cx}, ${cy})" />`;
    } else if (name.includes("emperor")) {
        content += `<rect x="-50" y="-50" width="100" height="100" transform="translate(${cx}, ${cy})" /> <!-- Throne -->
                    <line x1="0" y1="-70" x2="0" y2="70" transform="translate(${cx}, ${cy})" />`;
    } else if (name.includes("hierophant")) {
        content += `<line x1="0" y1="-60" x2="0" y2="60" transform="translate(${cx}, ${cy})" />
                    <line x1="-30" y1="-30" x2="30" y2="-30" transform="translate(${cx}, ${cy})" />
                    <line x1="-20" y1="-10" x2="20" y2="-10" transform="translate(${cx}, ${cy})" />
                    <line x1="-40" y1="-50" x2="40" y2="-50" transform="translate(${cx}, ${cy})" />`;
    } else if (name.includes("lovers")) {
        content += `<path d="M0 30 C-40 -10, -10 -40, 0 -10 C10 -40, 40 -10, 0 30" transform="translate(${cx}, ${cy}) scale(1.5)" /> <!-- Heart -->`;
    } else if (name.includes("chariot")) {
        content += `<rect x="-40" y="-20" width="80" height="60" transform="translate(${cx}, ${cy})" />
                    <circle cx="-30" cy="50" r="15" transform="translate(${cx}, ${cy})" />
                    <circle cx="30" cy="50" r="15" transform="translate(${cx}, ${cy})" />`;
    } else if (name.includes("strength")) {
        content += `<circle cx="0" cy="0" r="40" transform="translate(${cx}, ${cy})" />
                    <path d="M-50 -10 Q0 -60 50 -10" transform="translate(${cx}, ${cy})" fill="none" />`;
    } else if (name.includes("hermit")) {
        content += `<circle cx="20" cy="-30" r="15" transform="translate(${cx}, ${cy})" /> <!-- Lantern -->
                    <line x1="-20" y1="-80" x2="-20" y2="80" transform="translate(${cx}, ${cy})" /> <!-- Staff -->`;
    } else if (name.includes("wheel")) {
        content += `<circle cx="0" cy="0" r="50" transform="translate(${cx}, ${cy})" />
                    <circle cx="0" cy="0" r="20" transform="translate(${cx}, ${cy})" />
                    <line x1="-50" y1="0" x2="50" y2="0" transform="translate(${cx}, ${cy})" />
                    <line x1="0" y1="-50" x2="0" y2="50" transform="translate(${cx}, ${cy})" />`;
    } else if (name.includes("justice")) {
        content += `<line x1="-50" y1="-20" x2="50" y2="-20" transform="translate(${cx}, ${cy})" /> <!-- Scales -->
                    <line x1="0" y1="-40" x2="0" y2="60" transform="translate(${cx}, ${cy})" />
                    <path d="M-50 -20 L-50 20 M50 -20 L50 20" transform="translate(${cx}, ${cy})" />`;
    } else if (name.includes("hanged")) {
        content += `<line x1="-40" y1="-80" x2="40" y2="-80" transform="translate(${cx}, ${cy})" />
                    <line x1="0" y1="-80" x2="0" y2="40" transform="translate(${cx}, ${cy})" />
                    <path d="M0 40 L-20 60 M0 40 L20 60" transform="translate(${cx}, ${cy})" />`;
    } else if (name.includes("death")) {
        content += `<path d="M-30 60 L0 -40 L30 60 L-30 0 L30 0 Z" transform="translate(${cx}, ${cy})" /> <!-- Scythe/Abstract -->
                    <circle cx="0" cy="-60" r="10" fill="${col}" transform="translate(${cx}, ${cy})" />`;
    } else if (name.includes("temperance")) {
        content += `<path d="M-30 -40 L-10 20 M30 -40 L10 20" transform="translate(${cx}, ${cy})" /> <!-- Pouring -->
                    <circle cx="0" cy="40" r="20" transform="translate(${cx}, ${cy})" />`;
    } else if (name.includes("devil")) {
        content += `<path d="M-40 -40 L0 0 L40 -40 M-20 0 L-20 60 M20 0 L20 60" transform="translate(${cx}, ${cy})" /> <!-- Horns/Chains -->`;
    } else if (name.includes("tower")) {
        content += `<rect x="-25" y="-70" width="50" height="140" transform="translate(${cx}, ${cy})" />
                    <path d="M-40 -40 L-10 -70 M40 -40 L10 -70" stroke="${gold}" transform="translate(${cx}, ${cy})" /> <!-- Lightning -->`;
    } else if (name.includes("star")) {
        content += `<path d="M0 -60 L15 -15 L60 0 L15 15 L0 60 L-15 15 L-60 0 L-15 -15 Z" transform="translate(${cx}, ${cy})" /> <!-- Large Star -->`;
    } else if (name.includes("moon")) {
        content += `<path d="M10 -50 A 50 50 0 1 0 10 50 A 40 40 0 1 1 10 -50" transform="translate(${cx}, ${cy})" /> <!-- Crescent -->`;
    } else if (name.includes("sun")) {
        content += `<circle cx="0" cy="0" r="45" transform="translate(${cx}, ${cy})" />
                    <g transform="translate(${cx}, ${cy})">
                        ${Array.from({ length: 8 }).map((_, i) => `<line x1="0" y1="-50" x2="0" y2="-70" transform="rotate(${i * 45})" />`).join('')}
                    </g>`;
    } else if (name.includes("judgement")) {
        content += `<path d="M-20 -40 L20 -40 L10 40 L-10 40 Z" transform="translate(${cx}, ${cy})" /> <!-- Trumpet -->
                    <line x1="0" y1="40" x2="0" y2="80" transform="translate(${cx}, ${cy})" />`;
    } else if (name.includes("world")) {
        content += `<circle cx="0" cy="0" r="60" transform="translate(${cx}, ${cy})" stroke-dasharray="10,5" />
                    <ellipse cx="0" cy="0" rx="30" ry="55" transform="translate(${cx}, ${cy})" />`;
    } else {
        // Fallback for any missed names
        content += `<circle cx="0" cy="0" r="40" transform="translate(${cx}, ${cy})" />
                    <line x1="-50" y1="0" x2="50" y2="0" transform="translate(${cx}, ${cy})" />
                    <line x1="0" y1="-50" x2="0" y2="50" transform="translate(${cx}, ${cy})" />`;
    }

    content += `\n    </g>`;
    return content;
}

function drawMinorArcanaContent(card, cx, cy, col, gold) {
    let content = `\n    <g transform="translate(${cx}, ${cy})">`;
    const count = card.value || 1;
    const type = card.type;
    const name = card.name.toLowerCase();

    // Check if it's a Court Card (Page/11, Knight/12, Queen/13, King/14)
    if (count >= 11) {
        content += `\n        <g transform="scale(1.2)">`;
        // Background decorative circle for royalty
        content += `<circle cx="0" cy="0" r="60" stroke="${gold}" stroke-opacity="0.1" fill="none" />`;

        if (name.includes("page")) {
            // Page: Suit + Scroll/Feather
            content += `<g transform="translate(0, 10)">${drawSuitIcon(type, col)}</g>`;
            content += `<path d="M-15 -40 L15 -40 L15 -10 L-15 -10 Z M-15 -35 H15 M-15 -30 H15" stroke="${gold}" stroke-width="1.5" /> <!-- Scroll -->`;
        } else if (name.includes("knight")) {
            // Knight: Suit + Shield/Helmet
            content += `<g transform="translate(-20, 0)">${drawSuitIcon(type, col)}</g>`;
            content += `<path d="M10 -30 L40 -30 L40 10 Q25 30 10 10 Z" stroke="${gold}" stroke-width="2" /> <!-- Shield -->`;
        } else if (name.includes("queen")) {
            // Queen: Suit + Small Crown
            content += `<g transform="translate(0, 20)">${drawSuitIcon(type, col)}</g>`;
            content += `<path d="M-30 -20 L-20 0 L0 -10 L20 0 L30 -20 L15 -10 L0 -30 L-15 -10 Z" stroke="${gold}" stroke-width="2" /> <!-- Queen Crown -->`;
        } else if (name.includes("king")) {
            // King: Suit + Ornate Crown (scaled to match Queen)
            content += `<g transform="translate(0, 25)">${drawSuitIcon(type, col)}</g>`;
            content += `<path d="M-30 -10 L-22 15 H22 L30 -10 L15 0 L0 -30 L-15 0 Z" stroke="${gold}" stroke-width="2" /> <!-- King Crown -->
                        <line x1="-22" y1="15" x2="22" y2="15" stroke="${gold}" stroke-width="3" stroke-opacity="0.3" />`;
        }
        content += `\n        </g>`;
    } else {
        // Standard Grid for 1-10
        let rows = Math.ceil(Math.sqrt(count));
        let cols = Math.ceil(count / rows);
        let spacing = count > 6 ? 40 : 60;

        for (let i = 0; i < count; i++) {
            let r = Math.floor(i / cols);
            let c = i % cols;
            let x = (c - (cols - 1) / 2) * spacing;
            let y = (r - (rows - 1) / 2) * spacing;

            content += `\n        <g transform="translate(${x}, ${y}) scale(${count > 6 ? 0.7 : 1})">`;
            content += drawSuitIcon(type, col);
            content += `\n        </g>`;
        }
    }

    content += `\n    </g>`;
    return content;
}

function drawSuitIcon(type, col) {
    let icon = `<g fill="none" stroke="${col}" stroke-width="2">`;
    if (type === "Wands") {
        icon += `<line x1="0" y1="-20" x2="0" y2="20" /> <path d="M-5 -20 L0 -30 L5 -20" />`;
    } else if (type === "Cups") {
        icon += `<path d="M-12 -10 A 12 12 0 0 0 12 -10 H -12 Z" /> <line x1="0" y1="2" x2="0" y2="15" /> <line x1="-8" y1="15" x2="8" y2="15" />`;
    } else if (type === "Swords") {
        icon += `<line x1="0" y1="-25" x2="0" y2="10" /> <line x1="-12" y1="2" x2="12" y2="2" /> <line x1="0" y1="10" x2="0" y2="20" />`;
    } else if (type === "Pentacles") {
        icon += `<circle cx="0" cy="0" r="15" /> <path d="M0 -8 L2 0 L10 0 L3 5 L5 12 L0 7 L-5 12 L-3 5 L-10 0 L-2 0 Z" stroke-width="1" />`;
    }
    icon += `</g>`;
    return icon;
}

console.log('Generating Representative SVG for all cards...');
cardsData.forEach(card => {
    const svg = generateSVG(card);
    const fileName = `card-${card.id}.svg`;
    fs.writeFileSync(path.join(outputDir, fileName), svg);
});
console.log(`Successfully generated ${cardsData.length} representative cards in public/images/`);
