import { ObtenerMenu, ActualizarStock, RegistrarVenta } from '../../food/services/FoodServices';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { MenuItem } from '../../food/entities/MenuItem';
import { SaleItem } from '../../food/entities/SaleItem';

// Thunk para obtener el menu
export const fetchMenu = createAsyncThunk<MenuItem[], void, { rejectValue: string }>(
  "food/fetchMenu",
  async (_: void, { rejectWithValue }) => {
    try {
      // Espera la respuesta de la base de datos
      const menu = await ObtenerMenu();
      return menu;
    } catch (error: any) {
      // Retorna el error con rejectWithValue para que llegue al reducer rejected
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para procesar la venta
export const fetchProcesarVenta = createAsyncThunk<
  void, // No se retorna nada
  { item: MenuItem; cantidad: number; cliente: string; numero: string },
  { rejectValue: string }
>(
  "food/fetchProcesarVenta",
  async ({ item, cantidad, cliente, numero }, { rejectWithValue }) => {
    try {
      // Calcular la cantidad restante en stock
      const cantidadRestante = item.quantity - cantidad;
      
      // Actualizar el stock en la base de datos
      await ActualizarStock(item.id, cantidadRestante);
      
      // Crear el objeto SaleItem a registrar
      const saleItem: SaleItem = {
        idItem: item.id,
        quantity: cantidad,
        price: item.price,
        customer: cliente,
        telephone: numero,
        total: item.price * cantidad,
      };
      
      // Simular demora en el procesamiento (2 segundos)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Registrar la venta en la base de datos
      await RegistrarVenta(saleItem);
      
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);