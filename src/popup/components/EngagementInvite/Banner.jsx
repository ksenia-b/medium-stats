import styles from './styles.module.css';

export const Banner = ({bg}) => {
  console.log('sdf', bg)
  return (
    <div className={styles.banner} style={{backgroundImage: `url(${bg})`}}>
      <div>
        <p className={styles.p}>This chart is exclusively available for followers of <a href="https://medium.com/m-stats" target={"_blank"}>M. Stats💚—Earn More Together.</a> publication on Medium.</p>
        <br/>
        <br/>
        <p className={styles.p}><strong><a href={"https://medium.com/m-stats/how-to-unlock-access-to-engagement-charts-in-m-stats-chrome-extension-2b6311fe003e"} target={"_blank"}>How to Unlock Access to Engagement Charts in M.Stats Chrome Extension.</a></strong></p>
        <br/>
        <br/>
        <p className={styles.p}>Please note, it may take a short while for Medium to update publication information.</p>
      </div>
    </div>
  )
}
