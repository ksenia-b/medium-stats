import styles from './styles.module.css';

export const Banner = () => {
  return (
    <div className={styles.banner}>
      <p className={styles.p}>This chart is exclusively available for followers of <a href="https://medium.com/m-stats" target={"_blank"}>M. Stats💚—Earn More Together.</a> publication on Medium.</p>
      <p className={styles.p}><strong>To unlock access to this chart and join our community:</strong></p>

      <ol className={styles.list}>
        <li><strong>Visit M. Stats💚 Publication</strong>: Navigate to <a href="https://medium.com/m-stats" target={"_blank"}>M. Stats💚</a> on Medium.</li>
        <li><strong>Click "Follow"</strong>: Hit the "Follow" button to become a member of our publication.</li>
        <li><strong>Close and Reopen the Extension Popup</strong>: After joining, please close and reopen your Chrome extension popup to access this chart and other exclusive content seamlessly.</li>
      </ol>

      <p className={styles.p}>Please note, it may take a short while for Medium to update publication information.</p>
    </div>
  )
}
