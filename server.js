const express = require('express');
const path = require('path');

// Carrega as variáveis do .env
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ---- MIDDLEWARES ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- ARQUIVOS ESTÁTICOS ----
app.use(express.static(path.join(__dirname, 'public')));

// ---- ROTAS DA API ----
const eventosRoutes = require('./src/routes/eventosRoutes');
app.use('/api/eventos', eventosRoutes);

// ---- ROTA RAIZ ----
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---- INICIAR SERVIDOR ----
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});