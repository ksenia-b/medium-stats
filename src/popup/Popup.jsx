import './reset.css'
import './Popup.css'
import {Stats} from "./components/Stats/Stats";
import { Tools } from './components/Tools/Tools'
import {User} from "./components/User";
import React, { useEffect, useState}  from "react";
import { Footer } from './components/Footer/Footer'
import { SignInInvite} from './components/SignInInvite/SignInInvite'
import {Tab, TabList, TabPanel, Tabs} from "./components/Tabs/Tabs.jsx";
import { NotificationsTab } from './components/NotificationsTab/NotificationsTab';

export const Popup = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect( () => {
    async function fetchData() {
      return chrome.runtime.sendMessage({ type: 'GET_USER' });
    }

    fetchData().then((user) => {
      setUser(user);
      setLoading(false);
    });

  }, []);

  return (
    <main>
      {loading ? <p>Loading...</p> : null}
      {user?.username ? (
        <>
          <User user={user}/>

          <Tabs>
            <TabList>
              <Tab index={0}>Statistics</Tab>
              <Tab index={1}>Tools</Tab>
              <Tab index={2}>Notifications</Tab>
            </TabList>
            <TabPanel index={0}>
              <Stats username={user.username} />
            </TabPanel>
            <TabPanel index={1}>
              <Tools/>
            </TabPanel>
            <TabPanel index={2}>
              <NotificationsTab username={user.username}/>
            </TabPanel>
          </Tabs>

        </>
      ) : <SignInInvite/>}

      <Footer />
    </main>
  )
}

export default Popup
