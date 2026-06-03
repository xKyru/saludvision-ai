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
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axios.get('/api/cases');
        const records = response.data.records || [];

        setCasesData(records);

        // === Agrupación por Prioridad ===
        const priorityMap = records.reduce((acc, curr) => {
          let prio = curr.priority || 'Medium';
          if (prio === 'High') prio = 'Alta';
          else if (prio === 'Medium') prio = 'Media';
          else if (prio === 'Low') prio = 'Baja';

          acc[prio] = (acc[prio] || 0) + 1;
          return acc;
        }, {});

        setPriorityData(Object.keys(priorityMap).map((key, index) => ({
          name: key,
          value: priorityMap[key],
          fill: COLORS[index % COLORS.length]
        })));

        // === Agrupación por Estado (Nuevo) ===
        const statusMap = records.reduce((acc, curr) => {
          const status = curr.status || 'New';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        setStatusData(Object.keys(statusMap).map((key, index) => ({
          name: key,
          value: statusMap[key],
          fill: COLORS[index % COLORS.length]
        })));

        setLoading(false);
      } catch (err) {
        console.error("Error fetching cases:", err);
        setError(err.response?.data?.error || err.message);
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const totalCases = casesData.length;
  const openCases = casesData.filter(c => 
    c.status === 'New' || c.status === 'Working' || c.status === 'Escalated'
  ).length;

  const highPriorityCount = casesData.filter(c => 
    c.priority === 'High' || c.priority === 'Alta'
  ).length;

  if (loading) return <div className="flex flex-col items-center justify-center p-20">Cargando...</div>;
  if (error) return <div className="card p-10 text-red-600 text-center">{error}</div>;

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
        {/* Gráfico de Barras - Casos por Estado */}
        <div className="card p-6">
          <h3 className="section-title">Casos por Estado</h3>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
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

      {/* Tabla de Casos Recientes */}
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
              {casesData.slice(0, 10).map((c, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium">{c.caseNumber}</td>
                  <td className="py-4 px-4 text-gray-700">{c.subject}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium
                          ${(c.priority === 'High' || c.priority === 'Alta') ? 'bg-red-100 text-red-700' : 
                            c.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-blue-100 text-blue-700'}`}>
                      {c.priority === 'High' ? 'Alta' : c.priority === 'Medium' ? 'Media' : 'Baja'}
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