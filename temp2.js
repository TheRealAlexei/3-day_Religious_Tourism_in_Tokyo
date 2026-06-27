const fs = require('fs');

// 1. Update index.html
let html = fs.readFileSync('C:/Users/renzh/Desktop/tokyo-trip/index.html', 'utf8');
html = html.replace('<canvas id="particleCanvas"></canvas>', '<canvas id="flockCanvas"></canvas>');
fs.writeFileSync('C:/Users/renzh/Desktop/tokyo-trip/index.html', html, 'utf8');

// 2. Update style.css
let css = fs.readFileSync('C:/Users/renzh/Desktop/tokyo-trip/style.css', 'utf8');
css = css.replace(/#particleCanvas \{[\s\S]*?\}/, '#flockCanvas {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    z-index: 1;\n    pointer-events: none;\n}');
if (!css.includes('#flockCanvas {')) {
    css += '\n#flockCanvas {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    z-index: 1;\n    pointer-events: none;\n}\n';
}
fs.writeFileSync('C:/Users/renzh/Desktop/tokyo-trip/style.css', css, 'utf8');

// 3. Update script.js
let js = fs.readFileSync('C:/Users/renzh/Desktop/tokyo-trip/script.js', 'utf8');
const startIndex = js.indexOf('// ========== TEXT PARTICLE EFFECT');
const startIndex2 = js.indexOf('// ========== BIRD FLOCK');
let start = -1;
if (startIndex !== -1) start = startIndex;
if (startIndex2 !== -1 && (start === -1 || startIndex2 < start)) start = startIndex2;

if (start !== -1) {
    js = js.substring(0, start).trimEnd() + '\n\n';
}

const newJs = \// ========== DYNAMIC BIRD FLOCK EFFECT ==========
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('flockCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const hero = document.querySelector('.hero');

    function resizeCanvas() {
        canvas.width = hero ? hero.clientWidth : window.innerWidth;
        canvas.height = hero ? hero.clientHeight : window.innerHeight;
    }
    resizeCanvas();

    let birdsArray = [];
    const numberOfBirds = 300;

    const mouse = {
        x: undefined,
        y: undefined,
        radius: 150
    }

    window.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    window.addEventListener('mouseout', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    class Bird {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 4;
            this.vy = (Math.random() - 0.5) * 4;
            this.size = Math.random() * 2 + 1.5;
            
            this.maxSpeed = Math.random() * 2 + 3; 
            this.minSpeed = 1.5;

            const colors = ['#ffffff', '#ffb6c1', '#ffc0cb', '#ff69b4'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            
            let angle = Math.atan2(this.vy, this.vx);
            ctx.rotate(angle);

            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(this.size * 2, 0);       
            ctx.lineTo(-this.size, -this.size); 
            ctx.lineTo(0, 0);                   
            ctx.lineTo(-this.size, this.size);  
            ctx.closePath();
            ctx.fill();
            
            ctx.restore();
        }

        update() {
            this.vx += (Math.random() - 0.5) * 0.4;
            this.vy += (Math.random() - 0.5) * 0.4;

            if (mouse.x !== undefined) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    let force = (mouse.radius - distance) / mouse.radius;
                    let pushX = (dx / distance) * force * 3;
                    let pushY = (dy / distance) * force * 3;
                    
                    this.vx += pushX;
                    this.vy += pushY;
                }
            }

            let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > this.maxSpeed) {
                this.vx = (this.vx / speed) * this.maxSpeed;
                this.vy = (this.vy / speed) * this.maxSpeed;
            } else if (speed < this.minSpeed) {
                this.vx = (this.vx / speed) * this.minSpeed;
                this.vy = (this.vy / speed) * this.minSpeed;
            }

            this.x += this.vx;
            this.y += this.vy;

            if (this.x < -20) this.x = canvas.width + 20;
            if (this.x > canvas.width + 20) this.x = -20;
            if (this.y < -20) this.y = canvas.height + 20;
            if (this.y > canvas.height + 20) this.y = -20;
        }
    }

    function init() {
        birdsArray = [];
        for (let i = 0; i < numberOfBirds; i++) {
            birdsArray.push(new Bird());
        }
    }

    function animate() {
        // Use sunset background color for the clearing trail effect
        // so it doesn't black out the hero section
        ctx.fillStyle = 'rgba(253, 246, 238, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < birdsArray.length; i++) {
            birdsArray[i].update();
            birdsArray[i].draw();
        }
        requestAnimationFrame(animate);
    }

    init();
    animate();

    window.addEventListener('resize', resizeCanvas);
});
\;

fs.writeFileSync('C:/Users/renzh/Desktop/tokyo-trip/script.js', js + newJs, 'utf8');
