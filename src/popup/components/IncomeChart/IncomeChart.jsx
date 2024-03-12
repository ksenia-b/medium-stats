import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

import { useEffect, useState, useMemo} from "react";
import { CustomTooltip } from './Tooltip.jsx';
import { dateFormatter } from '../../../utils'

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

  const sorted =  finalData.sort((a, b) => {
    return new Date(a.periodStartedAt) - new Date(b.periodStartedAt);
  });

  const finalDataWithFilledEmptyDays = fillArrayWithEmptyDays(sorted);

  console.log('final data: ', sorted, finalDataWithFilledEmptyDays)

  return finalDataWithFilledEmptyDays;
}

function fillArrayWithEmptyDays(data) {
  const DAYS = 90;
  const daysToFill = DAYS - data.length;
  const arr = [];

  for(let i = DAYS; i > data.length; i--) {
    arr.push({
      periodStartedAt: new Date().getTime() - (i * 86400000),
    })
  }

  console.log('arr', arr);

  return [...arr, ...data]
}

export const IncomeChart = ({posts}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const postsWithIncome = useMemo(() => {
    return posts.filter((entry) => entry.income);
  }, [posts]);

  useEffect( () => {
    if (!postsWithIncome.length) {
      return;
    }

    async function fetchData() {
      return chrome.runtime.sendMessage({ type: 'GET_DAILY_INCOME', posts: postsWithIncome });
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
      <h2>Earnings by days</h2>

        <BarChart
          width={800}
          height={500}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="periodStartedAt" tickFormatter={dateFormatter}/>

          <YAxis />
          <Tooltip content={<CustomTooltip postById={postById}/>}/>
          {
            postsWithIncome.map((entry) => {
              return <Bar dataKey={entry.id} stackId="a" fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
            })
          }
        </BarChart>
    </div>
  )
}
