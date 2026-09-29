module.exports = function handler(req, res) {
  const clientId = process.env.DISCORD_CLIENT_ID;

  const redirectUri =
    "https://p-le-illegal.vercel.app/api/auth/discord/callback";

  if (!clientId) {
    return res.status(500).send("DISCORD_CLIENT_ID manquant.");
  }

  const discordUrl =
    "https://discord.com/oauth2/authorize" +
    "?client_id=" + encodeURIComponent(clientId) +
    "&response_type=code" +
    "&redirect_uri=" + encodeURIComponent(redirectUri) +
    "&scope=" + encodeURIComponent("identify");

  res.writeHead(302, {
    Location: discordUrl
  });

  res.end();
};
