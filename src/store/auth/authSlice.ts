import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'checking', // 'checking' 'not-authenticated', 'authenticated'
        uid: null,
        email: null,
        displayName: null,
        photoUrl: null,
        rol: null,
        errorMessage: null,
    },
    reducers: {
        // (state, action)
        login: ( state, {payload} ) => {
            state.status = 'authenticated';
            state.uid = payload.uid;
            state.email = payload.email;
            state.displayName = payload.displayName;
            state.photoUrl = payload.photoURL;
            state.rol = payload.rol;
            state.errorMessage = null;
        },
        logout: (state, {payload}) => {
            state.status = 'not-authenticated';
            state.uid = null;
            state.email = null;
            state.displayName = null;
            state.photoUrl = null;
            state.rol = null;
            state.errorMessage = payload?.errorMessage;
        },
        checkingCredentials: (state) => {
            state.status = 'checking';
        }
    }
});

// Action creator functions
export const { login, logout, checkingCredentials } = authSlice.actions;