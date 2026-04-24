// ── Dark Mode global ───────────────────────────────────
const isDark = () => localStorage.getItem('darkMode') === 'true';

function applyDark(val) {
    document.body.classList.toggle('dark-mode', val);
    localStorage.setItem('darkMode', String(val));
    const icon = document.getElementById('darkIcon');
    if (icon) icon.textContent = val ? '☀️' : '🌙';
    const tog = document.getElementById('togDark');
    if (tog) tog.checked = val;
}

// Aplica imediatamente ao carregar a página
applyDark(isDark());

document.addEventListener('DOMContentLoaded', () => {

    applyDark(isDark());

    // Botão 🌙 no header (só existe no config.html)
    const btnDark = document.getElementById('btnDark');
    if (btnDark) {
        btnDark.addEventListener('click', () => {
            applyDark(!isDark());
        });
    }

    // Toggle dentro da seção Aparência (config.html)
    const togDark = document.getElementById('togDark');
    if (togDark) {
        togDark.addEventListener('change', function () {
            applyDark(this.checked);
        });
    }

    // FAQ das outras páginas
    const faqItems = document.querySelectorAll('.faq-item h3');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const answer = item.nextElementSibling;
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
            } else {
                answer.style.display = 'block';
            }
        });
    });

});
