import { types } from "../types/types"

export const uiopenModal = () => {
    return{
        type:types.uiOpenModal
    }
}

export const uicloseModal = () => {
    return{
        type:types.uiCloseModal
    }
}