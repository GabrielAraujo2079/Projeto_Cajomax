// ============================================
//  eventosRoutes.js — Rotas de Eventos
//  Cajomax · 2026
//
//  Adicione ao server.js (já está lá):
//    const eventosRoutes = require('./src/routes/eventosRoutes');
//    app.use('/api/eventos', eventosRoutes);
// ============================================

const express  = require('express');
const router   = express.Router();
const { sql, poolPromise } = require('../config/db');

// ── GET /api/eventos ──────────────────────────────────────
// Lista todos os eventos
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT * FROM Eventos ORDER BY DataEvento ASC');

        return res.status(200).json(result.recordset);
    } catch (err) {
        console.error('[GET /api/eventos] Erro:', err);
        return res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
});

// ── GET /api/eventos/:id ──────────────────────────────────
// Busca um evento por ID
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' });

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Eventos WHERE Id = @id');

        if (result.recordset.length === 0)
            return res.status(404).json({ erro: 'Evento não encontrado.' });

        return res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error('[GET /api/eventos/:id] Erro:', err);
        return res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
});

// ── POST /api/eventos/criar ───────────────────────────────
// Cria um novo evento
router.post('/criar', async (req, res) => {
    const {
        usuarioId, titulo, descricao, dataEvento, horarioEvento,
        imagemPath, idadeMinima, idadeMaxima, generoAlvo,
        cep, rua, numero, complemento, bairro, cidade, estado
    } = req.body;

    // ── Validação básica ──────────────────────────────────
    if (!usuarioId || !titulo || !descricao || !dataEvento || !horarioEvento ||
        !cep || !rua || !numero || !bairro || !cidade || !estado) {
        return res.status(400).json({ erro: 'Campos obrigatórios faltando.' });
    }

    if (titulo.trim().length < 3) {
        return res.status(400).json({ erro: 'Título deve ter pelo menos 3 caracteres.' });
    }

    if (descricao.trim().length < 10) {
        return res.status(400).json({ erro: 'Descrição deve ter pelo menos 10 caracteres.' });
    }

    const idMin = parseInt(idadeMinima, 10) || 0;
    const idMax = parseInt(idadeMaxima, 10) || 120;

    if (idMin > idMax) {
        return res.status(400).json({ erro: 'Idade mínima não pode ser maior que a máxima.' });
    }

    const generosPermitidos = ['Masculino', 'Feminino', 'Todos'];
    if (generoAlvo && !generosPermitidos.includes(generoAlvo)) {
        return res.status(400).json({ erro: 'Gênero alvo inválido.' });
    }

    try {
        const pool = await poolPromise;

        // ── Verifica se usuário existe ────────────────────
        const checkUsuario = await pool.request()
            .input('usuarioId', sql.Int, parseInt(usuarioId, 10))
            .query('SELECT Id FROM Usuarios WHERE Id = @usuarioId');

        if (checkUsuario.recordset.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }

        // ── Inserção no banco ─────────────────────────────
        await pool.request()
            .input('usuarioId',      sql.Int,           parseInt(usuarioId, 10))
            .input('titulo',         sql.NVarChar(200),  titulo.trim())
            .input('descricao',      sql.NVarChar(800),  descricao.trim())
            .input('dataEvento',     sql.Date,           dataEvento)
            .input('horarioEvento',  sql.NVarChar(10),   horarioEvento)
            .input('imagemPath',     sql.NVarChar(500),  imagemPath || null)
            .input('idadeMinima',    sql.Int,            idMin)
            .input('idadeMaxima',    sql.Int,            idMax)
            .input('generoAlvo',     sql.NVarChar(20),   generoAlvo || 'Todos')
            .input('cep',            sql.Char(8),        cep.replace(/\D/g, ''))
            .input('rua',            sql.NVarChar(200),  rua.trim())
            .input('numero',         sql.NVarChar(20),   numero.trim())
            .input('complemento',    sql.NVarChar(100),  complemento || null)
            .input('bairro',         sql.NVarChar(100),  bairro.trim())
            .input('cidade',         sql.NVarChar(100),  cidade.trim())
            .input('estado',         sql.Char(2),        estado.trim().toUpperCase())
            .query(`
                INSERT INTO Eventos (
                    UsuarioId, Titulo, Descricao, DataEvento, HorarioEvento,
                    ImagemPath, IdadeMinima, IdadeMaxima, GeneroAlvo,
                    CEP, Rua, Numero, Complemento, Bairro, Cidade, Estado
                ) VALUES (
                    @usuarioId, @titulo, @descricao, @dataEvento, @horarioEvento,
                    @imagemPath, @idadeMinima, @idadeMaxima, @generoAlvo,
                    @cep, @rua, @numero, @complemento, @bairro, @cidade, @estado
                )
            `);

        return res.status(201).json({ mensagem: 'Evento criado com sucesso.' });

    } catch (err) {
        console.error('[POST /api/eventos/criar] Erro:', err);
        return res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
});

// ── DELETE /api/eventos/:id ───────────────────────────────
// Deleta um evento por ID
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' });

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Eventos WHERE Id = @id');

        if (result.rowsAffected[0] === 0)
            return res.status(404).json({ erro: 'Evento não encontrado.' });

        return res.status(200).json({ mensagem: 'Evento deletado com sucesso.' });
    } catch (err) {
        console.error('[DELETE /api/eventos/:id] Erro:', err);
        return res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
});

module.exports = router;