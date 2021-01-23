// *************************
//          Puerto
// *************************
process.env.PORT = process.env.PORT || 3000;

// *************************
//         Entorno
// *************************
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// *************************
//       Base de Datos
// *************************
let urlDB;

if ( process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// *************************
//   Vencimiento del token
// *************************
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = '48h';

// *************************
//   SEED de autenticación
// *************************
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// *************************
//      Google Client
// *************************
process.env.CLIENT_ID = process.env.CLIENT_ID || '299359006603-cehl3vps5f0jep9mum0jmcrt7m6kavb7.apps.googleusercontent.com';