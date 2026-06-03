import jsforce from 'jsforce';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // 1. Autenticación con Client Credentials (Server-to-Server)
    const loginParams = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.SALESFORCE_CLIENT_ID,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET,
    });

    const loginRes = await fetch(`${process.env.SALESFORCE_LOGIN_URL}/services/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: loginParams,
    });

    if (!loginRes.ok) {
      const errData = await loginRes.json();
      console.error("Error de login:", errData);
      return res.status(401).json({ 
        error: `Fallo de autenticación: ${errData.error_description || errData.error}` 
      });
    }

    const { access_token, instance_url } = await loginRes.json();

    // 2. Conexión con jsforce
    const conn = new jsforce.Connection({
      instanceUrl: instance_url,
      accessToken: access_token,
    });

    // 3. Query SOQL usando Account (Person Account)
    const query = `
      SELECT Name, Risk_Score__c, Condicion_Principal__c 
      FROM Account 
      WHERE Risk_Score__c > 70 
      ORDER BY Risk_Score__c DESC 
      LIMIT 10
    `;

    const result = await conn.query(query);

    // 4. Formateo para Recharts / Frontend
    const formattedRecords = result.records.map(record => ({
      name: record.Name,
      score: record.Risk_Score__c || 0,
      condition: record.Condicion_Principal__c || 'No especificada',
    }));

    return res.status(200).json({ 
      records: formattedRecords,
      total: formattedRecords.length 
    });

  } catch (error) {
    console.error('Error en el endpoint /api/patients:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor', 
      message: error.message 
    });
  }
}