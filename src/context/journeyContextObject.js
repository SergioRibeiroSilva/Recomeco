import { createContext, useContext } from 'react';

export const JourneyContext = createContext(null);

export const useJourney = () => {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney deve ser usado dentro de um JourneyProvider');
  }
  return context;
};
