const fs = require('fs');
const cssToAppend = `
/* ========== BIRD FLOCK TEXT FLYING EFFECT ========== */
#particleCanvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    display: block;
}
`;
fs.appendFileSync('C:/Users/renzh/Desktop/tokyo-trip/style.css', cssToAppend, 'utf8');

const jsToAppend = `
// ========== BIRD FLOCK TEXT FLYING EFFECT ===========
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    const hero = document.querySelector('.hero');
    canvas.width = hero ? hero.clientWidth : window.innerWidth;
    canvas.height = hero ? hero.clientHeight : window.innerHeight;

    let particlesArray = [];

    const mouse = {
        x: null,
        y: null,
        radius: 120
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

    class Particle {
        constructor(x, y) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.baseX = x;
            this.baseY = y;
            this.size = Math.random() * 2 + 1.5;
            this.density = (Math.random() * 30) + 1;
            this.vx = 0;
            this.vy = 0;
            const colors = ['#ffffff', '#ffb6c1', '#ffc0cb', '#ff69b4'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            
            let angle = Math.atan2(this.vy, this.vx);
            if (Math.abs(this.vx) < 0.1 && Math.abs(this.vy) < 0.1) {
                angle = -Math.PI / 2; 
            }
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
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouse.radius && mouse.x != undefined) {
                this.vx -= directionX;
                this.vy -= directionY;
            } else {
                let dxBase = this.baseX - this.x;
                let dyBase = this.baseY - this.y;
                this.vx += dxBase * 0.05;
                this.vy += dyBase * 0.05;
            }

            this.vx *= 0.85;
            this.vy *= 0.85;
            this.x += this.vx;
            this.y += this.vy;
        }
    }

    function init() {
        particlesArray = [];
        
        const offscreenCanvas = document.createElement('canvas');
        const offCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
        offscreenCanvas.width = canvas.width;
        offscreenCanvas.height = canvas.height;

        const text = "momotale";
        
        offCtx.fillStyle = 'white';
        let fontSize = Math.min(canvas.width / 5, 120);
        offCtx.font = 'bold ' + fontSize + 'px Verdana';
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';
        offCtx.fillText(text, offscreenCanvas.width / 2, offscreenCanvas.height / 2);

        const textCoordinates = offCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);

        for (let y = 0, y2 = textCoordinates.height; y < y2; y += 6) {
            for (let x = 0, x2 = textCoordinates.width; x < x2; x += 6) {
                if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
                    let positionX = x;
                    let positionY = y;
                    particlesArray.push(new Particle(positionX, positionY));
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].draw();
            particlesArray[i].update();
        }
        requestAnimationFrame(animate);
    }

    setTimeout(() => {
        init();
        animate();
    }, 100);

    window.addEventListener('resize', function() {
        canvas.width = hero ? hero.clientWidth : window.innerWidth;
        canvas.height = hero ? hero.clientHeight : window.innerHeight;
        init();
    });
});
`;
fs.appendFileSync('C:/Users/renzh/Desktop/tokyo-trip/script.js', jsToAppend, 'utf8');

