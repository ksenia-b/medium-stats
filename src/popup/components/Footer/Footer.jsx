import styles from './styles.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div>
        Want to support? <a href={'https://www.buymeacoffee.com/programmergirl'} target="_blank">DONATE</a>
      </div>
      <div>
        <a href={'https://forms.gle/vcfRrg7QQBLPv6oL9'} target='_blank'>Report a bug</a>
      </div>
      <div>
        &copy; {new Date().getFullYear()}
      </div>
      <div className={styles.version}>
        v0.1.1
      </div>
    </footer>
  )
}
