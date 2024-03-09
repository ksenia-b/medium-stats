import {useMonthlyStats} from "../../hooks/useMonthlyStatsForChart";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import styles from './incomeChart.module.css'
import mockedData from './mock.json';
import mockedPosts from './posts.json';

const postById = mockedPosts.reduce((acc, entry) => {
  acc[entry.id] = entry.title;
  return acc;
}, {});

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

const dateFormatter = date => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US').format(d);
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const totalIncome = (payload.reduce((acc, entry) => {
      return acc + entry.value;
    }, 0) / 100).toFixed(2)

    return (
      <div className={styles.tooltip}>
        <p>Date: {dateFormatter(label)}</p>
        <p>Total income: ${totalIncome}</p>
        <hr/>
        {payload.filter((entry) => entry.value).map((entry) => {
          return (
            <p className={styles.article} key={entry.dataKey} style={{color: entry.fill}}>
              <span>{`${postById[entry.dataKey].slice(0, 50)}... :`}</span>
              <span>{`$${(entry.value /100).toFixed(2)}`}</span>
            </p>
          )
        })}
        </div>
    );
  }

  return null;
};

export const IncomeChart = ({username}) => {

  const data = prepareData(mockedData);

  return (
    <div>
        <BarChart
          width={800}
          height={500}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="periodStartedAt" tickFormatter={dateFormatter}/>

          <YAxis />
          <Tooltip content={<CustomTooltip/>}/>
          {
            mockedData.map((entry) => {
              return <Bar dataKey={entry.postId} stackId="a" fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
            })
          }
        </BarChart>
    </div>
  )
}
