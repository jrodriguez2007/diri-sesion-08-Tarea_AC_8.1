import { useEffect } from 'react';
import LoggerService from '../src/auth/services/LoggerService';
import ErrorBoundary from './ui/Componentes/ErrorBoundaryComponent';
import EnergyComponent from './ui/Componentes/EnergyComponent';
import FoodPage from '../src/food/pages/FoodPage';
import './App.css'
import { AppRouter } from './router/AppRouter';

function App() {

  useEffect(() => {
    LoggerService.debug("Debug level log");
    LoggerService.info("Info level log");
    LoggerService.warn("Warning level log");
    LoggerService.error("Error level log");
  }, []);

  return (
    <>
      <AppRouter />
    </>
  )
}

export default App
