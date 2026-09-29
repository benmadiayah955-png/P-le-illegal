export default function handler(req, res) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return res.status(500).send("Variables Discord manquantes.");
  }

  const params = new URLSearchParams();

  params.set("client_id", clientId);
  params.set("redirect_uri", redirectUri);
  params.set("response_type", "code");
  params.set("scope", "identify");

  const discordUrl =
    "https://discord.com/oauth2/authorize?" + params.toString();

  res.writeHead(302, {
    Location: discordUrl
  });

  res.end();
}
