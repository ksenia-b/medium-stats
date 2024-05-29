import { useEffect, useState, useMemo} from "react";
import { Section} from './Section.jsx'
import {TopPerformersBarChart} from "./TopPerformersBarChart.jsx";

export const NotificationsTab = ({username}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect( () => {
    async function fetchData() {
      return chrome.runtime.sendMessage({ type: 'GET_NOTIFICATIONS', username });
    }

    fetchData().then((data) => {
      setData(data);
      setLoading(false);
    });
  }, [])

  const notifications = useMemo(() => {
    return data?.reduce((acc, notification) => {
      const { notificationType } = notification;
      acc[notificationType] ? acc[notificationType].push(notification) : acc[notificationType] = [notification]
      return acc;
    }, {})
  }, [data])

  const top5Users = useMemo(() => {
    const users = data?.reduce((acc, notification) => {
      const users = notification?.rollupItems?.map((item) => item.actor) || [notification.actor];
      users.forEach((user) => {
        const key = `${user?.username}-${user?.membership?.tier}`;
        acc[key] ? acc[key].count++ : acc[key] = {user, count: 1};
      })
      return acc;
    }, {})

    if (!users) {
      return []
    }

    const sortedUsers = Object.values(users).sort((a, b) => b.count - a.count);

    return sortedUsers.slice(0, 5)
  }, [data])

  console.log('top5Users: ', top5Users)
  console.log('notifications', notifications)

  if (loading) {
    return (
      <p>Loading...</p>
    )
  }

  return (
    <div>
      <h1>All notifications: <span>(Last 7 days)</span></h1>
      <TopPerformersBarChart data={top5Users}/>
      {Object.keys(notifications).map((notificationType) => {
        return (
          <div key={notificationType}>
            <Section username={username} title={notificationType} notifications={notifications[notificationType]}/>
          </div>
        )
      })}
    </div>
  )
}
