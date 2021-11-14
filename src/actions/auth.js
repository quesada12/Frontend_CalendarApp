import Swal from "sweetalert2";
import { fetchConToken, fetchSinToken } from "../helpers/fetch"
import { types } from "../types/types";


export const startLogin = (email, password) => {
    return async (dispatch) => {

        const respuesta = await fetchSinToken('auth',{email, password},'POST');
        const body = await respuesta.json();
        
        if (body.ok) {
            localStorage.setItem('token',body.token);
            localStorage.setItem('token-init-date',new Date().getTime());
            dispatch(login({
                uid: body.uid,
                name: body.name
            }))
        } else {
            Swal.fire('Error',body.msg, 'error');
        }

    }
}


export const startRegister = (email,password,name) => {
    return async(dispatch) => {

        const respuesta = await fetchSinToken('auth/new',{name, email, password},'POST');
        const body = await respuesta.json();
        
        if (body.ok) {
            localStorage.setItem('token',body.token);
            localStorage.setItem('token-init-date',new Date().getTime());
            dispatch(login({
                uid: body.uid,
                name: body.name
            }))
        } else {
            Swal.fire('Error',body.msg, 'error');
        }
        

    }
}


export const startChecking = () => {
    return async (dispatch) => {

        const respuesta = await fetchConToken('auth/renew');
        const body = await respuesta.json();
        
        if (body.ok) {
            localStorage.setItem('token',body.token);
            localStorage.setItem('token-init-date',new Date().getTime());
            dispatch(login({
                uid: body.uid,
                name: body.name
            }))
        } else {
            dispatch(checkingFinish())
        }

    }
}


const login = (user) => {
    return {
        type: types.authLogin,
        payload: user
    }
}

const checkingFinish = () => {
     return {
         type: types.authCheckingFinish
     }
 }

export const startLogout = () => {
    return async (dispatch) => {
        localStorage.clear();
        dispatch(logout())
    }
}

const logout = () => {
    return{
        type: types.authLogout
    }
}