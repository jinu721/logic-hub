    import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import homeReducer from './slices/homeSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        home: homeReducer
    }
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;