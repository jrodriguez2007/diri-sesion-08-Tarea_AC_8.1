import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuItem } from '../../food/entities/MenuItem';
import { fetchMenu, fetchProcesarVenta } from './thunks';

// Definimos la interfaz del estado
interface FoodState {
    menu: MenuItem[];
    loading: boolean;
    error: string | null;
    procesarVenta: boolean;
    errorVenta: string | null;
}

// Estado inicial
const initialState: FoodState = {
    menu: [],
    loading: false,
    error: null,
    procesarVenta: false,
    errorVenta: null,
};

export const foodSlice = createSlice({
    name: 'food',
    initialState,
    reducers: {
      // Ejemplo de un reduce síncrono para obtener menues
      setMenus: (state, action: PayloadAction<MenuItem[]>) => {
        state.menu = action.payload;
      },
    },
    extraReducers: (builder) => {
      // Thunk para cargar el menu
      builder
        .addCase(fetchMenu.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchMenu.fulfilled, (state, action: PayloadAction<MenuItem[]>) => {
          state.menu = action.payload;
          state.loading = false;
        })
        .addCase(fetchMenu.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || "Error desconocido";
        });

      // Thunk para procesar la venta
      builder
          .addCase(fetchProcesarVenta.pending, (state) => {
          state.procesarVenta = true;
          state.errorVenta = null;
          })
          .addCase(fetchProcesarVenta.fulfilled, (state) => {
          state.procesarVenta = false;
          })
          .addCase(fetchProcesarVenta.rejected, (state, action) => {
          state.procesarVenta = false;
          state.errorVenta = action.payload || "Error desconocido";
          });
      },
  });

export const { 
    setMenus
 } = foodSlice.actions;