import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Pause, Feather } from 'lucide-react';
import { useJourney } from '../../context/journeyContextObject';

const PHASE_ICONS = { inhale: Wind, hold: Pause, exhale: Feather };

const Breather = () => {
  const { nextStage } = useJourney();
  const [cleared, setCleared] = useState(0);
  const [breathPhase, setBreathPhase] = useState('inhale'); // inhale | hold | exhale
  const [breathCount, setBreathCount] = useState(0);
  const [mode, setMode] = useState('fog'); // fog | breathe
  const intervalRef = useRef(null);
  const containerRef = useRef(null);
  const nextStageRef = useRef(nextStage);
  useEffect(() => { nextStageRef.current = nextStage; }, [nextStage]);

  // Garante que a etapa avance uma única vez (clique duplo, clique + timer final)
  const advancedRef = useRef(false);
  const advance = useCallback(() => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    clearTimeout(intervalRef.current);
    nextStageRef.current();
  }, []);

  // Estrelas geradas uma única vez (evita piscar a cada render)
  const [stars] = useState(() =>
    Array.from({ length: 30 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      peak: Math.random() * 0.6 + 0.2,
    }))
  );

  // Estados para rastrear a posição do cursor/toque e se ele já se moveu
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);

  // Modo névoa: mover o mouse limpa a névoa
  const handleMouseMove = useCallback((e) => {
    if (mode !== 'fog') return;
    setMousePos({ x: e.clientX, y: e.clientY });
    setIsMoving(true);
    setCleared(prev => {
      const next = Math.min(prev + 0.6, 100);
      return next;
    });
  }, [mode]);

  // Touch registrado de forma ativa (passive: false) para permitir preventDefault sem avisos
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchMove = (e) => {
      if (mode !== 'fog') return;
      e.preventDefault();
      const touch = e.touches[0];
      setMousePos({ x: touch.clientX, y: touch.clientY });
      setIsMoving(true);
      setCleared(prev => Math.min(prev + 1, 100));
    };

    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      el.removeEventListener('touchmove', onTouchMove);
    };
  }, [mode]);

  // Quando a névoa está suficientemente limpa, ir para modo respiração
  useEffect(() => {
    if (cleared >= 100 && mode === 'fog') {
      const t = setTimeout(() => setMode('breathe'), 500);
      return () => clearTimeout(t);
    }
  }, [cleared, mode]);

  // Ciclo de respiração
  useEffect(() => {
    if (mode !== 'breathe') return;
    const phases = ['inhale', 'hold', 'exhale'];
    const durations = [4000, 2000, 4000];
    let phaseIdx = 0;
    let cycles = 0;

    const runPhase = () => {
      setBreathPhase(phases[phaseIdx]);
      intervalRef.current = setTimeout(() => {
        phaseIdx = (phaseIdx + 1) % 3;
        if (phaseIdx === 0) {
          cycles += 1;
          setBreathCount(cycles);
          if (cycles >= 2) {
            // Termina o exercício: um único timeout, limpo no unmount
            intervalRef.current = setTimeout(advance, 1000);
            return;
          }
        }
        runPhase();
      }, durations[phaseIdx]);
    };

    runPhase();
    return () => clearTimeout(intervalRef.current);
  }, [mode, advance]);

  const phaseText = {
    inhale: { text: 'Inspire', sub: '4 segundos', scale: 1.4 },
    hold: { text: 'Segure', sub: '2 segundos', scale: 1.4 },
    exhale: { text: 'Expire', sub: '4 segundos', scale: 1 },
  }[breathPhase];
  const PhaseIcon = PHASE_ICONS[breathPhase];

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseMove={handleMouseMove}
      style={{
        width: '100%',
        minHeight: '100dvh',
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
              margin: '0 1rem 6rem',
              background: 'var(--surface)',
              border: '1px solid var(--border-soft)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontSize: 'var(--font-title)',
                fontWeight: 500,
                color: 'var(--text-main)',
              }}
            >
              Respire fundo.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-subtitle)', fontStyle: 'italic', color: 'var(--text-secondary)' }}
            >
              Mova o cursor ou deslize o dedo pela tela para afastar as nuvens pesadas.
            </motion.p>

            {/* Alternativa sem mouse/toque (teclado, leitor de tela, movimento limitado) */}
            <button type="button" className="btn" onClick={() => setCleared(100)}>
              Dissipar a névoa
            </button>

            {/* Barra de progresso de névoa */}
            <div style={{ width: '220px', height: '4px', background: 'var(--surface-3)', borderRadius: '9999px', overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${cleared}%` }}
                style={{ height: '100%', background: 'var(--sage)', borderRadius: '9999px' }}
              />
            </div>

            <p className="t-eyebrow" aria-live="off" style={{ color: 'var(--text-primary)' }}>
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
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="sr-only">Exercício de respiração</h1>
              <p className="t-eyebrow" aria-live="polite" style={{ color: 'var(--clay-dark)' }}>
                {breathCount >= 2
                  ? 'Exercício de Respiração · Concluído'
                  : `Exercício de Respiração · Ciclo ${breathCount + 1} de 2`}
              </p>
            </motion.div>

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
                  border: '2px solid rgba(95,115,82,0.5)',
                }}
              />
              {/* Anel médio */}
              <motion.div
                animate={{
                  scale: breathPhase === 'exhale' ? 0.7 : breathPhase === 'hold' ? 1.1 : 1,
                  backgroundColor: breathPhase === 'inhale'
                    ? 'rgba(127,145,112,0.25)'
                    : breathPhase === 'hold'
                    ? 'rgba(169,91,64,0.18)'
                    : 'rgba(140,163,181,0.22)',
                }}
                transition={{ duration: breathPhase === 'inhale' ? 4 : breathPhase === 'exhale' ? 4 : 0.2, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  border: '1.5px solid rgba(95,115,82,0.4)',
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
                  background: 'radial-gradient(circle, rgba(169,91,64,0.30), rgba(127,145,112,0.12))',
                  color: 'var(--clay-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PhaseIcon size={30} strokeWidth={1.6} aria-hidden="true" />
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
                <p aria-live="polite" style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-hero)', fontWeight: 400, color: 'var(--text-main)' }}>
                  {phaseText.text}
                </p>
                <p style={{ fontSize: 'var(--font-body)', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  {phaseText.sub}
                </p>
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              className="btn"
              onClick={advance}
              style={{ fontSize: 'var(--font-small)', padding: '0.6rem 1.4rem', minHeight: '40px' }}
            >
              Avançar no meu ritmo
            </button>
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
            background: 'radial-gradient(circle, rgba(112,122,138,0.6) 0%, rgba(84,94,112,0.94) 100%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Feixe de luz que acompanha o mouse/toque com física de mola */}
      {mode === 'fog' && isMoving && (
        <motion.div
          animate={{
            x: mousePos.x - 150,
            y: mousePos.y - 150,
          }}
          transition={{ type: 'spring', damping: 28, stiffness: 220, mass: 0.1 }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,251,244,0.95) 0%, rgba(255,251,244,0.5) 40%, rgba(255,251,244,0) 75%)',
            pointerEvents: 'none',
            zIndex: 15,
          }}
        />
      )}

      {/* Estrelas reveladas conforme limpa */}
      {stars.map((s, i) => (
        <motion.div
          key={i}
          animate={{ opacity: (cleared / 100) * s.peak }}
          style={{
            position: 'absolute',
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: '50%',
            backgroundColor: '#a95b40',
            pointerEvents: 'none',
          }}
        />
      ))}
    </motion.div>
  );
};

export default Breather;
