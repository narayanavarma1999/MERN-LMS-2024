import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authslice'
import progressReducer from './progress-slice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        progress: progressReducer
    },
})


export default store