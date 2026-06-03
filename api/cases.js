import jsforce from 'jsforce';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // 1. Autenticación
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
      return res.status(401).json({ 
        error: `Fallo de autenticación: ${errData.error_description || errData.error}` 
      });
    }

    const { access_token, instance_url } = await loginRes.json();

    const conn = new jsforce.Connection({
      instanceUrl: instance_url,
      accessToken: access_token,
    });

    // 2. Query SOQL para Casos
    const query = `
      SELECT Id, CaseNumber, Subject, Priority, Status, CreatedDate, Account.Name 
      FROM Case 
      ORDER BY CreatedDate DESC 
      LIMIT 20
    `;

    const result = await conn.query(query);

    // 3. Formateo para el frontend
    const formattedRecords = result.records.map(record => ({
      id: record.Id,
      caseNumber: record.CaseNumber,
      subject: record.Subject || 'Sin asunto',
      priority: record.Priority || 'Media',
      status: record.Status || 'Open',
      createdDate: record.CreatedDate,
      accountName: record.Account ? record.Account.Name : 'Sin paciente',
    }));

    // Conteos útiles
    const openCases = formattedRecords.filter(c => c.status === 'Open' || c.status === 'New').length;
    const highPriority = formattedRecords.filter(c => c.priority === 'Alta').length;

    return res.status(200).json({
      records: formattedRecords,
      total: formattedRecords.length,
      open: openCases,
      highPriority: highPriority
    });

  } catch (error) {
    console.error('Error en el endpoint /api/cases:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor', 
      message: error.message 
    });
  }
}