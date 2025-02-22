import { Link, useNavigate } from 'react-router-dom';
import { Role } from '../../auth/services/IAuthService';
import { startLogout } from '../../store/auth';
import { useAppDispatch } from '../../hooks/mapping';
import { useSelector } from 'react-redux';

interface NavbarCompnentProps {
  onHomeClick: () => void;
  onAdminClick: () => void;
}

export const NavbarCompnent: React.FC<NavbarCompnentProps> = ({ onHomeClick, onAdminClick }) => {

    const dispatch = useAppDispatch();
    // Se obtiene la información de usuario del state.auth
    const { uid, displayName, rol } = useSelector((state: any) => state.auth);

    const onLogout = () => {
        dispatch( startLogout() );
    }


    // const { user, roles } = useContext(AuthContext);
    // const navigate = useNavigate();
    // const handleLogout = async () => {
    //     try {
    //         await authService.signOut();
    //         navigate('/login');
    //     } catch (error) {
    //         console.error("Error al cerrar sesión:", error);
    //     }
    // };

return (

  <>

    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          {/* Grupo izquierdo: links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              {/* <Link className="nav-link" to="/" onClick={onHomeClick}>Home</Link> */}
              <a
                href="#"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  onHomeClick();
                }}
              >
                Home
              </a>
            </li>
            {uid && rol === Role.ADMIN && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin" onClick={onAdminClick}>Admin</Link>
              </li>
            )}
            {!uid && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Registro</Link>
                </li>
              </>
            )}
          </ul>
          {/* Grupo derecho: nombre de usuario y botón de logout */}
          {uid && (
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              <li className="nav-item me-3">
                <span className="navbar-text">{displayName}</span>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-danger" onClick={onLogout}>
                  Salir
                </button>
              </li>
            </ul>
          )}
        </div>
      </nav>

  </>

  );
};

