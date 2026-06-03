import React, { useState, useEffect } from 'react';
import { Users, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import axios from 'axios';

const KPICards = () => {
  const [kpis, setKpis] = useState({
    highRiskPatients: 0,
    totalCases: 0,
    openCases: 0,
    efficiency: 82
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const [patientsRes, casesRes] = await Promise.all([
          axios.get('/api/patients'),
          axios.get('/api/cases')
        ]);

        setKpis({
          highRiskPatients: patientsRes.data.records?.length || 0,
          totalCases: casesRes.data.total || 0,
          openCases: casesRes.data.open || 0,
          efficiency: 82
        });
      } catch (error) {
        console.error("Error cargando KPIs:", error);
        // Datos fallback
        setKpis({ highRiskPatients: 4, totalCases: 26, openCases: 12, efficiency: 78 });
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[1,2,3,4].map(i => (
          <div key={i} className="card h-32 animate-pulse bg-gray-100"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div className="card">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Pacientes Alto Riesgo</p>
            <p className="text-5xl font-bold text-red-600 mt-2">{kpis.highRiskPatients}</p>
          </div>
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <p className="text-xs text-red-600 mt-4">Requieren atención prioritaria</p>
      </div>

      <div className="card">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Casos Totales</p>
            <p className="text-5xl font-bold text-blue-600 mt-2">{kpis.totalCases}</p>
          </div>
          <FileText className="w-10 h-10 text-blue-500" />
        </div>
        <p className="text-xs text-emerald-600 mt-4">{kpis.openCases} casos abiertos</p>
      </div>

      <div className="card">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Pacientes Activos</p>
            <p className="text-5xl font-bold text-emerald-600 mt-2">87</p>
          </div>
          <Users className="w-10 h-10 text-emerald-500" />
        </div>
        <p className="text-xs text-gray-500 mt-4">Este mes</p>
      </div>

      <div className="card">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Eficiencia Operativa</p>
            <p className="text-5xl font-bold text-amber-600 mt-2">{kpis.efficiency}%</p>
          </div>
          <TrendingUp className="w-10 h-10 text-amber-500" />
        </div>
        <p className="text-xs text-emerald-600 mt-4">+4% este mes</p>
      </div>
    </div>
  );
};

export default KPICards;