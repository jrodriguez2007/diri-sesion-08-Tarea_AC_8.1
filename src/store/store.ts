import { configureStore } from '@reduxjs/toolkit'
import { foodSlice } from './food';
import { authSlice } from './auth';

export const store = configureStore({
    reducer: {
      food: foodSlice.reducer,
      auth: authSlice.reducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;