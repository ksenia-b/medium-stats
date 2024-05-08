import {useState, useEffect} from "react";
import { getTimeDaysAgo } from "../../../utils";
import {getEngagementMetric, getMembersViewsReadsChartData} from './utils.js';
import { MembersReadsViewsChart} from "../MembersReadsViewsChart";
import {EngagementBarChart} from "../EngagementBarChart/EngagementBarChart.jsx";

const startTime = getTimeDaysAgo(28);
const endTime = new Date();

export const DailyBundleSection = ({posts}) => {
  // Date range for the chart is hardcoded for now

  const [loading, setLoading] = useState(true);
  const [memberViewsReadsData, setMemberViewsReadsData] = useState(null);
  const [totalClappers, setTotalClappers] = useState(null)
  const [totalFollowers, setTotalFollowers] = useState(null)
  const [totalHighlighters, setTotalHighlighters] = useState(null)
  const [totalResponders, setTotalResponders] = useState(null)

  useEffect( () => {
    async function fetchData() {
      return chrome.runtime.sendMessage({
        type: 'GET_POST_STATS_DAILY_BUNDLE',
        postsIds: posts.map(post => post.id),
        endTime,
        startTime
      });
    }

    fetchData().then((data) => {
      console.log('data 0 GET_POST_STATS_DAILY_BUNDLE', data)
      setMemberViewsReadsData(getMembersViewsReadsChartData(data));
      setTotalClappers(getEngagementMetric(data, 'readersThatClappedCount'));
      setTotalFollowers(getEngagementMetric(data, 'readersThatInitiallyFollowedAuthorFromThisPostCount'));
      setTotalHighlighters(getEngagementMetric(data, 'readersThatHighlightedCount'));
      setTotalResponders(getEngagementMetric(data, 'readersThatRepliedCount'));
      setLoading(false);
    });
  }, [posts, endTime, startTime])

  if (loading) {
    return (
      <p>Loading...</p>
    )
  }

  return (
    <div>
      <MembersReadsViewsChart memberViewsReadsData={memberViewsReadsData}/>
      <br/>
      <EngagementBarChart total={totalClappers} title={'Members / Non-member clappers'} />
      <br/>
      <EngagementBarChart total={totalFollowers} title={'Members / Non-member followers'} />
      <br/>
      <EngagementBarChart total={totalHighlighters} title={'Members / Non-member highlighters'} />
      <br/>
      <EngagementBarChart total={totalResponders} title={'Members / Non-member responders'} />
    </div>
  )
}
