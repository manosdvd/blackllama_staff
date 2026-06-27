'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  decay: number;
  wiggleFactor: number;
  angle: number;
  mode: 'pollen' | 'ember';
  reset: (canvas: HTMLCanvasElement) => void;
  update: (canvas: HTMLCanvasElement) => boolean;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

export function EmberBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let currentAmbianceMode = '';

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    // Helper classes inside effect
    const createParticle = (mode: 'pollen' | 'ember', initY?: number): Particle => {
      const p: Partial<Particle> = {
        mode,
        reset(cv) {
          this.x = Math.random() * cv.width;
          if (this.mode === 'ember') {
            this.y = cv.height + Math.random() * 80;
            this.size = Math.random() * 3 + 1;
            this.speedY = -(Math.random() * 1.5 + 0.5);
            this.speedX = (Math.random() - 0.5) * 0.8;
            const hue = Math.floor(Math.random() * 40 + 10);
            this.color = `hsl(${hue}, 100%, 60%)`;
            this.opacity = Math.random() * 0.6 + 0.3;
            this.decay = Math.random() * 0.004 + 0.002;
            this.wiggleFactor = Math.random() * 0.04;
            this.angle = Math.random() * Math.PI * 2;
          } else {
            this.y = Math.random() * cv.height;
            this.size = Math.random() * 2.5 + 1.2;
            this.speedY = (Math.random() - 0.5) * 0.25;
            this.speedX = -(Math.random() * 0.4 + 0.15);
            const hue = Math.random() > 0.3 ? Math.floor(Math.random() * 15 + 40) : Math.floor(Math.random() * 15 + 75);
            this.color = `hsl(${hue}, 85%, 65%)`;
            this.opacity = Math.random() * 0.35 + 0.15;
            this.decay = 0;
            this.wiggleFactor = Math.random() * 0.02;
            this.angle = Math.random() * Math.PI * 2;
          }
        },
        update(cv) {
          if (this.mode === 'ember') {
            this.y! += this.speedY!;
            this.angle! += this.wiggleFactor!;
            this.x! += Math.sin(this.angle!) * 0.4 + this.speedX!;
            this.opacity! -= this.decay!;
            if (this.opacity! <= 0 || this.y! < -10) {
              this.reset!(cv);
            }
          } else {
            this.y! += this.speedY!;
            this.x! += this.speedX!;
            this.angle! += this.wiggleFactor!;
            this.y! += Math.sin(this.angle!) * 0.08;
            if (this.x! < -10) {
              this.x = cv.width + 10;
              this.y = Math.random() * cv.height;
            }
            if (this.y! < -10 || this.y! > cv.height + 10) {
              this.y = Math.random() * cv.height;
              this.x = cv.width + 10;
            }
          }
          return true;
        },
        draw(c) {
          c.save();
          c.beginPath();
          c.arc(this.x!, this.y!, this.size!, 0, Math.PI * 2);
          c.fillStyle = this.color!;
          c.globalAlpha = this.opacity!;
          if (this.mode === 'ember') {
            c.shadowBlur = this.size! * 2.5;
            c.shadowColor = this.color!;
          } else {
            c.shadowBlur = this.size! * 1.5;
            c.shadowColor = 'rgba(255, 235, 170, 0.3)';
          }
          c.fill();
          c.restore();
        }
      };
      p.reset!(canvas);
      if (initY !== undefined) p.y = initY;
      return p as Particle;
    };

    const loop = () => {
      // Short-circuit if reduced stimulation is active
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
        if (actualMode === 'night') {
          for (let i = 0; i < 45; i++) {
            particles.push(createParticle('ember', Math.random() * canvas.height));
          }
        } else {
          for (let i = 0; i < 35; i++) {
            particles.push(createParticle('pollen', Math.random() * canvas.height));
          }
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update(canvas);
        p.draw(ctx);
      });

      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none -z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
export default EmberBackground;
