import ChatAgent from '../components/ChatAgent';
import KPICards from '../components/KPICards';

const Home = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="dashboard-title">Bienvenido a SaludVision AI</h1>
        <p className="text-xl text-gray-600 mt-2">
          Tu asistente inteligente para análisis clínico y operativo
        </p>
      </div>

      <KPICards />

      <div className="mt-10">
        <h2 className="section-title">Asistente IA</h2>
        <ChatAgent />
      </div>
    </div>
  );
};

export default Home;