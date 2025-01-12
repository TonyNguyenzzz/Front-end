// src/hooks/useTheme.ts
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const useThemeMode = () => {
  return useContext(ThemeContext);
};

export default useThemeMode;
