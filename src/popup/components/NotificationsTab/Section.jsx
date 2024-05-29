import styles from './styles.module.css';
import { NOTIFICATION_TYPES, OKSANA_USERNAME } from '../../../constants.js';
import {AiOutlineCopy} from "react-icons/ai";
import React, { useRef} from "react";

function getUniqueUsers(users) {
  const addedUsers = {};
  return users.filter((user) => {
    if (addedUsers[user?.username]) {
      return false;
    } else {
      addedUsers[user?.username] = true;
      return true;
    }
  });
}

const getTire = (membership) => {
  if (!membership) {
    return 'FREE';
  }
  if (membership?.tier === 'MEMBER') {
    return 'MEMBER';
  }
  if (membership?.tier === "FRIEND") {
    return 'FRIEND';
  }

  return 'UNKNOWN'
}

export const Section = ({title, notifications, username}) => {
  const refs = useRef([]);
  const users = notifications?.map((notification) => {
    return notification?.rollupItems?.length ? notification?.rollupItems?.map((item) => item.actor) : notification.actor
  }).flat();

  const uniqueUsers = getUniqueUsers(users);

  const usersByTier = uniqueUsers.reduce((acc, user) => {
    const tier = getTire(user?.membership);
    acc[tier] ? acc[tier].push(user) : acc[tier] = [user];
    return acc;
  }, {})

  const addToRefs = (el) => {
    if (el && !refs.current.includes(el)) {
      refs.current.push(el);
    }
  };

  const handleCopyClick = (index) => {
    refs.current[index].select();
    navigator.clipboard.writeText(refs.current[index].value);
  };

  return (
    <div>
      <h2>{NOTIFICATION_TYPES[title] || title}</h2>
      {Object.keys(usersByTier).map((tier, index) => {
        return (
          <div key={tier}>
            <p className={styles.tier}>{tier}</p>
            <div className={styles.wrapper}>
              <textarea ref={addToRefs} className={styles.textarea} value={usersByTier[tier].map((user) => username === OKSANA_USERNAME ? `@${user?.username}` : user?.name)?.join(', ')} readOnly={true}></textarea>
              <button onClick={() => handleCopyClick(index)}>
                <AiOutlineCopy size={'30px'}/>
              </button>
            </div>
          </div>
        )
      })
      }
       </div>
  )
}
