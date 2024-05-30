import {useSubscriptionStats} from "../../hooks/useSubscriptions.js";
import styles from './user.module.css';
import { Counter, Avatar } from './components'
export const User = ({user}) => {
  const {loading, error, data} = useSubscriptionStats({username: user.username})

  if (loading) {
    return (
      <p className={styles.loading}>Loading...</p>
    )
  }
  const totals = data?.viewerEdge?.audienceStats?.totals || {};

  return (
    <>
      <div className={styles.container}>
        <div className={styles.counter_wrapper}>
          <Counter title={'Followers'} count={totals.followers} previousCount={totals.followersPreviousMonth}/>
          <Counter title={'Email Subscribers'} count={totals.subscribers} previousCount={totals.subscribersPreviousMonth}/>
        </div>
        <div>
          <Avatar name={user.name} imageId={user.imageId}/>
        </div>
      </div>
    </>
  )
}
