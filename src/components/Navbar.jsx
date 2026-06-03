import { Link, useLocation } from 'react-router-dom';
import { Home, Users, FileText, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">SaludVision AI</h1>
              <p className="text-xs text-gray-500 -mt-1">Clínica SaludIntegral</p>
            </div>
          </div>

          <div className="flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link to="/" className={`flex items-center gap-2 hover:text-blue-600 transition-colors ${location.pathname === '/' ? 'text-blue-600 font-semibold' : ''}`}>
              <Home size={20} /> Inicio
            </Link>
            <Link to="/patients-risk" className={`flex items-center gap-2 hover:text-blue-600 transition-colors ${location.pathname === '/patients-risk' ? 'text-blue-600 font-semibold' : ''}`}>
              <Users size={20} /> Pacientes
            </Link>
            <Link to="/clinical-cases" className={`flex items-center gap-2 hover:text-blue-600 transition-colors ${location.pathname === '/clinical-cases' ? 'text-blue-600 font-semibold' : ''}`}>
              <FileText size={20} /> Casos
            </Link>
            <Link to="/operations" className={`flex items-center gap-2 hover:text-blue-600 transition-colors ${location.pathname === '/operations' ? 'text-blue-600 font-semibold' : ''}`}>
              <BarChart3 size={20} /> Operaciones
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;