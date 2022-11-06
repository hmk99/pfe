import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: false,
    id: null,
    level: null,
    score: null,
    admin: false,
    theme: "light",
    test: false
}

export const counterSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
        state.user= action.payload.user
        state.id= action.payload.id
        state.level= action.payload.level
    },
    setAdmin: (state, action) => {
        state.admin= action.payload.admin
    },
    setScore: (state, action) => {
        state.score= action.payload.score
    },
    setTheme: (state, action) => {
        state.theme= action.payload.theme
    },
    setTest: (state, action) => {
        state.test= action.payload.test
    }
  },
})


export const { setUser, setAdmin, setScore, setTheme, setTest } = counterSlice.actions

export default counterSlice.reducer



/*
function reducer(state, action){
    console.log(action)
    switch(action.type){
        case "set_user":
            return {
                ...state,
                user: action.user,
                id: action.id,
                admin: action.admin,
                level: action.level
            }
        default:
            return state
    }
}

export default reducer
*/