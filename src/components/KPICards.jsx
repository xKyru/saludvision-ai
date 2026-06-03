import React from 'react';
import { Users, FileText, AlertTriangle, TrendingUp } from 'lucide-react';

const KPICards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      
      {/* Card 1 */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Pacientes Alto Riesgo</p>
            <p className="text-4xl font-bold text-red-600 mt-2">4</p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-600" />
          </div>
        </div>
        <p className="text-xs text-red-600 mt-4 flex items-center gap-1">
          <TrendingUp size={16} /> +2 desde el mes pasado
        </p>
      </div>

      {/* Card 2 */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Casos Totales</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">26</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            <FileText className="w-7 h-7 text-blue-600" />
          </div>
        </div>
        <p className="text-xs text-emerald-600 mt-4">12 abiertos</p>
      </div>

      {/* Card 3 */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Pacientes Activos</p>
            <p className="text-4xl font-bold text-emerald-600 mt-2">87</p>
          </div>
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
            <Users className="w-7 h-7 text-emerald-600" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">Este mes</p>
      </div>

      {/* Card 4 */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Eficiencia Operativa</p>
            <p className="text-4xl font-bold text-amber-600 mt-2">78%</p>
          </div>
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-amber-600" />
          </div>
        </div>
        <p className="text-xs text-emerald-600 mt-4">+5% vs mes anterior</p>
      </div>

    </div>
  );
};

export default KPICards;