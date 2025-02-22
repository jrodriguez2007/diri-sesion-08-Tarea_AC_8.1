import { FormEvent, useState } from 'react';
import { MenuItem } from "../entities/MenuItem";
import LoggerService from '../../../src/auth/services/LoggerService';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchProcesarVenta } from '../../store/food';

interface FoodOrderComponentProps {
    item: MenuItem;
    onOrderSubmit: () => void;
}

function FoodOrderComponent({ item, onOrderSubmit }: FoodOrderComponentProps) {

  const [cantidad, setCantidad] = useState(1);
  const [cliente, setCliente] = useState("");
  const [numero, setNumero] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  // Utilizamos el dispatch tipado
  const dispatch = useDispatch<AppDispatch>();

  // Extraemos del store el flag de procesamiento de venta y cualquier error
  const { procesarVenta, errorVenta } = useSelector((state: RootState) => state.food);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validación: Si la cantidad es menor a 1, mostramos una alerta temporal
    if (cantidad < 1) {
      LoggerService.error(`La cantidad no puede ser menor a uno, y se ha ingresado ${cantidad}`);
      setLocalError(`La cantidad no puede ser menor a uno, y se ha ingresado ${cantidad}`);
      // La alerta se oculta automáticamente después de 2 segundos
      setTimeout(() => setLocalError(null), 2000);
      return;
    }

    try {
      // Despachamos el thunk procesarVenta y esperamos su resolución.
      await dispatch(fetchProcesarVenta({ item, cantidad, cliente, numero })).unwrap();
      // Una vez procesada la venta, se puede volver al listado
      onOrderSubmit();
    } catch (error) {
      LoggerService.error('Error al procesar el pedido: ' + error);
      // El error ya se refleja en el estado (errorVenta) para mostrarse en la interfaz
    }
  };

  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir cadena vacía para que el usuario pueda borrar y volver a escribir
    if (value === "" || /^\d+$/.test(value)) {
      setCantidad(value === "" ? 0 : Number(value));
    }
  };  
    

    return (
      <div>
        {/* Alerta de error local (por validación) */}
        {localError && (
          <Alert variant="danger" className="text-center">
            {localError}
          </Alert>
        )}

        {/* Si hay error en el proceso de venta, se muestra un mensaje */}
        {errorVenta && (
          <Alert variant="danger" className="text-center">
            {errorVenta}
          </Alert>
        )}
  
        {/* Se muestra la alerta con spinner mientras se procesa la venta */}
        {procesarVenta && (
          <Alert variant="info" className="text-center">
            <Spinner
              animation="border"
              role="status"
              size="sm"
              className="me-2"
            >
              <span className="visually-hidden">Procesando...</span>
            </Spinner>
            Registrando la venta, por favor espere...
          </Alert>
        )}
  
        {/* El formulario se muestra siempre que no se esté procesando la venta */}
        {!procesarVenta && (
          <Form onSubmit={handleSubmit}>
            <h2>Datos de la compra - {item.name}</h2>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad:</Form.Label>
              <Form.Control
              type="text"
              inputMode="numeric"
              pattern="^\d+$"
              value={cantidad.toString()}
              onChange={handleCantidadChange}
            />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cliente:</Form.Label>
              <Form.Control
                type="text"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Número Telefónico:</Form.Label>
              <Form.Control
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Grabar
            </Button>
            <Button variant="secondary" onClick={onOrderSubmit}>
              Cancelar
            </Button>
          </Form>
        )}
      </div>
    );

}

export default FoodOrderComponent;