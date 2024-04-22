import React, { createContext, useState, useContext } from 'react';

const TabsContext = createContext({});

export const TabsProvider = ({ children, defaultIndex = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultIndex);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
};

export const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a TabsProvider');
  }
  return context;
};
