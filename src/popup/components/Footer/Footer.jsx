import styles from "./styles.module.css";
import packageJson from "../../../../package.json";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        Want to support?{" "}
        <a
          href="https://www.buymeacoffee.com/programmergirl"
          target="_blank"
          rel="noreferrer"
        >
          DONATE
        </a>
      </div>
      <div>
        <a href="https://medium.com/m-stats" target="_blank" rel="noreferrer">
          Join our publication!
        </a>
      </div>
      <div>
        <a
          href="https://forms.gle/vcfRrg7QQBLPv6oL9"
          target="_blank"
          rel="noreferrer"
        >
          Report a bug
        </a>
      </div>
      <div>&copy; {new Date().getFullYear()}</div>
      <div className={styles.version}>v{packageJson.version}</div>
    </footer>
  );
}
