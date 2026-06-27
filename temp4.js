const fs = require('fs');

let js = fs.readFileSync('C:/Users/renzh/Desktop/tokyo-trip/script.js', 'utf8');

const startIndex = js.indexOf('// ========== DYNAMIC BIRD FLOCK EFFECT ==========');
if (startIndex !== -1) {
    js = js.substring(0, startIndex).trimEnd() + '\n\n';
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
    const numberOfBirds = 250;

    const mouse = {
        x: undefined,
        y: undefined,
        radius: 120
    };

    window.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    window.addEventListener('mouseout', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    // 群聚伴飛目標 (Leader)
    const flockTarget = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: 3,
        vy: 2
    };

    class Bird {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 4;
            this.vy = (Math.random() - 0.5) * 4;
            this.size = Math.random() * 2 + 1.5;
            
            this.maxSpeed = Math.random() * 1.5 + 2.5; 
            this.minSpeed = 1.0;

            const colors = ['#ffffff', '#ffb6c1', '#ffc0cb', '#ff69b4', '#e0603e'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            
            // 隨機跟隨力度，創造層次感
            this.followForce = Math.random() * 0.015 + 0.005;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            
            let angle = Math.atan2(this.vy, this.vx);
            ctx.rotate(angle);

            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(this.size * 2.5, 0);       
            ctx.lineTo(-this.size, -this.size * 1.2); 
            ctx.lineTo(0, 0);                   
            ctx.lineTo(-this.size, this.size * 1.2);  
            ctx.closePath();
            ctx.fill();
            
            ctx.restore();
        }

        update() {
            // 1. 群聚伴飛 (朝著虛擬領頭羊飛)
            let dxTarget = flockTarget.x - this.x;
            let dyTarget = flockTarget.y - this.y;
            this.vx += dxTarget * this.followForce;
            this.vy += dyTarget * this.followForce;

            // 2. 隨機亂流
            this.vx += (Math.random() - 0.5) * 0.3;
            this.vy += (Math.random() - 0.5) * 0.3;

            // 3. 滑鼠排斥
            if (mouse.x !== undefined) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    let force = (mouse.radius - distance) / mouse.radius;
                    let pushX = (dx / distance) * force * 5; 
                    let pushY = (dy / distance) * force * 5;
                    this.vx += pushX;
                    this.vy += pushY;
                }
            }

            // 4. 速度限制
            let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > this.maxSpeed) {
                this.vx = (this.vx / speed) * this.maxSpeed;
                this.vy = (this.vy / speed) * this.maxSpeed;
            } else if (speed < this.minSpeed) {
                this.vx = (this.vx / speed) * this.minSpeed;
                this.vy = (this.vy / speed) * this.minSpeed;
            }

            // 5. 更新位置
            this.x += this.vx;
            this.y += this.vy;
        }
    }

    function init() {
        birdsArray = [];
        for (let i = 0; i < numberOfBirds; i++) {
            birdsArray.push(new Bird());
        }
    }

    function updateFlockTarget() {
        // 讓領頭羊自己在畫面中平滑游走
        flockTarget.vx += (Math.random() - 0.5) * 0.5;
        flockTarget.vy += (Math.random() - 0.5) * 0.5;
        
        // 領頭羊限速
        let speed = Math.sqrt(flockTarget.vx * flockTarget.vx + flockTarget.vy * flockTarget.vy);
        if(speed > 4) {
            flockTarget.vx = (flockTarget.vx / speed) * 4;
            flockTarget.vy = (flockTarget.vy / speed) * 4;
        }

        flockTarget.x += flockTarget.vx;
        flockTarget.y += flockTarget.vy;

        // 領頭羊邊界反彈
        if (flockTarget.x < 100) flockTarget.vx += 0.5;
        if (flockTarget.x > canvas.width - 100) flockTarget.vx -= 0.5;
        if (flockTarget.y < 100) flockTarget.vy += 0.5;
        if (flockTarget.y > canvas.height - 100) flockTarget.vy -= 0.5;
    }

    function animate() {
        // 完全清除畫布，避免殘影破蓋住 CSS 漸層背景
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        updateFlockTarget();

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
