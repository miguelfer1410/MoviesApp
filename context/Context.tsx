import { createContext, useContext } from 'react';

export const Context = createContext<any>(undefined);

export const useMovieContext = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useContext must be used within a Provider');
  }
  return context;
};
