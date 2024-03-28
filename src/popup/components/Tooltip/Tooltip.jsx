import {Tooltip as ReactTooltip} from 'react-tooltip';

// <a data-tooltip-id="my-tooltip">◕‿‿◕</a>
export const Tooltip = ({children, id}) => (
  <ReactTooltip id={id}>
    {children}
  </ReactTooltip>)
