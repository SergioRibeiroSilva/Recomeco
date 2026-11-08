import React from 'react';
import { motion } from 'framer-motion';
import { useJourney } from '../context/JourneyContext';

const STAGE_LABELS = ['Início', 'Reconhecimento', 'Reconstrução', 'Respiração', 'Intenções', 'Recomeço'];

const ProgressBar = () => {
  const { currentStage } = useJourney();
  const progress = (currentStage / 5) * 100;

  return (
    <div
      role="progressbar"
      aria-label="Progresso da jornada"
      aria-valuemin={0}
      aria-valuemax={5}
      aria-valuenow={currentStage}
      aria-valuetext={STAGE_LABELS[currentStage]}
      className="card"
      style={{
        position: 'fixed',
        bottom: 'max(1.25rem, env(safe-area-inset-bottom))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.8rem 1.6rem 0.95rem',
        borderRadius: 'var(--radius-pill)',
        background: 'rgba(11,17,32,0.55)',
        boxShadow: 'var(--shadow-soft)',
      }}
    >
      <motion.p
        key={currentStage}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="t-eyebrow"
        style={{ color: 'var(--color-gold-300)', fontSize: 'var(--font-tiny)' }}
      >
        {STAGE_LABELS[currentStage]}
      </motion.p>

      <div style={{
        width: '200px',
        height: '3px',
        background: 'var(--surface-3)',
        borderRadius: '9999px',
        overflow: 'hidden',
      }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: 'linear-gradient(to right, var(--color-sage-400), var(--color-gold-400))',
            borderRadius: '9999px',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.6rem' }} aria-hidden="true">
        {STAGE_LABELS.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: i === currentStage ? 1.5 : 1,
              opacity: i <= currentStage ? 1 : 0.3,
              backgroundColor: i === currentStage ? '#efc27d' : 'rgba(251,244,234,0.55)',
            }}
            transition={{ duration: 0.5 }}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
