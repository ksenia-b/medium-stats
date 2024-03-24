import './reset.css'
import './Popup.css'
import {Stats} from "./components/Stats/Stats";
import {User} from "./components/User";
import { useEffect, useState}  from "react";
import { Footer } from './components/Footer/Footer'
import { SignInInvite} from './components/SignInInvite/SignInInvite'

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

  console.log('user: ', user)

  return (
    <main>
      {loading ? <p>Loading...</p> : null}
      {user?.username ? (
        <>
          <User user={user}/>
          <Stats username={user.username} />
        </>
      ) : <SignInInvite/>}

      <Footer />
    </main>
  )
}

export default Popup
