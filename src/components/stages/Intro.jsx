import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../../context/JourneyContext';

const moods = [
  {
    id: 'triste',
    emoji: '🌧️',
    label: 'Triste',
    sublabel: 'E tudo bem estar triste.',
    gradient: 'linear-gradient(135deg, #2a3a5a, #1a2a4a)',
    glow: 'rgba(80,120,200,0.3)',
  },
  {
    id: 'confuso',
    emoji: '🌀',
    label: 'Confuso',
    sublabel: 'Sem saber o que sentir.',
    gradient: 'linear-gradient(135deg, #3a2a5a, #2a1a4a)',
    glow: 'rgba(120,80,200,0.3)',
  },
  {
    id: 'exaurido',
    emoji: '🍂',
    label: 'Exausto',
    sublabel: 'Sem energia pra nada.',
    gradient: 'linear-gradient(135deg, #3a2a2a, #2a1a1a)',
    glow: 'rgba(180,100,80,0.3)',
  },
  {
    id: 'esperancoso',
    emoji: '🌱',
    label: 'Esperançoso',
    sublabel: 'Querendo recomeçar.',
    gradient: 'linear-gradient(135deg, #1a3a2a, #0a2a1a)',
    glow: 'rgba(80,180,120,0.3)',
  },
];

const floatingVariants = {
  animate: {
    y: [0, -12, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
};

const Intro = () => {
  const { setMood, nextStage } = useJourney();
  const [selected, setSelected] = useState(null);

  const handleSelect = (mood) => {
    setSelected(mood.id);
    setMood(mood.id);
    setTimeout(nextStage, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 1 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '860px',
        height: '100vh',
        padding: '1.5rem 1.5rem 8rem 1.5rem',
        textAlign: 'center',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Título */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        style={{ marginBottom: '0.5rem' }}
      >
        <h1 style={{
          fontSize: 'var(--font-hero)',
          fontWeight: 300,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          color: 'var(--text-main)',
        }}>
          Como está seu coração{' '}
          <span style={{
            fontWeight: 690,
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, #e0c8ff, #c8e0ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            paddingRight: '0.15em',
          }}>
            hoje?
          </span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1.2, duration: 1 }}
        style={{
          fontSize: 'var(--font-subtitle)',
          fontStyle: 'italic',
          marginBottom: '1.75rem',
          color: 'var(--text-secondary)',
        }}
      >
        Não há resposta errada. Apenas a sua verdade.
      </motion.p>

      {/* Cards de Humor */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.85rem',
        width: '100%',
      }}>
        {moods.map((mood, i) => (
          <motion.button
            key={mood.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.12, duration: 0.6 }}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(mood)}
            style={{
              background: selected === mood.id ? mood.gradient : 'rgba(255,255,255,0.04)',
              border: `1px solid ${selected === mood.id ? mood.glow : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '20px',
              padding: '1.4rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              position: 'relative',
              overflow: 'hidden',
              transition: 'background 0.4s, border 0.4s',
              boxShadow: selected === mood.id ? `0 0 40px ${mood.glow}` : 'none',
            }}
          >
            {/* Glow de fundo */}
            <motion.div
              whileHover={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: mood.gradient,
                opacity: 0,
                transition: 'opacity 0.3s',
                zIndex: 0,
                borderRadius: '24px',
              }}
            />
            <motion.span
              variants={floatingVariants}
              animate="animate"
              style={{ fontSize: '2rem', zIndex: 1, display: 'block' }}
            >
              {mood.emoji}
            </motion.span>
            <span style={{
              fontSize: 'var(--font-body)',
              fontWeight: 600,
              letterSpacing: '0.05em',
              color: 'var(--text-main)',
              zIndex: 1,
            }}>
              {mood.label}
            </span>
            <span style={{
              fontSize: 'var(--font-small)',
              color: 'var(--text-secondary)',
              fontStyle: 'italic',
              zIndex: 1,
            }}>
              {mood.sublabel}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Easter egg sutil */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 8, duration: 3 }}
        style={{
          marginTop: '1rem',
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.15em',
        }}
      >
        ✦ você não está sozinho ✦
      </motion.p>
    </motion.div>
  );
};

export default Intro;
