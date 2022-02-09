import { useEffect } from 'react';

function useDomKeydownListenerEffect(
    handleKeyDown,
    stateChanges
    ) {
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [[...stateChanges]]);
}

export default useDomKeydownListenerEffect;
