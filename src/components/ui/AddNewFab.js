import React from 'react'
import { useDispatch } from 'react-redux'

import { uiopenModal } from '../../actions/ui';

export const AddNewFab = () => {

    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(uiopenModal());
    }


    return (
        <button
            className="btn btn-primary fab"
            onClick={handleClick}
        >
            <i className="fas fa-plus"></i>
        </button>
    )
}
