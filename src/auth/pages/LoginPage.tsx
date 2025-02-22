import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
import { Link as RouterLink } from 'react-router-dom';
import { FormValidations, useForm } from '../../hooks';
import { checkingAuthentication, startLoginWithEmailPassword } from '../../store/auth/thunks';
import { useAppDispatch } from '../../hooks/mapping'; // Asegúrate de que la ruta sea la correcta

const formData = {
    email: '',
    password: ''  
}

const formValidations: FormValidations  = {
  email: [ (value: any) => value.includes('@'), 'El correo debe tener una @'],
  password: [ (value: any) => value.length >= 6, 'El password debe de tener más de 6 letras'],
}

const LoginPage: React.FC = () => {
    
    const [error, setError] = useState<string>('');
    // const navigate = useNavigate();

    const { status, errorMessage } = useSelector((state: any) => state.auth);
    const dispatch = useAppDispatch();

    const { email, password, onInputChange, 
            isFormValid, emailValid, passwordValid
     } = useForm(formData, formValidations);

    // Si el status cambia, se volverá a obtener nuevo valor
    const isAuthenticating = useMemo( () => status === 'checking', [status] );


    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        let errorMessageValidation = '';
        if (emailValid != null) errorMessageValidation += emailValid + ' \n';
        if (passwordValid != null) errorMessageValidation += passwordValid;

        if (errorMessageValidation) {
          setError(errorMessageValidation);
          return; // Opcional: evita continuar si hay errores
        }

        if ( !isFormValid ) return;
      
        setError('');

        await dispatch( startLoginWithEmailPassword({ email, password }) );

    };

    return (
            <>

            <div className="container mt-5">
                <div className='row'>
                    <div className='col-6 offset-md-3'>
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h2 className="card-title mb-4 text-center">Iniciar Sesión</h2>
                                <form noValidate onSubmit={handleLogin} className="p-4">
                                    <div className="mb-3 text-start">
                                        <label htmlFor="email" className="form-label">Correo electrónico</label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={email}
                                            onChange={onInputChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mb-3 text-start">
                                        <label htmlFor="password" className="form-label">Contraseña</label>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            value={password}
                                            onChange={onInputChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">Ingresar</button>
                                    {
                                        (error && (
                                        <div className="mt-3 alert alert-danger">
                                            {error.split('\n').map((line, index) => (
                                            <p key={index} className="mb-0">{line}</p>
                                            ))}
                                        </div>
                                        )) || 
                                        (errorMessage && (
                                            <div className="mt-3 alert alert-danger">
                                                <p className="mb-0">{errorMessage}</p>
                                            </div>
                                        ))
                                    }
                                </form>
                                <div className="d-flex justify-content-end align-items-center mt-3">
                                    <RouterLink to="/auth/register" className="text-decoration-none">
                                    Crear una cuenta
                                    </RouterLink>
                                </div>                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>            



            
        </>
            
        );
    };


export default LoginPage;