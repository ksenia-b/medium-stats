import styles from "./styles.module.css";

export function Stories({ data }) {
  return (
    <div>
      <ul className={styles.list}>
        <li>
          Public:
          {data.public}
        </li>
        <li>
          Member-only:
          {data.locked}
        </li>
        <li>
          Unlisted:
          {data.unlisted}
        </li>
        <li>
          With earnings:
          {data.withEarnings}
        </li>
      </ul>
    </div>
  );
}
