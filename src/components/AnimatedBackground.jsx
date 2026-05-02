import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useJourney } from '../context/JourneyContext';

const STAGE_BG_COLORS = [
  ['#0a0a12', '#12121e'],
  ['#0e0a18', '#1a1028'],
  ['#120a1e', '#201530'],
  ['#180a28', '#2a1540'],
  ['#1e0a2a', '#3a1a50'],
  ['#2a1a1a', '#4a2a2a'],
];

const ORBS = [
  [{ color: 'rgba(80,60,120,0.15)', x: '-10%', y: '-10%', size: '50vw' },
   { color: 'rgba(60,40,100,0.12)', x: '70%', y: '60%', size: '40vw' }],
  [{ color: 'rgba(100,60,160,0.18)', x: '-5%', y: '-5%', size: '55vw' },
   { color: 'rgba(80,50,140,0.15)', x: '60%', y: '50%', size: '45vw' }],
  [{ color: 'rgba(120,70,180,0.2)', x: '-15%', y: '20%', size: '50vw' },
   { color: 'rgba(100,80,160,0.18)', x: '65%', y: '-10%', size: '45vw' }],
  [{ color: 'rgba(150,80,200,0.22)', x: '10%', y: '-15%', size: '55vw' },
   { color: 'rgba(120,60,180,0.2)', x: '55%', y: '60%', size: '50vw' }],
  [{ color: 'rgba(200,100,200,0.25)', x: '-10%', y: '10%', size: '60vw' },
   { color: 'rgba(180,80,180,0.22)', x: '60%', y: '-20%', size: '55vw' }],
  [{ color: 'rgba(255,160,80,0.3)', x: '-5%', y: '-5%', size: '60vw' },
   { color: 'rgba(255,120,100,0.25)', x: '50%', y: '40%', size: '55vw' }],
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
