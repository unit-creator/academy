document.addEventListener("DOMContentLoaded", function() {

    // --- SISTEMA DE NAVEGAÇÃO HERO ---
    // Monitora o botão principal "Conhecer a estrutura..." para decolagem imediata.
    const startBtn = document.getElementById('startBtn');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            // Redireciona para a página de vendas/treinamentos
            window.location.href = 'treinamentos.html';
        });
    }

    // Nota do Piloto: 
    // O código do Modal foi removido pois a fuselagem (HTML) foi limpa.
    // O sistema agora roda sem erros de console.

});