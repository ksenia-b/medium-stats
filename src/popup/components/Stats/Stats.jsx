import { useEffect, useState} from "react";
import {IncomeChart} from "../IncomeChart/IncomeChart.jsx";

export const Stats = ({username}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);


  useEffect( () => {
    async function fetchData() {
      return chrome.runtime.sendMessage({ type: 'GET_STATS', username });
    }

    fetchData().then((data) => {
      console.log('got stats', data);
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
      <h2>Totals</h2>
      <pre>
        {JSON.stringify(data.totals, null, 2)}
      </pre>
      <IncomeChart posts={data.list}/>
    </div>
  )
}
