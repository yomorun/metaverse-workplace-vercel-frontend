import { useReducer, createContext } from 'react'
import { sound } from './reducers/sound'

const initialState = {
    sound: {
        muted: true
    },
}

const Context = createContext({})

const combineReducers = (...reducers) => (state, action) => {
    for (let i = 0; i < reducers.length; i++) {
        state = reducers[i](state, action)
    }

    return state
}

const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(
        combineReducers(sound),
        initialState
    )

    const value = { state, dispatch }

    return <Context.Provider value={value}>{children}</Context.Provider>
}

export { Context, Provider }
