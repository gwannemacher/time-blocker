const EventTypes = {
    MEETING: {
        id: 'meeting',
        name: 'Meeting',
        className: 'calendar-meeting-event',
    },
    FOCUSMATE_WORK: {
        id: 'focusmate-work',
        name: 'Focusmate (work)',
        className: 'calendar-focusmate-work-event',
    },
    FOCUSMATE_PERSONAL: {
        id: 'focusmate-personal',
        name: 'Focusmate (personal)',
        className: 'calendar-focusmate-personal-event',
    },
    MISC: {
        id: 'misc',
        name: 'Misc',
        className: 'calendar-default-event',
    },
    PERSONAL: {
        id: 'personal',
        name: 'Personal',
        className: 'calendar-personal-event',
    },
    select: (type) => {
        switch (type) {
            case EventTypes.MEETING.id:
                return EventTypes.MEETING;
            case EventTypes.FOCUSMATE_WORK.id:
                return EventTypes.FOCUSMATE_WORK;
            case EventTypes.FOCUSMATE_PERSONAL.id:
                return EventTypes.FOCUSMATE_PERSONAL;
            case EventTypes.PERSONAL.id:
                return EventTypes.PERSONAL;
            case EventTypes.MISC.id:
            default:
                return EventTypes.MISC;
        }
    },
    displayTitle: (type, title) => {
        switch (type) {
            case EventTypes.FOCUSMATE_WORK.id:
            case EventTypes.FOCUSMATE_PERSONAL.id:
                return `👩🏻‍💻👩🏻‍💻 ${title}`;
            default:
                return title;
        }
    },
};

export default EventTypes;
