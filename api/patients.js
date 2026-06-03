import jsforce from 'jsforce';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // 1. Autenticación Server-to-Server limpia sin contraseñas humanas
    const loginParams = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.SALESFORCE_CLIENT_ID,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET
    });

    const loginRes = await fetch(`${process.env.SALESFORCE_LOGIN_URL}/services/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: loginParams,
    });

    if (!loginRes.ok) {
      const errData = await loginRes.json();
      return res.status(401).json({ error: `Fallo de autenticación: ${errData.error_description || errData.error}` });
    }

    const { access_token, instance_url } = await loginRes.json();

    // 2. Conexión directa con JSforce mediante el token REST
    const conn = new jsforce.Connection({
      instanceUrl: instance_url,
      accessToken: access_token,
    });

    // 3. Tu query SOQL médico real (Asegúrate de que los campos existan en tus contactos de prueba)
    const query = "SELECT Name, Score_Riesgo__c, Condicion_Principal__c FROM Contact WHERE Score_Riesgo__c > 70 ORDER BY Score_Riesgo__c DESC";
    const result = await conn.query(query);

    // 4. Mapeo limpio para Recharts
    const formattedRecords = result.records.map(record => ({
      name: record.Name,
      score: record.Score_Riesgo__c || 0,
      condition: record.Condicion_Principal__c || 'No especificada',
    }));

    return res.status(200).json({ records: formattedRecords });

  } catch (error) {
    console.error('Error en el endpoint de pacientes:', error);
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
}