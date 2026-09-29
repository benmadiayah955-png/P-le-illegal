export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Code Discord manquant.");
  }

  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.DISCORD_REDIRECT_URI
  });

  const tokenResponse = await fetch(
    "https://discord.com/api/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params
    }
  );

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok) {
    return res.status(400).json(tokenData);
  }

  const userResponse = await fetch(
    "https://discord.com/api/users/@me",
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    }
  );

  const user = await userResponse.json();

  if (!userResponse.ok) {
    return res.status(400).json(user);
  }

  res.status(200).send(
    `Connexion Discord réussie ! Bienvenue ${user.username}.`
  );
}
