import React, { createContext, useContext, useState } from "react";

interface SoundContextType {
  isSoundOn: boolean;
  toggleSound: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);

  const toggleSound = () => {
    setIsSoundOn((prev) => !prev);
  };

  return (
    <SoundContext.Provider
      value={{
        isSoundOn,
        toggleSound,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
};
