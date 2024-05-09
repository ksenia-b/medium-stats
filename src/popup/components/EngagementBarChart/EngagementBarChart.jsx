import {Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis} from "recharts";
import {dateFormatter} from "../../../utils/index.js";
import {EngagementTooltip} from "../EngagementTooltip";
import {useMemo} from "react";

export const EngagementBarChart = ({total, title}) => {
  const totalCounter = useMemo(() => {
    if (!total) {
      return null;
    }

    return total.reduce((acc, entry) => {
      return {
        member: acc.member + entry.member,
        nonMember: acc.nonMember + entry.nonMember,
      }
    }, {member: 0, nonMember: 0});
  }, [total]);

  return (
    <div>
      <h2>{title}: <span>(Last 28 days - {totalCounter.member}/{totalCounter.nonMember})</span></h2>
      <BarChart
        width={800}
        height={500}
        syncId="anyId"
        data={total}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" tickFormatter={dateFormatter}/>

        <YAxis />
        <Tooltip content={<EngagementTooltip />}/>
        <Bar dataKey='nonMember' stackId="a" fill="#B3B3B3" />
        <Bar dataKey='member' stackId="a" fill="#FFC017" />
      </BarChart>
    </div>
  )
}
