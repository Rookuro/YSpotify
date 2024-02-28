const express = require('express');
const app = express();
const port = 8888;

const request = require('request');

const jwt = require('jsonwebtoken');

const path = require('path');

const cookieParser = require('cookie-parser');

app.use(cookieParser());

const bodyParser = require('body-parser');

const {stringify} = require("nodemon/lib/utils");

const SpotifyWebApi = require('spotify-web-api-node');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAna0ffx4JcSqAyE9qrzo8UCYgddPbsaN5mqAO8tuW8DOxE8ZO
9at3rOKdmSzZC5xqypNSYP66ZpwMfJcEuVsEvKu95QjzLaSKB1it2ZSdEdNrPa7w
RbLP/lKymGYiu5Tx00t4B6P53xh6TPt//RGrX7Z21ZbeCIoGFck5VYlSFcDBPa6f
VKUedPJPEj//oLx3kJsTj7m6mDDobi3LOXQ1lLxX4jjIYPvtF4ta1q/9ffzJHmF+
jKOoceUm+XOXrQsrJMZ+Fj1Po7GNCFTmp9JQkqBQUgK/qE1jW3V3zwhkjLcs5MoZ
sJ7E6eki4Da+JoY3+1sb3LQxLgxuag4HFcC+aQIDAQABAoIBAFyMWDdhpwMggnSQ
gLsXQH1+04C1eHccz+ydVAjiMQcOIDrOJFx4Z4c3gG9+7mqtRdVfgXPjL/+4Sm/6
qFAvh2lCmPRNO4cn08iaGXjjjQoAgSq0et0+Jm1NlvxyvqJBu2tdGbfKXIjBMk/r
MuWUsHU+gSO/KNX0RbwV3yxArMiM7LWOrflrLsvaPvf2seHy2wzvKn5D1JM8BL2L
mdwSR7nlvQP491Y+xDG3x3mcskxTETAqq69bhDwSTrKjgCFf1puUMqbcUZpYQK+4
OxUa9zzHIxOHzjnS7FL66inAxZvbbzrCBfDEB7xldNsGQLEAVxXvKVsBvooRpwON
2U5f3bECgYEA4WbK0QuYf6WUpyH2aUMl9H14TmN1bpDh/0UOz5UrQkDcrdppr8Mi
NLDUrDdYKsCWo/l6+8ctF0q3siNFK5m6iAw+QNhJ44iM9jSPMhtSa4Aebh7ITX1j
BeAGNZZ4wCsC9mAO1Niil+udQQffVW8bUPQ3lwnwtJ66JyxlfkKOct0CgYEAsxS5
3mc6mvhGMQSe8jUsbH0n859RNXesxhrNwV2YEuQxLrpB+vXUYUo8ntc3vxZazS0S
40GSahqaQThsBChYXR16aka/wYoJfVT3qNBQdI6WnyjH2PiCVRWJl36PNQZsRXAV
+rUxUCLHNJIkqNRfnx5BuxnOQDTWhuiMOYxpgv0CgYEAxntr8XUSjqTSJ/KCN+MH
UyoBfJWcXQZ72/uFtUmX1DmlmfoQwtNEFb35KMV7f/ojLLWNlJSpoi8LX3Qrft9a
IF8XmqZbOl+OMWfLCMaCZ2NkaHf2zjWxswS4swuTvTSi4S1pIgi59KlnylISWfsC
xOCo6vm32nVDWyd/IBWftokCgYA2ZiFgEfOXh7uqwECYStbHze0I8Gh22Xe+Zf4C
sy+y7WaTTzkjxvFQ7IAlsDLa9St4EC0go5aabKJXFZCaYrcU8hNxnTQ60ne3fswM
l9sYzQesKXMr0bGlrvkw790Iun7BSR8kHU5xjV799Tb1oi255DMLZvdkQai5KoMO
KD0U8QKBgAY+pCpVnVwh5hcF62WvD8ieXy5qcWl2r4VRSD1tDh0VeEmzr8FCdfKZ
tG5QtxMqi4FTvtK846auTDXo6mWarFINtwQhUu/8gybkLjyrsZL0tQTjiF+aeg+d
wuSMbRS6ScYyVLYvowCL/Mg+M7uZ8gcGWwSse3U2HAP6ANnRis2+
-----END RSA PRIVATE KEY-----`

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAna0ffx4JcSqAyE9qrzo8
UCYgddPbsaN5mqAO8tuW8DOxE8ZO9at3rOKdmSzZC5xqypNSYP66ZpwMfJcEuVsE
vKu95QjzLaSKB1it2ZSdEdNrPa7wRbLP/lKymGYiu5Tx00t4B6P53xh6TPt//RGr
X7Z21ZbeCIoGFck5VYlSFcDBPa6fVKUedPJPEj//oLx3kJsTj7m6mDDobi3LOXQ1
lLxX4jjIYPvtF4ta1q/9ffzJHmF+jKOoceUm+XOXrQsrJMZ+Fj1Po7GNCFTmp9JQ
kqBQUgK/qE1jW3V3zwhkjLcs5MoZsJ7E6eki4Da+JoY3+1sb3LQxLgxuag4HFcC+
aQIDAQAB
-----END PUBLIC KEY-----`

function jwtGuard(req, res, next) {
    const authorizationHeader = req.headers.authorization;

    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        const idToken = authorizationHeader.substring(7);

        jwt.verify(idToken, privateKey, (err, decoded) => {
            if (err) {
                res.status(401).send('Unauthorized');
            } else {
                req.userToken = decoded;
                // Extracting the ID from the decoded token



                next();
            }
        });
    } else {
        res.status(401).send('Unauthorized');
    }
}

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

let groups = fs.readFileSync('groups.json', 'utf-8');
const datagroup = Array.from(JSON.parse(groups));console.log(datagroup);

const groupsFilePath = path.join(__dirname, 'groups.json');
let groupsData = JSON.parse(fs.readFileSync(groupsFilePath, 'utf-8'));

const {v4 : uuidv4} = require("uuid")
const id = uuidv4()

const { v4: generateUUID } = require('uuid');

app.post('/groups',jwtGuard, (req, res) => {
    const userName = req.userToken.pseudo;
    const { groupName } = req.body;

    // Vérifie si l'utilisateur est déjà dans un groupe
    let currentUserGroup = null;
    groupsData.forEach(group => {
        if (group.members.some(member => member.name === userName)) {
            currentUserGroup = group;
        }
    });

    // Si l'utilisateur est déjà dans un groupe, le retirer
    if (currentUserGroup) {
        currentUserGroup.members = currentUserGroup.members.filter(member => member.name !== userName);
        // Si l'utilisateur était le chef, assigner un nouveau chef aléatoirement
        if (currentUserGroup.chef === userName) {
            currentUserGroup.chef = currentUserGroup.members.length > 0 ? currentUserGroup.members[Math.floor(Math.random() * currentUserGroup.members.length)].name : null;
        }
    }

    groupsData = groupsData.filter(group => group.members.length > 0);

    let targetGroup = groupsData.find(group => group.name === groupName);
    if (!targetGroup) {
        targetGroup = { name: groupName, chef: userName, members: [{ name: userName }] };
        groupsData.push(targetGroup);
    } else {
        targetGroup.members.push({ name: userName });
        if (!targetGroup.chef) {
            targetGroup.chef = userName;
        }
    }

    fs.writeFileSync(groupsFilePath, JSON.stringify(groupsData, null, 2), 'utf-8');

    res.send({ message: `L'utilisateur ${userName} a rejoint le groupe ${groupName}.`, groupDetails: targetGroup });
});

app.get('/groups-list', (req, res) => {
    const groupsWithMemberCount = groupsData.map(group => {
        return {
            groupsname: group.name,
            member: group.members
        };
    });
    res.json(groupsWithMemberCount);
    console.log(groupsWithMemberCount);
});

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

    const { pseudo, password } = req.body;

    const user = datauser.find(user => user.pseudo === pseudo && user.password === password);

    if (user) {
        const token = jwt.sign({ pseudo: user.pseudo, id: user.id }, privateKey, {algorithm: 'RS256', expiresIn: '1h'});
        res.set('Authorization', `Bearer ${token}`);
        res.send(token);
    } else {
        res.status(401).send("Pas trouvé");
    }
});

app.get('/auth', (req, res) => {

    const scopes = ['user-read-private', 'user-read-email', 'user-read-currently-playing','user-read-playback-state'];

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
        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                const accessToken = body.access_token;

                console.log('Access Token:', accessToken);

            }
        });

        request.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                const username = JSON.parse(body).display_name;
                console.log('Pseudo du compte Spotify associé:', username);
            } else {
            }
        });

        request.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                const track = JSON.parse(body).item;
                const artist = track.artists[0].name;
                const trackName = track.name;
                const albumName = track.album.name;

                console.log('Titre du morceau:', trackName);
                console.log('Nom de l\'artiste:', artist);
                console.log('Titre de l\'album:', albumName);
            } else {
            }
        });

        request.get('https://api.spotify.com/v1/me/player', {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                const deviceName = JSON.parse(body).device.name;
                console.log('Nom de l\'appareil d\'écoute actif:', deviceName);
            } else {

            }
        });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});