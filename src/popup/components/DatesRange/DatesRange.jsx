import styles from './styles.module.css';
import { useState, useEffect, useRef } from 'react';
import { getTimeDaysAgo, dateFormatter } from '../../../utils'
import { AiFillCaretDown } from "react-icons/ai";

export const DatesRange = ({onChange}) => {
  const [open, setOpen] = useState(false);
  const [ startTime, setStartTime ] = useState(null);
  const [endTime, setEndTime ] = useState(null);
  const [label, setLabel] = useState('Date range');
  const listRef = useRef(null);

  useEffect(function setInitialDateRange() {
    handleDaysAgo(7)
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (listRef.current && !listRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (startTime && endTime) {
      console.log('startTime', startTime, new Date(startTime));
      console.log('endTime', endTime, new Date(endTime));
      onChange({startTime, endTime});
    }
  }, [startTime, endTime])

  const handleYearMonthClick = (event) => {
    const year = event.target.getAttribute('data-year');
    const month = event.target.getAttribute('data-month');

    let startTime;
    let end;

    if (month) {
      startTime = new Date(year, month, 1); // First day of the selected month
      end = new Date(year, Number(month) + 1, 0);
      setLabel(`${months[month]} ${year}`);
    } else {
      startTime = new Date(year, 0, 1); // January 1 of the selected year
      end = new Date(year, 11, 31); // December 31 of the selected year
      setLabel(year);
    }

    const endTime = end > new Date() ? new Date() : end;

    setStartTime(startTime.getTime());
    setEndTime(endTime.getTime());
    setOpen(false);
  }

  const handleDaysAgo = (days) => {
    const endTime = new Date();
    const startTime = getTimeDaysAgo(days);
    setStartTime(startTime);
    setEndTime(endTime);
    setLabel('Last ' + days + ' days');
    setOpen(false);
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 2}, (_, i) => currentYear - i);

  const currentMonthIndex = new Date().getMonth();

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let lastThreeMonths = [];

  for (let i = 0; i < 3; i++) {
    let date = new Date();
    date.setMonth(currentMonthIndex - i);
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    lastThreeMonths.push({ monthIndex, year});
  }

  return (
    <div className={styles.datesrange}>
      <div onClick={() => setOpen(true)} className={styles.label}>
        <p>{startTime && endTime ? (`${dateFormatter(startTime)} - ${dateFormatter(endTime)}`) : null}</p>
        <p>{label}</p>
        <AiFillCaretDown className={styles.arrow}/>
      </div>
      {open && (
        <div className={styles.list} ref={listRef}>
          <div onClick={()=> handleDaysAgo(7)} className={styles.item}>Last 7 days</div>
          <div onClick={()=> handleDaysAgo(28)} className={styles.item}>Last 28 days</div>
          <div onClick={()=> handleDaysAgo(90)} className={styles.item}>Last 90 days</div>
          <div onClick={()=> handleDaysAgo(180)} className={styles.item}>Last 180 days</div>
          <div onClick={()=> handleDaysAgo(365)} className={styles.item}>Last 365 days</div>

          <div className={styles.separator}></div>

          {years.map(year => (
            <div key={year} className={styles.item} data-year={year} onClick={handleYearMonthClick}>{year}</div>
          ))}

          <div className={styles.separator}></div>

          {lastThreeMonths.map(({year, monthIndex}) => (
            <div key={`${monthIndex}-${year}`} className={styles.item} data-year={year} data-month={monthIndex} onClick={handleYearMonthClick}>{months[monthIndex]} {year}</div>
          ))}
        </div>
      )}

    </div>
  )
}
