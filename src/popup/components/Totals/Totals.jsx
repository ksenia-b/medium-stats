import {Item} from "./Item.jsx";
import styles from './styles.module.css';
import { TOTALS} from "../../../constants.js";
import { currencyFormatter } from "../../../utils";

export const Totals = ({data, details}) => {
  return (
    <div className={styles.totalsWrapper}>
      {
        Object.keys(TOTALS).map((key) => {
            const value = key === 'income' ? currencyFormatter(data[key]) : data[key];
            return (
              <Item key={key} value={value} label={key} diff={0} details={details[key]}/>
            )
          }
        )
      }
    </div>
  )
}
