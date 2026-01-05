document.addEventListener("DOMContentLoaded", () => {
    // --- 1. REFERÊNCIAS DO DOM ---
    const trigger = document.getElementById("botTrigger");
    const windowChat = document.getElementById("chatWindow");
    const closeBtn = document.getElementById("chatClose");
    const chatBody = document.getElementById("chatBody");
    
    // Variáveis de Controle
    let inputArea, nameInput, sendBtn;
    let userName = "";
    let isChatOpen = false;

    // ============================================================
    // 2. CÉREBRO DO BOT (BASE DE CONHECIMENTO EXPANDIDA)
    // ============================================================
    const knowledge = {
        // --- ABERTURA ---
        intro: {
            msg: "Olá! Sou a Inteligência Virtual da UNIT Academy. 🤖<br><br>Estou aqui para criar seu plano de estudos ideal. Para começarmos, <strong>como posso te chamar?</strong>",
            type: "input"
        },

        // --- MENU PRINCIPAL (CONSULTIVO) ---
        menu: {
            getMsg: (name) => `Prazer, <strong>${name}</strong>! Vamos direto ao ponto.<br><br>Para eu te indicar a melhor estratégia, <strong>qual é o seu objetivo principal hoje?</strong>`,
            options: [
                { text: "🚀 Iniciar uma Carreira em Tech (Do Zero)", next: "perfil_iniciante" },
                { text: "💰 Automatizar Negócios & Lucrar", next: "perfil_empreendedor" },
                { text: "🎨 Criação Visual & Design", next: "perfil_criativo" },
                { text: "📱 Criar Apps e Sistemas Complexos", next: "perfil_dev" },
                { text: "🤔 Quem é a UNIT / Gustavo?", next: "sobre_unit" }
            ]
        },

        // --- PERFIS DE USUÁRIO (SEGMENTAÇÃO) ---
        
        // 1. INICIANTE
        perfil_iniciante: {
            msg: "Excelente. O mercado de tecnologia mudou. Hoje, não contratam mais quem só 'digita código', mas sim quem resolve problemas usando IA.<br><br>Para começar com o pé direito e salário alto, recomendo dominar a base completa (Web + Automação).",
            options: [
                { text: "💎 Quero o Combo Completo (Recomendado)", action: "checkout_flow", url: "LINK_KIWIFY_COMBO_COMPLETO" },
                { text: "Quero ir passo a passo (Web Full Stack)", action: "scroll", target: "Full-Stack" },
                { text: "Voltar", next: "back_to_menu" }
            ]
        },

        // 2. EMPREENDEDOR / DINHEIRO
        perfil_empreendedor: {
            msg: "Entendido. Você busca <strong>Alavancagem</strong>. Não quer ser programador, quer ter sistemas trabalhando por você.<br><br>A trilha de <strong>Automação & Bots</strong> é a ideal. Você vai aprender a criar 'funcionários digitais' que atendem clientes e até operam no mercado financeiro.",
            options: [
                { text: "Ver detalhes de Automação", action: "open_modal", target: "automacao" },
                { text: "Gostei, quero garantir minha vaga", action: "checkout_flow", url: "LINK_KIWIFY_AUTOMACAO" },
                { text: "Voltar", next: "back_to_menu" }
            ]
        },

        // 3. CRIATIVO
        perfil_criativo: {
            msg: "Perfeito. O módulo de <strong>IA Criativa</strong> vai te libertar. Você vai parar de depender de designers ou bancos de imagem.<br><br>Ensinamos a gerar vídeos, logotipos e interfaces de nível estúdio usando apenas comandos de texto.",
            options: [
                { text: "Ver grade curricular", action: "open_modal", target: "criativa" },
                { text: "Quero dominar o Design com IA", action: "checkout_flow", url: "LINK_KIWIFY_CRIATIVA" },
                { text: "Voltar", next: "back_to_menu" }
            ]
        },

        // 4. DEV / ARQUITETO
        perfil_dev: {
            msg: "Ótimo. Se você quer construir SaaS, Plataformas ou Apps, precisa do método <strong>IA-First</strong>.<br><br>No módulo <strong>Mobile</strong>, ensinamos a técnica Wrapper: transformar seu Web App em nativo (Android/iOS) sem precisar aprender Java ou Swift.",
            options: [
                { text: "Ver detalhes Mobile", action: "open_modal", target: "mobile" },
                { text: "Quero o Combo Arquiteto (Tudo)", action: "checkout_flow", url: "LINK_KIWIFY_COMBO_COMPLETO" },
                { text: "Voltar", next: "back_to_menu" }
            ]
        },

        // --- SOBRE A UNIT (AUTORIDADE) ---
        sobre_unit: {
            msg: "A <strong>UNIT</strong> é liderada por <strong>Gustavo Capichoni</strong>, Engenheiro de Software e Arquiteto de Soluções.<br><br>Diferente de cursos teóricos, a UNIT nasce da prática de campo: Trading Quantitativo, Sistemas de Alta Escala e Automação Empresarial.<br><br>Nosso foco: <strong>Autonomia Técnica.</strong> Ensinamos você a não depender de ninguém.",
            options: [
                { text: "Gostei da filosofia. Quero ver os cursos.", next: "menu_treinamentos" },
                { text: "Qual a garantia que tenho?", next: "garantia_detalhada" }
            ]
        },

        // --- MENU DE CURSOS (CATÁLOGO) ---
        menu_treinamentos: {
            msg: "Aqui estão nossas trilhas de especialização:",
            options: [
                { text: "💎 Combo Completo (Melhor Custo/Benefício)", action: "checkout_flow", url: "LINK_KIWIFY_COMBO_COMPLETO" },
                { text: "🎨 IA Criativa & Design", action: "open_modal", target: "criativa" },
                { text: "🤖 Automação & Bots", action: "open_modal", target: "automacao" },
                { text: "💻 Web Full Stack", action: "open_modal", target: "web" },
                { text: "📱 Apps Mobile", action: "open_modal", target: "mobile" },
                { text: "Voltar", next: "back_to_menu" }
            ]
        },

        // --- GARANTIA E SUPORTE ---
        garantia_detalhada: {
            msg: "Você tem <strong>Risco Zero</strong>.<br><br>1. Pagamento seguro via Kiwify.<br>2. Acesso Vitalício e Imediato.<br>3. <strong>7 Dias de Garantia Incondicional:</strong> Se não gostar, devolvemos 100% do valor. Sem letras miúdas.",
            options: [
                { text: "Me sinto seguro. Quero entrar.", next: "decisao_compra" },
                { text: "Falar com Humano no WhatsApp", action: "link", url: "https://wa.me/5521996442487" }
            ]
        },

        // --- FECHAMENTO (DECISÃO FINAL) ---
        decisao_compra: {
            getMsg: (name) => `Bora construir o futuro, ${name}. 🚀<br>Você prefere o acesso completo ou algo específico?`,
            options: [
                { text: "💎 Quero o Combo Completo (Recomendado)", action: "checkout_flow", url: "LINK_KIWIFY_COMBO_COMPLETO" },
                { text: "Quero escolher um módulo", next: "menu_treinamentos" }
            ]
        }
    };

    // ============================================================
    // 3. MOTOR DE EXECUÇÃO (LÓGICA)
    // ============================================================

    function initInputArea() {
        if (!document.getElementById("botInputArea")) {
            const div = document.createElement("div");
            div.id = "botInputArea";
            div.className = "chat-input-area";
            div.innerHTML = `
                <input type="text" id="botNameInput" class="chat-input" placeholder="Digite seu nome..." autocomplete="off">
                <button id="botSendBtn" class="chat-send"><i class="fa-solid fa-paper-plane"></i></button>
            `;
            windowChat.appendChild(div);
            
            inputArea = div;
            nameInput = document.getElementById("botNameInput");
            sendBtn = document.getElementById("botSendBtn");

            sendBtn.onclick = handleNameSubmit;
            nameInput.onkeypress = (e) => { if(e.key === "Enter") handleNameSubmit(); };
        }
    }

    // Função de "Digitando..." para humanizar
    function showTyping() {
        const div = document.createElement("div");
        div.className = "msg msg-bot typing-indicator";
        div.id = "typingBubble";
        div.innerHTML = `<span>.</span><span>.</span><span>.</span>`; // CSS fará a animação
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
        return div;
    }

    function addMsg(text, type, delay = 0) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const div = document.createElement("div");
                div.className = `msg msg-${type}`;
                div.innerHTML = text;
                chatBody.appendChild(div);
                chatBody.scrollTop = chatBody.scrollHeight;
                resolve();
            }, delay);
        });
    }

    function addOptions(options) {
        const div = document.createElement("div");
        div.className = "chat-options";
        options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "chat-btn";
            btn.innerHTML = `<span style="color:var(--neon-green)">›</span> ${opt.text}`;
            btn.onclick = () => handleOptionClick(opt);
            div.appendChild(btn);
        });
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function handleNameSubmit() {
        const name = nameInput.value.trim();
        if (name.length > 1) {
            userName = name;
            addMsg(name, "user"); 
            inputArea.classList.remove("active");
            
            // Simula digitação
            const typing = showTyping();
            setTimeout(() => {
                typing.remove();
                const menuData = knowledge.menu;
                addMsg(menuData.getMsg(userName), "bot");
                addOptions(menuData.options);
            }, 1000);
        }
    }

    // --- CÉREBRO DE AÇÕES ---
    function handleOptionClick(opt) {
        addMsg(opt.text, "user"); 
        
        // Limpa opções antigas
        const oldOpts = document.querySelectorAll(".chat-options");
        oldOpts.forEach(el => el.remove());

        // Simula pensamento do bot
        const typing = showTyping();

        setTimeout(() => {
            typing.remove();

            // 1. AÇÃO: ABRIR MODAL (Integração com gradeTreinamentos.js)
            if (opt.action === "open_modal") {
                addMsg("Abrindo a ementa técnica na tela... 📄", "bot");
                if (typeof abrirModalM === "function") {
                    abrirModalM(opt.target);
                    // Pergunta de fechamento após abrir o modal
                    setTimeout(() => {
                        addMsg("O que achou do conteúdo? Faz sentido pro seu objetivo?", "bot");
                        addOptions([
                            { text: "✅ Sim, é o que preciso (Comprar)", action: "checkout_flow", url: `LINK_KIWIFY_${opt.target.toUpperCase()}` },
                            { text: "💬 Tenho outra dúvida", next: "back_to_menu" }
                        ]);
                    }, 1500);
                } else {
                    console.error("Erro: Função abrirModalM não encontrada.");
                }
            } 
            
            // 2. AÇÃO: SCROLL
            else if (opt.action === "scroll") {
                const targetEl = document.getElementById(opt.target);
                if(targetEl) {
                    addMsg("Te levando para lá... 🚀", "bot");
                    targetEl.scrollIntoView({ behavior: "smooth" });
                    if(window.innerWidth < 768) resetChat(); 
                } else {
                    runFlow("back_to_menu");
                }
            } 
            
            // 3. AÇÃO: CHECKOUT FLOW (TURBO)
            else if (opt.action === "checkout_flow") {
                addMsg("Excelente escolha! Você está a um passo da autonomia técnica. 🚀", "bot");
                setTimeout(() => {
                    addMsg("Abrindo ambiente seguro da Kiwify...", "bot");
                    setTimeout(() => {
                        // Aqui você colocaria o link real
                        console.log("Indo para: " + opt.url); 
                        // window.location.href = opt.url; // Descomente em produção
                        
                        // Para teste, apenas avisamos:
                        if(opt.url.includes("LINK_KIWIFY")) {
                            alert("Aqui o Bot redirecionaria para: " + opt.url + "\n\n(Lembre de configurar os links no código!)");
                        } else {
                            window.location.href = opt.url;
                        }

                    }, 1000);
                }, 800);
            }
            
            // 4. AÇÃO: LINK EXTERNO
            else if (opt.action === "link") {
                window.open(opt.url, "_blank");
                addMsg("Abri em uma nova aba.", "bot");
                setTimeout(() => runFlow("back_to_menu"), 2000);
            }
            
            // 5. NAVEGAÇÃO INTERNA
            else if (opt.next) {
                runFlow(opt.next);
            }

        }, 600); // Delay padrão de "pensamento"
    }

    function runFlow(flowKey) {
        if (flowKey === "back_to_menu") {
            const menuData = knowledge.menu;
            addMsg(`Posso ajudar em algo mais, ${userName}?`, "bot");
            addOptions(menuData.options);
            return;
        }

        const data = knowledge[flowKey];
        if (data) {
            const msgText = (typeof data.getMsg === "function") ? data.getMsg(userName) : data.msg;
            addMsg(msgText, "bot");
            if (data.options) addOptions(data.options);
        }
    }

    // --- CONTROLE DA JANELA ---
    function openChat() {
        windowChat.classList.add("open");
        isChatOpen = true;
        
        // --- ADICIONE ISTO AQUI (Trava a rolagem no Mobile) ---
        if (window.innerWidth < 768) {
            document.body.classList.add("chat-open");
        }
        // -------------------------------------------------------

        if (!userName) {
            chatBody.innerHTML = "";
            initInputArea();
            setTimeout(() => {
                addMsg(knowledge.intro.msg, "bot");
                inputArea.classList.add("active");
                nameInput.focus();
            }, 300);
        }
    }

    function resetChat() {
        // 1. Fecha visualmente a janela
        windowChat.classList.remove("open");
        isChatOpen = false;
        document.body.classList.remove("chat-open");
        // 2. Aguarda a animação de descida terminar (300ms) e LIMPA TUDO
        setTimeout(() => {
            // Zera as variáveis de estado
            userName = ""; 
            
            // Limpa o histórico de mensagens (HTML)
            chatBody.innerHTML = ""; 
            
            // Restaura o campo de input para o estado original
            if(inputArea) inputArea.classList.remove("active");
            if(nameInput) nameInput.value = "";
            
            // Garante que o input Area seja recriado/resetado na próxima abertura se necessário
            // (A função openChat já trata isso chamando initInputArea e adicionando msg de intro)
            
        }, 300);
    }

    trigger.addEventListener("click", () => {
        if (!isChatOpen) openChat();
        else resetChat();
    });

    closeBtn.addEventListener("click", resetChat);
});