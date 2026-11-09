import { useEffect, useRef } from 'react';
import { useJourney } from '../context/journeyContextObject';

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

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduceMotion = mql.matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Trabalha em pixels CSS; o canvas tem resolução física para ficar nítido em telas retina
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      if (reduceMotion) return;
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    if (!reduceMotion) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Criar partículas
    for (let i = 0; i < 28; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.5 + 1,
        opacity: Math.random() * 0.3 + 0.08,
        targetOpacity: Math.random() * 0.3 + 0.08,
      });
    }

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const stage = stageRef.current;
      const col = STAGE_COLORS[Math.min(stage, STAGE_COLORS.length - 1)];

      particles.forEach((p) => {
        // Repulsão suave do mouse
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0 && dist < 100) {
          const force = (100 - dist) / 100;
          p.vx += (dx / dist) * force * 0.5;
          p.vy += (dy / dist) * force * 0.5;
        }

        // Atração ao centro suave
        p.vx += (width / 2 - p.x) * 0.00005;
        p.vy += (height / 2 - p.y) * 0.00005;

        // Amortecimento
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.x += p.vx;
        p.y += p.vy;

        // Fade aleatório
        if (Math.random() < 0.01) p.targetOpacity = Math.random() * 0.3 + 0.08;
        p.opacity = lerp(p.opacity, p.targetOpacity, 0.05);

        // Wrap nas bordas
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Desenhar partícula
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col.r},${col.g},${col.b},${p.opacity})`;
        ctx.fill();
      });

      if (!reduceMotion && !document.hidden) animId = requestAnimationFrame(animate);
    };

    // Retoma o loop quando a aba volta a ficar visível ou preferência de movimento muda
    const handleVisibility = () => {
      if (!document.hidden && !reduceMotion) {
        cancelAnimationFrame(animId);
        animate();
      }
    };
    const handleMotionChange = (e) => {
      reduceMotion = e.matches;
      cancelAnimationFrame(animId);
      if (reduceMotion) {
        ctx.clearRect(0, 0, width, height);
        window.removeEventListener('mousemove', handleMouseMove);
        mouseRef.current = { x: -999, y: -999 };
      } else {
        window.addEventListener('mousemove', handleMouseMove);
        if (!document.hidden) animate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    mql.addEventListener?.('change', handleMotionChange);

    animate();

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('visibilitychange', handleVisibility);
      mql.removeEventListener?.('change', handleMotionChange);
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
