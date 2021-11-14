import React, { useEffect, useState } from 'react'
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {uicloseModal} from '../../actions/ui'
import {  eventClearActiveEvent, eventStartUpdate, startAddNew } from '../../actions/events';

//Centrar el modal
const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

//linkearlo al index.js
Modal.setAppElement('#root');

//Fecha Inicial
const now = moment().minutes(0).seconds(0).add(1,'hours');
const nowPlus1 = now.clone().add('1','hours');

const initialForm = {
    title:'',
    notes :'',
    start:now.toDate(),
    end: nowPlus1.toDate(),
}



export const CalendarModal = () => {

    const {modalOpen} = useSelector( state => state.ui );
    const {activeEvent} = useSelector( state => state.calendar );

    const dispatch = useDispatch();

    const [, setDateStart] = useState(now.toDate());
    const [, setDateEnd] = useState(nowPlus1.toDate());
    const [titleValid, setTitleValid] = useState(true);

    const [formValues, setFormValues] = useState(initialForm)

    const {title,notes,start,end} =formValues;


    useEffect(() => {
        if (activeEvent) {
            setFormValues(activeEvent)
        }else{
            setFormValues(initialForm)
        }
      
    }, [activeEvent,setFormValues])



    const handleInputChange = ({target}) => {
        setFormValues({
            ...formValues,
            [target.name]:target.value
        });
    }


    const closeModal = () => {
        //Cerrar el modal
        dispatch(uicloseModal());
        setFormValues(initialForm);
        dispatch(eventClearActiveEvent());
    }

    const handleStartDateChange = (e) => {
        setDateStart(e);
        setFormValues({
            ...formValues,
            start:e
        });
    }
    const handleEndDateChange = (e) => {
        setDateEnd(e);
        setFormValues({
            ...formValues,
            end:e
        });
    }

    const handleSubmitForm = e => {
        e.preventDefault();

        const momentStart = moment(start);
        const momentEnd = moment(end);

        if (momentStart.isSameOrAfter(momentEnd)) {
            return Swal.fire('Error','La fecha fin debe ser mayor a la fecha de inicio','error');
        }

        if (title.trim().length < 2) {
            return setTitleValid(false);
        }

        if (activeEvent) {
            dispatch(eventStartUpdate(formValues));
        }else{
            dispatch(startAddNew(formValues));
        }
        
        setTitleValid(true);
        closeModal();
    }


    return (
        <Modal
            isOpen={modalOpen}
            // onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            className="modal"
            overlayClassName="modal-fondo"
            closeTimeoutMS={200}
        >
            <h1> {activeEvent ? 'Editar evento' : 'Nuevo evento'} </h1>
            <hr />
            <form className="container" onSubmit={handleSubmitForm}>

                <div className="form-group">
                    <label>Fecha y hora inicio</label>
                    <DateTimePicker 
                        onChange={ handleStartDateChange }
                        value={ start}
                        className="form-control"
                        format="y-MM-dd h:mm:ss a"
                        amPmAriaLabel="Select AM/PM"
                    />
                </div>

                <div className="form-group">
                    <label>Fecha y hora fin</label>
                    <DateTimePicker 
                        onChange={ handleEndDateChange }
                        value={ end}
                        className="form-control"
                        format="y-MM-dd h:mm:ss a"
                        amPmAriaLabel="Select AM/PM"
                        minDate={start}
                    />
                </div>

                <hr />
                <div className="form-group">
                    <label>Titulo y notas</label>
                    <input 
                        type="text" 
                        className={`form-control  ${!titleValid && 'is-invalid'} `}
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={title}
                        onChange={handleInputChange}

                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group">
                    <textarea 
                        type="text" 
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={notes}
                        onChange={handleInputChange}
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>
                <div className="d-grid gap-2">

                    <button
                        type="submit"
                        className="btn btn-outline-primary btn-block"
                        
                    >
                        <i className="far fa-save"></i>
                        <span> Guardar</span>
                    </button>

                </div>

            </form>

        </Modal>
    )
}
