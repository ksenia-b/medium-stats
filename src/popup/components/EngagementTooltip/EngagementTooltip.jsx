import styles from "./tooltip.module.css";
import {dateFormatter} from "../../../utils";

const LABELS = {
  member: 'Members',
  nonMember: 'Non-members'
}
export const EngagementTooltip = ({active, payload, label}) => {
  if (active && payload && payload.length) {
    const total = (payload?.reduce((acc, entry) => {
      return acc + entry.value;
    }, 0))

    return (
      <div className={styles.tooltip}>
        {label ? <p>Date: {dateFormatter(label)}</p> : null}
        <p>Total: {total}</p>
        <hr/>
        {payload.filter((entry) => entry.value).map((entry) => {
          return (
            <p className={styles.article} key={entry.dataKey} style={{color: entry.fill}}>
              <span>{LABELS[entry.dataKey]}:{' '}</span>
              <span>{entry.value}</span>
            </p>
          )
        })}
      </div>
    );
  }

  return null;
};
