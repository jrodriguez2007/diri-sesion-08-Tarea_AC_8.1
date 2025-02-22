
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormValidations, useForm } from '../../hooks';
import { startCreatingUserWithEmailPassword } from '../../store/auth';
import { useAppDispatch } from '../../hooks/mapping';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

const formData = {
  email: '',
  password: '',
  displayName: ''
}

const formValidations: FormValidations  = {
  email: [ (value: any) => value.includes('@'), 'El correo debe tener una @'],
  password: [ (value: any) => value.length >= 6, 'El password debe de tener más de 6 letras'],
  displayName: [ (value) => value.length >= 1, 'El nombre es obligatorio'],
}

const RegisterPage: React.FC = () => {

  const dispatch = useAppDispatch();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  const { status, errorMessage } = useSelector( (state: any) => state.auth );
  const isCheckingAuthentication = useMemo(() => status === 'checking', [status]);
  
   const { formState, displayName, email, password, onInputChange,  
           isFormValid, emailValid, passwordValid, displayNameValid
   } = useForm(formData, formValidations);
   
  const handleRegister = async (e:
    React.FormEvent<HTMLFormElement>) => {
      
      e.preventDefault();
      
      let errorMessageValid = '';
      if (displayNameValid != null) errorMessageValid += displayNameValid + ' \n';
      if (emailValid != null) errorMessageValid += emailValid + ' \n';
      if (passwordValid != null) errorMessageValid += passwordValid;
      
      if (errorMessageValid) {
        setError(errorMessageValid);
        return; // Opcional: evita continuar si hay errores
      }

      // TODO: agregar código adicional  
      if ( !isFormValid ) return;
      
      setError('');

      try 
      {
        await dispatch(startCreatingUserWithEmailPassword(formState));
        // const resultAction = await dispatch(startCreatingUserWithEmailPassword(formState));
        // if (startCreatingUserWithEmailPassword.rejected.match(resultAction)) {
        //   setError(resultAction.payload as string);
        //   return;
        // }

        // setSuccess('Registro exitoso. Redirigiendo al Dashboard...');
        // setTimeout(() => {}, 2000);
      } 
      catch (error: any) 
      {
        console.error("Error al registrarse:", error);
        setError(error.message);
      }
    };
    

  return (
    <div className="container mt-5">

      <div className='row'>
        <div className='col-6 offset-md-3'>

          <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="card-title mb-4 text-center">Registrarse</h2>
            <form noValidate onSubmit={handleRegister}>
              <div className="mb-3 text-start">
                <label htmlFor="displayName" className="form-label">Nombre de usuario</label>
                <input
                  type="text"
                  name="displayName"
                  id="displayName"
                  placeholder="Nombres y Apellidos"
                  value={displayName}
                  onChange={onInputChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3 text-start">
                <label htmlFor="email" className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email válido"
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
                  placeholder="Al menos 6 caracteres"
                  value={password}
                  onChange={onInputChange}
                  className="form-control"
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Registrarse</button>
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
              {success && (
                <div className="mt-3 alert alert-success">
                  {success}
                </div>
              )}
            </form>

          
            <div className="d-flex justify-content-end align-items-center mt-3">
                <span className="me-2">¿Ya tienes una cuenta?</span>
                <RouterLink to="/auth/login" className="text-decoration-none">
                  Ingresar
                </RouterLink>
            </div>

          </div>
        </div>

        </div>
      </div>


    </div>
  );
};

export default RegisterPage;