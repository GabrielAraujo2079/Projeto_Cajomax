// ============================================
//  usuariosRoutes.js — Rotas de Usuários
//  Cajomax · 2026
//
//  Adicione ao server.js:
//    const usuariosRoutes = require('./src/routes/usuariosRoutes');
//    app.use('/api/usuarios', usuariosRoutes);
// ============================================

const express    = require('express');
const router     = express.Router();
const bcrypt = require('bcryptjs');
const { sql, poolPromise } = require('../config/db');

// ── POST /api/usuarios/criar ──────────────────────────────
router.post('/criar', async (req, res) => {
    const { nome, email, senha, idade, telefone, genero } = req.body;

    // ── Validação básica no servidor ──────────────────────
    if (!nome || !email || !senha || idade === undefined || !telefone || !genero) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
    }

    if (typeof nome !== 'string' || nome.trim().length < 3) {
        return res.status(400).json({ erro: 'Nome inválido.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ erro: 'E-mail inválido.' });
    }

    if (typeof senha !== 'string' || senha.length < 8) {
        return res.status(400).json({ erro: 'A senha deve ter pelo menos 8 caracteres.' });
    }

    const idadeNum = parseInt(idade, 10);
    if (isNaN(idadeNum) || idadeNum < 0 || idadeNum > 120) {
        return res.status(400).json({ erro: 'Idade inválida.' });
    }

    const generosPermitidos = ['Masculino', 'Feminino', 'Outro'];
    if (!generosPermitidos.includes(genero)) {
        return res.status(400).json({ erro: 'Gênero inválido.' });
    }

    try {
        const pool = await poolPromise;

        // ── Verifica se e-mail já existe ──────────────────
        const checkEmail = await pool.request()
            .input('email', sql.NVarChar(150), email.trim())
            .query('SELECT Id FROM Usuarios WHERE Email = @email');

        if (checkEmail.recordset.length > 0) {
            return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
        }

        // ── Hash da senha com bcrypt ──────────────────────
        const SALT_ROUNDS = 12;
        const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

        // ── Inserção no banco ─────────────────────────────
        await pool.request()
            .input('nome',      sql.NVarChar(100), nome.trim())
            .input('email',     sql.NVarChar(150), email.trim())
            .input('senhaHash', sql.NVarChar(255), senhaHash)
            .input('idade',     sql.Int,           idadeNum)
            .input('telefone',  sql.NVarChar(20),  telefone.trim())
            .input('genero',    sql.NVarChar(20),  genero)
            .query(`
                INSERT INTO Usuarios (Nome, Email, SenhaHash, Idade, Telefone, Genero)
                VALUES (@nome, @email, @senhaHash, @idade, @telefone, @genero)
            `);

        return res.status(201).json({ mensagem: 'Conta criada com sucesso.' });

    } catch (err) {
        console.error('[POST /api/usuarios/criar] Erro:', err);
        return res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
});

module.exports = router;
