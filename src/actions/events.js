import Swal from "sweetalert2";
import { fetchConToken } from "../helpers/fetch";
import { prepareEvent } from "../helpers/prepareEvents";
import { types } from "../types/types";


export const startAddNew = (event) =>{
    return async(dispatch, getState) => {

        const {uid, name} =getState().auth;
        try {

            const resp = await fetchConToken('events',event,'POST');
            const body = await resp.json();
            if (body.ok) {
                event.id = body.evento.id;
                event.user = {
                    _id: uid,
                    name
                }
                dispatch(eventAddNew( event ))
            }
            
        } catch (error) {
            console.log(error)
        }

    }
}


const eventAddNew = (event) => {
    return {
        type:types.eventAddNew,
        payload:event
    }
}

export const eventSetActive = (event) => {
    return {
        type:types.eventSetActive,
        payload:event
    }
}

export const eventClearActiveEvent = () => {
    return{
        type:types.eventClearActiveEvent
    }
}


export const eventStartUpdate = (event) => {
    return async (dispatch)=>{
        try {
            
            const resp = await fetchConToken(`events/${event.id}`,event,'PUT');
            const body = await resp.json();
            
            if (body.ok) {
                dispatch(eventUpdated(event));
                Swal.fire('Success','Evento actualizado','success');
            }else{
                Swal.fire('Error',body.msg,'error');
            }
            
        } catch (error) {
            console.log(error)
        }

    }
}


const eventUpdated = (event) => {
    return{
        type:types.eventUpdated,
        payload: event
    }
}


export const eventStartDeleted = () => {
    return async(dispatch,getState) => {
        try {
            const {activeEvent} = getState().calendar
            const resp = await fetchConToken(`events/${activeEvent.id}`,{},'DELETE');
            const body = await resp.json();
            
            if (body.ok) {
                dispatch(eventDeleted());
                Swal.fire('Success','Evento eliminado','success');
            }else{
                Swal.fire('Error',body.msg,'error');
            }
            
        } catch (error) {
            console.log(error)
        }
    }
}


const eventDeleted = () => {
    return {
        type: types.eventDeleted
    }
}

export const eventStartLoading = () => {
    return async(dispatch) => {

        const resp = await fetchConToken('events');
        const body = await resp.json();

        const events = prepareEvent(body.eventos) ;
        dispatch(eventLoaded(events))

    }
}

const eventLoaded = (events) => {
    return {
        type: types.eventLoaded,
        payload: events
    }
}

export const eventLogout = () => {
    return {
        type: types.eventLogout
    }
}