const sql = require('mssql');

// Lê as variáveis do .env
const config = {
    server: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    options: {
        encrypt: false,           // true se for Azure
        trustServerCertificate: true  // necessário em ambientes locais
    }
};

// Pool de conexão reutilizável — evita abrir e fechar conexão a cada request
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conectado ao SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Erro ao conectar no banco:', err);
    });

module.exports = { sql, poolPromise };