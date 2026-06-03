import React, { useEffect, useState } from 'react';

const ChatAgent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let bootstrapScript = null;

    const initEmbeddedMessaging = () => {
      try {
        if (window.embeddedservice_bootstrap) {
          window.embeddedservice_bootstrap.settings.language = 'es';
          
          const container = document.getElementById('agentforce-chat-container');
          if (container) {
            window.embeddedservice_bootstrap.settings.targetElement = container;
          }
          
          window.embeddedservice_bootstrap.init(
            '00Dg500000ApMtZ',
            'Agente_SaludVision_Prod',
            'https://orgfarm-5f6fd17f81-dev-ed.develop.my.site.com/ESWAgenteSaludVisionPro1780452286431',
            {
              scrt2URL: 'https://orgfarm-5f6fd17f81-dev-ed.develop.my.salesforce-scrt.com'
            }
          );
    
          // --- CAMBIO AQUÍ: INTENTAR ABRIR AUTOMÁTICAMENTE ---
          const autoOpenInterval = setInterval(() => {
            if (
              window.embeddedservice_bootstrap && 
              window.embeddedservice_bootstrap.utilAPI && 
              typeof window.embeddedservice_bootstrap.utilAPI.launchChat === 'function'
            ) {
              // Ejecuta el comando nativo para abrirlo
              window.embeddedservice_bootstrap.utilAPI.launchChat();
              // Limpia el intervalo para que deje de ejecutarse una vez abierto
              clearInterval(autoOpenInterval);
            }
          }, 300);
    
          // Limpieza de seguridad por si el componente se desmonta antes de tiempo
          setTimeout(() => clearInterval(autoOpenInterval), 10000);
    
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error cargando Embedded Messaging:', err);
        setHasError(true);
        setIsLoading(false);
      }
    };

    // Cargar el script de bootstrap
    bootstrapScript = document.createElement('script');
    bootstrapScript.type = 'text/javascript';
    bootstrapScript.src = 'https://orgfarm-5f6fd17f81-dev-ed.develop.my.site.com/ESWAgenteSaludVisionPro1780452286431/assets/js/bootstrap.min.js';
    
    bootstrapScript.onload = initEmbeddedMessaging;
    bootstrapScript.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };

    document.body.appendChild(bootstrapScript);

    return () => {
      if (bootstrapScript && document.body.contains(bootstrapScript)) {
        document.body.removeChild(bootstrapScript);
      }
    };
  }, []);

  if (hasError) {
    return (
      <div className="card h-[680px] flex flex-col items-center justify-center bg-gray-50 text-center p-8">
        <p className="text-red-600 mb-4">No se pudo cargar el asistente</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="card h-[680px] flex flex-col overflow-hidden shadow-xl border border-gray-200">
      {/* Encabezado Personalizado */}
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
      <div id="agentforce-chat-container" className="flex-1 bg-white relative embedded-chat-wrapper">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="text-sm text-gray-500">Cargando asistente...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatAgent;