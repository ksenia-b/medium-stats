import styles from './styles.module.css';
import { DatesRange} from "../DatesRange/DatesRange";
import { useState, useCallback} from "react";

export const DatesConfig = ({ children}) => {
  const [dates, setDates] = useState({startTime: null, endTime: null});
  const [datesLabel, setDatesLabel] = useState('--');
  const onChange = useCallback((dates) => {
    setDates({
      startTime: dates.startTime,
      endTime: dates.endTime
    });

    setDatesLabel(dates.label)
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.date}>
        <DatesRange onChange={onChange}/>
      </div>
      {children(dates, datesLabel)}
    </div>
  )
}
