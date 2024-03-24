import styles from "./incomeChart.module.css";
import {dateFormatter} from "../../../utils";

export const CustomTooltip = ({active, payload, label, postById}) => {
  if (active && payload && payload.length) {
    const totalIncome = (payload?.reduce((acc, entry) => {
      return acc + entry.value;
    }, 0) / 100)?.toFixed(2)

    return (
      <div className={styles.tooltip}>
        {label ? <p>Date: {dateFormatter(label)}</p> : null}
        <p>Total income: ${totalIncome}</p>
        <hr/>
        {payload.filter((entry) => entry.value).map((entry) => {
          return (
            <p className={styles.article} key={entry.dataKey} style={{color: entry.fill}}>
              <span>{`${postById[entry.dataKey].slice(0, 50)}... :`}</span>
              <span>{`$${(entry.value / 100)?.toFixed(2)}`}</span>
            </p>
          )
        })}
      </div>
    );
  }

  return null;
};
