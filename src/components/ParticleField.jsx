import React, { useEffect, useRef } from 'react';
import { useJourney } from '../context/JourneyContext';

// Poeira de luz: do azul-lua ao dourado do amanhecer
const STAGE_COLORS = [
  { r: 150, g: 170, b: 220 },   // Stage 0 - Azul lua
  { r: 160, g: 175, b: 225 },   // Stage 1 - Azul névoa
  { r: 190, g: 175, b: 225 },   // Stage 2 - Lavanda pálida
  { r: 150, g: 215, b: 220 },   // Stage 3 - Água-marinha
  { r: 190, g: 225, b: 190 },   // Stage 4 - Sálvia
  { r: 255, g: 215, b: 150 },   // Stage 5 - Dourado
];

const ParticleField = () => {
  const canvasRef = useRef(null);
  const { currentStage } = useJourney();
  const stageRef = useRef(currentStage);
  const mouseRef = useRef({ x: -999, y: -999 });

  useEffect(() => {
    stageRef.current = currentStage;
  }, [currentStage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Criar partículas
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        targetOpacity: Math.random() * 0.5 + 0.1,
      });
    }

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const stage = stageRef.current;
      const col = STAGE_COLORS[Math.min(stage, STAGE_COLORS.length - 1)];

      particles.forEach((p, i) => {
        // Repulsão suave do mouse
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          p.vx += (dx / dist) * force * 0.5;
          p.vy += (dy / dist) * force * 0.5;
        }

        // Atração ao centro suave
        p.vx += (canvas.width / 2 - p.x) * 0.00005;
        p.vy += (canvas.height / 2 - p.y) * 0.00005;

        // Amortecimento
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.x += p.vx;
        p.y += p.vy;

        // Fade aleatório
        if (Math.random() < 0.01) p.targetOpacity = Math.random() * 0.5 + 0.1;
        p.opacity = lerp(p.opacity, p.targetOpacity, 0.05);

        // Wrap nas bordas
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Conectar partículas próximas
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const ddx = p.x - q.x;
          const ddy = p.y - q.y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${col.r},${col.g},${col.b},${(1 - d / 120) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        // Desenhar partícula
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col.r},${col.g},${col.b},${p.opacity})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default ParticleField;
