import { useRef, useState } from "react";

const useDebounce = (initialValue, delay = 500) => {
    const [value, setValue] = useState(initialValue);
    const timeoutRef = useRef(null);

    const debounceValue = (newValue) => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setValue(newValue);
        }, delay);
    };

    return [value, debounceValue];
};

export default useDebounce;