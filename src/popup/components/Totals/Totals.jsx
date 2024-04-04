import {Item} from "./Item.jsx";
import styles from './styles.module.css';

export const Totals = ({data, details}) => {

  return (
    <div className={styles.totalsWrapper}>
      {
        Object.keys(data).map((key) => {
            const value = key === 'income' ? `$${data[key]?.toFixed(1)}` : data[key];
            return (
              <Item key={key} value={value} label={key} diff={0} details={details[key]}/>
            )
          }
        )
      }
    </div>
  )
}
