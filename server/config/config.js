/**
 * SERVER PORT
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * ENTORNO
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * BASE DE DATOS
 */

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://cafe-user:123456A@ds121652.mlab.com:21652/cafe';
}
process.env.URLDB = urlDB;