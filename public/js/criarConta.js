// ============================================
//  criarConta.js — Frontend da Criação de Conta
//  Cajomax · 2026
// ============================================

// ── Elementos do DOM ──────────────────────────────────────
const btnCriar       = document.getElementById('btnCriarConta');
const btnTexto       = document.getElementById('btnTexto');
const btnLoader      = document.getElementById('btnLoader');
const msgGlobal      = document.getElementById('mensagem');

// ── Máscara de telefone ───────────────────────────────────
document.getElementById('telefone').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 11);
    if (v.length <= 10) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
        v = v.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    this.value = v;
});

// ── Toggles de senha ─────────────────────────────────────
document.querySelectorAll('.toggle-senha').forEach(btn => {
    btn.addEventListener('click', () => {
        const alvo = document.getElementById(btn.dataset.alvo);
        if (!alvo) return;
        alvo.type = alvo.type === 'password' ? 'text' : 'password';
        btn.textContent = alvo.type === 'password' ? '👁' : '🙈';
    });
});

// ── Funções auxiliares ────────────────────────────────────
function limparErros() {
    document.querySelectorAll('.campo-erro').forEach(el => el.textContent = '');
    document.querySelectorAll('.input-erro').forEach(el => el.classList.remove('input-erro'));
}

function mostrarErro(campoId, mensagem) {
    const erroEl = document.getElementById(`erro-${campoId}`);
    if (erroEl) erroEl.textContent = mensagem;
    const input = document.getElementById(campoId);
    if (input) input.classList.add('input-erro');
}

function mostrarMensagem(texto, tipo) {
    msgGlobal.textContent  = texto;
    msgGlobal.className    = `mensagem ${tipo}`;
    msgGlobal.classList.remove('oculto');
    msgGlobal.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function setCarregando(estado) {
    btnCriar.disabled      = estado;
    btnTexto.textContent   = estado ? 'Criando...' : 'Criar conta';
    btnLoader.classList.toggle('oculto', !estado);
}

// ── Validação ─────────────────────────────────────────────
function validar(dados) {
    let valido = true;

    if (!dados.nome || dados.nome.trim().length < 3) {
        mostrarErro('nome', 'Informe um nome com pelo menos 3 caracteres.');
        valido = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!dados.email || !emailRegex.test(dados.email)) {
        mostrarErro('email', 'Informe um e-mail válido.');
        valido = false;
    }

    if (!dados.senha || dados.senha.length < 8) {
        mostrarErro('senha', 'A senha deve ter pelo menos 8 caracteres.');
        valido = false;
    }

    if (dados.senha !== dados.confirmarSenha) {
        mostrarErro('confirmarSenha', 'As senhas não coincidem.');
        valido = false;
    }

    const idade = parseInt(dados.idade, 10);
    if (isNaN(idade) || idade < 0 || idade > 120) {
        mostrarErro('idade', 'Informe uma idade válida (0–120).');
        valido = false;
    }

    const telefoneNumerico = dados.telefone.replace(/\D/g, '');
    if (telefoneNumerico.length < 10 || telefoneNumerico.length > 11) {
        mostrarErro('telefone', 'Informe um telefone válido com DDD.');
        valido = false;
    }

    if (!dados.genero) {
        mostrarErro('genero', 'Selecione um gênero.');
        valido = false;
    }

    return valido;
}

// ── Envio do formulário ───────────────────────────────────
btnCriar.addEventListener('click', async () => {
    limparErros();
    msgGlobal.classList.add('oculto');

    // Coleta os dados
    const generoSelecionado = document.querySelector('input[name="genero"]:checked');
    const dados = {
        nome:           document.getElementById('nome').value.trim(),
        email:          document.getElementById('email').value.trim(),
        senha:          document.getElementById('senha').value,
        confirmarSenha: document.getElementById('confirmarSenha').value,
        idade:          document.getElementById('idade').value,
        telefone:       document.getElementById('telefone').value,
        genero:         generoSelecionado ? generoSelecionado.value : '',
    };

    if (!validar(dados)) return;

    setCarregando(true);

    try {
        const res = await fetch('/api/usuarios/criar', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
                nome:     dados.nome,
                email:    dados.email,
                senha:    dados.senha,
                idade:    parseInt(dados.idade, 10),
                telefone: dados.telefone,
                genero:   dados.genero,
            }),
        });

        const json = await res.json();

        if (res.ok) {
            mostrarMensagem('✅ Conta criada com sucesso! Redirecionando...', 'sucesso');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            mostrarMensagem(json.erro || 'Erro ao criar conta. Tente novamente.', 'erro');
        }
    } catch (err) {
        console.error(err);
        mostrarMensagem('Falha na conexão com o servidor. Verifique e tente novamente.', 'erro');
    } finally {
        setCarregando(false);
    }
});
