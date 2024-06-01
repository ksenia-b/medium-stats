import {Banner} from "./Banner.jsx";
import areaChart from '../../../assets/img/EngagementInvite/area-chart.png';
import barChart1 from '../../../assets/img/EngagementInvite/bar-chart-1.png';
import barChart2 from '../../../assets/img/EngagementInvite/bar-chart-2.png';

export const EngagementInvite = () => {
  return (
    <div>
      <h2>Members only Reads/Views <span>(Last 28 days - ?/?)</span></h2>
      <Banner bg={areaChart}/>
      <br/>
      <h2>Members / Non-member clappers <span>(Last 28 days - ?/?)</span></h2>
      <Banner bg={barChart1}/>
      <br/>
      <h2>Members / Non-member followers <span>(Last 28 days - ?/?)</span></h2>
      <Banner bg={barChart2}/>
      <br/>
      <h2>Members / Non-member highlighters <span>(Last 28 days - ?/?)</span></h2>
      <Banner bg={barChart1}/>
      <br/>
      <h2>Members / Non-member responders <span>(Last 28 days - ?/?)</span></h2>
      <Banner bg={barChart2}/>
    </div>
  )
}
