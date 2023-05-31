'use client';

import { configureStore } from "@reduxjs/toolkit";
import conuterReducer from './features/counter/counterSlice';

export const store = configureStore({
    reducer: {
        counter: conuterReducer
    }
})


export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;