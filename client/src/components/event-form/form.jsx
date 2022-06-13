import React, { useState, useEffect, useCallback } from 'react';

import AllDayEventForm from './all-day-event-form';
import EventForm from './event-form';
import EditForm from './edit-form';
import DeleteForm from './delete-form';
import useKeyboardEvents from '../../hooks/useKeyboardEvents';

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
        if (selectedDateInfo) {
            if (selectedDateInfo.date.getMinutes() === 15) {
                selectedDateInfo.date.setMinutes(0);
            } else if (selectedDateInfo.date.getMinutes() === 45) {
                selectedDateInfo.date.setMinutes(30);
            }

            setDate(selectedDateInfo.date);

            if (selectedDateInfo.allDay) {
                setIsAllDayFormVisible(true);
            } else {
                setIsFormVisible(true);
            }
        }
    }, [selectedDateInfo]);

    return (
        <>
            <EventForm
                range={range}
                isVisible={isFormVisible}
                date={date}
                hideForm={() => setIsFormVisible(false)}
            />
            <AllDayEventForm
                isVisible={isAllDayFormVisible}
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
