import React from 'react';

export const CheckingAuth: React.FC = () => {
  return (
    <div className="d-flex align-items-center justify-content-center bg-primary min-vh-100 p-4">
      <div className="spinner-border text-warning" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );
};
