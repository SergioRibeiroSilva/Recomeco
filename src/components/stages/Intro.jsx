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
    gradient: 'linear-gradient(145deg, rgba(110,150,220,0.28), rgba(40,60,110,0.35))',
    glow: 'rgba(130,165,235,0.55)',
    tint: '#bcd3f2',
  },
  {
    id: 'confuso',
    Icon: Waves,
    label: 'Confuso',
    sublabel: 'Sem saber o que sentir.',
    gradient: 'linear-gradient(145deg, rgba(170,140,230,0.28), rgba(70,50,120,0.35))',
    glow: 'rgba(180,150,235,0.55)',
    tint: '#d6c6f5',
  },
  {
    id: 'exaurido',
    Icon: BatteryLow,
    label: 'Exausto',
    sublabel: 'Sem energia pra nada.',
    gradient: 'linear-gradient(145deg, rgba(230,150,120,0.28), rgba(120,60,45,0.35))',
    glow: 'rgba(235,165,135,0.55)',
    tint: '#f3c3ad',
  },
  {
    id: 'esperancoso',
    Icon: Sprout,
    label: 'Esperançoso',
    sublabel: 'Querendo recomeçar.',
    gradient: 'linear-gradient(145deg, rgba(140,210,170,0.28), rgba(40,100,70,0.35))',
    glow: 'rgba(150,215,180,0.55)',
    tint: '#bfe0cf',
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
              background: selected === mood.id ? mood.gradient : 'var(--surface-1)',
              border: `1px solid ${selected === mood.id ? mood.glow : 'var(--border-soft)'}`,
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
              boxShadow: selected === mood.id ? `0 0 44px -6px ${mood.glow}` : 'var(--shadow-soft)',
            }}
          >
            {/* Brilho de fundo no hover */}
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
              }}
            />
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
                background: 'var(--surface-2)',
                border: '1px solid var(--border-soft)',
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
        animate={{ opacity: 0.45 }}
        transition={{ delay: 8, duration: 3 }}
        style={{
          marginTop: '1rem',
          fontSize: 'var(--font-tiny)',
          color: 'var(--color-gold-300)',
          letterSpacing: '0.18em',
        }}
      >
        ✦ você não está sozinho ✦
      </motion.p>
    </motion.div>
  );
};

export default Intro;
