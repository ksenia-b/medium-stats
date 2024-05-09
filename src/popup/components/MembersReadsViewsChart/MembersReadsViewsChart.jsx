import {useMemo} from "react";
import {  dateFormatter } from "../../../utils";
import {Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis} from "recharts";
import { CustomTooltip } from './Tooltip.jsx';

export const MembersReadsViewsChart = ({memberViewsReadsData}) => {
  const countViewReads = useMemo(() => {
    if (!memberViewsReadsData) {
      return null;
    }

    return memberViewsReadsData.reduce((acc, entry) => {
      return {
        views: acc.views + entry.views,
        reads: acc.reads + entry.reads,
      }
    }, {views: 0, reads: 0});
  }, [memberViewsReadsData]);

  if (!memberViewsReadsData) {
    return null;
  }

  return (
    <>
      <h2>Members only Reads/Views <span>(Last 28 days - {countViewReads.reads}/{countViewReads.views})</span></h2>

      <AreaChart
        width={800}
        height={400}
        syncId="anyId"
        data={memberViewsReadsData}
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
          stroke="#FEA010"
          fill="#FAEDAF"
        />
      </AreaChart>
    </>
  )
}
