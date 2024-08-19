import { Tooltip as ReactTooltip } from 'react-tooltip';

// <a data-tooltip-id="my-tooltip">◕‿‿◕</a>
export function Tooltip({ children, id }) {
  return (
    <ReactTooltip id={id}>
      {children}
    </ReactTooltip>
  );
}
