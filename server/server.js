require('./config/config')
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

/**
 * Le indicamos a express que vamos a usar body-parser.
 * Hacemos que los objetos en formato JSON y formato url-encoded se transformen en objeto JS.
 */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Le decimos a express que vamos a usar los endpoints que hay en este fichero 
 */
app.use(require('./routes/usuario.js'))

/**
 * Conectamos con la base de datos MongoDB
 */
mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('BDD ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${process.env.PORT}`);
});