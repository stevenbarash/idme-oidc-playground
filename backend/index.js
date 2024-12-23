const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

const clientSecret = process.env.CLIENT_SECRET || "f367572f241bb022a5649f504fb986ce";
const clientId = process.env.CLIENT_ID || "0f2ce521178825f83f986daa5ce0b2d3";

// Hardcoded redirect URI for consistency
const redirectUri = "https://idme-demo-app-8ef557295d28.herokuapp.com/authorization-code/callback";

// API route for handling OAuth callback
app.get("/authorization-code/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Authorization code not provided.");
  }

  try {
    const tokenResponse = await axios.post("https://api.idmelabs.com/oauth/token", null, {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri, // Use hardcoded redirect URI
      },
    });

    const { access_token, id_token } = tokenResponse.data;
    const decodedToken = jwt.decode(id_token);

    if (!decodedToken) {
      return res.status(400).json({ error: "Failed to decode token" });
    }

    res.redirect(`/result?access_token=${access_token}&id_token=${id_token}`);
  } catch (error) {
    console.error("Error exchanging code for token:", error.response ? error.response.data : error.message);
    res.status(500).send("Failed to exchange code for token.");
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/build")));

// Catch-all handler to serve the React app for any other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
