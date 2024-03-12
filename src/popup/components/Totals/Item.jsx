import styles from './styles.module.css';

export const Item = ({value, label, diff}) => {
  return (
    <div>
      <p className={styles.itemLabel}>{label}</p>
      <p className={styles.itemValue}>{value}</p>
      {diff ? <p>Diff: {diff}</p> : null}
    </div>
)};
