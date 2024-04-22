import {TabsProvider, useTabs } from './TabsContext.jsx';
import styles from './tabs.module.css';

export const Tabs = ({ children, defaultIndex }) => {
  return <TabsProvider defaultIndex={defaultIndex}>{children}</TabsProvider>;
};

export const TabList = ({ children }) => {
  return <div className={styles.tabsList}>{children}</div>;
};

export const Tab = ({ index, children }) => {
  const { activeTab, setActiveTab } = useTabs();
  return (
    <button className={`${styles.tab} ${activeTab === index ? styles.activeTab : ''}`} onClick={() => setActiveTab(index)}>
      {children}
    </button>
  );
};

export const TabPanel = ({ index, children }) => {
  const { activeTab } = useTabs();
  return activeTab === index ? <div className={styles.tabPanel}>{children}</div> : null;
};
