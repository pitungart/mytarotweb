// Star Particles & Denser Constellations Background (Instance Mode)

const starSketch = (p) => {
    let stars = [];
    let constellations = [];

    // --- [1] KEPADATAN (DENSITY) ---
    // Atur jumlah bintang latar dan jumlah maksimal rasi bintang yang muncul bersamaan
    const starCount = 500; // Jumlah bintang latar belakang (falling stars)
    const maxConstellations = 10; // Jumlah maksimal rasi bintang di layar

    // --- [2] VARIASI POLA (PATTERN VARIATIONS) ---
    // Daftar koordinat untuk membentuk berbagai rasi bintang
    const patterns = [
        // Big Dipper
        { points: [[0, 0], [40, -10], [90, 0], [120, 20], [110, 60], [160, 70], [180, 40]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]] },
        // Cassiopeia
        { points: [[0, 0], [30, 40], [70, 10], [110, 50], [150, 0]], lines: [[0, 1], [1, 2], [2, 3], [3, 4]] },
        // Simple Triangle/Pyramid
        { points: [[50, 0], [0, 80], [100, 80]], lines: [[0, 1], [1, 2], [2, 0]] },
        // Orion-ish
        { points: [[0, 0], [40, 10], [80, 0], [20, 60], [40, 65], [60, 70], [0, 120], [40, 110], [80, 120]], lines: [[0, 1], [1, 2], [3, 4], [4, 5], [0, 3], [2, 5], [3, 6], [5, 8], [6, 7], [7, 8]] },
        // Northern Cross (Cygnus)
        { points: [[50, 0], [50, 60], [50, 150], [0, 60], [100, 60]], lines: [[0, 1], [1, 2], [3, 1], [1, 4]] },
        // Little Dipper
        { points: [[0, 0], [-20, 30], [-10, 60], [30, 70], [60, 70], [60, 40], [30, 40]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]] }
    ];

    p.setup = () => {
        let cnv = p.createCanvas(p.windowWidth, p.windowHeight);
        cnv.parent('star-canvas');

        // Membuat field bintang awal
        for (let i = 0; i < starCount; i++) {
            stars.push(new Star(p));
        }

        // Munculkan rasi bintang pertama kali
        for (let i = 0; i < maxConstellations; i++) {
            spawnConstellation();
        }

        p.noStroke();
    };

    p.draw = () => {
        p.clear();

        // Menggambar Rasi Bintang
        for (let i = constellations.length - 1; i >= 0; i--) {
            constellations[i].update();
            constellations[i].show();
            if (constellations[i].isDead) {
                constellations.splice(i, 1);
                spawnConstellation();
            }
        }

        // Menggambar Bintang Latar (Falling Stars)
        for (let s of stars) {
            s.update();
            s.show();
        }
    };

    function spawnConstellation() {
        const pattern = p.random(patterns);
        const x = p.random(50, p.width - 200);
        const y = p.random(50, p.height - 200);
        constellations.push(new Constellation(p, x, y, pattern));
    }

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    class Constellation {
        constructor(p, x, y, pattern) {
            this.p = p;
            this.x = x;
            this.y = y;
            this.pattern = pattern;
            this.alpha = 0;

            // --- [3] KEJELASAN VISUAL (RASI BINTANG) ---
            // targetAlpha: Seberapa terang rasi bintang saat muncul maksimal (0-255)
            this.targetAlpha = p.random(180, 155);

            // --- [4] DINAMIKA CEPAT (ANIMASI) ---
            // fadeSpeed: Kecepatan rasi bintang memudar masuk/keluar
            this.fadeSpeed = p.random(1.0, 2.5);

            this.fadeDir = 1;
            this.isDead = false;
            this.scale = p.random(0.5, 1.0);
            this.rotation = p.random(p.TWO_PI);
        }

        update() {
            if (this.fadeDir > 0) {
                // Proses Memudar Masuk (Fade In)
                this.alpha += this.fadeSpeed;
                if (this.alpha >= this.targetAlpha) {
                    this.fadeDir = 0;
                    // holdTimer: Durasi rasi bintang bertahan di layar sebelum memudar keluar
                    this.holdTimer = p.frameCount + p.random(150, 400);
                }
            } else if (this.fadeDir === 0) {
                // Menahan posisi diam
                if (p.frameCount > this.holdTimer) {
                    this.fadeDir = -1;
                }
            } else {
                // Proses Memudar Keluar (Fade Out)
                this.alpha -= this.fadeSpeed * 0.3;
                if (this.alpha <= 0) {
                    this.isDead = true;
                }
            }
        }

        show() {
            this.p.push();
            this.p.translate(this.x, this.y);
            this.p.rotate(this.rotation);
            this.p.scale(this.scale);

            // --- [3] KEJELASAN VISUAL (GARIS PENGHUBUNG) ---
            // Mengatur transparansi dan ketebalan garis rasi bintang
            this.p.stroke(157, 129, 76, this.alpha * 0.5);
            this.p.strokeWeight(0.8);
            for (let line of this.pattern.lines) {
                let p1 = this.pattern.points[line[0]];
                let p2 = this.pattern.points[line[1]];
                this.p.line(p1[0], p1[1], p2[0], p2[1]);
            }

            // Menggambar Titik Bintang Rasi
            this.p.noStroke();
            for (let pt of this.pattern.points) {
                // Titik Inti Bintang
                this.p.fill(157, 129, 76, this.alpha);
                this.p.ellipse(pt[0], pt[1], 4);

                // Efek Cahaya (Glow) di sekeliling titik rasi bintang
                this.p.fill(157, 129, 76, this.alpha * 0.4);
                this.p.ellipse(pt[0], pt[1], 10);
            }
            this.p.pop();
        }
    }

    class Star {
        constructor(p5Instance) {
            this.p = p5Instance;
            this.reset();
            this.y = this.p.random(this.p.height);
        }

        reset() {
            this.x = this.p.random(this.p.width);
            this.y = this.p.random(-50, -10);

            // --- [5] BINTANG LATAR (UKURAN & KECEPATAN) ---
            this.size = this.p.random(0.5, 2.0); // Ukuran bintang kecil (titik-titik latar)
            this.speed = this.p.random(0.05, 0.4); // Kecepatan gerak jatuh (floating)

            // Transparansi dan Kedipan bintang latar
            this.alpha = this.p.random(30, 230);
            this.baseX = this.x;
            this.twinkleSpeed = this.p.random(0.01, 0.05); // Kecepatan kedipan
            this.twinkleDir = this.p.random() > 0.5 ? 1 : -1;
        }

        update() {
            this.y += this.speed;

            // Logika Kedipan (Twinkling)
            this.alpha += this.twinkleSpeed * 5 * this.twinkleDir;
            if (this.alpha >= 240 || this.alpha <= 20) this.twinkleDir *= -1;

            // Interaksi Tikus (Mouse Repel)
            let d = this.p.dist(this.p.mouseX, this.p.mouseY, this.x, this.y);
            if (d < 100) {
                let force = this.p.map(d, 0, 100, 2, 0);
                if (this.p.mouseX < this.x) this.x += force;
                else this.x -= force;
            } else {
                this.x += (this.baseX - this.x) * 0.01;
            }

            if (this.y > this.p.height) this.reset();
        }

        show() {
            // Menggambar Bintang Latar
            this.p.fill(157, 129, 76, this.alpha);
            this.p.ellipse(this.x, this.y, this.size);

            // Efek Glow samar pada bintang latar yang lebih besar
            if (this.size > 1.4) {
                this.p.fill(157, 129, 76, this.alpha * 0.2);
                this.p.ellipse(this.x, this.y, this.size * 3);
            }
        }
    }
};

new p5(starSketch);
