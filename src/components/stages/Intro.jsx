import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Waves, BatteryLow, Sprout } from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';

const moods = [
  {
    id: 'triste',
    Icon: CloudRain,
    label: 'Triste',
    sublabel: 'E tudo bem estar triste.',
    bg: '#e3eaf0',
    border: '#8ca3b5',
    tint: '#4f6b80',
  },
  {
    id: 'confuso',
    Icon: Waves,
    label: 'Confuso',
    sublabel: 'Sem saber o que sentir.',
    bg: '#e9e4ee',
    border: '#a79bb5',
    tint: '#6b5c80',
  },
  {
    id: 'exaurido',
    Icon: BatteryLow,
    label: 'Exausto',
    sublabel: 'Sem energia pra nada.',
    bg: '#f3e0d5',
    border: '#c98b6e',
    tint: '#9a4f36',
  },
  {
    id: 'esperancoso',
    Icon: Sprout,
    label: 'Esperançoso',
    sublabel: 'Querendo recomeçar.',
    bg: '#e1e9d8',
    border: '#8fae8b',
    tint: '#4f6b45',
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
        minHeight: '100dvh',
        padding: '1.5rem 1.5rem 8rem 1.5rem',
        textAlign: 'center',
        overflowX: 'hidden',
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
          fontWeight: 400,
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
          color: 'var(--text-main)',
        }}>
          Como está seu coração{' '}
          <span className="t-gold" style={{
            fontWeight: 500,
            fontStyle: 'italic',
            paddingRight: '0.15em',
          }}>
            hoje?
          </span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--font-subtitle)',
          fontStyle: 'italic',
          marginBottom: '2rem',
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
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(mood)}
            aria-pressed={selected === mood.id}
            className="card"
            style={{
              background: selected === mood.id ? mood.bg : 'var(--surface)',
              border: `1.5px solid ${selected === mood.id ? mood.border : 'var(--border-soft)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.55rem',
              position: 'relative',
              overflow: 'hidden',
              transition: 'background 0.4s, border 0.4s, box-shadow 0.4s',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <motion.span
              variants={floatingVariants}
              animate="animate"
              aria-hidden="true"
              style={{
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: mood.bg,
                border: `1.5px solid ${mood.border}`,
                color: mood.tint,
              }}
            >
              <mood.Icon size={28} strokeWidth={1.6} />
            </motion.span>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--font-subtitle)',
              fontWeight: 600,
              color: 'var(--text-main)',
              zIndex: 1,
            }}>
              {mood.label}
            </span>
            <span style={{
              fontSize: 'var(--font-small)',
              color: 'var(--text-secondary)',
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
        animate={{ opacity: 1 }}
        transition={{ delay: 8, duration: 3 }}
        style={{
          marginTop: '1rem',
          fontSize: 'var(--font-tiny)',
          color: 'var(--ink-3)',
          letterSpacing: '0.06em',
        }}
      >
        Você não está sozinho.
      </motion.p>
    </motion.div>
  );
};

export default Intro;
