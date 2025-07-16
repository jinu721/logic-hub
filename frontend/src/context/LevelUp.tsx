import React, { createContext, useState, useContext } from 'react';

const LevelUpContext = createContext();

export const LevelUpProvider = ({ children }) => {
  const [levelUpData, setLevelUpData] = useState({
    pending: false,
    newLevel: 0,
    xpGained: 0,
    remainingXP: 0,
    rewards: []
  });

  const queueLevelUp = (data) => {
    setLevelUpData({
      pending: true,
      newLevel: data.newLevel,
      xpGained: data.xpGained,
      remainingXP: data.remainingXP,
      rewards: data.rewards || []
    });
  };

  const clearLevelUp = () => {
    setLevelUpData({
      pending: false,
      newLevel: 0,
      xpGained: 0,
      remainingXP: 0,
      rewards: []
    });
  };

  return (
    <LevelUpContext.Provider
      value={{
        levelUpData,
        queueLevelUp,
        clearLevelUp
      }}
    >
      {children}
    </LevelUpContext.Provider>
  );
};

export const useLevelUp = () => {
  const context = useContext(LevelUpContext);
  if (!context) {
    throw new Error('useLevelUp must be used within a LevelUpProvider');
  }
  return context;
};