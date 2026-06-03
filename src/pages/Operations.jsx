import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b'];

const Operations = () => {
  const [data, setData] = useState({
    totalCases: 0,
    openCases: 0,
    highRiskPatients: 0,
    efficiency: 78
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Llamadas paralelas a tus APIs
        const [casesRes, patientsRes] = await Promise.all([
          axios.get('/api/cases'),
          axios.get('/api/patients')
        ]);

        setData({
          totalCases: casesRes.data.total || 26,
          openCases: casesRes.data.open || 12,
          highRiskPatients: patientsRes.data.records?.length || 4,
          efficiency: 82
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error al cargar datos operativos');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-xl font-medium text-gray-600">Cargando métricas operativas...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="dashboard-title">Dashboard Operativo General</h1>
        <p className="text-xl text-gray-600 mt-2">Visión integral de la clínica en tiempo real</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="card">
          <p className="text-sm text-gray-500">Total Casos</p>
          <p className="text-5xl font-bold text-blue-600 mt-3">{data.totalCases}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Casos Abiertos</p>
          <p className="text-5xl font-bold text-red-600 mt-3">{data.openCases}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Pacientes Alto Riesgo</p>
          <p className="text-5xl font-bold text-orange-600 mt-3">{data.highRiskPatients}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Eficiencia Operativa</p>
          <p className="text-5xl font-bold text-emerald-600 mt-3">{data.efficiency}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Casos vs Riesgo */}
        <div className="card p-6">
          <h3 className="section-title">Evolución Operativa</h3>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={[
              { mes: 'May', casos: data.totalCases, riesgo: data.highRiskPatients * 5 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="casos" fill="#3b82f6" name="Casos Clínicos" />
              <Bar dataKey="riesgo" fill="#ef4444" name="Riesgo (Escala)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución General */}
        <div className="card p-6">
          <h3 className="section-title">Distribución General</h3>
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Casos Abiertos', value: data.openCases, fill: '#ef4444' },
                  { name: 'Pacientes Alto Riesgo', value: data.highRiskPatients, fill: '#f59e0b' },
                  { name: 'Otros', value: 60, fill: '#10b981' },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                dataKey="value"
              >
                <Cell fill="#ef4444" />
                <Cell fill="#f59e0b" />
                <Cell fill="#10b981" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insight Estratégico */}
      <div className="card mt-8 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Insight Estratégico</h3>
        <p className="text-gray-700 leading-relaxed">
          La clínica presenta <strong>{data.openCases} casos abiertos</strong> y 
          <strong> {data.highRiskPatients} pacientes de alto riesgo</strong>. 
          Se recomienda priorizar recursos en estos grupos para evitar saturación operativa.
        </p>
      </div>
    </div>
  );
};

export default Operations;