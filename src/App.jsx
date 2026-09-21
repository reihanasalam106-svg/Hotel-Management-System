import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ReservationProvider, useReservations } from './context/ReservationContext';
import { Toast } from './components/common/Toast';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './styles/global.css';

function AppContent() {
  const { toast, hideToast } = useReservations();
  return (
    <>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ReservationProvider>
          <AppContent />
        </ReservationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
