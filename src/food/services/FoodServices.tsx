import { db } from '../../firebase/Config';
import { ref, get, set, update } from 'firebase/database';
import { MenuItem } from '../entities/MenuItem';
import { SaleItem } from '../entities/SaleItem';
import LoggerService from '../../../src/auth/services/LoggerService';

export const ObtenerMenu = async (): Promise<MenuItem[]> => {
  try {
    // Referencia a la colección "menuItems"
    const menuRef = ref(db, 'menuItems'); 
    const snapshot = await get(menuRef);

    if (snapshot.exists()) {
      const menuData = snapshot.val();

      // Convertir la data en un arreglo de `MenuItem`
      return Object.keys(menuData).map((key) => ({
        id: Number(key),
        ...menuData[key],
      }));

    } else {
      LoggerService.warn('No hay datos disponibles en la base de datos');
      return [];
    }
  } catch (error) {
    LoggerService.error('Error al obtener el menú desde Firebase: ' + error);
    throw error;
  }
}

  
export const RegistrarVenta = async (item: SaleItem): Promise<void> => {

  try {
      // Referencia a la colección "sales"
      const salesRef = ref(db, 'sales');
      const snapshot = await get(salesRef);

      // Obtener el máximo id actual
      let newId = 1; // Valor predeterminado si no hay ventas registradas
      if (snapshot.exists()) {
        const salesData = snapshot.val();
        const ids = Object.keys(salesData).map((key) => Number(key));
        newId = Math.max(...ids) + 1;
      }

      // Asignar el nuevo id
      const newItem = { ...item, id: newId };

      // Registrar la venta con el nuevo id
      const newItemRef = ref(db, `sales/${newId}`);
      await set(newItemRef, newItem);

      LoggerService.info(`Venta registrada exitosamente con id: ${newId}`);
  } catch (error) {
    LoggerService.error(`Error al registrar la venta: ${error}`);
    throw error;
  }
}

export const ActualizarStock = async (id: number, cantidadRestante: number): Promise<void> => {
  try {
    // Ruta en la base de datos
    const itemRef = ref(db, `menuItems/${id}`);
    await update(itemRef, { quantity: cantidadRestante });
  } catch (error) {
    LoggerService.error(`Error al actualizar el stock del item ${id}: ${error}`);
    throw error;
  }
}


