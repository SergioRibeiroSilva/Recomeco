import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout, Leaf, Flower, Flower2, Trees, Sun, DoorOpen, BookOpen,
  HeartHandshake, CloudRain, Hourglass, Moon, Sparkles, X,
} from 'lucide-react';
import { useJourney } from '../../context/journeyContextObject';

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

const MIN_INTENTIONS = 3; // mínimo para continuar; também é o limite (o formulário some ao atingi-lo)
const MAX_LENGTH = 60;

const GARDEN_ICONS = [Sprout, Leaf, Flower, Flower2, Trees, Sun];

const PlantedIntentionPill = ({ item, onRemove }) => (
  <motion.li
    layout
    initial={{ opacity: 0, scale: 0.85, y: 12 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.85, y: -8 }}
    transition={{ duration: 0.3 }}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'var(--surface)',
      border: '1.5px solid var(--border-gold)',
      boxShadow: 'var(--shadow-soft)',
      borderRadius: 'var(--radius-pill)',
      padding: '0.55rem 0.7rem 0.55rem 1.15rem',
      fontFamily: 'var(--font-serif)',
      fontStyle: 'italic',
      fontSize: 'var(--font-body)',
      color: 'var(--text-main)',
      maxWidth: '100%',
    }}
  >
    <Sprout size={16} strokeWidth={1.8} color="var(--clay)" aria-hidden="true" style={{ flexShrink: 0 }} />
    <span style={{ wordBreak: 'break-word', textAlign: 'left' }}>{item.text}</span>
    <button
      type="button"
      onClick={() => onRemove(item.id)}
      aria-label={`Remover intenção "${item.text}"`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: 'var(--surface-sand)',
        color: 'var(--ink-2)',
        flexShrink: 0,
      }}
    >
      <X size={14} strokeWidth={2} aria-hidden="true" />
    </button>
  </motion.li>
);

const Strengthening = () => {
  const { nextStage, intentions, setIntentions } = useJourney();
  const [inputValue, setInputValue] = useState('');
  const [currentAffIdx, setCurrentAffIdx] = useState(0);
  const inputRef = useRef(null);

  const affirmation = AFFIRMATIONS[currentAffIdx];
  const gardenStage = Math.min(intentions.length, GARDEN_ICONS.length - 1);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || intentions.length >= MIN_INTENTIONS) return;
    setIntentions(prev => [
      ...prev,
      { id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`, text: inputValue.trim() },
    ]);
    setInputValue('');
    setCurrentAffIdx(prev => (prev + 1) % AFFIRMATIONS.length);
    inputRef.current?.focus();
  };

  const handleRemove = (id) => {
    setIntentions(prev => prev.filter(item => item.id !== id));
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const canProceed = intentions.length >= MIN_INTENTIONS;

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
        minHeight: '100dvh',
        padding: '1rem 1rem 8rem',
        boxSizing: 'border-box',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
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
        padding: '2rem 1rem 6rem 1rem',
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
                color: i === gardenStage ? 'var(--clay)' : 'var(--sage)',
              }}
            >
              <GardenIcon size={i === gardenStage ? 36 : 22} strokeWidth={1.5} />
            </motion.span>
          ))}
        </motion.div>

        <h1 style={{
          fontSize: 'var(--font-title)',
          fontWeight: 500,
          color: 'var(--text-main)',
          lineHeight: 1.2,
        }}>
          3 sentimentos que você pode cultivar.
        </h1>

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
            <affirmation.Icon size={20} strokeWidth={1.6} aria-hidden="true" style={{ flexShrink: 0, color: 'var(--clay)' }} />
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
                placeholder={`O que você quer cultivar? (${intentions.length}/${MIN_INTENTIONS})`}
                maxLength={MAX_LENGTH}
                disabled={intentions.length >= MIN_INTENTIONS}
              />
              <motion.button
                type="submit"
                aria-label="Plantar intenção"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!inputValue.trim() || intentions.length >= MIN_INTENTIONS}
                className="btn btn-primary btn-icon"
              >
                <Sprout size={22} strokeWidth={2} aria-hidden="true" />
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Lista organizada de intenções plantadas */}
        {intentions.length > 0 && (
          <ul
            aria-label="Intenções cultivadas"
            style={{
              listStyle: 'none',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.65rem',
              width: '100%',
              margin: '0.25rem 0',
              padding: 0,
            }}
          >
            <AnimatePresence>
              {intentions.map((int) => (
                <PlantedIntentionPill key={int.id} item={int} onRemove={handleRemove} />
              ))}
            </AnimatePresence>
          </ul>
        )}

        {/* Contador de intenções */}
        <p aria-live="polite" style={{ fontSize: 'var(--font-small)', color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
          {intentions.length < MIN_INTENTIONS
            ? `Digite mais ${3 - intentions.length} intenç${3 - intentions.length !== 1 ? 'ões' : 'ão'} e clique na mudinha para continuar`
            : 'Seu jardim está florescendo!'}
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
