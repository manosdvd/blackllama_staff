// Background Ambiance Controller

class AmbianceParticle {
  constructor(canvas, mode) {
    this.canvas = canvas;
    this.mode = mode; // 'pollen' or 'ember'
    this.reset();
  }
  
  reset() {
    this.x = Math.random() * this.canvas.width;
    
    if (this.mode === 'ember') {
      // Embers rise from bottom
      this.y = this.canvas.height + Math.random() * 80;
      this.size = Math.random() * 3 + 1;
      this.speedY = -(Math.random() * 1.5 + 0.5);
      this.speedX = (Math.random() - 0.5) * 0.8;
      
      const hue = Math.floor(Math.random() * 40 + 10); // red-orange-yellow
      this.color = `hsl(${hue}, 100%, 60%)`;
      this.opacity = Math.random() * 0.6 + 0.3;
      this.decay = Math.random() * 0.004 + 0.002;
      this.wiggleFactor = Math.random() * 0.04;
      this.angle = Math.random() * Math.PI * 2;
    } else {
      // Pollen drift all over, slowly
      this.y = Math.random() * this.canvas.height;
      this.size = Math.random() * 2.5 + 1.2;
      this.speedY = (Math.random() - 0.5) * 0.25;
      this.speedX = -(Math.random() * 0.4 + 0.15); // gentle drift to the left
      
      const hue = Math.random() > 0.3 ? Math.floor(Math.random() * 15 + 40) : Math.floor(Math.random() * 15 + 75);
      this.color = `hsl(${hue}, 85%, 65%)`;
      this.opacity = Math.random() * 0.35 + 0.15;
      this.decay = 0;
      this.wiggleFactor = Math.random() * 0.02;
      this.angle = Math.random() * Math.PI * 2;
    }
  }
  
  update() {
    if (this.mode === 'ember') {
      this.y += this.speedY;
      this.angle += this.wiggleFactor;
      this.x += Math.sin(this.angle) * 0.4 + this.speedX;
      this.opacity -= this.decay;
      
      if (this.opacity <= 0 || this.y < -10) {
        this.reset();
      }
    } else {
      // Pollen
      this.y += this.speedY;
      this.x += this.speedX;
      this.angle += this.wiggleFactor;
      this.y += Math.sin(this.angle) * 0.08; // sway
      
      if (this.x < -10) {
        this.x = this.canvas.width + 10;
        this.y = Math.random() * this.canvas.height;
      }
      if (this.y < -10 || this.y > this.canvas.height + 10) {
        this.y = Math.random() * this.canvas.height;
        this.x = this.canvas.width + 10;
      }
    }
  }
  
  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    
    if (this.mode === 'ember') {
      ctx.shadowBlur = this.size * 2.5;
      ctx.shadowColor = this.color;
      ctx.globalAlpha = this.opacity;
    } else {
      ctx.globalAlpha = this.opacity;
      ctx.shadowBlur = this.size * 1.5;
      ctx.shadowColor = 'rgba(255, 235, 170, 0.3)';
    }
    
    ctx.fill();
    ctx.restore();
  }
}

class Sunbeam {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }
  
  reset() {
    this.x = Math.random() * this.canvas.width;
    this.widthTop = Math.random() * 60 + 30;
    this.widthBottom = this.widthTop * (Math.random() * 2 + 1.5);
    this.angle = (Math.random() * 12 + 12) * (Math.PI / 180);
    if (Math.random() > 0.5) this.angle = -this.angle;
    
    this.maxOpacity = Math.random() * 0.04 + 0.015;
    this.opacity = 0;
    this.speed = Math.random() * 0.003 + 0.001;
    this.state = 'fadein';
    this.visibleTime = Math.random() * 300 + 150;
  }
  
  update() {
    if (this.state === 'fadein') {
      this.opacity += this.speed;
      if (this.opacity >= this.maxOpacity) {
        this.opacity = this.maxOpacity;
        this.state = 'visible';
      }
    } else if (this.state === 'visible') {
      this.visibleTime--;
      if (this.visibleTime <= 0) {
        this.state = 'fadeout';
      }
    } else if (this.state === 'fadeout') {
      this.opacity -= this.speed;
      if (this.opacity <= 0) {
        this.reset();
      }
    }
  }
  
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    
    const h = this.canvas.height;
    const xTopLeft = this.x - this.widthTop / 2;
    const xTopRight = this.x + this.widthTop / 2;
    
    const shift = h * Math.tan(this.angle);
    const xBottomLeft = xTopLeft + shift - this.widthBottom / 2;
    const xBottomRight = xTopRight + shift + this.widthBottom / 2;
    
    ctx.beginPath();
    ctx.moveTo(xTopLeft, 0);
    ctx.lineTo(xTopRight, 0);
    ctx.lineTo(xBottomRight, h);
    ctx.lineTo(xBottomLeft, h);
    ctx.closePath();
    
    const grad = ctx.createLinearGradient(xTopLeft, 0, xTopRight, 0);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    grad.addColorStop(0.3, 'rgba(255, 250, 220, 0.4)');
    grad.addColorStop(0.5, 'rgba(255, 255, 240, 0.5)');
    grad.addColorStop(0.7, 'rgba(255, 250, 220, 0.4)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }
}

class Star {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.opacity = Math.random();
    this.twinkleSpeed = Math.random() * 0.02 + 0.005;
    this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
  }
  
  update() {
    this.opacity += this.twinkleSpeed * this.twinkleDir;
    if (this.opacity >= 1) {
      this.opacity = 1;
      this.twinkleDir = -1;
    } else if (this.opacity <= 0.1) {
      this.opacity = 0.1;
      this.twinkleDir = 1;
      this.x = Math.random() * this.canvas.width;
      this.y = Math.random() * this.canvas.height;
    }
  }
  
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export function initAmbiance() {
  const canvas = document.getElementById('bg-ambiance-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let sunbeams = [];
  let stars = [];
  let currentAmbianceMode = ''; // 'day' or 'night'
  let animationId;
  
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  
  window.addEventListener('resize', resize);
  resize();
  
  const loop = () => {
    const isCalm = document.documentElement.classList.contains('reduced-stimulation');
    if (isCalm) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animationId = requestAnimationFrame(loop);
      return;
    }

    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    const isCodeRed = document.documentElement.getAttribute('data-theme-mode') === 'code-red';
    const actualMode = (isDarkTheme || isCodeRed) ? 'night' : 'day';
    
    if (currentAmbianceMode !== actualMode) {
      currentAmbianceMode = actualMode;
      particles = [];
      sunbeams = [];
      stars = [];
      
      if (actualMode === 'night') {
        // Night mode: embers
        for (let i = 0; i < 45; i++) {
          const p = new AmbianceParticle(canvas, 'ember');
          p.y = Math.random() * canvas.height;
          particles.push(p);
        }
      } else {
        // Day mode: pollen + sunbeams
        for (let i = 0; i < 35; i++) {
          const p = new AmbianceParticle(canvas, 'pollen');
          p.y = Math.random() * canvas.height;
          particles.push(p);
        }
        sunbeams = [new Sunbeam(canvas), new Sunbeam(canvas), new Sunbeam(canvas), new Sunbeam(canvas)];
      }
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (currentAmbianceMode === 'day') {
      sunbeams.forEach(s => { s.update(); s.draw(ctx); });
      particles.forEach(p => { p.update(); p.draw(ctx); });
    } else {
      particles.forEach(p => { p.update(); p.draw(ctx); });
    }
    
    animationId = requestAnimationFrame(loop);
  };
  
  loop();
  
  return () => {
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(animationId);
  };
}
