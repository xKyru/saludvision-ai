import ChatAgent from '../components/ChatAgent';
import KPICards from '../components/KPICards';

const Home = () => {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="dashboard-title text-4xl">Bienvenido a SaludVision AI</h1>
        <p className="text-2xl text-gray-600 mt-3">
          Tu asistente inteligente para la toma de decisiones clínicas y operativas
        </p>
      </div>

      <KPICards />

      <div>
        <h2 className="section-title text-3xl mb-6">Asistente IA</h2>
        <ChatAgent />
      </div>

      <div className="text-center text-sm text-gray-500 pt-8 border-t">
        Datos en tiempo real desde Salesforce • Actualizado automáticamente
      </div>
    </div>
  );
};

export default Home;