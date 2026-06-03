import React, { useEffect } from 'react';

const ChatAgent = () => {
  useEffect(() => {
    // === TU CÓDIGO DE EMBEDDING ===
    const initEmbeddedMessaging = () => {
      try {
        if (window.embeddedservice_bootstrap) {
          window.embeddedservice_bootstrap.settings.language = 'es'; // Español
          
          window.embeddedservice_bootstrap.init(
            '00Dg500000ApMtZ',
            'SaludVision_AI_Chat',
            'https://orgfarm-5f6fd17f81-dev-ed.develop.my.site.com/ESWSaludVisionAIChat1780461035752',
            {
              scrt2URL: 'https://orgfarm-5f6fd17f81-dev-ed.develop.my.salesforce-scrt.com'
            }
          );
        }
      } catch (err) {
        console.error('Error loading Embedded Messaging: ', err);
      }
    };

    // Cargar el script principal
    const bootstrapScript = document.createElement('script');
    bootstrapScript.type = 'text/javascript';
    bootstrapScript.src = 'https://orgfarm-5f6fd17f81-dev-ed.develop.my.site.com/ESWSaludVisionAIChat1780461035752/assets/js/bootstrap.min.js';
    bootstrapScript.onload = initEmbeddedMessaging;
    document.body.appendChild(bootstrapScript);

    return () => {
      document.body.removeChild(bootstrapScript);
    };
  }, []);

  return (
    <div className="card h-[680px] flex flex-col overflow-hidden shadow-xl border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-sky-600 p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-2xl">
            🤖
          </div>
          <div>
            <h3 className="font-semibold text-lg">SaludVision AI</h3>
            <p className="text-sm opacity-90">Asistente Inteligente • En línea</p>
          </div>
        </div>
      </div>

      {/* Contenedor del Chat */}
      <div id="agentforce-chat-container" className="flex-1 bg-white relative">
        {/* Agentforce inyectará el chat aquí */}
      </div>
    </div>
  );
};

export default ChatAgent;