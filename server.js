const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- MIDDLEWARES ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- ARQUIVOS ESTÁTICOS ----
app.use(express.static(path.join(__dirname, 'public')));

// ---- ROTA RAIZ ----
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---- INICIAR SERVIDOR ----
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});