const EventTypes = {
    MEETING: {
        id: 'meeting',
        name: 'Meeting',
        prefix: '',
        className: 'calendar-meeting-event',
    },
    FOCUSMATE_WORK: {
        id: 'focusmate-work',
        name: 'Focusmate (work)',
        prefix: '👩🏻‍💻👩🏻‍💻 ',
        className: 'calendar-focusmate-work-event',
    },
    FOCUSMATE_PERSONAL: {
        id: 'focusmate-personal',
        name: 'Focusmate (personal)',
        prefix: '👩🏻‍💻👩🏻‍💻 ',
        className: 'calendar-focusmate-personal-event',
    },
    MISC: { id: 'misc', name: 'Misc', prefix: '', className: 'calendar-default-event' },
    PERSONAL: {
        id: 'personal',
        name: 'Personal',
        prefix: '',
        className: 'calendar-personal-event',
    },
    select: (id) => {
        switch (id) {
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
                return EventTypes.MISC;;
        }
    },
};

export default EventTypes;
