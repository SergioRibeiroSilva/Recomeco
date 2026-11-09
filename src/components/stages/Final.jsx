import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sun, RotateCcw } from 'lucide-react';
import DawnCard from '../DawnCard';
import { useJourney } from '../../context/journeyContextObject';

const MESSAGES = [
  "Você passou por algo difícil.",
  "Sentiu na pele o peso de uma perda.",
  "E mesmo assim, você está aqui.",
  "Isso tem um nome: coragem.",
];

const Final = () => {
  const { resetJourney } = useJourney();
  const [msgIdx, setMsgIdx] = useState(0);
  const [done, setDone] = useState(false);
  const canvasRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    if (msgIdx < MESSAGES.length - 1) {
      const t = setTimeout(() => setMsgIdx(i => i + 1), 2200);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setDone(true), 2000);
      return () => clearTimeout(t);
    }
  }, [msgIdx]);

  useEffect(() => {
    if (!done) return;
    rootRef.current?.closest('main')?.scrollTo?.({ top: 0 });
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    const myConfetti = confetti.create(canvas, { resize: true, useWorker: false });

    const colors = ['#a95b40', '#e8c4b4', '#7f9170', '#dce3d1', '#e3a857'];
    let count = 0;
    const max = 6;
    const interval = setInterval(() => {
      myConfetti({
        particleCount: 60,
        spread: 80,
        startVelocity: 35,
        origin: { x: Math.random() * 0.6 + 0.2, y: 0.1 },
        colors,
        shapes: ['circle', 'square'],
        scalar: 0.9,
        gravity: 0.8,
        drift: (Math.random() - 0.5) * 0.5,
        decay: 0.92,
      });
      if (++count >= max) clearInterval(interval);
    }, 600);

    return () => {
      clearInterval(interval);
      myConfetti.reset();
    };
  }, [done]);

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        minHeight: '100dvh',
        position: 'relative',
        textAlign: 'center',
        padding: '2rem 2rem 3rem',
        overflowX: 'hidden',
      }}
    >
      {/* Canvas de confetes */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 50,
        }}
      />

      {/* Mensagens sequenciais */}
      {!done ? (
        <motion.div
          key={msgIdx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            margin: 'auto',
          }}
        >
          <h1 className="sr-only">Recomeço</h1>
          <p
            aria-live="polite"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--font-quote)',
              fontWeight: 400,
              color: 'var(--text-main)',
              fontStyle: 'italic',
              lineHeight: 1.5,
              maxWidth: '600px',
            }}
          >
            {MESSAGES[msgIdx]}
          </p>
          {/* Indicador */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '1rem' }} aria-hidden="true">
            {MESSAGES.map((_, i) => (
              <div key={i} style={{
                width: i === msgIdx ? '20px' : '6px',
                height: '4px',
                borderRadius: '2px',
                background: i <= msgIdx ? 'var(--clay)' : 'var(--surface-3)',
                transition: 'all 0.4s',
              }} />
            ))}
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => setDone(true)}
            style={{ marginTop: '1rem', fontSize: 'var(--font-small)', padding: '0.55rem 1.3rem', minHeight: '40px' }}
          >
            Ver meu cartão de Alvorecer
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, type: 'spring' }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            maxWidth: '700px',
            margin: 'auto',
            padding: '1rem 0',
          }}
        >
          {/* Ícone solar */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            aria-hidden="true"
            style={{
              display: 'flex',
              color: 'var(--clay)',
            }}
          >
            <Sun size={72} strokeWidth={1.2} />
          </motion.div>

          <div>
            <h1 style={{
              fontSize: 'clamp(2.3rem, 6.4vw, 4.4rem)',
              fontWeight: 500,
              fontStyle: 'italic',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
              marginBottom: '1rem',
              paddingBottom: '0.1em',
            }}>
              O sol sempre volta.
            </h1>
            <p style={{
              fontSize: 'var(--font-subtitle)',
              fontWeight: 400,
              color: 'var(--text-main)',
              lineHeight: 1.7,
              maxWidth: '520px',
              margin: '0 auto',
            }}>
              Sua jornada ganhou um novo fôlego hoje.{' '}
              Você é mais inteiro do que imagina, e o amanhã ainda não foi escrito.
            </p>
          </div>

          <DawnCard />

          {/* Ações */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={resetJourney}
              className="btn"
            >
              <RotateCcw size={18} strokeWidth={2} aria-hidden="true" />
              Refazer a jornada
            </motion.button>
          </div>

          {/* Easter egg */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5 }}
            style={{
              fontSize: 'var(--font-tiny)',
              letterSpacing: '0.2em',
              color: 'var(--ink-3)',
              marginTop: '2rem',
              textTransform: 'uppercase',
            }}
          >
            Feito com carinho e cuidado para quem precisa recomeçar.
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Final;
