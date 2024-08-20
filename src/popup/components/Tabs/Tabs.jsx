import { TabsProvider, useTabs } from "./TabsContext.jsx";
import styles from "./tabs.module.css";

export function Tabs({ children, defaultIndex }) {
  return <TabsProvider defaultIndex={defaultIndex}>{children}</TabsProvider>;
}

export function TabList({ children }) {
  return <div className={styles.tabsList}>{children}</div>;
}

export function Tab({ index, children }) {
  const { activeTab, setActiveTab } = useTabs();
  return (
    <button
      className={`${styles.tab} ${activeTab === index ? styles.activeTab : ""}`}
      onClick={() => setActiveTab(index)}
    >
      {children}
    </button>
  );
}

export function TabPanel({ index, children }) {
  const { activeTab } = useTabs();
  return activeTab === index ? (
    <div className={styles.tabPanel}>{children}</div>
  ) : null;
}
