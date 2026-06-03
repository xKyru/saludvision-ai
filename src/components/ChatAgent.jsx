import React, { useEffect } from 'react';

const ChatAgent = () => {
  useEffect(() => {
    // === CÓDIGO DE EMBEDDING DE AGENTFORCE ===
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      function initEmbeddedMessaging() {
        try {
          embeddedservice_bootstrap.settings.language = 'es'; 
          embeddedservice_bootstrap.init(
            '00Dg500000ApMtZ',
            'Agente_de_Servicio_de_Agentforce',
            'https://orgfarm-5f6fd17f81-dev-ed.develop.my.site.com/ESWAgentedeServiciode1780107216442',
            {
              scrt2URL: 'https://orgfarm-5f6fd17f81-dev-ed.develop.my.salesforce-scrt.com'
            }
          );
        } catch (err) {
          console.error('Error loading Embedded Messaging: ', err);
        }
      }
    `;
    document.body.appendChild(script);

    // Cargar el script bootstrap
    const bootstrapScript = document.createElement('script');
    bootstrapScript.type = 'text/javascript';
    bootstrapScript.src = 'https://orgfarm-5f6fd17f81-dev-ed.develop.my.site.com/ESWAgentedeServiciode1780107216442/assets/js/bootstrap.min.js';
    bootstrapScript.onload = () => {
      if (typeof initEmbeddedMessaging === 'function') {
        initEmbeddedMessaging();
      }
    };
    document.body.appendChild(bootstrapScript);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(bootstrapScript);
    };
  }, []);

  return (
    <div className="card h-[680px] flex flex-col overflow-hidden shadow-xl border border-gray-200">
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

      <div id="agentforce-chat-container" className="flex-1 bg-white relative">
        {/* El chat de Agentforce se cargará aquí */}
      </div>
    </div>
  );
};

export default ChatAgent;