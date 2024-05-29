import {Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis} from "recharts";
import {useMemo} from "react";

export const TopPerformersBarChart = ({data}) => {
  const totalCounter = useMemo(() => {
    if (!data) {
      return null;
    }

    return data.map((item) => {
      return {
        user: item.user?.name,
        count: item.count,
      }
    });
  }, [data]);

  return (
    <div>
      <h2>Top performers: <span>(Last 7 days)</span></h2>
      <BarChart
        width={760}
        height={200}
        data={totalCounter}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="user"/>
        <Tooltip />
        <YAxis />
        <Bar dataKey='count' stackId="a" fill="#B3B3B3" />
      </BarChart>
    </div>
  )
}
