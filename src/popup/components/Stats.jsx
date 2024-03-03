import {useStats} from "../hooks/useStats";

export const Stats = ({username}) => {
  const {loading, data, totals} = useStats({username});

  if (loading) {
    return (
      <p>Loading...</p>
    )
  }

  console.log('totals', totals);

  return (
    <div>
      <h2>Totals</h2>
      <pre>
        {JSON.stringify(totals, null, 2)}
      </pre>
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
