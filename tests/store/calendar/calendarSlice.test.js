import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEnvent, onUpdateEvent } from '../../../src/store/calendar/calendarSlice';
import { calendarWhithActiveEventState, calendarWhithEventsState, events, initialState } from '../../fixtures/calendarState';


describe('Pruebas en el calendarSlice', () => {
    
    test('debe regresar el estado por defecto', () => {
        
        const state = calendarSlice.getInitialState();
        expect(state).toEqual( initialState );

    });

    test('onSetActiveEnvent debe activar el evento', () => {

        const state = calendarSlice.reducer( calendarWhithEventsState, onSetActiveEnvent( events[0] ) );
        expect(state.activeEvent).toEqual( events[0] );
        
    });

    test('onAddNewEvent debe agregar el evento', () => {

        const newEvent = 
            {
                id: '3',
                start: new Date('2020-08-11 11:24:00'),
                end: new Date('2020-08-11 14:24:00'),
                title: 'Cumpleaños de Sofia!!',
                notes: 'Cualquier regalo!',
            };

        const state = calendarSlice.reducer( calendarWhithEventsState, onAddNewEvent( newEvent ) );
        expect( state.events ).toEqual([ ...events, newEvent ]);
        
        
    });

    test('onUpdateEvent debe actualizar el evento', () => {

        const updatedEvent = 
            {
                id: '1',
                start: new Date('2020-08-11 11:24:00'),
                end: new Date('2020-08-11 14:24:00'),
                title: 'Cumpleaños de Sofia actualizado',
                notes: 'Cualquier regalo lindo',
            };

        const state = calendarSlice.reducer( calendarWhithEventsState, onUpdateEvent( updatedEvent ) );
        expect( state.events ).toContain( updatedEvent );
        
        
    });

    test('onDeleteEvent debe borrar el evento activo', () => {
        //calendarWhithActiveEventState
        const state = calendarSlice.reducer( calendarWhithActiveEventState, onDeleteEvent() );
        expect( state.activeEvent ).toBe(null);
        expect( state.events ).not.toContain( events[0] );
    });

    test('onLoadEvents debe establecer los eventos', () => {
        // initialState
        const state = calendarSlice.reducer( initialState, onLoadEvents( events ) );
        expect( state.isLoadingEvents ).toBeFalsy();
        expect( state.events ).toEqual( events );

        const newState = calendarSlice.reducer( initialState, onLoadEvents( events ) );
        expect( newState.events.length ).toBe( events.length );
    });

    test('onLogoutCalendar debe limpiar el estado', () => {
        //calendarWhithActiveEventState
        const state = calendarSlice.reducer( calendarWhithActiveEventState, onLogoutCalendar() );
        expect( state ).toEqual( initialState );
        expect( state.activeEvent ).toBe( null );
    });
    
    
    
    
    
    

})
