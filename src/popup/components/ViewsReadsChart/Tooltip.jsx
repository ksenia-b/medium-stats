import { dateFormatter } from '../../../utils'
import styles from './tooltip.module.css';

export const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {

    return (
      <div className={styles.tooltip}>
        <p>Date: {dateFormatter(label)}</p>
        <hr/>
        {payload.map((entry) => {
          return (
            <p key={entry.dataKey} style={{color: entry.fill}}>
              <span>{`${entry.dataKey}: ${entry.value}`}</span>
            </p>
          )
        })}
        </div>
    );
  }

  return null;
}
