import { useState, useCallback, useMemo } from 'react';
import { JourneyContext } from './journeyContextObject';

const LAST_STAGE = 5;

export const JourneyProvider = ({ children }) => {
  const [currentStage, setCurrentStage] = useState(0); // 0 a 5
  const [emotionalProgress, setEmotionalProgress] = useState(0); // 0 a 100
  const [userMood, setUserMood] = useState(null);
  const [intentions, setIntentions] = useState([]); // intenções plantadas no estágio Strengthening

  // Avança um estágio. Identidade estável e sem depender do estágio atual no closure,
  // para que chamadas atrasadas (timeouts) nunca usem um valor antigo.
  const nextStage = useCallback(() => {
    setCurrentStage(prev => {
      if (prev >= LAST_STAGE) return prev;
      return prev + 1;
    });
    setEmotionalProgress(prev => Math.min(prev + 20, 100));
  }, []);

  const setMood = useCallback((mood) => {
    setUserMood(mood);
    setEmotionalProgress(10); // Começa com 10% de progresso ao admitir o sentimento
  }, []);

  const resetJourney = useCallback(() => {
    setCurrentStage(0);
    setEmotionalProgress(0);
    setUserMood(null);
    setIntentions([]);
  }, []);

  const isCompleted = currentStage >= LAST_STAGE;

  const value = useMemo(() => ({
    currentStage,
    setCurrentStage,
    emotionalProgress,
    setEmotionalProgress,
    userMood,
    setMood,
    nextStage,
    resetJourney,
    intentions,
    setIntentions,
    isCompleted,
  }), [currentStage, emotionalProgress, userMood, setMood, nextStage, resetJourney, intentions, isCompleted]);

  return (
    <JourneyContext.Provider value={value}>
      {children}
    </JourneyContext.Provider>
  );
};
