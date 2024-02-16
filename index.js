const express = require('express');
const { stringify } = require("querystring");
const app = express();
const port = 8888;
const crypto = require('crypto');
const querystring = require('node:querystring');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const Schema = mongoose.Schema;

//let users = JSON.parse(data);
const User = Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("User", User);


function generateRandomString(length) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const client_id = 'e5196a4107a54a1e89807459d6d9a10d';
const redirect_uri = 'http://localhost:8888/callback';
const client_secret = 'f56cc1bc736142708bf6b8fa4c930964';

app.post('/signup', (req, res) => {

});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});