import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../../context/JourneyContext';

const chapters = [
  {
    text: 'Às vezes, parece que o mundo continuou girando, mas você ficou parado no mesmo lugar.',
    sub: 'E isso não significa que você está atrasado.',
    question: 'O que mais pesou pra você?',
    options: ['A solidão', 'As memórias', 'A incerteza', 'O que não foi dito'],
  },
  {
    text: 'O silêncio que antes era confortável agora faz barulho demais.',
    sub: 'Mas silêncios podem se transformar.',
    question: 'Como você tem dormido?',
    options: ['Mal, pensando demais', 'Bem, estou entorpecido', 'Irregular, em ondas', 'Com sonhos estranhos'],
  },
  {
    text: 'Você tenta colocar sentido onde só restam fragmentos. É exaustivo.',
    sub: 'Não é fraqueza. É amor processando a perda.',
    question: 'O que você sente mais falta?',
    options: ['Da presença física', 'Da cumplicidade', 'Do futuro que planejou', 'De quem você era junto'],
  },
  {
    text: 'Reconhecer a dor não é se render a ela. É o primeiro passo real.',
    sub: 'Você chegou aqui. Isso já é coragem.',
    question: null,
    options: [],
  },
];

const TypewriterText = ({ text }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 28);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayed}</span>;
};

const Narrative = () => {
  const { nextStage } = useJourney();
  const [chapterIndex, setChapterIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showNext, setShowNext] = useState(false);

  const chapter = chapters[chapterIndex];
  const isLast = chapterIndex === chapters.length - 1;

  const handleOptionSelect = (opt) => {
    setSelectedOption(opt);
    setTimeout(() => setShowNext(true), 600);
  };

  const handleNext = () => {
    if (isLast) {
      nextStage();
    } else {
      setChapterIndex(i => i + 1);
      setSelectedOption(null);
      setShowNext(false);
    }
  };

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
        maxWidth: '680px',
        width: '100%',
        padding: '2rem 2rem 10rem 2rem',
        textAlign: 'center',
        gap: '2rem',
        minHeight: '85vh',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={chapterIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {/* Número do capítulo */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            {chapterIndex + 1} / {chapters.length}
          </motion.span>

          {/* Frase principal com typewriter */}
          <motion.p
            style={{
              fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
              fontWeight: 300,
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.9)',
              fontStyle: 'italic',
            }}
          >
            "<TypewriterText text={chapter.text} />"
          </motion.p>

          {/* Sub-frase */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: chapter.text.length * 0.028 + 0.5 }}
            style={{
              fontSize: '0.95rem',
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 400,
            }}
          >
            {chapter.sub}
          </motion.p>

          {/* Pergunta e opções */}
          {chapter.question && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: chapter.text.length * 0.028 + 1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}
            >
              <p style={{
                fontSize: '0.85rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
              }}>
                {chapter.question}
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
              }}>
                {chapter.options.map(opt => (
                  <motion.button
                    key={opt}
                    whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleOptionSelect(opt)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '16px',
                      background: selectedOption === opt
                        ? 'rgba(200,160,255,0.2)'
                        : 'rgba(255,255,255,0.05)',
                      border: selectedOption === opt
                        ? '1px solid rgba(200,160,255,0.5)'
                        : '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.85)',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Botão Avançar */}
      <AnimatePresence>
        {(showNext || !chapter.question) && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={handleNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '50px',
              padding: '0.85rem 2.5rem',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              textTransform: 'uppercase',
              marginTop: '1rem',
            }}
          >
            {isLast ? 'Estou pronto para continuar →' : 'Continuar →'}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Narrative;
