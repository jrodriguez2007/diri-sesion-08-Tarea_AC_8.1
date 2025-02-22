import { MenuItem } from "../entities/MenuItem";
import { ListGroup } from 'react-bootstrap';

interface FoodListComponentProps {
    menuItems: MenuItem[]
  }

function FoodListComponent({ menuItems } : FoodListComponentProps) {

    return (
        <ListGroup className="my-3">
          {menuItems.map((item) => (
            <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
              <span>{item.name}</span>
              <span className="badge bg-primary rounded-pill">{item.quantity}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      );    
}

export default FoodListComponent;
