import {Item} from "./Item.jsx";
import styles from './styles.module.css';

export const Totals = ({data}) => {

  return (
    <div className={styles.totalsWrapper}>
      {
        Object.keys(data).map((key) => {
            return (
              <Item key={key} value={data[key]} label={key} diff={0}/>
            )
          }
        )
      }
    </div>
  )
}
