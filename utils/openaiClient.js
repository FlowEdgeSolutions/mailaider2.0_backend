const axios = require('axios');

/**
 * Sendet einen Prompt an Azure OpenAI (Chat Completions API).
 * Erwartet, dass folgende Umgebungsvariablen gesetzt sind:
 * - AZURE_OPENAI_KEY
 * - AZURE_OPENAI_ENDPOINT (z.B. https://dein-resource-name.openai.azure.com)
 * - AZURE_OPENAI_DEPLOYMENT (z.B. gpt-4)
 * - AZURE_OPENAI_API_VERSION (optional, Standard: 2024-02-15-preview)
 */
async function callOpenAI(prompt) {
  require('dotenv').config();
  const apiKey = process.env.AZURE_OPENAI_KEY;
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview';

  if (!apiKey || !endpoint || !deployment) {
    throw new Error('Azure OpenAI-Konfiguration fehlt. Bitte prüfe die .env-Datei.');
  }

  // Baue die Azure OpenAI-URL
  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

  // Debug-Ausgabe der tatsächlichen Werte
  console.log('Azure OpenAI Request:', {
    endpoint,
    deployment,
    apiVersion,
    url
  });

  try {
    const response = await axios.post(
      url,
      {
        messages: [{ role: 'user', content: prompt }],
        // Optional: weitere Parameter wie max_tokens, temperature etc.
      },
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    // Die Antwort extrahieren
    return response.data.choices[0].message.content;
  } catch (err) {
    throw new Error('Fehler bei der Anfrage an Azure OpenAI: ' + (err.response?.data?.error?.message || err.message));
  }
}

module.exports = { callOpenAI };