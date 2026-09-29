module.exports = async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Code Discord manquant.");
  }

  const redirectUri =
    "https://p-le-illegal.vercel.app/api/auth/discord/callback";

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: redirectUri
  });

  const credentials = Buffer.from(
    `${process.env.DISCORD_CLIENT_ID}:${process.env.DISCORD_CLIENT_SECRET}`
  ).toString("base64");

  try {
    const tokenResponse = await fetch(
      "https://discord.com/api/v10/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${credentials}`
        },
        body: body.toString()
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res.status(400).json(tokenData);
    }

    const userResponse = await fetch(
      "https://discord.com/api/v10/users/@me",
      {
        headers: {
          "Authorization": `Bearer ${tokenData.access_token}`
        }
      }
    );

    const user = await userResponse.json();

    if (!userResponse.ok) {
      return res.status(400).json(user);
    }

    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Connexion réussie</title>
        <style>
          body {
            margin: 0;
            min-height: 100vh;
            background: #05070D;
            color: #F5F7FF;
            font-family: Arial, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .box {
            padding: 40px;
            border: 1px solid #1597FF;
            border-radius: 20px;
            background: #0f1423;
          }

          h1 {
            color: #65E6FF;
          }

          p {
            color: #B99CFF;
          }
        </style>
      </head>

      <body>
        <div class="box">
          <h1>Connexion réussie 🩷</h1>
          <p>Bienvenue ${user.username} !</p>
          <p>Ton compte Discord est bien connecté.</p>
        </div>
      </body>
      </html>
    `);

  } catch (error) {
    return res.status(500).json({
      error: "Erreur serveur",
      details: error.message
    });
  }
};
