/**
 * SERVER PORT
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * ENTORNO
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * JWT - CONFIG
 */
process.env.CADUCIDAD_TOKEN = '48h';
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

/**
 * BASE DE DATOS
 */

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;


/**
 * GOOGLE CLIENT ID
 */

process.env.CLIENT_ID = process.env.CLIENT_ID || '743207933858-3rf6tihdclqq6lnqpo8f4deudu3l2vfb.apps.googleusercontent.com';