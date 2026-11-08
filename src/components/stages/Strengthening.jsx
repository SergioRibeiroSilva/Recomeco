import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout, Leaf, Flower, Flower2, Trees, Sun, DoorOpen, BookOpen,
  HeartHandshake, CloudRain, Hourglass, Moon, Sparkles,
} from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';

const AFFIRMATIONS = [
  { text: "Você não precisa entender tudo agora.", Icon: Leaf },
  { text: "O fim de algo abre espaço para o que ainda não chegou.", Icon: DoorOpen },
  { text: "Sua história não acaba aqui. Ela recomeça.", Icon: BookOpen },
  { text: "Amor próprio não é egoísmo — é sobrevivência.", Icon: HeartHandshake },
  { text: "Você merece o mesmo cuidado que deu.", Icon: Flower2 },
  { text: "Chorar não é fraqueza. É o coração se limpando.", Icon: CloudRain },
  { text: "Um dia de cada vez. Às vezes, uma hora de cada vez.", Icon: Hourglass },
  { text: "Você é inteiro mesmo sem alguém ao lado.", Icon: Moon },
];

const GARDEN_ICONS = [Sprout, Leaf, Flower, Flower2, Trees, Sun];

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
      background: 'rgba(239,194,125,0.14)',
      border: '1px solid rgba(239,194,125,0.4)',
      borderRadius: 'var(--radius-pill)',
      padding: '0.7rem 1.4rem',
      fontFamily: 'var(--font-serif)',
      fontStyle: 'italic',
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
        padding: '2rem 1rem 10rem 1rem',
        textAlign: 'center',
      }}>
        {/* Jardim de progresso */}
        <motion.div
          style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}
        >
          {GARDEN_ICONS.slice(0, Math.min(gardenStage + 1, GARDEN_ICONS.length)).map((GardenIcon, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              style={{
                display: 'flex',
                color: i === gardenStage ? 'var(--color-gold-300)' : 'var(--color-sage-400)',
              }}
            >
              <GardenIcon size={i === gardenStage ? 36 : 22} strokeWidth={1.5} />
            </motion.span>
          ))}
        </motion.div>

        <h2 style={{
          fontSize: 'var(--font-title)',
          fontWeight: 500,
          color: 'var(--text-main)',
          lineHeight: 1.2,
        }}>
          3 sentimentos que você pode cultivar.
        </h2>

        {/* Afirmação rotativa */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentAffIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--font-subtitle)',
              fontStyle: 'italic',
              color: 'var(--text-primary)',
              lineHeight: 1.5,
            }}
          >
            <affirmation.Icon size={20} strokeWidth={1.6} aria-hidden="true" style={{ flexShrink: 0, color: 'var(--color-gold-300)' }} />
            <span>{affirmation.text}</span>
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
                className="field"
                aria-label="Escreva uma intenção para cultivar"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder={`O que você quer cultivar? (${intentions.length}/3)`}
                disabled={intentions.length >= 6}
              />
              <motion.button
                type="submit"
                aria-label="Plantar intenção"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!inputValue.trim() || intentions.length >= 6}
                className="btn btn-primary btn-icon"
              >
                <Sprout size={22} strokeWidth={2} aria-hidden="true" />
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Contador de intenções */}
        <p aria-live="polite" style={{ fontSize: 'var(--font-small)', color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
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
              className="btn btn-primary"
              style={{ padding: '1rem 2.4rem' }}
            >
              Clique aqui se está pronto para o recomeço
              <Sparkles size={20} strokeWidth={2} aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Strengthening;
