import jsforce from 'jsforce';

export default async function handler(req, res) {
  // Asegurar que solo aceptemos peticiones GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const conn = new jsforce.Connection({
      loginUrl: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com'
    });

    // Autenticación usando el flujo de contraseña + token de seguridad externo
    const username = process.env.SALESFORCE_USERNAME;
    const passwordWithToken = process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_SECURITY_TOKEN;

    await conn.login(username, passwordWithToken);

    // Consulta SOQL usando JSforce (recuerda cambiar por tus API Names reales)
    const query = "SELECT Name, Score_Riesgo__c, Condicion_Principal__c FROM Contact WHERE Score_Riesgo__c > 70 ORDER BY Score_Riesgo__c DESC";
    
    const result = await conn.query(query);

    // Formatear los registros para Recharts
    const formattedRecords = result.records.map(record => ({
      name: record.Name,
      score: record.Score_Riesgo__c || 0,
      condition: record.Condicion_Principal__c || 'No especificada',
    }));

    return res.status(200).json({ records: formattedRecords });

  } catch (error) {
    console.error('Error en la API de Salesforce:', error);
    return res.status(500).json({ error: 'Fallo al conectar con Salesforce: ' + error.message });
  }
}