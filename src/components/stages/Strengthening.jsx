import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../../context/JourneyContext';

const AFFIRMATIONS = [
  { text: "Você não precisa entender tudo agora.", emoji: "🌿" },
  { text: "O fim de algo abre espaço para o que ainda não chegou.", emoji: "🚪" },
  { text: "Sua história não acaba aqui. Ela recomeça.", emoji: "📖" },
  { text: "Amor próprio não é egoísmo — é sobrevivência.", emoji: "❤️‍🔥" },
  { text: "Você merece o mesmo cuidado que deu.", emoji: "🌸" },
  { text: "Chorar não é fraqueza. É o coração se limpando.", emoji: "🌧️" },
  { text: "Um dia de cada vez. Às vezes, uma hora de cada vez.", emoji: "⏳" },
  { text: "Você é inteiro mesmo sem alguém ao lado.", emoji: "🌕" },
];

const GARDEN_ICONS = ['🌱', '🌿', '🌻', '🌸', '🌺', '🌹'];

const FloatingIntention = ({ text, x, y, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
    transition={{
      opacity: { duration: 0.5, delay },
      scale: { duration: 0.5, delay },
      y: { duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 },
    }}
    style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      transform: 'translate(-50%, -50%)',
      background: 'rgba(200,160,255,0.18)',
      border: '1px solid rgba(200,160,255,0.35)',
      borderRadius: '24px',
      padding: '0.7rem 1.4rem',
      fontSize: 'var(--font-body)',
      color: 'var(--text-main)',
      whiteSpace: 'nowrap',
      backdropFilter: 'blur(8px)',
      pointerEvents: 'none',
    }}
  >
    {text}
  </motion.div>
);

const Strengthening = () => {
  const { nextStage } = useJourney();
  const [intentions, setIntentions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [currentAffIdx, setCurrentAffIdx] = useState(0);
  const [gardenStage, setGardenStage] = useState(0);
  const inputRef = useRef(null);

  const affirmation = AFFIRMATIONS[currentAffIdx];
  const gardenEmoji = GARDEN_ICONS[Math.min(gardenStage, GARDEN_ICONS.length - 1)];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || intentions.length >= 6) return;
    const x = 15 + Math.random() * 70;
    const y = 20 + Math.random() * 60;
    setIntentions(prev => [...prev, { id: Date.now(), text: inputValue, x, y }]);
    setInputValue('');
    setGardenStage(prev => Math.min(prev + 1, GARDEN_ICONS.length - 1));
    setCurrentAffIdx(prev => (prev + 1) % AFFIRMATIONS.length);
  };

  const canProceed = intentions.length >= 3;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Intenções flutuantes no fundo */}
      {intentions.map((int, i) => (
        <FloatingIntention key={int.id} text={int.text} x={int.x} y={int.y} delay={0} />
      ))}

      {/* Conteúdo central */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        maxWidth: '560px',
        width: '100%',
        padding: '2rem 2rem 10rem 2rem',
        textAlign: 'center',
      }}>
        {/* Jardim de progresso */}
        <motion.div
          style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}
        >
          {GARDEN_ICONS.slice(0, Math.min(gardenStage + 1, GARDEN_ICONS.length)).map((icon, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              style={{ fontSize: i === gardenStage ? '2rem' : '1.2rem' }}
            >
              {icon}
            </motion.span>
          ))}
        </motion.div>

        <h2 style={{
          fontSize: 'var(--font-title)',
          fontWeight: 300,
          color: 'var(--text-main)',
          lineHeight: 1.2,
        }}>
          Plante suas intenções.
        </h2>

        {/* Afirmação rotativa */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentAffIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.9, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              fontSize: 'var(--font-subtitle)',
              fontStyle: 'italic',
              color: 'var(--text-primary)',
              lineHeight: 1.5,
            }}
          >
            {affirmation.emoji} {affirmation.text}
          </motion.p>
        </AnimatePresence>

        {/* Formulário com transição de saída suave ao completar as intenções */}
        <AnimatePresence>
          {!canProceed && (
            <motion.form
              initial={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0, scale: 0.95, overflow: 'hidden', marginTop: 0, marginBottom: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              onSubmit={handleAdd}
              style={{ display: 'flex', gap: '0.75rem', width: '100%' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder={`O que você quer cultivar? (${intentions.length}/3)`}
                disabled={intentions.length >= 6}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '50px',
                  padding: '1rem 1.5rem',
                  color: 'var(--text-main)',
                  fontSize: 'clamp(1.15rem, 3vw, 1.35rem)',
                  outline: 'none',
                  fontFamily: 'Outfit, sans-serif',
                  transition: 'border 0.3s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(200,160,255,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!inputValue.trim() || intentions.length >= 6}
                style={{
                  padding: '1rem 1.7rem',
                  borderRadius: '50px',
                  background: 'rgba(200,160,255,0.3)',
                  border: '1px solid rgba(200,160,255,0.45)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  opacity: !inputValue.trim() || intentions.length >= 6 ? 0.4 : 1,
                  transition: 'opacity 0.3s',
                }}
              >
                🌱
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Contador de intenções */}
        <p style={{ fontSize: 'var(--font-small)', color: 'var(--text-primary)', letterSpacing: '0.1em' }}>
          {intentions.length < 3
            ? `Digite mais ${3 - intentions.length} intenç${3 - intentions.length !== 1 ? 'ões' : 'ão'} e clique na mudinha para continuar`
            : '✓ Seu jardim está florescendo!'}
        </p>

        {/* Botão continuar */}
        <AnimatePresence>
          {canProceed && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={nextStage}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '1rem 3rem',
                borderRadius: '50px',
                background: 'linear-gradient(135deg, rgba(200,160,255,0.25), rgba(255,180,120,0.2))',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'var(--text-main)',
                fontSize: 'var(--font-body)',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 500,
              }}
            >
              Clique aqui se está pronto para o recomeço ✨
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Strengthening;
