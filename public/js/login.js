// ============================================
//  login.js — Frontend da Página de Login
//  Cajomax · 2026
// ============================================

const btnLogin  = document.getElementById('btnLogin');
const btnTexto  = document.getElementById('btnTexto');
const btnLoader = document.getElementById('btnLoader');
const msgGlobal = document.getElementById('mensagem');

// ── Toggle de senha ───────────────────────────────────────
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
    msgGlobal.textContent = texto;
    msgGlobal.className   = `mensagem ${tipo}`;
    msgGlobal.classList.remove('oculto');
    msgGlobal.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function setCarregando(estado) {
    btnLogin.disabled    = estado;
    btnTexto.textContent = estado ? 'Entrando...' : 'Entrar';
    btnLoader.classList.toggle('oculto', !estado);
}

// ── Validação ─────────────────────────────────────────────
function validar(email, senha) {
    let valido = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        mostrarErro('email', 'Informe um e-mail válido.');
        valido = false;
    }

    if (!senha || senha.length < 8) {
        mostrarErro('senha', 'A senha deve ter pelo menos 8 caracteres.');
        valido = false;
    }

    return valido;
}

// ── Envio do formulário ───────────────────────────────────
btnLogin.addEventListener('click', async () => {
    limparErros();
    msgGlobal.classList.add('oculto');

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    if (!validar(email, senha)) return;

    setCarregando(true);

    try {
        const res = await fetch('/api/usuarios/login', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ email, senha }),
        });

        const json = await res.json();

        if (res.ok) {
            mostrarMensagem('✅ Login realizado! Redirecionando...', 'sucesso');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
        } else {
            mostrarMensagem(json.erro || 'E-mail ou senha incorretos.', 'erro');
        }
    } catch (err) {
        console.error(err);
        mostrarMensagem('Falha na conexão com o servidor. Verifique e tente novamente.', 'erro');
    } finally {
        setCarregando(false);
    }
});

// ── Permite enviar com Enter ──────────────────────────────
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btnLogin.click();
});