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

// Paleta de colores para las condiciones médicas asignadas dinámicamente
const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

const PatientsRisk = () => {
  const [patientsData, setPatientsData] = useState([]);
  const [conditionData, setConditionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientsData = async () => {
      try {
        // Petición a tu Serverless Function en Vercel (/api/patients.js)
        const response = await axios.get('/api/patients');
        const records = response.data.records || [];

        setPatientsData(records);

        // 1. Agrupación y conteo dinámico de condiciones para el gráfico circular (PieChart)
        const uniqueConditions = records.reduce((acc, curr) => {
          acc[curr.condition] = (acc[curr.condition] || 0) + 1;
          return acc;
        }, {});

        // 2. Formatear el mapa de condiciones al formato que requiere Recharts
        const formattedConditions = Object.keys(uniqueConditions).map((key, index) => ({
          name: key,
          value: uniqueConditions[key],
          fill: COLORS[index % COLORS.length] // Cicla los colores si hay más de 6 condiciones
        }));

        setConditionData(formattedConditions);
        setLoading(false);
      } catch (err) {
        console.error("Error capturado en el frontend:", err);
        // Captura el mensaje de error personalizado enviado por tu backend o el error de red
        setError(err.response?.data?.error || err.message || 'Error desconocido al conectar con la API.');
        setLoading(false);
      }
    };

    fetchPatientsData();
  }, []);

  // 3. Cálculos de métricas en tiempo real basados en los datos de Salesforce
  const totalPatients = patientsData.length;
  
  const averageScore = totalPatients > 0 
    ? (patientsData.reduce((sum, p) => sum + p.score, 0) / totalPatients).toFixed(1) 
    : '0.0';

  const uniqueConditionsCount = conditionData.length;

  // Renderizado en estado de carga
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
        <p className="text-xl font-medium text-gray-600">Sincronizando expedientes clínicos desde Salesforce...</p>
      </div>
    );
  }

  // Renderizado en caso de error (Credenciales expiradas, problemas de red, nombres de API incorrectos, etc.)
  if (error) {
    return (
      <div className="card border border-red-200 bg-red-50 p-8 rounded-lg max-w-2xl mx-auto mt-10 text-center">
        <h2 className="text-2xl font-bold text-red-700 mb-3">Error de Conexión Clínico</h2>
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <p className="text-sm text-gray-500">
          Por favor, verifica tus variables de entorno en Vercel, el estado de tu External Client App o los nombres de API de tus campos en Salesforce.
        </p>
      </div>
    );
  }

  return (
    <div className="p-1">
      <div className="mb-8">
        <h1 className="dashboard-title text-3xl font-bold text-gray-900">Pacientes de Alto Riesgo</h1>
        <p className="text-xl text-gray-600 mt-2">
          Monitoreo y análisis de pacientes críticos en tiempo real desde Salesforce
        </p>
      </div>

      {/* KPI Cards Dinámicas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="card p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Pacientes en Riesgo</p>
          <p className="text-5xl font-bold text-red-600 mt-3">{totalPatients}</p>
          <p className="text-sm font-medium text-red-500 mt-2">Puntaje Score &gt; 70</p>
        </div>
        
        <div className="card p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Score de Riesgo Promedio</p>
          <p className="text-5xl font-bold text-orange-500 mt-3">{averageScore}</p>
          <p className="text-sm text-gray-400 mt-2">Media general crítica</p>
        </div>
        
        <div className="card p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Patologías Detectadas</p>
          <p className="text-5xl font-bold text-emerald-600 mt-3">{uniqueConditionsCount}</p>
          <p className="text-sm text-gray-400 mt-2">Condiciones de alta prioridad</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Barras - Pacientes por Score */}
        <div className="card p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Pacientes por Score de Riesgo</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={patientsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 13 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 13 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                itemStyle={{ color: '#ef4444', fontWeight: 'bold' }}
              />
              <Bar dataKey="score" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico Circular - Distribución por Patología */}
        <div className="card p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Distribución por Condición Médica</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={conditionData}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={115}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {conditionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla Dinámica de Pacientes Críticos */}
      <div className="card mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Lista de Pacientes Críticos</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-sm">
                <th className="text-left py-4 px-4 font-semibold">Paciente</th>
                <th className="text-left py-4 px-4 font-semibold">Score de Riesgo</th>
                <th className="text-left py-4 px-4 font-semibold">Condición Principal</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {patientsData.map((patient, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-medium text-gray-900">{patient.name}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold bg-red-50 text-red-700">
                      {patient.score}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600 font-medium">{patient.condition}</td>
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