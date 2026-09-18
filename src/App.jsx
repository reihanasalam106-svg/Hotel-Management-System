import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { ReservationProvider, useReservations } from './context/ReservationContext';
import { Toast } from './components/common/Toast';
import './styles/global.css';

function AppContent() {
  const { toast, hideToast } = useReservations();
  return (
    <>
      <AppRoutes />
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ReservationProvider>
        <AppContent />
      </ReservationProvider>
    </BrowserRouter>
  );
}

export default App;

