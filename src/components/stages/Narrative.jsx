import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../../context/JourneyContext';

const CHAPTER_GROUPS = [
  // Grupo 1: O Peso do Presente (Original)
  [
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
  ],
  // Grupo 2: Rotina e Mudança
  [
    {
      text: 'A rotina que vocês construíram agora parece um mapa de um lugar que não existe mais.',
      sub: 'Redescobrir o próprio caminho leva tempo.',
      question: 'Qual parte do dia é mais difícil?',
      options: ['Acordar', 'A hora do almoço', 'Chegar em casa', 'Antes de dormir'],
    },
    {
      text: 'Existem objetos pela casa que contam histórias que você ainda não está pronto para esquecer.',
      sub: 'As coisas perdem o significado aos poucos, no seu ritmo.',
      question: 'O que você fez com as lembranças?',
      options: ['Guardei tudo', 'Joguei fora/Doei', 'Ainda não mexi', 'Escondi de vista'],
    },
    {
      text: 'Você se pega ensaiando conversas que nunca vão acontecer.',
      sub: 'Sua mente está tentando encerrar ciclos em aberto.',
      question: 'O que você mais queria dizer?',
      options: ['Um pedido de desculpas', 'Um grito de revolta', 'Um último adeus', 'Só queria ser ouvido'],
    },
    {
      text: 'Cada pequeno ajuste na sua nova vida é uma vitória silenciosa.',
      sub: 'Respirar fundo também é progresso.',
      question: null,
      options: [],
    },
  ],
  // Grupo 3: Identidade e Autocuidado
  [
    {
      text: "Por muito tempo, o 'nós' abafou o 'eu'. Agora, o silêncio é a chance de se ouvir novamente.",
      sub: 'Você ainda está aí, sob todas essas camadas.',
      question: 'Quem é você sem essa relação?',
      options: ['Me sinto perdido(a)', 'Estou me redescobrindo', 'Ainda não sei', 'Alguém mais forte'],
    },
    {
      text: 'O autocuidado às vezes parece uma obrigação pesada, mas é o seu porto seguro.',
      sub: 'Trate-se com a mesma gentileza que trataria um amigo.',
      question: 'Como você tem se cuidado?',
      options: ['Focando no trabalho', 'Buscando terapia/ajuda', 'Tentando novos hobbies', 'Apenas sobrevivendo'],
    },
    {
      text: 'A saudade é um visitante que não bate na porta, ele simplesmente entra e senta à mesa.',
      sub: 'Você não precisa expulsá-lo, apenas aprender a conviver.',
      question: 'Onde a saudade aperta mais?',
      options: ['No peito', 'No pensamento', 'Na falta do toque', 'No hábito da voz'],
    },
    {
      text: 'Sua história não termina com esse ponto final. É apenas o fim de um capítulo.',
      sub: 'Vire a página com calma.',
      question: null,
      options: [],
    },
  ],
  // Grupo 4: Cura e Futuro
  [
    {
      text: 'A cura não é uma linha reta; é uma espiral que às vezes nos faz revisitar lugares conhecidos.',
      sub: 'Mesmo voltando, você já não é a mesma pessoa.',
      question: 'Como você define seu estado hoje?',
      options: ['Em reconstrução', 'Cansado(a)', 'Esperançoso(a)', 'Em choque'],
    },
    {
      text: 'O perdão, inclusive para si mesmo, é a chave que abre as grades que você nem sabia que existiam.',
      sub: 'Solte o peso que não lhe pertence mais.',
      question: 'O que você mais se culpa?',
      options: ['Por ter tentado tanto', 'Por não ter visto antes', 'Por erros passados', 'Por ainda sentir dor'],
    },
    {
      text: 'O mundo lá fora continua vasto e cheio de cores que você voltará a enxergar.',
      sub: 'A luz volta aos poucos, fresta por fresta.',
      question: 'O que te dá um pouco de paz?',
      options: ['Música/Arte', 'Amigos/Família', 'Natureza', 'Ficar sozinho(a)'],
    },
    {
      text: 'Aceitar que acabou é dar permissão para que algo novo comece.',
      sub: 'O tempo é seu aliado, não seu inimigo.',
      question: null,
      options: [],
    },
  ],
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

  // Seleciona um grupo de capítulos aleatoriamente na montagem do componente
  const chapters = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * CHAPTER_GROUPS.length);
    return CHAPTER_GROUPS[randomIndex];
  }, []);

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
