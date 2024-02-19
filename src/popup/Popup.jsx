import './Popup.css'
import { useUser } from './hooks/useUser'
import {Stats} from "./components/Stats";

export const Popup = () => {
  const { loading, user} = useUser();

  return (
    <main>
      {loading ? <p>Loading...</p> : null}
      {user ? (
        <Stats username={user.username}/>
      ) : null}
    </main>
  )
}

export default Popup
