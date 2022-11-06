const express = require('express');
const app = express();

const pg = require('pg');
const client = new pg.Client({user: "hackcade2022", password: "hackcade2022"});
client.connect();

const bodyParser = require("body-parser");

const crypto = require("crypto");

const bytea = require("postgres-bytea");

app.use(bodyParser.json())

app.get("/game/:id/:key", async (req, res) => {
    const id = req.params.id;
    let key = req.params.key;
    if(!id || !key) {
        res.status(404).send();
        return;
    }
    key = Buffer.from(key, 'hex');
    const result = (await client.query("SELECT * FROM games WHERE id = $1", [id])).rows[0];
    if(!result) {
        res.status(404).send();
        return;
    }
    const file = decrypt(Buffer.from(result.file, 'hex'), key);
    res.status(200).send({ title: result.title, author: result.author, file });
})

app.post("/game", async (req, res) => {
    const data = req.body;
    if (!data.title || !data.author || !data.file) {
        res.status(404).send();
    }
    const id = crypto.randomBytes(32).toString('hex');
    const key = crypto.randomBytes(32);
    const file = encrypt(Buffer.from(data.file, "hex"), key).toString('hex');
    await client.query("INSERT INTO games (id, title, author, file) VALUES ($1, $2, $3, $4)", [id, data.title, data.author, file]);
    res.status(200).send({ id, key: key.toString('hex') })
})


const encrypt = (buffer, key) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
    return Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
};

const decrypt = (encrypted, key) => {
    const iv = encrypted.slice(0, 16);
    encrypted = encrypted.slice(16);
    const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
};








app.listen(3000, () => {
    console.log("Server started on port 3000.")
});