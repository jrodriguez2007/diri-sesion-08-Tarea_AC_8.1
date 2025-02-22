import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthRoutes } from '../auth/routes/AuthRoutes';
import { FoodRoutes } from '../food/routes/FoodRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { CheckingAuth } from '../ui/Componentes/CheckingAuth';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/Config';
import { login, logout } from '../store/auth';

export const AppRouter = () => {

  const { status } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {

    onAuthStateChanged(auth, async (user: any) => {
      // console.log(user);
      if ( !user ) return dispatch( logout(null) );
      const { uid, email, displayName, photoURL } = user;
      dispatch(login({ uid, email, displayName, photoURL }))
    })

  }, [])

  // if (status == 'checking'){
  //   return <CheckingAuth />
  // }

  return (
    <Routes>

        {
          (status === 'authenticated')
          ? <Route path="/*" element={ <FoodRoutes /> } />
          : <Route path="/auth/*" element={ <AuthRoutes /> } />
        }

        {/* Puede que la persona quiera acceder a otro url, en ese caso se redirecciona a /auth/url */}
        <Route path='/*' element={ <Navigate to={'/auth/login'} /> } ></Route>


    </Routes>
  )
}
