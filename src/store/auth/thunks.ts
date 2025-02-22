
import { createAsyncThunk } from "@reduxjs/toolkit";
import { checkingCredentials, login, logout } from "./authSlice";
import { authService } from "../../auth/services/AuthService";
import { Role } from "../../auth/services/IAuthService";
import { FirebaseDatabaseService } from '../../firebase/services/FirebaseDatabaseService';

interface UserCredentials {
    email: string;
    password: string;
    displayName: string
}
  
interface AuthResponse {
    ok: boolean;
    uid?: string;
    photoURL?: string;
    errorMessage?: string;
}

interface LoginCredentials {
    email: string;
    password: string;
}

export const checkingAuthentication = createAsyncThunk<
  any, // Tipo de dato retornado en estado fulfilled (puede ser un objeto con la info del usuario)
  { email: string; password: string }, // Tipo de argumento que recibe la función (en este caso, email y password)
  { rejectValue: string } // Configuración adicional (en este caso, se especifica el tipo de rejectValue)
>(
  'auth/checkingAuthentication',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    dispatch(checkingCredentials());
  }
);

export const startCreatingUserWithEmailPassword = createAsyncThunk<
  void, // Tipo de dato retornado en fulfilled (en este caso void, ya que las acciones se despachan internamente)
  UserCredentials, // Tipo de argumento que recibe la función
  { rejectValue: string; }
>(
    'auth/startCreatingUserWithEmailPassword',
    async ({ email, password, displayName }, { dispatch, rejectWithValue }) => {
      dispatch(checkingCredentials());
        
      try {
        // Se utiliza el método signUp que solo recibe email y password
        const resp = await authService.signUp(email, password);        
        // Se extrae el usuario desde la respuesta
        const { user } = resp;
        
        //Actualizamos el displayName en el perfil del usuario
        await authService.updateProfile( displayName );

        const { uid, photoURL } = user;

        // Determinar el rol: Si el email contiene "jrodriguez", asignar ADMIN; de lo contrario, USER.
        const assignedRole = email.toLowerCase().includes('jrodriguez') ? Role.ADMIN : Role.USER;

        // Registrar el rol del usuario en Firebase (crea un nuevo registro en la colección o ruta correspondiente)
        const firebaseDatabaseService = new FirebaseDatabaseService();
        await firebaseDatabaseService.createUserRoles(uid, {
          email,
          role: assignedRole,
        });

        dispatch(login({ uid, displayName, email, photoURL, rol: assignedRole }));
      } catch (error: any) {
        dispatch(logout({ errorMessage: error.message }));
        return rejectWithValue(error.message || 'Error desconocido');
      }
    }
  );

export const startLoginWithEmailPassword = createAsyncThunk<
  void, // Tipo de retorno en caso de éxito
  LoginCredentials, // Tipo de argumento que recibe el thunk
  { rejectValue: string } // Tipo del valor de rechazo
>(
  'auth/startLoginWithEmailPassword',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    dispatch(checkingCredentials());

    try
    {
        const resp = await authService.signIn( email, password );
        const { user } = resp;
        const { accessToken, uid, photoURL, displayName } = user;
        
        if (!accessToken) {
            dispatch(logout({ errorMessage: 'Usuario no registrado' }));
            return rejectWithValue(resp.errorMessage || 'Usuario no registrado');
          }

        // Se obtiene el rol del usuario desde la base de datos
        const firebaseDatabaseService = new FirebaseDatabaseService();
        const rol = await firebaseDatabaseService.getUserRole(uid);        

        dispatch(login({uid, photoURL, displayName, rol}));

    } catch (error: any) 
    {
        dispatch(logout({ errorMessage: error.message }));
        return rejectWithValue(error.message || 'Error desconocido');
    }

  }
);
  
export const startLogout = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  'auth/startLogout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await  authService.signOut();
      dispatch(logout(null));
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cerrar sesión');
    }
  }
);