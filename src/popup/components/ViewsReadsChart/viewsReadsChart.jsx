import {useMonthlyStats} from "../../hooks/useMonthlyStatsForChart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dateFormatter = date => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US').format(d);
};

export const ViewsReadsChart = ({username}) => {
  const {loading, data} = useMonthlyStats({username});

  if (loading) {
    return (
      <p>Loading...</p>
    )
  }

  console.log('data data: ', data)

  const chartData = data?.user?.postsAggregateTimeseriesStats?.points?.map((item) => ({
    timestamp: item.timestamp,
    views: item.stats.total.viewers,
    reads: item.stats.total.readers
  }));

  console.log('chartData: ', chartData);

  return (
    <div>
      <AreaChart
        width={800}
        height={400}
        data={chartData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" hasTick
               scale="time"
               tickFormatter={dateFormatter}/>
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="views"
          stackId="1"
          stroke="#8884d8"
          fill="#8884d8"
        />
        <Area
          type="monotone"
          dataKey="reads"
          stackId="2"
          stroke="#82ca9d"
          fill="#82ca9d"
        />
      </AreaChart>
    </div>
  )
}
