// Slide Navigation
let currentSlide = 1;
const totalSlides = 7;

// Initialize presentation
document.addEventListener('DOMContentLoaded', function() {
    updateSlideCounter();
    updateNavButtons();
    setupArtworkSlideshow(); // Initialize artwork slideshow
    initDemos();
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });
    
    // Button navigation
    document.getElementById('prev-btn').addEventListener('click', prevSlide);
    document.getElementById('next-btn').addEventListener('click', nextSlide);
});

function nextSlide() {
    if (currentSlide < totalSlides) {
        document.querySelector(`[data-slide="${currentSlide}"]`).classList.remove('active');
        currentSlide++;
        document.querySelector(`[data-slide="${currentSlide}"]`).classList.add('active');
        updateSlideCounter();
        updateNavButtons();
    }
}

function prevSlide() {
    if (currentSlide > 1) {
        document.querySelector(`[data-slide="${currentSlide}"]`).classList.remove('active');
        currentSlide--;
        document.querySelector(`[data-slide="${currentSlide}"]`).classList.add('active');
        updateSlideCounter();
        updateNavButtons();
    }
}

function updateSlideCounter() {
    document.getElementById('current-slide').textContent = currentSlide;
}

function updateNavButtons() {
    document.getElementById('prev-btn').disabled = currentSlide === 1;
    document.getElementById('next-btn').disabled = currentSlide === totalSlides;
}

// Artwork Slideshow (Slide 6)
let currentArtworkIndex = 0;
const artworkSlides = [];
const indicators = [];

function setupArtworkSlideshow() {
    const artworkSlidesElements = document.querySelectorAll('.artwork-slide');
    const indicatorElements = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-artwork');
    const nextBtn = document.querySelector('.next-artwork');
    
    // Convert NodeLists to arrays
    artworkSlides.push(...artworkSlidesElements);
    indicators.push(...indicatorElements);
    
    // Setup navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => changeArtwork(-1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => changeArtwork(1));
    }
    
    // Setup indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToArtwork(index));
    });
    
    // Keyboard navigation for artwork slideshow (only when on slide 6)
    document.addEventListener('keydown', (e) => {
        if (currentSlide === 6) {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                changeArtwork(-1);
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                changeArtwork(1);
            }
        }
    });
}

function changeArtwork(direction) {
    const newIndex = currentArtworkIndex + direction;
    
    if (newIndex < 0 || newIndex >= artworkSlides.length) return;
    
    goToArtwork(newIndex);
}

function goToArtwork(index) {
    // Remove active class from current
    artworkSlides[currentArtworkIndex].classList.remove('active-artwork');
    indicators[currentArtworkIndex].classList.remove('active-indicator');
    
    // Add active class to new
    currentArtworkIndex = index;
    artworkSlides[currentArtworkIndex].classList.add('active-artwork');
    indicators[currentArtworkIndex].classList.add('active-indicator');
}


// ============================================
// GENERATIVE ART DEMOS
// ============================================

// Demo 1: Simple Processing-style Sketch (Slide 4)
// Demonstrates basic drawing and interactivity
let demo1Active = false;
let demo1Canvas, demo1Ctx;
let particles1 = [];

function initDemo1() {
    demo1Canvas = document.getElementById('canvas1');
    if (!demo1Canvas) return;
    
    demo1Ctx = demo1Canvas.getContext('2d');
    demo1Canvas.width = demo1Canvas.offsetWidth;
    demo1Canvas.height = demo1Canvas.offsetHeight;
    
    // Initialize particles
    for (let i = 0; i < 50; i++) {
        particles1.push({
            x: Math.random() * demo1Canvas.width,
            y: Math.random() * demo1Canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            radius: Math.random() * 3 + 1,
            hue: Math.random() * 60 + 140 // Green-cyan range
        });
    }
    
    demo1Active = true;
    animateDemo1();
    
    // Mouse interaction
    demo1Canvas.addEventListener('mousemove', function(e) {
        const rect = demo1Canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        particles1.forEach(p => {
            const dx = x - p.x;
            const dy = y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 100) {
                const angle = Math.atan2(dy, dx);
                p.vx -= Math.cos(angle) * 0.5;
                p.vy -= Math.sin(angle) * 0.5;
            }
        });
    });
}

function animateDemo1() {
    if (!demo1Active) return;
    
    // Fade effect
    demo1Ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    demo1Ctx.fillRect(0, 0, demo1Canvas.width, demo1Canvas.height);
    
    // Update and draw particles
    particles1.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        // Bounce off edges
        if (p.x < 0 || p.x > demo1Canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > demo1Canvas.height) p.vy *= -1;
        
        // Friction
        p.vx *= 0.99;
        p.vy *= 0.99;
        
        // Draw particle
        demo1Ctx.beginPath();
        demo1Ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        demo1Ctx.fillStyle = `hsla(${p.hue}, 100%, 50%, 0.8)`;
        demo1Ctx.fill();
        
        // Draw connections
        particles1.forEach(other => {
            const dx = other.x - p.x;
            const dy = other.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 80) {
                demo1Ctx.beginPath();
                demo1Ctx.moveTo(p.x, p.y);
                demo1Ctx.lineTo(other.x, other.y);
                demo1Ctx.strokeStyle = `hsla(${p.hue}, 100%, 50%, ${1 - dist / 80})`;
                demo1Ctx.lineWidth = 0.5;
                demo1Ctx.stroke();
            }
        });
    });
    
    requestAnimationFrame(animateDemo1);
}

// Demo 2: Complex Generative System (Slide 6)
// Demonstrates Process-style algorithm with emergent behavior
let demo2Active = false;
let demo2Canvas, demo2Ctx;
let agents = [];
let demo2Running = true;

function initDemo2() {
    demo2Canvas = document.getElementById('canvas2');
    if (!demo2Canvas) return;
    
    demo2Ctx = demo2Canvas.getContext('2d');
    demo2Canvas.width = demo2Canvas.offsetWidth;
    demo2Canvas.height = demo2Canvas.offsetHeight;
    
    // Initialize agents with complex behaviors
    for (let i = 0; i < 100; i++) {
        agents.push({
            x: Math.random() * demo2Canvas.width,
            y: Math.random() * demo2Canvas.height,
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 2 + 1,
            turnRate: (Math.random() - 0.5) * 0.1,
            hue: Math.random() * 30 + 150,
            size: Math.random() * 2 + 1,
            trail: []
        });
    }
    
    demo2Active = true;
    animateDemo2();
}

function animateDemo2() {
    if (!demo2Active) return;
    
    if (demo2Running) {
        // Subtle fade for trail effect
        demo2Ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        demo2Ctx.fillRect(0, 0, demo2Canvas.width, demo2Canvas.height);
        
        agents.forEach((agent, index) => {
            // Update agent
            agent.angle += agent.turnRate;
            
            // Check nearby agents and adjust behavior
            agents.forEach((other, otherIndex) => {
                if (index !== otherIndex) {
                    const dx = other.x - agent.x;
                    const dy = other.y - agent.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    // Alignment behavior
                    if (dist < 50 && dist > 0) {
                        const angleTo = Math.atan2(dy, dx);
                        const angleDiff = angleTo - agent.angle;
                        agent.angle += angleDiff * 0.05;
                    }
                    
                    // Separation behavior
                    if (dist < 20 && dist > 0) {
                        const angleAway = Math.atan2(-dy, -dx);
                        agent.angle += (angleAway - agent.angle) * 0.1;
                    }
                }
            });
            
            // Move agent
            const prevX = agent.x;
            const prevY = agent.y;
            
            agent.x += Math.cos(agent.angle) * agent.speed;
            agent.y += Math.sin(agent.angle) * agent.speed;
            
            // Wrap around edges
            if (agent.x < 0) agent.x = demo2Canvas.width;
            if (agent.x > demo2Canvas.width) agent.x = 0;
            if (agent.y < 0) agent.y = demo2Canvas.height;
            if (agent.y > demo2Canvas.height) agent.y = 0;
            
            // Draw line from previous position
            demo2Ctx.beginPath();
            demo2Ctx.moveTo(prevX, prevY);
            demo2Ctx.lineTo(agent.x, agent.y);
            demo2Ctx.strokeStyle = `hsla(${agent.hue}, 100%, 60%, 0.6)`;
            demo2Ctx.lineWidth = agent.size;
            demo2Ctx.stroke();
            
            // Draw agent
            demo2Ctx.beginPath();
            demo2Ctx.arc(agent.x, agent.y, agent.size * 1.5, 0, Math.PI * 2);
            demo2Ctx.fillStyle = `hsla(${agent.hue}, 100%, 70%, 0.8)`;
            demo2Ctx.fill();
        });
    }
    
    requestAnimationFrame(animateDemo2);
}

function resetDemo2() {
    if (!demo2Canvas) return;
    
    // Clear canvas
    demo2Ctx.fillStyle = '#000000';
    demo2Ctx.fillRect(0, 0, demo2Canvas.width, demo2Canvas.height);
    
    // Reinitialize agents
    agents = [];
    for (let i = 0; i < 100; i++) {
        agents.push({
            x: Math.random() * demo2Canvas.width,
            y: Math.random() * demo2Canvas.height,
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 2 + 1,
            turnRate: (Math.random() - 0.5) * 0.1,
            hue: Math.random() * 30 + 150,
            size: Math.random() * 2 + 1,
            trail: []
        });
    }
}

function toggleDemo2() {
    demo2Running = !demo2Running;
}

// ============================================
// P5.JS DEMOS - Translated from Processing
// ============================================

// Demo 3: Superformula (Slide 5) - Generative organic forms
let demo3;
let demo3Active = false;

function initDemo3() {
    if (demo3Active) return;
    
    const container = document.getElementById('canvas3');
    if (!container) {
        console.error('Canvas3 container not found');
        return;
    }
    
    demo3Active = true;
    
    demo3 = new p5(function(p) {
        let scaler = 180;
        let m = 2;
        let n1 = 18;
        let n2 = 1;
        let n3 = 1;
        
        p.setup = function() {
            let w = container.offsetWidth || 700;
            let h = 400;
            p.createCanvas(w, h);
            p.frameRate(30);
        };
        
        p.draw = function() {
            p.background(0);
            p.push();
            p.translate(p.width/2, p.height/2);
            
            let newscaler = scaler;
            for (let s = 16; s > 0; s--) {
                p.noFill();
                p.stroke(255);
                p.beginShape();
                let mm = m + s;
                let nn1 = n1 + s;
                let nn2 = n2 + s;
                let nn3 = n3 + s;
                newscaler = newscaler * 0.98;
                let sscaler = newscaler;
                
                let points = superformula(mm, nn1, nn2, nn3);
                p.curveVertex(points[points.length-1].x * sscaler, points[points.length-1].y * sscaler);
                
                for (let i = 0; i < points.length; i++) {
                    p.curveVertex(points[i].x * sscaler, points[i].y * sscaler);
                }
                
                p.curveVertex(points[0].x * sscaler, points[0].y * sscaler);
                p.endShape();
            }
            p.pop();
        };
        
        function superformula(m, n1, n2, n3) {
            let numPoints = 360;
            let phi = p.TWO_PI / numPoints;
            let points = [];
            
            for (let i = 0; i <= numPoints; i++) {
                points.push(superformulaPoint(m, n1, n2, n3, phi * i));
            }
            return points;
        }
        
        function superformulaPoint(m, n1, n2, n3, phi) {
            let r;
            let t1, t2;
            let a = 1, b = 1;
            let x = 0;
            let y = 0;
            
            t1 = p.cos(m * phi / 4) / a;
            t1 = p.abs(t1);
            t1 = p.pow(t1, n2);
            
            t2 = p.sin(m * phi / 4) / b;
            t2 = p.abs(t2);
            t2 = p.pow(t2, n3);
            
            r = p.pow(t1 + t2, 1/n1);
            
            if (p.abs(r) == 0) {
                x = 0;
                y = 0;
            } else {
                r = 1 / r;
                x = r * p.cos(phi);
                y = r * p.sin(phi);
            }
            
            return p.createVector(x, y);
        }
    }, container);
}

// Demo 4: Parameterize Chair (Slide 5) - 3D generative chairs
let demo4;
let demo4Active = false;

function initDemo4() {
    if (demo4Active) return;
    
    const container = document.getElementById('canvas4');
    if (!container) {
        console.error('Canvas4 container not found');
        return;
    }
    
    demo4Active = true;
    
    demo4 = new p5(function(p) {
        let chairSeatHeight = 100;
        let chairWidth = 50;
        let chairDepth = 50;
        let chairBackHeight = 100;
        let chairFrameThickness = 10;
        
        p.setup = function() {
            let w = container.offsetWidth || 400;
            let h = 400;
            p.createCanvas(w, h, p.WEBGL);
            p.noLoop();
        };
        
        p.draw = function() {
            p.background(255);
            p.fill(0);
            p.stroke(0);
            
            p.push();
            p.rotateX(-p.PI / 9);
            p.rotateY(p.PI / 8);
            
            drawChair();
            p.pop();
        };
        
        function drawChair() {
            // back
            p.push();
            p.translate(0, -chairBackHeight/2, chairDepth/2 - chairFrameThickness/2);
            p.box(chairWidth, chairBackHeight, chairFrameThickness);
            p.pop();
            
            // seat
            p.push();
            p.translate(0, -chairFrameThickness/2, 0);
            p.box(chairWidth, chairFrameThickness, chairDepth);
            p.pop();
            
            // legs
            let legPositions = [
                [-chairWidth/2 + chairFrameThickness/2, -chairDepth/2 + chairFrameThickness/2],
                [chairWidth/2 - chairFrameThickness/2, -chairDepth/2 + chairFrameThickness/2],
                [chairWidth/2 - chairFrameThickness/2, chairDepth/2 - chairFrameThickness/2],
                [-chairWidth/2 + chairFrameThickness/2, chairDepth/2 - chairFrameThickness/2]
            ];
            
            for (let pos of legPositions) {
                p.push();
                p.translate(pos[0], chairSeatHeight/2, pos[1]);
                p.box(chairFrameThickness, chairSeatHeight, chairFrameThickness);
                p.pop();
            }
        }
        
        function scrambleChair() {
            chairSeatHeight = p.floor(p.random(10, 200));
            chairWidth = p.floor(p.random(10, 200));
            chairDepth = p.floor(p.random(10, 200));
            chairBackHeight = p.floor(p.random(10, 200));
        }
        
        p.mousePressed = function() {
            if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
                scrambleChair();
                p.redraw();
            }
        };
    }, container);
}

// Demo 5: Parameterize Wave (Slide 5) - Brick wave pattern
let demo5;
let demo5Active = false;

function initDemo5() {
    if (demo5Active) return;
    
    const container = document.getElementById('canvas5');
    if (!container) {
        console.error('Canvas5 container not found');
        return;
    }
    
    demo5Active = true;
    
    demo5 = new p5(function(p) {
        let brickWidth = 40;
        let brickHeight = 15;
        let cols = 20;
        let rows = 24;
        let columnOffset = 60;
        let rowOffset = 30;
        let rotationIncrement = 0.15;
        
        p.setup = function() {
            let w = container.offsetWidth || 400;
            let h = 400;
            p.createCanvas(w, h);
            p.noLoop();
        };
        
        p.draw = function() {
            p.background(255);
            p.noFill();
            p.stroke(0);
            
            p.push();
            p.translate(30, 30);
            
            for (let i = 0; i < cols; i++) {
                p.push();
                p.translate(i * columnOffset, 0);
                let r = p.random(-p.QUARTER_PI, p.QUARTER_PI);
                let dir = 1;
                
                for (let j = 0; j < rows; j++) {
                    p.push();
                    p.translate(0, rowOffset * j);
                    p.rotate(r);
                    p.rect(-brickWidth/2, -brickHeight/2, brickWidth, brickHeight);
                    p.pop();
                    
                    r += dir * rotationIncrement;
                    if (r > p.QUARTER_PI || r < -p.QUARTER_PI) {
                        dir *= -1;
                    }
                }
                p.pop();
            }
            p.pop();
        };
        
        p.mousePressed = function() {
            if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
                p.redraw();
            }
        };
    }, container);
}

// Demo 6: Word Frequency Visualization (Slide 5)
// Simplified version without loading external files
let demo6;
let demo6Active = false;

function initDemo6() {
    if (demo6Active) return;
    
    const container = document.getElementById('canvas6');
    if (!container) {
        console.error('Canvas6 container not found');
        return;
    }
    
    demo6Active = true;
    
    demo6 = new p5(function(p) {
        // Sample word data (simulating Frankenstein and Dracula word frequencies)
        let frankWords = [
            {word: "THE", count: 4500}, {word: "I", count: 3200}, {word: "AND", count: 2800},
            {word: "TO", count: 2500}, {word: "OF", count: 2200}, {word: "A", count: 1800},
            {word: "MY", count: 1500}, {word: "IN", count: 1400}, {word: "WAS", count: 1200},
            {word: "THAT", count: 1100}, {word: "HIS", count: 950}, {word: "IT", count: 900},
            {word: "WITH", count: 850}, {word: "HE", count: 800}, {word: "AS", count: 750},
            {word: "HAD", count: 700}, {word: "YOU", count: 650}, {word: "NOT", count: 600},
            {word: "BE", count: 580}, {word: "HER", count: 550}
        ];
        
        let dracWords = [
            {word: "THE", count: 5200}, {word: "AND", count: 3100}, {word: "I", count: 2900},
            {word: "TO", count: 2700}, {word: "OF", count: 2400}, {word: "A", count: 2000},
            {word: "IN", count: 1600}, {word: "WAS", count: 1500}, {word: "THAT", count: 1300},
            {word: "IT", count: 1150}, {word: "HE", count: 1000}, {word: "FOR", count: 900},
            {word: "WITH", count: 880}, {word: "AS", count: 820}, {word: "HIS", count: 780},
            {word: "HAD", count: 730}, {word: "BUT", count: 680}, {word: "NOT", count: 650},
            {word: "SHE", count: 620}, {word: "AT", count: 590}
        ];
        
        p.setup = function() {
            let w = container.offsetWidth || 400;
            let h = 400;
            p.createCanvas(w, h);
            p.background(0);
            p.fill(255);
            p.textAlign(p.LEFT, p.BASELINE);
            p.noLoop();
        };
        
        p.draw = function() {
            p.background(0);
            
            let maxSize = 50;
            let exponent = 0.60;
            
            // Draw Frankenstein words
            drawWordCloud(frankWords, 0, maxSize * 0.75, p.height/2 - 20, maxSize, exponent);
            
            // Draw Dracula words
            drawWordCloud(dracWords, 0, p.height/2 + maxSize * 0.75, p.height, maxSize, exponent);
        };
        
        function drawWordCloud(words, startY, initialY, maxY, maxSize, exponent) {
            let x = 10;
            let y = initialY;
            
            for (let i = 0; i < words.length; i++) {
                let wordSize = p.pow(words[i].count / words[0].count, exponent) * maxSize;
                wordSize = p.max(wordSize, 8);
                
                p.textSize(wordSize);
                let wordWidth = p.textWidth(words[i].word);
                
                // Check if word fits on current line
                if (x + wordWidth > p.width - 10 && x > 10) {
                    x = 10;
                    y += wordSize * 1.2;
                }
                
                // Stop if we've exceeded vertical space
                if (y > maxY) break;
                
                p.text(words[i].word, x, y);
                x += wordWidth + p.textWidth(" ") * 0.75;
            }
        }
    }, container);
}

// Initialize all demos
function initDemos() {
    // Check which slide we're on and initialize appropriate demo
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.classList.contains('active')) {
                const slideNum = parseInt(mutation.target.getAttribute('data-slide'));
                
                if (slideNum === 4 && !demo1Active) {
                    initDemo1();
                } else if (slideNum === 5) {
                    if (!demo3Active) initDemo3();
                    if (!demo4Active) initDemo4();
                    if (!demo5Active) initDemo5();
                    if (!demo6Active) initDemo6();
                } else if (slideNum === 6 && !demo2Active) {
                    initDemo2();
                }
            }
        });
    });
    
    document.querySelectorAll('.slide').forEach(slide => {
        observer.observe(slide, { attributes: true, attributeFilter: ['class'] });
    });
    
    // Initialize first demos if on those slides
    if (currentSlide === 4) initDemo1();
    if (currentSlide === 5) {
        initDemo3();
        initDemo4();
        initDemo5();
        initDemo6();
    }
    if (currentSlide === 6) initDemo2();
}

// Resize handler for responsive canvas
window.addEventListener('resize', function() {
    if (demo1Canvas) {
        demo1Canvas.width = demo1Canvas.offsetWidth;
        demo1Canvas.height = demo1Canvas.offsetHeight;
    }
    if (demo2Canvas) {
        demo2Canvas.width = demo2Canvas.offsetWidth;
        demo2Canvas.height = demo2Canvas.offsetHeight;
    }
});