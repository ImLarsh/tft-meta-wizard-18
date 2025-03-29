
import React, { createContext, useContext, useState } from 'react';

type ChampionSet = 'standard' | 'set14';

interface ChampionSetContextType {
  set: ChampionSet;
  toggleSet: () => void;
}

const ChampionSetContext = createContext<ChampionSetContextType>({
  set: 'standard',
  toggleSet: () => {},
});

export function ChampionSetProvider({ children }: { children: React.ReactNode }) {
  const [set, setSet] = useState<ChampionSet>('standard');

  const toggleSet = () => {
    setSet((prevSet) => (prevSet === 'standard' ? 'set14' : 'standard'));
  };

  return (
    <ChampionSetContext.Provider value={{ set, toggleSet }}>
      {children}
    </ChampionSetContext.Provider>
  );
}

export const useChampionSet = () => useContext(ChampionSetContext);
