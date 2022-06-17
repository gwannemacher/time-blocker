import React, { useState, useEffect, useCallback } from 'react';

import CreateAllDayForm from './create-all-day-form';
import CreateForm from './create-form';
import EditForm from './edit-form';
import DeleteForm from './delete-form';
import useKeyboardEvents from '../../hooks/useKeyboardEvents';

const getRoundedMinutes = (date: any) => {
    if (date.getMinutes() === 15) {
        return 0;
    }

    if (date.getMinutes() === 45) {
        return 30;
    }

    // shouldn't ever get here
    return date.getMinutes();
};

const getBlock = (selectedVar: any, timeBlocks: any[]) => {
    if (!selectedVar?.id || !selectedVar?.isSelected || !timeBlocks) {
        return null;
    }

    const filtered = timeBlocks.filter((x) => x.id === selectedVar.id);
    return filtered?.length === 0 ? null : filtered[0];
};

function Form(props) {
    const { selectedDateInfo, range, selectedVar, timeBlocks } = props;
    const [isAllDayFormVisible, setIsAllDayFormVisible] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isEditFormVisible, setIsEditFormVisible] = useState(false);
    const [isDeleteFormVisible, setIsDeleteFormVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const { copyEvent, moveEvent } = useKeyboardEvents(range);

    const handleKeyDown = useCallback(
        (event) => {
            if (
                !selectedVar.id ||
                isFormVisible ||
                isAllDayFormVisible ||
                isDeleteFormVisible ||
                isEditFormVisible
            ) {
                return;
            }

            if (event.key === 'd' || event.key === 'Backspace') {
                setIsDeleteFormVisible(true);
            } else if (event.key === 'e') {
                setIsEditFormVisible(true);
            } else if (event.key === 'c') {
                copyEvent(getBlock(selectedVar, timeBlocks));
            } else if (event.key === 'm') {
                moveEvent(getBlock(selectedVar, timeBlocks));
            }
        },
        [
            selectedVar,
            isFormVisible,
            isAllDayFormVisible,
            isDeleteFormVisible,
            isEditFormVisible,
        ]
    );

    useEffect(() => {
        document.addEventListener('keyup', handleKeyDown);
        return () => {
            document.removeEventListener('keyup', handleKeyDown);
        };
    }, [handleKeyDown]);

    useEffect(() => {
        if (!selectedDateInfo) {
            return;
        }

        const roundedMinutes = getRoundedMinutes(selectedDateInfo.date);
        selectedDateInfo.date.setMinutes(roundedMinutes);
        setDate(selectedDateInfo.date);

        if (selectedDateInfo.allDay) {
            setIsAllDayFormVisible(true);
        } else {
            setIsFormVisible(true);
        }
    }, [selectedDateInfo]);

    return (
        <>
            <CreateForm
                isVisible={isFormVisible}
                range={range}
                date={date}
                hideForm={() => setIsFormVisible(false)}
            />
            <CreateAllDayForm
                isVisible={isAllDayFormVisible}
                range={range}
                date={date}
                hideForm={() => setIsAllDayFormVisible(false)}
            />
            <EditForm
                isVisible={isEditFormVisible}
                id={selectedVar?.id}
                title={getBlock(selectedVar, timeBlocks)?.title}
                hideForm={() => setIsEditFormVisible(false)}
            />
            <DeleteForm
                isVisible={isDeleteFormVisible}
                id={selectedVar?.id}
                hideForm={() => setIsDeleteFormVisible(false)}
            />
        </>
    );
}

export default Form;
