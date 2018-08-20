require('./config/config')
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

/**
 * Le indicamos a express que vamos a usar body-parser.
 * Hacemos que los objetos en formato JSON y formato url-encoded se transformen en objeto JS.
 */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Habilitamos la carpeta public
 */
app.use(express.static(path.resolve(__dirname, '../public')));

/**
 * Le decimos a express que vamos a usar los endpoints que hay en este fichero 
 * Index.js tiene el mapeo de todos los ficheros con endpoints
 */
app.use(require('./routes/index'));

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