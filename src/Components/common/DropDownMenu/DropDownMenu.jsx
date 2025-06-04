import { Dropdown } from 'react-bootstrap';
import s from './DropDownMenu.module.scss';
import { ReactSVG } from 'react-svg';
import cx from "classnames";

import dotMenuIcon from "../../../assets/svg/dotsMenu.svg";
import pencilIcon from "../../../assets/svg/pencil.svg";
import binIcon from "../../../assets/svg/bin.svg";

export default function DropDownMenu(props) {
    const { editHandle, deleteHandle, className } = props;
    return (
        <Dropdown className={cx(className, s.dropdown)}>
            {/* <Dropdown.Toggle variant="" > */}
                <ReactSVG role="button" src={dotMenuIcon} />
            {/* </Dropdown.Toggle> */}
            <Dropdown.Menu>
                <Dropdown.Item onClick={editHandle} className={"d-flex gap-2 align-items-center"}>
                    <ReactSVG src={pencilIcon} />
                    Edit
                </Dropdown.Item>
                <Dropdown.Item onClick={deleteHandle} className={"d-flex gap-2 align-items-center"}>
                    <ReactSVG src={binIcon} />
                    Delete
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}
