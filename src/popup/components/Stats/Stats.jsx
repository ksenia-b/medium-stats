import { useEffect, useState} from "react";
import {IncomeChart} from "../IncomeChart/IncomeChart.jsx";
import { Totals } from '../Totals/Totals.jsx';

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
      <h2>Lifetime</h2>
      <Totals data={data.totals}/>
      {
        data.totals.income > 0 ? (
          <IncomeChart posts={data.list}/>
        ) : null
      }

    </div>
  )
}
