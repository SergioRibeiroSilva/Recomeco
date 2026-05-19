import React from 'react';
import { motion } from 'framer-motion';
import { useJourney } from '../context/JourneyContext';

const STAGE_LABELS = ['Início', 'Reconhecimento', 'Reconstrução', 'Respiração', 'Intenções', 'Recomeço'];

const ProgressBar = () => {
  const { currentStage } = useJourney();
  const progress = (currentStage / 5) * 100;

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
    }}>
      <motion.p
        key={currentStage}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 0.85, y: 0 }}
        style={{
          fontSize: 'var(--font-small)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
        }}
      >
        {STAGE_LABELS[currentStage]}
      </motion.p>
      <div style={{
        width: '200px',
        height: '2px',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '9999px',
        overflow: 'hidden',
      }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: 'linear-gradient(to right, rgba(255,255,255,0.3), rgba(255,200,150,0.8))',
            borderRadius: '9999px',
          }}
        />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {STAGE_LABELS.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: i === currentStage ? 1.5 : 1,
              opacity: i <= currentStage ? 1 : 0.2,
              backgroundColor: i === currentStage ? 'rgba(255,200,150,0.9)' : 'rgba(255,255,255,0.3)',
            }}
            transition={{ duration: 0.5 }}
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
