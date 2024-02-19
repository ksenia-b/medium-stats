import styles from './avatar.module.css';

export const Avatar = ({name, imageId}) => {
  return (
    <div className={styles.wrapper}>
      <p>{name}</p>
      <img className={styles.avatar} src={`https://miro.medium.com/v2/resize:fill:32:32/${imageId}`} alt={name} />
    </div>
  )
}
