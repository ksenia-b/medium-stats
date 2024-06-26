import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

import { useEffect, useState, useMemo} from "react";
import { CustomTooltip } from './Tooltip';
import {currencyFormatter, dateFormatter, getColorByIndex} from '../../../utils'

function prepareData(data) {
  const groupedByDate = data.reduce((acc, entry) => {
    const post = entry.data;
    const postId = entry.postId;

    post.forEach((item) => {
      const time = item.periodStartedAt;
      const amount = item.amount;
      acc[time] = {
        ...acc[time],
        [postId]: amount,
      }
    });

    return acc;
  }, {});

  const finalData = Object.keys(groupedByDate).map((date) => {
    return {
      periodStartedAt: Number(date),
      ...groupedByDate[date],
    }
  })

  return finalData.sort((a, b) => {
    return new Date(a.periodStartedAt) - new Date(b.periodStartedAt);
  })
}

function fillArrayWithEmptyDays(data, startTime, endTime) {
  const arr = [];

  for(let i = startTime; i <= endTime; i += 86400000) {
    const found = data.find((entry) => {
      const entryDate = new Date(entry.periodStartedAt);
      entryDate.setHours(0, 0, 0, 0);

      const currentDate = new Date(i);
      currentDate.setHours(0, 0, 0, 0);

      return entryDate.getTime() === currentDate.getTime();
    });

    if (found) {
      arr.push(found);
    } else {
      arr.push({
        periodStartedAt: i,
      })
    }
  }

  return arr;
}

export const IncomeChart = ({username, posts, endTime, startTime, datesLabel}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const datesRangedData = useMemo(() => {
    if (!data) {
      return null;
    }

    const filtered =  data.filter((entry) => {
      return entry.periodStartedAt >= startTime && entry.periodStartedAt <= endTime;
    });

    const filled = fillArrayWithEmptyDays(filtered, startTime, endTime);

    return filled;
  }, [data, startTime, endTime]);

  const earningsByPeriod = useMemo(() => {
    if (!datesRangedData) {
      return null;
    }

    return datesRangedData.map((entry) => {
      return Object.keys(entry).reduce((acc, key) => {
        if (key === 'periodStartedAt') {
          return acc;
        }

        return acc + entry[key];
      }, 0);
    }).reduce((acc, entry) => {
      return acc + entry;
    }, 0);
  }, [datesRangedData]);

  const postsWithIncome = useMemo(() => {
    return posts.filter((entry) => entry.income);
  }, [posts]);

  useEffect( () => {
    if (!postsWithIncome.length) {
      return;
    }

    async function fetchData() {
      return chrome.runtime.sendMessage({ type: 'GET_DAILY_INCOME', posts: postsWithIncome, username });
    }

    fetchData().then((data) => {
      setData(prepareData(data));
      setLoading(false);
    });
  }, [postsWithIncome]);

  const postById = useMemo(() => postsWithIncome.reduce((acc, entry) => {
    acc[entry.id] = entry.title;
    return acc;
  }, {}), [postsWithIncome]);

  if (!data || loading || !postsWithIncome.length) {
    return (
      <p>Loading...</p>
    )
  }

  return (
    <div>
      <h2>Earnings by days <span>({datesLabel} - {currencyFormatter(earningsByPeriod / 100)})</span></h2>

        <BarChart
          width={800}
          height={500}
          data={datesRangedData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="periodStartedAt" tickFormatter={dateFormatter}/>

          <YAxis tickFormatter={(value) => Number((value / 100)?.toFixed(0))}/>
          <Tooltip content={<CustomTooltip postById={postById}/>}/>
          {
            postsWithIncome.map((entry, index) => {
              return <Bar key={entry.id} dataKey={entry.id} stackId="a" fill={getColorByIndex(index)} />
            })
          }
        </BarChart>
    </div>
  )
}
