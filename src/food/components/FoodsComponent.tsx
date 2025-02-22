import { MenuItem } from "../entities/MenuItem";
import { Card, Row, Col } from 'react-bootstrap';

interface FoodsProps {
    foodItems: MenuItem[];
    onSelectItem: (item: MenuItem) => void;
  }

   function Foods({ foodItems, onSelectItem }: FoodsProps) {

    return (
        <>
          <h4 className="text-center mb-4">Escoge un item del menú</h4>
          <Row xs={1} sm={2} md={3} className="g-4">
            {foodItems.map((item) => (
              <Col key={item.id}>
                <Card onClick={() => onSelectItem(item)} className="h-100 clickable-card">
                  <Card.Img 
                    variant="top" 
                    src={`${import.meta.env.VITE_BASE_URL}images/${item.image}`}
                    alt={item.name} />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>{item.desc}</Card.Text>
                  </Card.Body>
                  <Card.Footer className="text-center">
                    <span className="fw-bold text-success">{item.price}$</span>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </>
    );

};
export default Foods;