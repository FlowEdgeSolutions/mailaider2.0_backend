// Prompt-Vorlagen für die verschiedenen KI-Aktionen

const PROMPTS = {
  summarize: "Fasse folgende E-Mail zusammen:\n{base}",
  reply: "Formuliere eine höfliche Antwort auf diese E-Mail im Tonfall {tone}:\n{base}",
  translate: "Übersetze die folgende E-Mail ins {language}:\n{base}",
  compose: "Verfasse eine neue E-Mail an {to} mit dem Betreff \"{subject}\". Zweck: {purpose}. Ton: {tone}.",
  system: "Du bist ein hilfreicher E-Mail-Assistent für die Region {region}."
};

module.exports = { PROMPTS }; 