import './reset.css'
import './Popup.css'
import { useUser } from './hooks/useUser'
import {Stats} from "./components/Stats";
import {User} from "./components/User";
import {ViewsReadsChart} from "./components/ViewsReadsChart/";


export const Popup = () => {
  const { loading, user} = useUser();

  return (
    <main>
      {loading ? <p>Loading...</p> : null}
      {user ? (
        <>
          <User user={user}/>
          {/*<ViewsReadsChart username={user.username}/>*/}
          <Stats username={user.username}/>
        </>
      ) : null}
    </main>
  )
}

export default Popup
