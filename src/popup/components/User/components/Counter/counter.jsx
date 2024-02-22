import styles from './counter.module.css';

export const Counter = ({ title, count, previousCount }) => {
  const difference = count - previousCount;
  return (
    <div>
      <p className={styles.title}>{title}</p>
      <p className={styles.count}>{count}</p>
      <p className={styles.difference}>{difference > 0 ? '+' : ''}{difference} from last month</p>
    </div>
  )
}
