import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../../context/JourneyContext';

const Breather = () => {
  const { nextStage } = useJourney();
  const [cleared, setCleared] = useState(0);
  const [exhaling, setExhaling] = useState(false);
  const [breathPhase, setBreathPhase] = useState('inhale'); // inhale | hold | exhale
  const [breathCount, setBreathCount] = useState(0);
  const [mode, setMode] = useState('fog'); // fog | breathe
  const intervalRef = useRef(null);

  // Modo névoa: mover o mouse limpa a névoa
  const handleMouseMove = useCallback((e) => {
    if (mode !== 'fog') return;
    setCleared(prev => {
      const next = Math.min(prev + 0.6, 100);
      return next;
    });
  }, [mode]);

  const handleTouchMove = useCallback((e) => {
    if (mode !== 'fog') return;
    e.preventDefault();
    setCleared(prev => Math.min(prev + 1, 100));
  }, [mode]);

  // Quando a névoa está suficientemente limpa, ir para modo respiração
  React.useEffect(() => {
    if (cleared >= 100 && mode === 'fog') {
      setTimeout(() => setMode('breathe'), 500);
    }
  }, [cleared, mode]);

  // Ciclo de respiração
  React.useEffect(() => {
    if (mode !== 'breathe') return;
    const phases = ['inhale', 'hold', 'exhale'];
    const durations = [4000, 2000, 4000];
    let phaseIdx = 0;

    const runPhase = () => {
      setBreathPhase(phases[phaseIdx]);
      intervalRef.current = setTimeout(() => {
        phaseIdx = (phaseIdx + 1) % 3;
        if (phaseIdx === 0) {
          setBreathCount(c => {
            if (c + 1 >= 2) {
              setTimeout(nextStage, 1000);
            }
            return c + 1;
          });
        }
        runPhase();
      }, durations[phaseIdx]);
    };

    runPhase();
    return () => clearTimeout(intervalRef.current);
  }, [mode, nextStage]);

  const phaseText = {
    inhale: { text: 'Inspire', sub: '4 segundos', scale: 1.4 },
    hold: { text: 'Segure', sub: '2 segundos', scale: 1.4 },
    exhale: { text: 'Expire', sub: '4 segundos', scale: 1 },
  }[breathPhase];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: mode === 'fog' ? 'crosshair' : 'default',
        position: 'relative',
        overflow: 'hidden',
        touchAction: 'none',
      }}
    >
      <AnimatePresence mode="wait">
        {mode === 'fog' && (
          <motion.div
            key="fog"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              zIndex: 10,
              textAlign: 'center',
              maxWidth: '500px',
              padding: '2rem',
            }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              Respire fundo.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.8 }}
              style={{ fontSize: '1rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.5)' }}
            >
              Mova o cursor para afastar as nuvens pesadas.
            </motion.p>

            {/* Barra de progresso de névoa */}
            <div style={{ width: '200px', height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${cleared}%` }}
                style={{ height: '100%', background: 'linear-gradient(to right, rgba(180,140,255,0.6), rgba(255,220,180,0.8))', borderRadius: '9999px' }}
              />
            </div>

            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
              {Math.round(cleared)}% da névoa dissipada
            </p>
          </motion.div>
        )}

        {mode === 'breathe' && (
          <motion.div
            key="breathe"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2rem',
              zIndex: 10,
              textAlign: 'center',
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 0.5, y: 0 }}
              style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}
            >
              Exercício de Respiração · {breathCount}/2 ciclos
            </motion.p>

            {/* Círculo pulsante */}
            <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Anel externo */}
              <motion.div
                animate={{
                  scale: breathPhase === 'exhale' ? 1 : phaseText.scale,
                  opacity: breathPhase === 'hold' ? 0.8 : 0.4,
                }}
                transition={{ duration: breathPhase === 'inhale' ? 4 : breathPhase === 'exhale' ? 4 : 0.2, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  width: '220px',
                  height: '220px',
                  borderRadius: '50%',
                  border: '2px solid rgba(200,160,255,0.3)',
                }}
              />
              {/* Anel médio */}
              <motion.div
                animate={{
                  scale: breathPhase === 'exhale' ? 0.7 : breathPhase === 'hold' ? 1.1 : 1,
                  backgroundColor: breathPhase === 'inhale'
                    ? 'rgba(160,120,255,0.15)'
                    : breathPhase === 'hold'
                    ? 'rgba(180,140,255,0.2)'
                    : 'rgba(120,180,255,0.12)',
                }}
                transition={{ duration: breathPhase === 'inhale' ? 4 : breathPhase === 'exhale' ? 4 : 0.2, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  border: '1px solid rgba(200,160,255,0.2)',
                }}
              />
              {/* Centro */}
              <motion.div
                animate={{
                  scale: breathPhase === 'exhale' ? 0.5 : 1,
                }}
                transition={{ duration: breathPhase === 'exhale' ? 4 : 0.5, ease: 'easeInOut' }}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(200,160,255,0.4), rgba(160,120,255,0.1))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '1.6rem' }}>
                  {breathPhase === 'inhale' ? '🌬️' : breathPhase === 'hold' ? '🫁' : '😮‍💨'}
                </span>
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={breathPhase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ textAlign: 'center' }}
              >
                <p style={{ fontSize: '2rem', fontWeight: 300, color: 'rgba(255,255,255,0.9)' }}>
                  {phaseText.text}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>
                  {phaseText.sub}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay de névoa */}
      {mode === 'fog' && (
        <motion.div
          animate={{ opacity: 1 - cleared / 100 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle, transparent 0%, rgba(10,5,20,0.7) 100%)',
            backdropFilter: `blur(${(1 - cleared / 100) * 20}px)`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Estrelas reveladas conforme limpa */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: (cleared / 100) * (Math.random() * 0.6 + 0.2) }}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            borderRadius: '50%',
            backgroundColor: 'white',
            pointerEvents: 'none',
          }}
        />
      ))}
    </motion.div>
  );
};

export default Breather;
