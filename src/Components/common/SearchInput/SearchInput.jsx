import { ReactSVG } from 'react-svg';
import s from './SearchInput.module.scss';

import searchIcon from "../../../assets/svg/search.svg"

export default function SearchInput(props) {
    const { placeholder, value, onChange } = props;
    return (
        <div className={s.inputContainer}>
            <ReactSVG src={searchIcon} className={s.icon} />
            <input className={s.input} placeholder={placeholder} value={value} onChange={onChange} />
        </div>
    )
}
