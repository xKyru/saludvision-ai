import React, { useEffect } from 'react';

const ChatAgent = () => {
  useEffect(() => {
    // 1. Asignamos tu nueva función de inicialización directamente al objeto window
    window.initEmbeddedMessaging = function () {
      try {
        if (window.embeddedservice_bootstrap) {
          // Cambiado a 'es' para que la interfaz e instrucciones del chat estén en español
          window.embeddedservice_bootstrap.settings.language = 'es'; 
          
          window.embeddedservice_bootstrap.init(
            '00Dg500000ApMtZ',
            'Agente_SaludVision_Prod',
            'https://orgfarm-5f6fd17f81-dev-ed.develop.my.site.com/ESWAgenteSaludVisionPro1780452286431',
            {
              scrt2URL: 'https://orgfarm-5f6fd17f81-dev-ed.develop.my.salesforce-scrt.com'
            }
          );
        }
      } catch (err) {
        console.error('Error cargando Embedded Messaging de Agentforce: ', err);
      }
    };

    // 2. Creamos y cargamos el nuevo script bootstrap de tu Sitio Digital
    const bootstrapScript = document.createElement('script');
    bootstrapScript.type = 'text/javascript';
    bootstrapScript.src = 'https://orgfarm-5f6fd17f81-dev-ed.develop.my.site.com/ESWAgenteSaludVisionPro1780452286431/assets/js/bootstrap.min.js';
    
    // Al cargarse completamente, dispara la inicialización segura
    bootstrapScript.onload = () => {
      if (typeof window.initEmbeddedMessaging === 'function') {
        window.initEmbeddedMessaging();
      }
    };

    document.body.appendChild(bootstrapScript);

    // 3. Limpieza al desmontar el componente (evita duplicación del chat si el usuario navega a otra sección)
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

      {/* Contenedor donde Agentforce inyectará el widget */}
      <div id="agentforce-chat-container" className="flex-1 bg-white relative">
        {/* Aquí renderizará de manera nativa */}
      </div>
    </div>
  );
};

export default ChatAgent;