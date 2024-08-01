

export const events = [
    {
        id: '1',
        start: new Date('2024-08-11 11:24:00'),
        end: new Date('2024-08-11 14:24:00'),
        title: 'Cumpleaños de Sofia',
        notes: 'Cualquier regalo',
    },

    {
        id: '2',
        start: new Date('2024-12-15 11:24:00'),
        end: new Date('2024-12-15 14:24:00'),
        title: 'Cumpleaños de Julian',
        notes: 'Cualquier regalo',
    },

];

export const initialState =  {
    isLoadingEvents: true,
    events: [],
    activeEvent: null
};

export const calendarWhithEventsState =  {
    isLoadingEvents: false,
    events: [ ...events ],
    activeEvent: null
};

export const calendarWhithActiveEventState =  {
    isLoadingEvents: false,
    events: [ ...events ],
    activeEvent: { ...events[0] }
};