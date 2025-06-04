import React, { useState } from 'react';
import PropTypes from 'prop-types';
import s from './Tooltip.module.scss'; 
import { ReactSVG } from 'react-svg';
import toolTipIcon from "../../../assets/svg/toolTip.svg";

const Tooltip = ({ text, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className={s.tooltipContainer} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <ReactSVG src={toolTipIcon}/>
      {showTooltip && <div className={s.tooltip}>{text}</div>}
    </div>
  );
};

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Tooltip;
