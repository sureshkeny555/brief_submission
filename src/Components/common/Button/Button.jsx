import React from 'react';
import s from './Button.module.scss';
import { ReactSVG } from 'react-svg';
import personIcon from "../../assets/svg/personIcon.svg";

const Button = (props) => {
    const {label, style, icon = false, handleClick } = props
  return (
      <div className={s.inputContainer}>
            {icon == true && <ReactSVG src={personIcon} className={s.icon} />}
            <button className={s.btn} style={style} type="submit" onClick={handleClick}>{label}</button>
        </div>
  )
}

export default Button
