import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { fetchMenu } from '../../store/food/thunks';
import { AppDispatch, RootState } from '../../store/store'; // Importamos los tipos
import { MenuItem } from '../entities/MenuItem';
import FoodsComponent from '../components/FoodsComponent';
import {NavbarCompnent} from '../../ui/Componentes/NavBarComponent';
import FoodOrderComponent from '../components/FoodOrderComponent';
import FoodListComponent from '../components/FoodListComponent';
import ErrorBoundary from '../../ui/Componentes/ErrorBoundaryComponent';
import LoggerService from '../../../src/auth/services/LoggerService';
import { Button, Container, Row, Col, Alert, Spinner  } from 'react-bootstrap';


function FoodPage() {

  const textoGlobal = import.meta.env.VITE_EJEMPLO;

  const [isChooseFoodPage, setIsChooseFoodPage] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  // Obtenemos menu, loading y error desde el store
  const { menu, loading, error } = useSelector((state: any) => state.food);
  const { rol } = useSelector((state: any) => state.auth);

  // Despachamos el thunk al montar el componente para cargar el menú
  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  // Al enviar un pedido se refresca el menú
  const handleOrderSubmit = async () => {
    dispatch(fetchMenu());
    setSelectedItem(null); // Volvemos al listado
  };

  const goToFoodPageAdmin = () => {
    setIsChooseFoodPage(true);
  };

  const goToFoodPageUser = () => {
    dispatch(fetchMenu());
    setSelectedItem(null); // Volvemos al listado    
  };

return (
  <Container>
    
    <NavbarCompnent onHomeClick={goToFoodPageUser} onAdminClick={goToFoodPageAdmin}/>
    <Row className="mb-4 mt-4 text-center">
      <Col>
        <h1 className="display-4 text-success">FoodPage</h1>
        <h2 className="text-muted">{textoGlobal}</h2>
      </Col>
    </Row>

    {(rol === 'ADMIN') && (
      <Row className="mb-3 justify-content-center">
        <Col xs="auto">
          <Button
            variant={isChooseFoodPage ? 'warning' : 'primary'}
            onClick={() => setIsChooseFoodPage(!isChooseFoodPage)}
          >
            {isChooseFoodPage ? 'Disponibilidad' : 'Pedir Comida'}
          </Button>
        </Col>
      </Row>
    )}

    <Row className="text-center">
      <Col>
        <h3 className="fw-bold">Comida Rápida Online</h3>
      </Col>
    </Row>

    {error && (
      <Row className="justify-content-center mb-4">
        <Col xs="auto">
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        </Col>
      </Row>
    )}

    {(rol === 'ADMIN' && !isChooseFoodPage) ? (
      <>
        <Row className="mb-3">
          <Col>
            <h4 className="text-light">Menús</h4>
          </Col>
        </Row>

        {loading && (
          <Row className="justify-content-center mb-4">
            <Col xs="auto">
              <Alert variant="info" className="text-center">
                <Spinner
                  animation="border"
                  role="status"
                  size="sm"
                  className="me-2"
                >
                  <span className="visually-hidden">Cargando...</span>
                </Spinner>
                Cargando el menú, por favor espere...
              </Alert>
            </Col>
          </Row>
        )}

        <Row>
          <Col>
            <FoodListComponent menuItems={menu} />
          </Col>
        </Row>
      </>
    ) : selectedItem ? (
      <ErrorBoundary fallback={<div className="text-danger">¡Algo salió mal!</div>}>
        <FoodOrderComponent item={selectedItem} onOrderSubmit={handleOrderSubmit} />
      </ErrorBoundary>
    ) : (
      <FoodsComponent
        foodItems={menu}
        onSelectItem={(item) => setSelectedItem(item)}
      />
    )}
  </Container>
  );
  
}
export default FoodPage;
