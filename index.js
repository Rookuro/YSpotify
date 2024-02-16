const express = require('express');
const app = express();
const port = 8888;
const crypto = require('crypto');
const { stringify } = require("querystring");
const querystring = require('node:querystring');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const fs = require('fs');

let users = fs.readFileSync('users.json');
let datauser = JSON.parse(users);
console.log(datauser);


app.post('/register', (req, res) => {
    const { pseudo, password } = req.body;

    const userdata = datauser.find(user => user.pseudo === pseudo && user.password === password);

    /*if (userdata) {
        res.send(userdata);
    }*/

    const existingUser = datauser.find(user => user.pseudo === pseudo);
    if (existingUser) {
        return res.status(400).json({ message: 'Ce pseudo est déjà utilisé' });
    }

    // Vérifier si les données sont présentes
    if (!pseudo || !password) {
        return res.status(400).json({ message: 'Pseudo et mot de passe requis' });
    }

    // Charger les utilisateurs existants depuis le fichier users.json (s'il existe)
    let users = [];
    if (fs.existsSync('users.json')) {
        const usersData = fs.readFileSync('users.json');
        users = JSON.parse(usersData);
    }

    // Vérifier si l'utilisateur existe déjà


    // Ajouter le nouvel utilisateur dans la liste
    users.push({ pseudo: pseudo, password: password });
    // Enregistrer les utilisateurs mis à jour dans le fichier users.json
    fs.writeFileSync('users.json', JSON.stringify(users));

    // Répondre avec succès
    res.status(200).json({ message: 'Inscription réussie' });
});

app.get('/status', (request, response) => {
    const status = {
          'Status': 'Running',
    };

    response.send(status);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});