import { useEffect, useState} from "react";
import {IncomeChart} from "../IncomeChart/IncomeChart.jsx";
import { Totals } from '../Totals/Totals';
import {ViewsReadsChart} from "../ViewsReadsChart";
import {DailyBundleSection} from "../DailyBundleSection";
import {DatesConfig} from "../DatesConfig";
import { M_STATS_PUBLICATION_ID} from '../../../constants.js'
import { EngagementInvite } from "../EngagementInvite";

export const Stats = ({username}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [isUserInMStatsPublication, setIsUserInMStatsPublication] = useState(false);

  useEffect( () => {
    async function fetchData() {
      return chrome.runtime.sendMessage({ type: 'GET_STATS', username });
    }

    fetchData().then((data) => {
      setData(data);
      setLoading(false);
    });
  }, [])

  useEffect( () => {
    async function fetchData() {
      return chrome.runtime.sendMessage({ type: 'IS_OUR_PUBLICATION_FOLLOWER' });
    }

    fetchData().then((data) => {
      const isFollowing = data?.collection?.viewerEdge?.isFollowing;
      setIsUserInMStatsPublication(isFollowing);
    });
  }, [])

  if (loading) {
    return (
      <p>Loading...</p>
    )
  }

  return (
    <div>
      {data ? (
        <>
          <h2>Lifetime</h2>
          <Totals data={data.totals} details={data?.totalsDetails}/>
        </>
      ) : null}

      <DatesConfig>
        {({startTime, endTime}, datesLabel) => {
          return (
            <>
              {
                data.totals.income > 0 ? (
                  <IncomeChart username={username} posts={data.list} startTime={startTime} endTime={endTime} datesLabel={datesLabel}/>
                ) : null
              }

              <ViewsReadsChart username={username} startTime={startTime} endTime={endTime} datesLabel={datesLabel}/>
              <br/>
              {isUserInMStatsPublication ? (
                <DailyBundleSection posts={data.list}/>
              ) : (
                <EngagementInvite/>
              )}

            </>

          )
        }}
      </DatesConfig>
    </div>
  )
}
