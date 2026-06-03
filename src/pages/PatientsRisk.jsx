import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

const PatientsRisk = () => {
  const [patientsData, setPatientsData] = useState([]);
  const [conditionData, setConditionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('/api/patients');
        const records = response.data.records || [];

        setPatientsData(records);

        // Agrupación dinámica por condición para el PieChart
        const conditionMap = records.reduce((acc, curr) => {
          const cond = curr.condition || 'Sin especificar';
          acc[cond] = (acc[cond] || 0) + 1;
          return acc;
        }, {});

        const formattedConditions = Object.keys(conditionMap).map((key, index) => ({
          name: key,
          value: conditionMap[key],
          fill: COLORS[index % COLORS.length]
        }));

        setConditionData(formattedConditions);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError(err.response?.data?.error || err.message || 'Error al conectar con Salesforce');
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const totalPatients = patientsData.length;
  const averageScore = totalPatients > 0 
    ? (patientsData.reduce((sum, p) => sum + (p.score || 0), 0) / totalPatients).toFixed(1) 
    : '0.0';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
        <p className="text-xl font-medium text-gray-600">Cargando datos desde Salesforce...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border border-red-200 bg-red-50 p-10 text-center max-w-2xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-red-700 mb-3">Error de Conexión</h2>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="dashboard-title">Pacientes de Alto Riesgo</h1>
        <p className="text-xl text-gray-600 mt-2">Monitoreo en tiempo real desde Salesforce</p>
      </div>

      {/* KPI Cards Dinámicas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="card">
          <p className="text-sm text-gray-500">Pacientes en Alto Riesgo</p>
          <p className="text-5xl font-bold text-red-600 mt-3">{totalPatients}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Score Promedio</p>
          <p className="text-5xl font-bold text-orange-600 mt-3">{averageScore}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Condiciones Detectadas</p>
          <p className="text-5xl font-bold text-emerald-600 mt-3">{conditionData.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Barras */}
        <div className="card">
          <h3 className="section-title">Pacientes por Score de Riesgo</h3>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={patientsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico Circular */}
        <div className="card">
          <h3 className="section-title">Distribución por Condición</h3>
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie
                data={conditionData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {conditionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla */}
      <div className="card mt-8">
        <h3 className="section-title">Lista de Pacientes Críticos</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500">
                <th className="text-left py-4 px-4">Paciente</th>
                <th className="text-left py-4 px-4">Score de Riesgo</th>
                <th className="text-left py-4 px-4">Condición Principal</th>
              </tr>
            </thead>
            <tbody>
              {patientsData.map((p, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium">{p.name}</td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-red-600">{p.score}</span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{p.condition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientsRisk;