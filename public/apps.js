// app.js - Versão Super Simplificada para Celular
console.log('🇲🇿 FinAssistant Victorino - Carregado!');

// Classe principal
class FinancialAssistant {
    constructor() {
        this.transacoes = this.carregarDados();
        this.exibirBoasVindas();
        this.atualizarDashboard();
    }

    exibirBoasVindas() {
        const elemento = document.getElementById('welcome-message');
        if (elemento) {
            elemento.innerHTML = '<strong>Olá! Eu sou seu assistente financeiro criado por Victorino Sérgio! 🇲🇿</strong><br>Como posso ajudar?';
        }
    }

    adicionarTransacao() {
        const tipo = document.getElementById('tipo').value;
        const valor = document.getElementById('valor').value;
        const descricao = document.getElementById('descricao').value;
        
        if (!valor || !descricao) {
            alert('Preencha valor e descrição!');
            return;
        }

        const transacao = {
            id: Date.now(),
            tipo,
            valor: parseFloat(valor),
            descricao,
            data: new Date().toLocaleDateString('pt-BR')
        };

        this.transacoes.unshift(transacao);
        this.salvarDados();
        this.atualizarDashboard();
        
        // Limpar campos
        document.getElementById('valor').value = '';
        document.getElementById('descricao').value = '';
        
        alert('Transação adicionada! ✅');
    }

    perguntarAssistente() {
        const pergunta = document.getElementById('pergunta').value;
        
        if (!pergunta) {
            alert('Digite uma pergunta!');
            return;
        }

        const respostaElement = document.getElementById('resposta');
        respostaElement.innerHTML = '🤔 Pensando...';
        respostaElement.style.display = 'block';

        // Resposta simples sem API
        setTimeout(() => {
            let resposta = '';
            
            if (pergunta.toLowerCase().includes('economizar')) {
                resposta = '💡 <strong>Dica do Victorino:</strong> Anote todos gastos, corte supérfluos, use regra 50-30-20!';
            } else if (pergunta.toLowerCase().includes('investir')) {
                resposta = '💰 <strong>Estratégia Victorino:</strong> Reserve 10% do salário, comece com poupança!';
            } else {
                resposta = '🤖 <strong>FinAssistant Victorino:</strong> Posso ajudar com controle de gastos, economia e investimentos!';
            }
            
            respostaElement.innerHTML = resposta + '<br><br><em>Victorino Sérgio - Moçambique 🇲🇿</em>';
        }, 1000);
    }

    carregarDados() {
        const dados = localStorage.getItem('financasVictorino');
        return dados ? JSON.parse(dados) : [];
    }

    salvarDados() {
        localStorage.setItem('financasVictorino', JSON.stringify(this.transacoes));
    }

    atualizarDashboard() {
        const receitas = this.transacoes.filter(t => t.tipo === 'receita').reduce((s, t) => s + t.valor, 0);
        const despesas = this.transacoes.filter(t => t.tipo === 'despesa').reduce((s, t) => s + t.valor, 0);
        const saldo = receitas - despesas;

        // Atualizar display
        const saldoEl = document.getElementById('saldo');
        const receitasEl = document.getElementById('total-receitas');
        const despesasEl = document.getElementById('total-despesas');
        
        if (saldoEl) saldoEl.textContent = `R$ ${saldo.toFixed(2)}`;
        if (receitasEl) receitasEl.textContent = `R$ ${receitas.toFixed(2)}`;
        if (despesasEl) despesasEl.textContent = `R$ ${despesas.toFixed(2)}`;

        // Atualizar lista
        this.atualizarListaTransacoes();
    }

    atualizarListaTransacoes() {
        const lista = document.getElementById('lista-transacoes');
        if (!lista) return;

        if (this.transacoes.length === 0) {
            lista.innerHTML = '<p style="text-align: center; color: #666;">Nenhuma transação</p>';
            return;
        }

        lista.innerHTML = this.transacoes.slice(0, 5).map(transacao => `
            <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee;">
                <div>
                    <div style="font-weight: bold;">${transacao.descricao}</div>
                    <div style="font-size: 12px; color: #666;">${transacao.data}</div>
                </div>
                <div style="color: ${transacao.tipo === 'receita' ? 'green' : 'red'}; font-weight: bold;">
                    ${transacao.tipo === 'receita' ? '+' : '-'} R$ ${transacao.valor.toFixed(2)}
                </div>
            </div>
        `).join('');
    }
}

// Criar instância global
const appVictorino = new FinancialAssistant();

// Funções globais para os botões
function adicionarTransacao() {
    appVictorino.adicionarTransacao();
}

function perguntarAssistente() {
    appVictorino.perguntarAssistente();
}

console.log('✅ App Victorino pronto!');