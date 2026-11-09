import { useState, useCallback, useMemo } from 'react';
import { JourneyContext } from './journeyContextObject';

export const LAST_STAGE = 5;

export const JourneyProvider = ({ children }) => {
  const [currentStage, setCurrentStage] = useState(0); // 0 a 5
  const [userMood, setUserMood] = useState(null);
  const [intentions, setIntentions] = useState([]); // intenções plantadas no estágio Strengthening

  // Avança um estágio. Identidade estável e sem depender do estágio atual no closure,
  // para que chamadas atrasadas (timeouts) nunca usem um valor antigo.
  const nextStage = useCallback(() => {
    setCurrentStage(prev => (prev >= LAST_STAGE ? prev : prev + 1));
  }, []);

  const setMood = useCallback((mood) => {
    setUserMood(mood);
  }, []);

  const resetJourney = useCallback(() => {
    setCurrentStage(0);
    setUserMood(null);
    setIntentions([]);
  }, []);

  const value = useMemo(() => ({
    currentStage,
    userMood,
    setMood,
    nextStage,
    resetJourney,
    intentions,
    setIntentions,
  }), [currentStage, userMood, setMood, nextStage, resetJourney, intentions]);

  return (
    <JourneyContext.Provider value={value}>
      {children}
    </JourneyContext.Provider>
  );
};
