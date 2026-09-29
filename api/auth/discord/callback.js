export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Code Discord manquant.");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.DISCORD_REDIRECT_URI
  });

  const credentials = Buffer.from(
    `${process.env.DISCORD_CLIENT_ID}:${process.env.DISCORD_CLIENT_SECRET}`
  ).toString("base64");

  const tokenResponse = await fetch(
    "https://discord.com/api/v10/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${credentials}`
      },
      body
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

  res.status(200).send(
    `Connexion Discord réussie ! Bienvenue ${user.username}.`
  );
}
