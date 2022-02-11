// https://blog.logrocket.com/accessing-previous-props-state-react-hooks/
import { useRef, useEffect } from 'react';

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

export default usePrevious;
