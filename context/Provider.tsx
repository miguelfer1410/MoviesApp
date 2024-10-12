import React, { useReducer, ReactNode, useEffect } from 'react';
import { Context } from './Context';
import { Reducer, initialState } from './Reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  useEffect(() => {
    const loadFavorites = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
            dispatch({ type: 'SET_FAVORITES', payload: favorites });
        } catch (error) {
            console.error('Failed to load favorites:', error);
        }
    };

    loadFavorites();
}, []);

  return (
    <Context.Provider value={{ state, dispatch }}>
      {children}
    </Context.Provider>
  );
};