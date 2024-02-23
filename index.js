const express = require('express');
const app = express();
const port = 8888;

const bodyParser = require('body-parser');

const uuid = require('uuid');

const {stringify} = require("nodemon/lib/utils");

const SpotifyWebApi = require('spotify-web-api-node');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const fs = require('fs');
//const {stringify} = require("uuid");


const spotifyApi = new SpotifyWebApi({
    clientId: 'e5196a4107a54a1e89807459d6d9a10d',
    clientSecret: 'f56cc1bc736142708bf6b8fa4c930964',
    redirectUri: 'http://localhost:8888/callback'
});

const state = 'some-state-of-my-choice';
const showDialog = true;

const client_id = 'e5196a4107a54a1e89807459d6d9a10d';
const redirect_uri = 'http://localhost:8888/callback';
const client_secret = 'f56cc1bc736142708bf6b8fa4c930964';
let users = fs.readFileSync('users.json', 'utf-8');
let datauser = JSON.parse(users);
console.log(datauser);

const {v4 : uuidv4} = require("uuid")
const id = uuidv4()

app.post('/register', (req, res) => {
    const { pseudo, password } = req.body;

    const existingUser = datauser.find(user => user.pseudo === pseudo);
    if (existingUser) {
        return res.status(400).json({ message: 'Ce pseudo est déjà utilisé' });
    }

    if (!pseudo || !password) {
        return res.status(400).json({ message: 'Pseudo et mot de passe requis' });
    }

    let users = [];
    if (fs.existsSync('users.json')) {
        const usersData = fs.readFileSync('users.json');
        users = JSON.parse(usersData);
    }

    users.push({ id: id, pseudo: pseudo, password: password  });
    fs.writeFileSync('users.json', JSON.stringify(users));

    res.status(200).json({ message: 'Inscription réussie' });
});

app.get('/login', (req, res) => {
    // Define the scopes for authorization; these are the permissions we ask from the user.
    const scopes = ['user-read-private', 'user-read-email'];
    let redirectUri = 'http://localhost:8888/callback';

    res.redirect(spotifyApi.createAuthorizeURL(scopes,state,showDialog));
});



app.get('/callback', function(req, res) {
    const code = req.query.code || null;
    const state = req.query.state || null;

    if (state === null) {
        res.redirect('/#' +
        stringify({
            error: 'state_mismatch'
        }));
    } else {
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };
        res.json(authOptions);
        console.log(authOptions);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});