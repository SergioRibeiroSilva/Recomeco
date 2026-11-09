import { motion } from 'framer-motion';
import { useJourney } from '../context/journeyContextObject';

// Do creme matinal ao amanhecer pêssego
const STAGE_BG_COLORS = [
  ['#f6efe4', '#efe4d2'],
  ['#f4ebdd', '#eadcc6'],
  ['#f3e8dc', '#e8d3c4'],
  ['#eef0e3', '#dde5d2'],
  ['#f0f1e2', '#d8e2cb'],
  ['#f9ebd8', '#f0cbae'],
];

// Manchas orgânicas bem suaves (terra, sálvia, pêssego)
const ORBS = [
  [{ color: 'rgba(169,91,64,0.08)', x: '-10%', y: '-10%', size: '50vw' },
   { color: 'rgba(127,145,112,0.10)', x: '70%', y: '60%', size: '40vw' }],
  [{ color: 'rgba(169,91,64,0.09)', x: '-5%', y: '-5%', size: '55vw' },
   { color: 'rgba(140,163,181,0.10)', x: '60%', y: '50%', size: '45vw' }],
  [{ color: 'rgba(201,139,110,0.14)', x: '-15%', y: '20%', size: '50vw' },
   { color: 'rgba(167,155,181,0.10)', x: '65%', y: '-10%', size: '45vw' }],
  [{ color: 'rgba(127,145,112,0.18)', x: '10%', y: '-15%', size: '55vw' },
   { color: 'rgba(140,163,181,0.12)', x: '55%', y: '60%', size: '50vw' }],
  [{ color: 'rgba(127,145,112,0.18)', x: '-10%', y: '10%', size: '60vw' },
   { color: 'rgba(232,196,180,0.30)', x: '60%', y: '-20%', size: '55vw' }],
  [{ color: 'rgba(240,170,120,0.30)', x: '-5%', y: '-5%', size: '60vw' },
   { color: 'rgba(232,150,120,0.22)', x: '50%', y: '40%', size: '55vw' }],
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
            // transform (GPU) em vez de left/top, que forçam layout a cada frame
            x: `${parseFloat(orb.x)}vw`,
            y: `${parseFloat(orb.y)}vh`,
            backgroundColor: orb.color,
          }}
          transition={{ duration: 3, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            filter: 'blur(90px)',
            pointerEvents: 'none',
          }}
        />
      ))}
    </motion.div>
  );
};

export default AnimatedBackground;
