import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const MESSAGES = [
  "Você passou por algo difícil.",
  "Sentiu na pele o peso de uma perda.",
  "E mesmo assim, você está aqui.",
  "Isso tem um nome: coragem.",
];

const Final = () => {
  const [msgIdx, setMsgIdx] = useState(0);
  const [done, setDone] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (msgIdx < MESSAGES.length - 1) {
      const t = setTimeout(() => setMsgIdx(i => i + 1), 2200);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setDone(true), 2000);
      return () => clearTimeout(t);
    }
  }, [msgIdx]);

  useEffect(() => {
    if (!done) return;
    const canvas = canvasRef.current;
    const myConfetti = confetti.create(canvas, { resize: true, useWorker: false });

    const colors = ['#ff8c42', '#f7aef8', '#ffd700', '#b3e5fc', '#a8edea'];
    let count = 0;
    const max = 6;
    const interval = setInterval(() => {
      myConfetti({
        particleCount: 60,
        spread: 80,
        startVelocity: 35,
        origin: { x: Math.random() * 0.6 + 0.2, y: 0.1 },
        colors,
        shapes: ['circle', 'square'],
        scalar: 0.9,
        gravity: 0.8,
        drift: (Math.random() - 0.5) * 0.5,
        decay: 0.92,
      });
      if (++count >= max) clearInterval(interval);
    }, 600);

    return () => {
      clearInterval(interval);
      myConfetti.reset();
    };
  }, [done]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
        position: 'relative',
        textAlign: 'center',
        padding: '2rem',
        overflow: 'hidden',
      }}
    >
      {/* Canvas de confetes */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 50,
        }}
      />

      {/* Mensagens sequenciais */}
      {!done ? (
        <motion.div
          key={msgIdx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <p style={{
            fontSize: 'clamp(1.3rem, 3vw, 2rem)',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.9)',
            fontStyle: 'italic',
            lineHeight: 1.5,
            maxWidth: '600px',
          }}>
            {MESSAGES[msgIdx]}
          </p>
          {/* Indicador */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '1rem' }}>
            {MESSAGES.map((_, i) => (
              <div key={i} style={{
                width: i === msgIdx ? '20px' : '6px',
                height: '4px',
                borderRadius: '2px',
                background: i <= msgIdx ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.15)',
                transition: 'all 0.4s',
              }} />
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, type: 'spring' }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            maxWidth: '700px',
          }}
        >
          {/* Ícone solar */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ fontSize: '4rem' }}
          >
            ☀️
          </motion.div>

          <div>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #fff 0%, #ffd700 40%, #ff8c42 80%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.75rem',
            }}>
              O sol sempre volta.
            </h1>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.3rem)',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.6,
              maxWidth: '500px',
            }}>
              Sua jornada ganhou um novo fôlego hoje.{' '}
              Você é mais inteiro do que imagina, e o amanhã ainda não foi escrito.
            </p>
          </div>

          {/* Ações */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              style={{
                padding: '0.9rem 2rem',
                borderRadius: '50px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif',
                letterSpacing: '0.05em',
              }}
            >
              ↩ Refazer a jornada
            </motion.button>

            {/* Compartilhar no X */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const url = 'https://SergioRibeiroSilva.github.io/Recomeco/';
                const text = encodeURIComponent(`Eu passei por uma jornada de recomeço hoje. 🌱 Você também pode: ${url}`);
                window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
              }}
              style={{
                padding: '0.9rem 2rem',
                borderRadius: '50px',
                background: '#000',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>𝕏</span> Compartilhar no X
            </motion.button>

            {/* Compartilhar no WhatsApp */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(37,211,102,0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const url = 'https://SergioRibeiroSilva.github.io/Recomeco/';
                const text = encodeURIComponent(`Eu passei por uma jornada de recomeço hoje. 🌱 Você também pode: ${url}`);
                window.open(`https://wa.me/?text=${text}`, '_blank');
              }}
              style={{
                padding: '0.9rem 2rem',
                borderRadius: '50px',
                background: '#25D366',
                border: 'none',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>💬</span> Compartilhar no WhatsApp
            </motion.button>
          </div>

          {/* Easter egg */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ delay: 5 }}
            style={{
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.4)',
              marginTop: '2rem',
              textTransform: 'uppercase',
            }}
          >
            ✦ feito com cuidado para quem precisa recomeçar ✦
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Final;
