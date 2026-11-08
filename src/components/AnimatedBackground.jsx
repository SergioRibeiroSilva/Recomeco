import React from 'react';
import { motion } from 'framer-motion';
import { useJourney } from '../context/JourneyContext';

// Da noite profunda ao amanhecer dourado
const STAGE_BG_COLORS = [
  ['#070b16', '#0f1730'],
  ['#0a1020', '#18223d'],
  ['#0e1226', '#272444'],
  ['#0a1a24', '#16363f'],
  ['#0f1d1f', '#2c4036'],
  ['#2a1710', '#7a3f26'],
];

const ORBS = [
  [{ color: 'rgba(90,110,190,0.16)', x: '-10%', y: '-10%', size: '50vw' },
   { color: 'rgba(60,80,150,0.14)', x: '70%', y: '60%', size: '40vw' }],
  [{ color: 'rgba(100,120,200,0.18)', x: '-5%', y: '-5%', size: '55vw' },
   { color: 'rgba(120,100,170,0.14)', x: '60%', y: '50%', size: '45vw' }],
  [{ color: 'rgba(150,120,190,0.2)', x: '-15%', y: '20%', size: '50vw' },
   { color: 'rgba(220,150,150,0.12)', x: '65%', y: '-10%', size: '45vw' }],
  [{ color: 'rgba(80,170,180,0.2)', x: '10%', y: '-15%', size: '55vw' },
   { color: 'rgba(110,150,210,0.16)', x: '55%', y: '60%', size: '50vw' }],
  [{ color: 'rgba(150,200,160,0.2)', x: '-10%', y: '10%', size: '60vw' },
   { color: 'rgba(239,194,125,0.16)', x: '60%', y: '-20%', size: '55vw' }],
  [{ color: 'rgba(255,190,110,0.34)', x: '-5%', y: '-5%', size: '60vw' },
   { color: 'rgba(255,140,110,0.26)', x: '50%', y: '40%', size: '55vw' }],
];

const AnimatedBackground = () => {
  const { currentStage } = useJourney();
  const [bg1, bg2] = STAGE_BG_COLORS[Math.min(currentStage, STAGE_BG_COLORS.length - 1)];
  const orbs = ORBS[Math.min(currentStage, ORBS.length - 1)];

  return (
    <motion.div
      animate={{ background: `linear-gradient(135deg, ${bg1} 0%, ${bg2} 100%)` }}
      transition={{ duration: 2, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        overflow: 'hidden',
      }}
    >
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          animate={{
            left: orb.x,
            top: orb.y,
            backgroundColor: orb.color,
          }}
          transition={{ duration: 3, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
        />
      ))}
    </motion.div>
  );
};

export default AnimatedBackground;
