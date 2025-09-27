import { createSlice } from '@reduxjs/toolkit';

const progressSlice = createSlice({
    name: 'progress',
    initialState: 0,
    reducers: {
        setProgress: (state, action) => {
            return action.payload;
        },
        incrementProgress: (state, action) => {
            return state + action.payload;
        },
        resetProgress: () => {
            return 0;
        }
    },
});

export const { setProgress, incrementProgress, resetProgress } = progressSlice.actions;
export default progressSlice.reducer;