import { useEffect } from 'react';

function useDomEffect(domEvent, handleEvent, stateChanges) {
    useEffect(() => {
        document.addEventListener(domEvent, handleEvent);
        return () => {
            document.removeEventListener(domEvent, handleEvent);
        };
    }, [[...stateChanges]]);
}

export default useDomEffect;
