// ============================================
//  db.js — Conexão com SQL Server
//  Cajomax · 2026
// ============================================

const sql = require('mssql');

// Separa o servidor da instância nomeada (ex: SERVIDOR\INSTANCIA)
const serverRaw = process.env.DB_SERVER || '';
const [server, instanceName] = serverRaw.split('\\');

const config = {
    server: server,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    options: {
        instanceName:           instanceName || undefined,
        encrypt:                false,
        trustServerCertificate: true,
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conectado ao SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Erro ao conectar no banco:', err.message);
        console.error('Verifique: servidor, instância, usuário, senha e se o SQL Server Browser está ativo.');
        throw err;
    });

module.exports = { sql, poolPromise };