import React, { useEffect, useState } from 'react'
import { Navbar } from '../ui/Navbar'
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';

import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
//importa el idioma de moment
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { messages } from '../../helpers/calendar-messages-es';
import { useDispatch, useSelector } from 'react-redux';

import {uiopenModal} from '../../actions/ui'
import { eventClearActiveEvent, eventSetActive, eventStartLoading } from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';

//Cambio en el idioma de Moment
moment.locale('es');

const localizer = momentLocalizer(moment);


export const CalendarScreen = () => {

    const dispatch = useDispatch();
    
    const {events, activeEvent} = useSelector( state => state.calendar );
    const {uid} = useSelector( state => state.auth );

    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');

    useEffect(() => {
        dispatch(eventStartLoading())
    }, [dispatch])


    const onDoubleClick = (e) => {
        dispatch(uiopenModal());
    }

    const onSelectEvent = (e) =>{
        dispatch(eventSetActive(e));
        
    }

    const onViewChange = (e) => {
        //Para que se quede en la vista aun cuando se recargue el navegador
        setLastView(e);
        localStorage.setItem('lastView',e);
    }

    const onSelectSlot = e => {
        dispatch(eventClearActiveEvent())
    }

    const eventStyleGetter = (event,start,end,isSelected) => {

        
        const style = {
            backgroundColor:(uid === event.user._id) ? '#367CF7' : '#465660' ,
            borderRadius:'0px',
            opacity:0.8,
            display:'block',
            color:'white'
        }
        return {
            style
        }
    }

    return (
        <div className="calendar-screen">
            <Navbar />

            <Calendar 
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                messages={messages}
                eventPropGetter = {eventStyleGetter}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelectEvent}
                onView={onViewChange}
                view = {lastView}
                components={{event: CalendarEvent}}
                onSelectSlot={ onSelectSlot}
                selectable= {true}
            />


            <CalendarModal />

            <AddNewFab />


           {
           activeEvent &&
                <DeleteEventFab />
           }

        </div>
    )
}
