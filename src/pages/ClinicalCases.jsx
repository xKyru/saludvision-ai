import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

const ClinicalCases = () => {
  const [casesData, setCasesData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axios.get('/api/cases');
        const records = response.data.records || [];

        setCasesData(records);

        // Agrupación por prioridad (adaptado a valores en inglés)
        const priorityMap = records.reduce((acc, curr) => {
          let prio = curr.priority || 'Medium';
          
          // Normalizar nombres para mostrar bonito
          if (prio === 'High') prio = 'Alta';
          else if (prio === 'Medium') prio = 'Media';
          else if (prio === 'Low') prio = 'Baja';

          acc[prio] = (acc[prio] || 0) + 1;
          return acc;
        }, {});

        const formattedPriorities = Object.keys(priorityMap).map((key, index) => ({
          name: key,
          value: priorityMap[key],
          fill: COLORS[index % COLORS.length]
        }));

        setPriorityData(formattedPriorities);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cases:", err);
        setError(err.response?.data?.error || err.message || 'Error al cargar casos clínicos');
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const totalCases = casesData.length;
  const openCases = casesData.filter(c => 
    c.status === 'New' || c.status === 'Working' || c.status === 'Escalated' || !c.status
  ).length;

  const highPriorityCount = casesData.filter(c => c.priority === 'High' || c.priority === 'Alta').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-xl font-medium text-gray-600">Cargando casos clínicos desde Salesforce...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border border-red-200 bg-red-50 p-10 text-center max-w-2xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-red-700 mb-3">Error de Conexión</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="dashboard-title">Casos Clínicos</h1>
        <p className="text-xl text-gray-600 mt-2">Gestión y seguimiento de incidencias médicas</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="card">
          <p className="text-sm text-gray-500">Total de Casos</p>
          <p className="text-5xl font-bold text-blue-600 mt-3">{totalCases}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Casos Abiertos</p>
          <p className="text-5xl font-bold text-red-600 mt-3">{openCases}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Prioridad Alta</p>
          <p className="text-5xl font-bold text-orange-600 mt-3">{highPriorityCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Barras - Casos por Prioridad */}
        <div className="card p-6">
          <h3 className="section-title">Casos por Prioridad</h3>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={casesData.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="caseNumber" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="priorityScore" fill="#3b82f6" radius={[6, 6, 0, 0]} />   {/* Nota: puedes cambiar priorityScore por otro campo si lo deseas */}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico Circular - Distribución por Prioridad */}
        <div className="card p-6">
          <h3 className="section-title">Distribución por Prioridad</h3>
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla de Casos */}
      <div className="card mt-8">
        <h3 className="section-title">Casos Recientes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500">
                <th className="text-left py-4 px-4">Caso</th>
                <th className="text-left py-4 px-4">Asunto</th>
                <th className="text-left py-4 px-4">Prioridad</th>
                <th className="text-left py-4 px-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {casesData.slice(0, 8).map((c, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium">{c.caseNumber}</td>
                  <td className="py-4 px-4 text-gray-700">{c.subject}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium
                          ${c.priority === 'High' || c.priority === 'Alta' ? 'bg-red-100 text-red-700' : 
                            c.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-blue-100 text-blue-700'}`}>
                      {c.priority === 'High' ? 'Alta' : 
                       c.priority === 'Medium' ? 'Media' : 
                       c.priority === 'Low' ? 'Baja' : c.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-emerald-600 font-medium">{c.status || 'New'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClinicalCases;