import { createContext, useState } from 'react';

export const TempUnitContext = createContext();

export const TempUnitProvider = ({ children }) => {
  const [tempUnit, setTempUnit] = useState('celsius');

  return (
    <TempUnitContext.Provider value={{ tempUnit, setTempUnit }}>
      {children}
    </TempUnitContext.Provider>
  );
};
