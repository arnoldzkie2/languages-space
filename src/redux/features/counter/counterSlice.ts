import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
    value: boolean;
}

const initialState: CounterState = {
    value: false,
};

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        handleBoolean: (state) => {
            state.value = !state.value
        },
    }
});

export const {handleBoolean} = counterSlice.actions

export default counterSlice.reducer;
