// ════════════════════════════════════════
//  CajomaX — script.js
// ════════════════════════════════════════

// ── Dark Mode (funciona em todas as páginas) ──────────────
const isDark = () => localStorage.getItem('darkMode') === 'true';

function applyDark(val) {
    document.body.classList.toggle('dark-mode', val);
    localStorage.setItem('darkMode', val);
    const icon = document.getElementById('darkIcon');
    if (icon) icon.textContent = val ? '☀️' : '🌙';
}

// Aplica ao carregar
applyDark(isDark());

// Botão do header
const btnDark = document.getElementById('btnDark');
if (btnDark) {
    btnDark.addEventListener('click', () => applyDark(!isDark()));
}
