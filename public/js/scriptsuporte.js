<script src="suporte.html"></script>


    function enviarTicket() {
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const categoria = document.getElementById('categoria').value;
        const mensagem = document.getElementById('mensagem').value.trim();

        if (!nome || !email || !categoria || !mensagem) {
            alert('Por favor, preencha todos os campos antes de enviar.');
            return;
        }

        document.getElementById('mensagem-sucesso').style.display = 'block';

        document.getElementById('nome').value = '';
        document.getElementById('email').value = '';
        document.getElementById('categoria').value = '';
        document.getElementById('mensagem').value = '';
    }
