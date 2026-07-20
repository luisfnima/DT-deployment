import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Scheduler } from './components/Scheduler';
import { Destinatarios } from './components/Destinatarios';
import { Reportes } from './components/Reportes';
import { Historial } from './components/Historial';
import { Logs } from './components/Logs';
import { Configuracion } from './components/Configuracion';
import { ToastContainer } from './components/Toast';
import type { ToastMessage, ToastType } from './components/Toast';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard addToast={addToast} />;
      case 'scheduler':
        return <Scheduler addToast={addToast} />;
      case 'destinatarios':
        return <Destinatarios addToast={addToast} />;
      case 'reportes':
        return <Reportes />;
      case 'historial':
        return <Historial />;
      case 'logs':
        return <Logs />;
      case 'configuracion':
        return <Configuracion addToast={addToast} />;
      default:
        return <Dashboard addToast={addToast} />;
    }
  };

  return (
    <div className="flex bg-dark-bg min-h-screen">
      {/* Sidebar navigation */}
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main content viewport */}
      <main className="flex-1 px-8 py-6 overflow-y-auto max-h-screen">
        {renderContent()}
      </main>

      {/* Global Toasts */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
