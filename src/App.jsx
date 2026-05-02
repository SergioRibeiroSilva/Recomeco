import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { JourneyProvider, useJourney } from './context/JourneyContext';
import ParticleField from './components/ParticleField';
import AnimatedBackground from './components/AnimatedBackground';
import ProgressBar from './components/ProgressBar';
import Intro from './components/stages/Intro';
import Narrative from './components/stages/Narrative';
import Kintsugi from './components/stages/Kintsugi';
import Breather from './components/stages/Breather';
import Strengthening from './components/stages/Strengthening';
import Final from './components/stages/Final';
import './styles/theme.css';

const STAGES = [Intro, Narrative, Kintsugi, Breather, Strengthening, Final];

const TRANSITIONS = [
  // Intro → Narrative: dissolve
  { initial: { opacity: 0, scale: 1.04 }, exit: { opacity: 0, scale: 0.96 } },
  // Narrative → Kintsugi: slide up
  { initial: { opacity: 0, y: 60 }, exit: { opacity: 0, y: -60 } },
  // Kintsugi → Breather: fade + rotate
  { initial: { opacity: 0, rotate: -3 }, exit: { opacity: 0, rotate: 3 } },
  // Breather → Strengthening: slide in from right
  { initial: { opacity: 0, x: 80 }, exit: { opacity: 0, x: -80 } },
  // Strengthening → Final: scale up
  { initial: { opacity: 0, scale: 0.85 }, exit: { opacity: 0, scale: 1.15 } },
];

const StageManager = () => {
  const { currentStage } = useJourney();
  const StageComponent = STAGES[currentStage];
  const trans = TRANSITIONS[Math.min(currentStage, TRANSITIONS.length - 1)];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStage}
        initial={{ ...trans.initial, opacity: 0 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
        exit={{ ...trans.exit }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <StageComponent />
      </motion.div>
    </AnimatePresence>
  );
};

const JourneyApp = () => {
  const { currentStage } = useJourney();
  const showProgress = currentStage > 0 && currentStage < 5;

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: 'Outfit, sans-serif',
    }}>
      {/* Camada 1: Fundo animado */}
      <AnimatedBackground />

      {/* Camada 2: Campo de partículas */}
      <ParticleField />

      {/* Camada 3: Conteúdo principal */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <StageManager />
      </div>

      {/* Camada 4: Barra de progresso (não na intro e não na final) */}
      {showProgress && <ProgressBar />}
    </div>
  );
};

function App() {
  return (
    <JourneyProvider>
      <JourneyApp />
    </JourneyProvider>
  );
}

export default App;
