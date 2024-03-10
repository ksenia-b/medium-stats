import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { useState, useEffect} from "react";
import { getToday, getTimeDaysAgo, dateFormatter } from "../../../utils";

import { CustomTooltip } from './Tooltip.jsx';

export const ViewsReadsChart = ({username}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect( () => {
    async function fetchData() {
      return chrome.runtime.sendMessage({
        type: 'GET_MONTHLY_STATA_READS_VIEWS',
        username,
        endTime: getToday(),
        startTime: getTimeDaysAgo(90)
      });
    }

    fetchData().then((data) => {
      setData(data);
      setLoading(false);
    });
  }, [username])

  if (loading) {
    return (
      <p>Loading...</p>
    )
  }

  return (
    <div>
      <AreaChart
        width={800}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" hasTick
               tickFormatter={dateFormatter}/>
        <YAxis />
        <Tooltip content={<CustomTooltip />}/>
        <Area
          type="monotone"
          dataKey="views"
          stackId="1"
          stroke="#457bff"
          fill="#c5e2ff"
        />
        <Area
          type="monotone"
          dataKey="reads"
          stackId="2"
          stroke="#3aaf51"
          fill="#b5e5a4"
        />
      </AreaChart>
    </div>
  )
}
