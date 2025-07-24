const express = require('express');
const router = express.Router();

// Importiere die Utility-Funktion für den OpenAI-Call
const { callOpenAI } = require('../utils/openaiClient');
// Importiere die Prompt-Vorlagen
const { PROMPTS } = require('../utils/prompts');

/**
 * POST /ai
 * Erwartet: { action, emailContent, settings, customPrompt, recipientName, composeContext }
 * Antwort: { result: "..." }
 */
router.post('/', async (req, res) => {
  const { action, emailContent, settings = {}, customPrompt, recipientName, composeContext } = req.body;

  // Prompt-Logik ins Backend verlagert
  let prompt = '';
  const base = `E-Mail-Inhalt:\n${emailContent ?? ''}\n` +
               `Einstellungen: Ton=${settings.tone || ''}, ` +
               `Länge=${settings.length || ''}, ` +
               `Sprache=${settings.language || ''}\n`;

  switch (action) {
    case 'summarize':
      prompt = PROMPTS.summarize.replace('{base}', base);
      console.log("[DEBUG] Prompt für Zusammenfassung:", prompt); // Debug-Log
      break;
    case 'reply':
      prompt = PROMPTS.reply
        .replace('{base}', base)
        .replace('{tone}', settings.tone || 'neutral');
      break;
    case 'translate':
      prompt = PROMPTS.translate
        .replace('{language}', settings.language || 'Deutsch')
        .replace('{base}', base);
      break;
    case 'compose':
      if (composeContext) {
        prompt = PROMPTS.compose
          .replace('{to}', composeContext.to?.join(', ') || '')
          .replace('{subject}', composeContext.subject || '')
          .replace('{purpose}', composeContext.purpose || '')
          .replace('{tone}', settings.tone || '');
      } else {
        prompt = `Verfasse eine neue E-Mail. ${base}`;
      }
      break;
    case 'custom':
      prompt = `${base}${customPrompt || ''}`;
      break;
    default:
      prompt = customPrompt || base;
  }

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt konnte nicht generiert werden.' });
  }

  try {
    // Anfrage an OpenAI stellen
    const result = await callOpenAI(prompt);
    if (action === 'summarize') {
      console.log("[DEBUG] OpenAI-Antwort für Zusammenfassung:", result); // Debug-Log
    }
    return res.json({ result });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Fehler bei der KI-Anfrage.' });
  }
});

module.exports = router;