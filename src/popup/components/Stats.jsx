import {useStats} from "../hooks/useStats";

export const Stats = ({username}) => {
  const {loading, data} = useStats({username});

  if (loading) {
    return (
      <p>Loading...</p>
    )
  }

  return (
    <div>
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
