const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

//to do remove Replace with your actual client secret
const clientSecret = 'f367572f241bb022a5649f504fb986ce';

app.get('/authorization-code/callback', async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).send('Authorization code not provided.');
    }

    try {
        const tokenResponse = await axios.post('https://api.idmelabs.com/oauth/token', {
            client_id: '0f2ce521178825f83f986daa5ce0b2d3',
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'http://localhost:3020/authorization-code/callback',
        });
    
        console.log('Token Response:', tokenResponse.data);
    
        const { access_token, id_token } = tokenResponse.data;
        const decodedToken = jwt.decode(id_token);
        if (!decodedToken) {
            return res.status(400).json({ error: 'Failed to decode token' });
        }
            
        console.log('Decoded Token:', decodedToken);
    
        res.json({
            access_token,
            user_info: decodedToken,
        });
    } catch (error) {
        console.error('Error exchanging code for token:', error.response ? error.response.data : error.message);
        res.status(500).send('Failed to exchange code for token.');
    }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
