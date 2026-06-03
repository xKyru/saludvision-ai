import React, { useEffect } from 'react';

const ChatAgent = () => {
  useEffect(() => {
    // 1. Asignamos la función de inicialización directamente a window para que bootstrap.min.js la encuentre sin problemas
    window.initEmbeddedMessaging = function () {
      try {
        if (window.embeddedservice_bootstrap) {
          window.embeddedservice_bootstrap.settings.language = 'es'; 
          window.embeddedservice_bootstrap.init(
            '00Dg500000ApMtZ',
            'Agente_de_Servicio_de_Agentforce',
            'https://orgfarm-5f6fd17f81-dev-ed.develop.my.site.com/ESWAgentedeServiciode1780107216442',
            {
              scrt2URL: 'https://orgfarm-5f6fd17f81-dev-ed.develop.my.salesforce-scrt.com'
            }
          );
        }
      } catch (err) {
        console.error('Error cargando Embedded Messaging de Agentforce: ', err);
      }
    };

    // 2. Creamos y cargamos el script bootstrap oficial de tu org de Salesforce
    const bootstrapScript = document.createElement('script');
    bootstrapScript.type = 'text/javascript';
    bootstrapScript.src = 'https://orgfarm-5f6fd17f81-dev-ed.develop.my.site.com/ESWAgentedeServiciode1780107216442/assets/js/bootstrap.min.js';
    
    bootstrapScript.onload = () => {
      if (typeof window.initEmbeddedMessaging === 'function') {
        window.initEmbeddedMessaging();
      }
    };

    document.body.appendChild(bootstrapScript);

    // 3. Limpieza: Al desmontar el componente eliminamos el script y la función global para evitar fugas de memoria
    return () => {
      if (document.body.contains(bootstrapScript)) {
        document.body.removeChild(bootstrapScript);
      }
      delete window.initEmbeddedMessaging;
    };
  }, []);

  return (
    <div className="card h-[680px] flex flex-col overflow-hidden shadow-xl border border-gray-200">
      {/* Encabezado del Chat */}
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

      {/* Contenedor del Chat de Agentforce */}
      <div id="agentforce-chat-container" className="flex-1 bg-white relative">
        {/* Aquí se inyectará el widget nativo de Salesforce */}
      </div>
    </div>
  );
};

export default ChatAgent;