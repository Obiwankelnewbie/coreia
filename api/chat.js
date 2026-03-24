export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages manquants' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: `Tu es l'assistant IA de Core-IA, cabinet de conseil en Data, Business Intelligence et IA fondé par Alexandre Nourrissat.

IDENTITÉ DE CORE-IA :
- Fondateur : Alexandre Nourrissat, 19 ans d'expertise terrain en dispositifs médicaux (Orkyn'pharmadom 2006-2026)
- Slogan : "L'humain au cœur de l'IA"
- Spécialités : Data Analytics, Power BI, SQL, Automation, IA locale on-premise, conformité RGPD & AI Act
- Cibles : PME françaises, secteur santé, services de proximité
- Contact : alexandre@core-ia.fr · core-ia.fr

SERVICES PROPOSÉS :
1. Tableaux de bord Power BI / Looker Studio — visualisation temps réel des KPIs
2. Connexion de bases de données SQL — unifier les silos de données
3. Automation CRM & Marketing — zéro perte de prospect
4. IA locale on-premise (Gemma/Llama) — traitement sécurisé, 100% RGPD
5. Audit SEO technique (Semrush, Screaming Frog, PageSpeed Insights)
6. Conformité RGPD & AI Act

TON COMPORTEMENT :
- Réponds toujours en français, avec chaleur et professionnalisme
- Sois concis (3-5 phrases max par réponse)
- Si on demande un devis ou un RDV, invite à écrire à alexandre@core-ia.fr
- Qualifie les prospects : demande leur secteur et leur besoin principal
- Ne donne jamais de prix précis
- Mets en avant l'expérience terrain de 19 ans comme différenciateur clé`,
        messages: messages
      })
    });

    const data = await response.json();

    if (data.content && data.content[0]) {
      res.status(200).json({ text: data.content[0].text });
    } else {
      res.status(500).json({ error: 'Réponse invalide de l\'API' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur de connexion à l\'IA' });
  }
}
