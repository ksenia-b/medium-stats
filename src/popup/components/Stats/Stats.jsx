import { useEffect, useState} from "react";
import {IncomeChart} from "../IncomeChart/IncomeChart.jsx";
import { Totals } from '../Totals/Totals';
import {ViewsReadsChart} from "../ViewsReadsChart";
import {DatesConfig} from "../DatesConfig";

export const Stats = ({username}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect( () => {
    async function fetchData() {
      return chrome.runtime.sendMessage({ type: 'GET_STATS', username });
    }

    fetchData().then((data) => {
      setData(data);
      setLoading(false);
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
          <Totals data={data.totals}/>
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
            </>

          )
        }}
      </DatesConfig>
    </div>
  )
}
