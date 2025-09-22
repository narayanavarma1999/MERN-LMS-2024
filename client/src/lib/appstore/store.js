import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userslice'
import authReducer from './authslice'

const store = configureStore({
    reducer: {
        user: userReducer,
        auth: authReducer
    },
})


export default store