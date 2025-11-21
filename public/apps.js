// app.js - Victorino Edition
class FinancialAssistant {
    constructor() {
        this.transacoes = this.carregarDados();
        this.atualizarInterface();
        this.exibirApresentacao();
    }

    exibirApresentacao() {
        const welcomeElement = document.getElementById('welcome-message');
        welcomeElement.innerHTML = `
            <strong>Olá! Eu sou o seu assistente financeiro pessoal criado por Victorino Sérgio com a ajuda do DeepSeek!</strong> 💰
            <br><br>
            Como posso ajudar você hoje? Posso auxiliar com:
            <br>
            • 📊 Controle de gastos
            <br>
            • 💰 Economia e investimentos  
            <br>
            • 🎯 Metas financeiras
            <br>
            • 📈 Análise do seu orçamento
            <br><br>
            <em>Em que posso ser útil?</em>
        `;
    }

    adicionarTransacao(tipo, valor, descricao, categoria) {
        if (!valor || !descricao) {
            this.mostrarAlerta('Preencha todos os campos!', 'error');
            return;
        }

        const transacao = {
            id: Date.now(),
            tipo,
            valor: parseFloat(valor),
            descricao,
            categoria: categoria || 'outros',
            data: new Date().toLocaleDateString('pt-BR'),
            timestamp: new Date().getTime()
        };

        this.transacoes.unshift(transacao);
        this.salvarDados();
        this.atualizarInterface();
        this.mostrarAlerta('Transação adicionada com sucesso!', 'success');
    }

    calcularTotais() {
        const receitas = this.transacoes
            .filter(t => t.tipo === 'receita')
            .reduce((sum, t) => sum + t.valor, 0);
        
        const despesas = this.transacoes
            .filter(t => t.tipo === 'despesa')
            .reduce((sum, t) => sum + t.valor, 0);
        
        return {
            saldo: receitas - despesas,
            receitas,
            despesas,
            transacoes: this.transacoes.length
        };
    }

    async perguntarAssistente(pergunta) {
        if (!pergunta.trim()) {
            this.mostrarAlerta('Digite uma pergunta!', 'error');
            return;
        }

        const respostaElement = document.getElementById('resposta');
        const chatMessages = document.getElementById('chat-messages');
        
        // Adicionar mensagem do usuário ao chat
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.innerHTML = `<strong>Você:</strong> ${pergunta}`;
        chatMessages.appendChild(userMessage);

        respostaElement.textContent = '🤔 Victorino está pensando...';
        respostaElement.classList.add('show');

        try {
            const financialData = this.calcularTotais();
            
            const response = await fetch('/api/assistant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: pergunta,
                    financialData: financialData
                })
            });

            const data = await response.json();

            if (data.success) {
                respostaElement.textContent = data.response;
                
                // Adicionar resposta do assistente ao chat
                const assistantMessage = document.createElement('div');
                assistantMessage.className = 'message assistant-message';
                assistantMessage.innerHTML = `<strong>FinAssistant:</strong> ${data.response}`;
                chatMessages.appendChild(assistantMessage);
                
                // Scroll para a última mensagem
                chatMessages.scrollTop = chatMessages.scrollHeight;
            } else {
                respostaElement.textContent = data.response;
            }

        } catch (error) {
            console.error('Erro:', error);
            respostaElement.textContent = '❌ Erro de conexão. Verifique sua internet e tente novamente.';
        }
    }

    exportarDados() {
        if (this.transacoes.length === 0) {
            this.mostrarAlerta('Nenhum dado para exportar!', 'error');
            return;
        }

        const csv = this.converterParaCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `financas-victorino-${new Date().toLocaleDateString('pt-BR')}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.mostrarAlerta('Dados exportados com sucesso!', 'success');
    }

    converterParaCSV() {
        const headers = ['Data,Descrição,Categoria,Tipo,Valor'];
        const rows = this.transacoes.map(t => 
            `"${t.data}","${t.descricao}","${t.categoria}","${t.tipo}",${t.valor.toFixed(2)}`
        );
        return headers.concat(rows).join('\n');
    }

    limparDados() {
        if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
            this.transacoes = [];
            this.salvarDados();
            this.atualizarInterface();
            this.mostrarAlerta('Todos os dados foram limpos!', 'success');
        }
    }

    mostrarAlerta(mensagem, tipo) {
        alert(`[${tipo === 'success' ? '✅' : '⚠️'}] ${mensagem}`);
    }

    salvarDados() {
        localStorage.setItem('financialAssistantVictorino', JSON.stringify(this.transacoes));
    }

    carregarDados() {
        const dados = localStorage.getItem('financialAssistantVictorino');
        return dados ? JSON.parse(dados) : [];
    }

    atualizarInterface() {
        const totais = this.calcularTotais();
        
        // Atualizar dashboard
        document.getElementById('saldo').textContent = `R$ ${totais.saldo.toFixed(2)}`;
        document.getElementById('total-receitas').textContent = `R$ ${totais.receitas.toFixed(2)}`;
        document.getElementById('total-despesas').textContent = `R$ ${totais.despesas.toFixed(2)}`;
        
        // Atualizar cores do saldo
        const saldoElement = document.getElementById('saldo');
        saldoElement.style.color = totais.saldo >= 0 ? 'var(--success)' : 'var(--danger)';
        
        // Atualizar lista de transações
        this.atualizarListaTransacoes();
    }

    atualizarListaTransacoes() {
        const lista = document.getElementById('lista-transacoes');
        
        if (this.transacoes.length === 0) {
            lista.innerHTML = '<p class="empty-state">Nenhuma transação cadastrada</p>';
            return;
        }

        lista.innerHTML = this.transacoes
            .slice(0, 10)
            .map(transacao => `
                <div class="transacao-item ${transacao.tipo}">
                    <div class="transacao-info">
                        <div class="transacao-descricao">${transacao.descricao}</div>
                        <div class="transacao-meta">
                            ${transacao.categoria} • ${transacao.data}
                        </div>
                    </div>
                    <div class="transacao-valor">
                        ${transacao.tipo === 'receita' ? '+' : '-'} R$ ${transacao.valor.toFixed(2)}
                    </div>
                </div>
            `).join('');
    }
}

// Instanciar a aplicação
const app = new FinancialAssistant();

// Funções globais para o HTML
function adicionarTransacao() {
    const tipo = document.getElementById('tipo').value;
    const valor = document.getElementById('valor').value;
    const descricao = document.getElementById('descricao').value;
    const categoria = document.getElementById('categoria').value;

    app.adicionarTransacao(tipo, valor, descricao, categoria);
    
    // Limpar campos
    document.getElementById('valor').value = '';
    document.getElementById('descricao').value = '';
}

function perguntarAssistente() {
    const pergunta = document.getElementById('pergunta').value;
    if (!pergunta.trim()) return;
    
    app.perguntarAssistente(pergunta);
    
    // Limpar campo de pergunta
    document.getElementById('pergunta').value = '';
}

function exportarDados() {
    app.exportarDados();
}

function limparDados() {
    app.limparDados();
}

// Enter para adicionar transação e perguntar
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('valor').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') adicionarTransacao();
    });
    
    document.getElementById('descricao').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') adicionarTransacao();
    });
    
    document.getElementById('pergunta').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') perguntarAssistente();
    });
});
