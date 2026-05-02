import React, { createContext, useContext, useState, useEffect } from 'react';

const JourneyContext = createContext();

export const JourneyProvider = ({ children }) => {
  const [currentStage, setCurrentStage] = useState(0); // 0 a 5
  const [emotionalProgress, setEmotionalProgress] = useState(0); // 0 a 100
  const [userMood, setUserMood] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Lógica para avançar estágio
  const nextStage = () => {
    if (currentStage < 5) {
      setCurrentStage(prev => prev + 1);
      setEmotionalProgress(prev => Math.min(prev + 20, 100));
    } else {
      setIsCompleted(true);
    }
  };

  const setMood = (mood) => {
    setUserMood(mood);
    setEmotionalProgress(10); // Começa com 10% de progresso ao admitir o sentimento
  };

  return (
    <JourneyContext.Provider value={{
      currentStage,
      setCurrentStage,
      emotionalProgress,
      setEmotionalProgress,
      userMood,
      setMood,
      nextStage,
      isCompleted
    }}>
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = () => {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney deve ser usado dentro de um JourneyProvider');
  }
  return context;
};
