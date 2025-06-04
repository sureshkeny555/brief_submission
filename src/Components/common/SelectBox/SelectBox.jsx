import { useEffect, useRef, useState } from "react";
import { ReactSVG } from 'react-svg';
import cx from "classnames";
import s from "./SelectBox.module.scss";
import downArrow from "../../assets/svg/downArrow.svg";
import searchIcon from "../../assets/svg/search.svg";
import useDebounce from "../../../hooks/useDebounce";

export default function SelectBox(props) {
    const { options = [], placeholder, className, value: selectedList = [], onOpen = () => { }, onChange = () => { }, name, isMultiSelect = false, onClose = () => { }, zIndex = "10001", style } = props;
    const popupRef = useRef();
    const selectRef = useRef();
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [isOpen, setIsOpen] = useState(false);
    const [filterValue, setFilterValue] = useDebounce(null, 300);

    function handleSelectBoxClick(e) {
        if (popupRef.current && popupRef.current.contains(e.target)) {
            return;
        } else {
            setIsOpen(v => {
                if (v) {
                    onClose();
                    setFilterValue(null);
                } else {
                    setTimeout(() => {
                        onOpen();
                    }, 100);
                }
                return !v;
            });
        }
    }

    useEffect(() => {
        if (filterValue && String(filterValue).trim()) {
            setFilteredOptions(options.filter(item => String(item.label)?.toLowerCase()?.includes(String(filterValue)?.toLowerCase())));
        } else {
            setFilteredOptions(options);
        }
    }, [filterValue, options]);

    function handleInputChange(e) {
        setFilterValue(e.target.value);
    }

    const handleCheckboxChange = (item) => {
        let newValue = selectedList ? [...selectedList] : [];

        if (!isMultiSelect) {
            newValue = [item]; 
        } else if (!selectedList.some(selectedItem => selectedItem.value === item.value)) {
            newValue.push(item);
        } else {
            newValue = newValue.filter(data => data.value !== item.value);
        }

        if (typeof onChange === "function") {
            onChange(newValue); 
        }

        if (!isMultiSelect) {
            setIsOpen(false);
            setFilteredOptions(options);
        }
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target) &&
                (!selectRef.current || !selectRef.current.contains(event.target))
            ) {
                setIsOpen(false);
                if (typeof onClose === "function") {
                    onClose();
                    setFilterValue(null);
                }
            }
        };
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <div
            className={cx(s.selectBox, { [s.isOpen]: isOpen }, className)}
            tabIndex="0"
            ref={selectRef}
            onClick={handleSelectBoxClick}
        >
            {!selectedList.length ? (
                <div className={s.placeholder}>{placeholder || "Please Select..."}</div>
            ) : (
                <div className="text-truncate">
                    {isMultiSelect ? (
                        selectedList.map((item, i) => (
                            <span key={i} className={s.selectedLabel}>
                                {item.label}
                                <span className={s.removeIcon} onClick={() => handleCheckboxChange(item)}>×</span>
                            </span>
                        ))
                    ) : (
                        selectedList[0]?.label
                    )}
                </div>
            )}

            <ReactSVG className={s.dropdownArrow} src={downArrow} />
            {isOpen && (
                <div className={s.popup} style={{ zIndex }} ref={popupRef}>
                    <div className={s.searchInputContainer}>
                        <ReactSVG src={searchIcon} />
                        <input placeholder="Search" onChange={handleInputChange} style={style} />
                    </div>

                    {filteredOptions.length ? (
                        filteredOptions.map((item, i) => {
                            const isActive = selectedList.some((selectedItem) => selectedItem?.value === item?.value);
                            return (
                                <div
                                    key={`FILTERED_OPTION_ITEM_${i}`}
                                    className={cx(s.multiSelectField, "my-1", { [s.active]: isActive })}
                                    onClick={() => handleCheckboxChange(item)}
                                >
                                    <input
                                        type="checkbox"
                                        onChange={() => handleCheckboxChange(item)}
                                        checked={isActive}
                                        className={s.checkbox}
                                        style={style}
                                    />
                                    <div>{item.label}</div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-2">No match</div>
                    )}
                </div>
            )}
        </div>
    );
}
