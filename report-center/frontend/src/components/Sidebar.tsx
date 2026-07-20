import React from 'react';
import { 
  LayoutDashboard, 
  CalendarRange, 
  FileSpreadsheet, 
  History, 
  Terminal, 
  Settings,
  Flame,
  Users
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scheduler', label: 'Scheduler', icon: CalendarRange },
    { id: 'destinatarios', label: 'Destinatarios', icon: Users },
    { id: 'reportes', label: 'Reportes', icon: FileSpreadsheet },
    { id: 'historial', label: 'Historial', icon: History },
    { id: 'logs', label: 'Logs', icon: Terminal },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-dark-bg border-r border-dark-border flex flex-col justify-between h-screen sticky top-0">
      <div className="flex flex-col">
        {/* Brand / Logo */}
        <div className="h-16 flex items-center px-6 gap-3 border-b border-dark-border">
          <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center text-white shadow-lg shadow-brand-red/20">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-dark-text tracking-wide uppercase">DreamTeam</h1>
            <p className="text-[10px] text-dark-muted font-medium tracking-wider uppercase">Report Center</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-dark-card text-dark-text border-l-2 border-brand-red shadow-sm' 
                    : 'text-dark-muted hover:text-dark-text hover:bg-dark-card/50'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-brand-red' : 'text-dark-muted'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Session */}
      <div className="p-4 border-t border-dark-border bg-dark-card/20">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="w-8 h-8 rounded-full bg-dark-border border border-dark-border flex items-center justify-center font-bold text-xs text-brand-red">
            DT
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-semibold text-dark-text truncate">DreamTeam Admin</span>
            <span className="text-[10px] text-dark-muted truncate">operador@dreamteam.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
