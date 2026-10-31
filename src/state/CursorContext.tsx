import React, { createContext, useContext, useState, useCallback } from 'react';

export type CursorMode = 'default' | 'hover' | 'drag' | 'explore' | 'view' | 'configure';

interface CursorContextValue {
  mode: CursorMode;
  label: string;
  setCursor: (mode: CursorMode, label?: string) => void;
  resetCursor: () => void;
}

const CursorContext = createContext<CursorContextValue>({
  mode: 'default',
  label: '',
  setCursor: () => {},
  resetCursor: () => {},
});

export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<CursorMode>('default');
  const [label, setLabel] = useState<string>('');

  const setCursor = useCallback((nextMode: CursorMode, nextLabel = '') => {
    setMode(nextMode);
    setLabel(nextLabel);
  }, []);

  const resetCursor = useCallback(() => {
    setMode('default');
    setLabel('');
  }, []);

  return (
    <CursorContext.Provider value={{ mode, label, setCursor, resetCursor }}>
      {children}
    </CursorContext.Provider>
  );
};

export function useCursor() {
  return useContext(CursorContext);
}
