import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import {useState, useEffect, useMemo} from "react";
import { getToday, getTimeDaysAgo, dateFormatter } from "../../../utils";

import { CustomTooltip } from './Tooltip.jsx';

export const ViewsReadsChart = ({username, endTime, startTime, datesLabel}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const countViewReads = useMemo(() => {
    if (!data) {
      return null;
    }

    return data.reduce((acc, entry) => {
      return {
        views: acc.views + entry.views,
        reads: acc.reads + entry.reads,
      }
    }, {views: 0, reads: 0});
  }, [data]);

  useEffect( () => {
    async function fetchData() {
      return chrome.runtime.sendMessage({
        type: 'GET_MONTHLY_STATA_READS_VIEWS',
        username,
        endTime,
        startTime
      });
    }

    fetchData().then((data) => {
      setData(data);
      setLoading(false);
    });
  }, [username, endTime, startTime])

  if (loading) {
    return (
      <p>Loading...</p>
    )
  }

  return (
    <div>
      <h2>Reads/Views  <span>({datesLabel} - {countViewReads.reads}/{countViewReads.views})</span></h2>

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
