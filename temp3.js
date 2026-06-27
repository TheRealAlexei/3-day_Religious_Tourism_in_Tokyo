const fs = require('fs');

// 1. Update script.js to fix the dark trail
let js = fs.readFileSync('C:/Users/renzh/Desktop/tokyo-trip/script.js', 'utf8');
js = js.replace(/ctx\.fillStyle = 'rgba\(11, 12, 16, 0\.3\)';/g, "ctx.fillStyle = 'rgba(255, 235, 220, 0.35)';");
fs.writeFileSync('C:/Users/renzh/Desktop/tokyo-trip/script.js', js, 'utf8');

// 2. Update style.css to make the sunset much richer and less monotonous
let css = fs.readFileSync('C:/Users/renzh/Desktop/tokyo-trip/style.css', 'utf8');

css = css.replace(/--clr-bg: #fdf6ee;/g, '--clr-bg: #fff0e6;');
css = css.replace(/--clr-surface: #fff8f0;/g, '--clr-surface: #ffffff;');
css = css.replace(/--clr-surface-2: #f5ebe0;/g, '--clr-surface-2: #ffe1d0;');
css = css.replace(/--clr-border: rgba\(198, 160, 120, 0\.35\);/g, '--clr-border: rgba(224, 96, 62, 0.25);');

css = css.replace(/linear-gradient\(180deg, #fdf6ee 0%, #fceee0 40%, #f8e4d0 100%\)/g, 
    'linear-gradient(180deg, #fff0e6 0%, #ffcba4 50%, #ff9e7a 100%)');

css = css.replace(/linear-gradient\(135deg, rgba\(255, 200, 140, 0\.4\) 0%, rgba\(240, 150, 100, 0\.3\) 35%, rgba\(180, 100, 150, 0\.25\) 70%, rgba\(100, 80, 140, 0\.35\) 100%\)/g, 
    'linear-gradient(135deg, rgba(255, 126, 95, 0.4) 0%, rgba(254, 180, 123, 0.35) 40%, rgba(224, 96, 62, 0.25) 70%, rgba(139, 95, 176, 0.2) 100%)');

css = css.replace(/linear-gradient\(180deg, #fceee0 0%, #f5d5b8 50%, #e8b89a 100%\)/g, 
    'linear-gradient(180deg, #ffd3b6 0%, #ffaa85 50%, #e0603e 100%)');

css = css.replace(/linear-gradient\(180deg, var\(--clr-bg\) 0%, rgba\(240, 180, 130, 0\.2\) 50%, var\(--clr-bg\) 100%\)/g,
    'linear-gradient(180deg, #ff9e7a 0%, #ffcba4 50%, #fff0e6 100%)');

css = css.replace(/background: rgba\(253, 246, 238, 0\.88\);/g, 'background: rgba(255, 240, 230, 0.9);');

fs.writeFileSync('C:/Users/renzh/Desktop/tokyo-trip/style.css', css, 'utf8');
