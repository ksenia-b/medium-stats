import styles from './styles.module.css';
import {AiOutlineInfoCircle} from "react-icons/ai";
import {Tooltip} from '../Tooltip/Tooltip';
import { Stories } from './TooltipContents/Stories'

export const Item = ({value, label, diff, details}) => {

  return (
    <>
      <div>
        <p className={styles.itemLabel}>
          {label}
          {details ? <AiOutlineInfoCircle data-tooltip-id="details" className={styles.infoIcon}/> : null}
        </p>
        <p className={styles.itemValue}>{value}</p>
        {diff ? <p>Diff: {diff}</p> : null}
      </div>
      {details ? (
        <Tooltip id={'details'}>
          <Stories data={details}/>
        </Tooltip>
      ) : null}

    </>
  )
};
