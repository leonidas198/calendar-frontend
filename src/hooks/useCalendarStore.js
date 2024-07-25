import { useDispatch, useSelector } from 'react-redux';
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEnvent, onUpdateEvent } from '../store';
import { calendarApi } from '../api';
import { convertToDateEvents } from '../helpers';
import Swal from 'sweetalert2';


export const useCalendarStore = () => {
  
  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector( state => state.calendar  );
  const { user } = useSelector( state => state.auth  );
  
  const setActiveEvent = ( calendarEvent ) => {
    dispatch( onSetActiveEnvent( calendarEvent ) );
  }

  const startSavingEvent = async( calendarEvent ) => {

    try {

      if ( calendarEvent.id ){
        // Actualizando
        await calendarApi.put(`/events/${ calendarEvent.id }`, calendarEvent );
        dispatch( onUpdateEvent( { ...calendarEvent, user } ) );
        return;
     
      } 
      // creando
      const { data } = await calendarApi.post('/events', calendarEvent);
      
      dispatch( onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }) )
      
    } catch (error) {
      console.log(error);
      Swal.fire('Error al guardar', error.response.data.msg, 'error' );
    }
    
    
    

  }

  const startDeletingEvent = async(  ) => {
    // Todo: llegar al backend
    try {
 
        await calendarApi.delete(`/events/${ activeEvent.id }` );
        dispatch( onDeleteEvent() );
      
      
    } catch (error) {
      console.log(error);
      Swal.fire('Error al eliminar', error.response.data.msg, 'error' );
    }


    
    dispatch( onDeleteEvent() );
  }

  
  const startLoadingEvents = async() => {

    try {
      const { data } = await calendarApi.get('/events');
      const events = convertToDateEvents( data.eventos );
      dispatch( onLoadEvents( events ) )
      

    } catch (error) {
      console.log('Error cargando eventos');
      console.log(error)
    }


  }



  
    return {
        // ! properties
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,

        // ! metods
        setActiveEvent,
        startDeletingEvent,
        startLoadingEvents,
        startSavingEvent,
  }
}
