import React, { useEffect, useRef } from 'react';
import { useJourney } from '../context/JourneyContext';

// Pólen suave: tons de terra e sálvia
const STAGE_COLORS = [
  { r: 169, g: 91, b: 64 },     // Stage 0 - Terracota
  { r: 150, g: 110, b: 85 },    // Stage 1 - Argila
  { r: 160, g: 110, b: 110 },   // Stage 2 - Rosé terroso
  { r: 110, g: 140, b: 110 },   // Stage 3 - Sálvia
  { r: 100, g: 130, b: 95 },    // Stage 4 - Musgo claro
  { r: 200, g: 120, b: 70 },    // Stage 5 - Âmbar
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
    for (let i = 0; i < 28; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.5 + 1,
        opacity: Math.random() * 0.3 + 0.08,
        targetOpacity: Math.random() * 0.3 + 0.08,
      });
    }

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const stage = stageRef.current;
      const col = STAGE_COLORS[Math.min(stage, STAGE_COLORS.length - 1)];

      particles.forEach((p) => {
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
        if (Math.random() < 0.01) p.targetOpacity = Math.random() * 0.3 + 0.08;
        p.opacity = lerp(p.opacity, p.targetOpacity, 0.05);

        // Wrap nas bordas
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

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
