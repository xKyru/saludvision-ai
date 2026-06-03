import jsforce from 'jsforce';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // 1. Obtener el Token de Acceso usando el flujo OAuth2 REST estándar
    const loginParams = new URLSearchParams({
      grant_type: 'password',
      client_id: process.env.SALESFORCE_CLIENT_ID,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET,
      username: process.env.SALESFORCE_USERNAME,
      password: process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_SECURITY_TOKEN,
    });

    const loginRes = await fetch(`${process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com'}/services/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: loginParams,
    });

    if (!loginRes.ok) {
      const errData = await loginRes.json();
      console.error('Error al solicitar Token OAuth2:', errData);
      return res.status(401).json({ error: `Error de autenticación OAuth2: ${errData.error_description || errData.error}` });
    }

    const { access_token, instance_url } = await loginRes.json();

    // 2. Inicializar JSforce usando directamente el Token REST obtenido (Bypasseando SOAP)
    const conn = new jsforce.Connection({
      instanceUrl: instance_url,
      accessToken: access_token,
    });

    // 3. Ejecutar la consulta SOQL
    const query = "SELECT Name, Score_Riesgo__c, Condicion_Principal__c FROM Contact WHERE Score_Riesgo__c > 70 ORDER BY Score_Riesgo__c DESC";
    const result = await conn.query(query);

    // 4. Formatear la respuesta para el componente de Recharts
    const formattedRecords = result.records.map(record => ({
      name: record.Name,
      score: record.Score_Riesgo__c || 0,
      condition: record.Condicion_Principal__c || 'No especificada',
    }));

    return res.status(200).json({ records: formattedRecords });

  } catch (error) {
    console.error('Error en el servidor intermediario:', error);
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
}