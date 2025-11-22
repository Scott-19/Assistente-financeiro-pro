// app.js - Versão Ultra Simplificada e Testada
console.log('🇲🇿 FinAssistant Victorino - INICIADO!');

// Classe principal
class FinancialAssistant {
    constructor() {
        console.log('✅ Classe carregada!');
        this.transacoes = this.carregarDados();
        this.atualizarInterface();
        this.exibirMensagemBoasVindas();
    }

    exibirMensagemBoasVindas() {
        console.log('🎯 Exibindo boas-vindas...');
        const elemento = document.getElementById('welcome-message');
        if (elemento) {
            elemento.innerHTML = '<strong>Olá! Eu sou seu assistente financeiro criado por Victorino Sérgio! 🇲🇿</strong><br>Como posso ajudar?';
        } else {
            console.error('❌ Elemento welcome-message não encontrado!');
        }
    }

    adicionarTransacao() {
        console.log('➕ Tentando adicionar transação...');
        
        const tipo = document.getElementById('tipo').value;
        const valor = document.getElementById('valor').value;
        const descricao = document.getElementById('descricao').value;
        
        if (!valor || !descricao) {
            alert('❌ Preencha valor e descrição!');
            return;
        }

        console.log('📝 Dados:', { tipo, valor, descricao });

        // Criar transação
        const transacao = {
            id: Date.now(),
            tipo,
            valor: parseFloat(valor),
            descricao,
            data: new Date().toLocaleDateString('pt-BR')
        };

        // Adicionar à lista
        this.transacoes.unshift(transacao);
        
        // Salvar e atualizar
        this.salvarDados();
        this.atualizarInterface();
        
        // Limpar campos
        document.getElementById('valor').value = '';
        document.getElementById('descricao').value = '';
        
        alert('✅ Transação adicionada com sucesso!');
        console.log('💾 Transação salva!');
    }

    perguntarAssistente() {
        console.log('🤖 Iniciando assistente...');
        const pergunta = document.getElementById('pergunta').value;
        
        if (!pergunta) {
            alert('❌ Digite uma pergunta!');
            return;
        }

        const respostaElement = document.getElementById('resposta');
        if (!respostaElement) {
            console.error('❌ Elemento resposta não encontrado!');
            return;
        }

        respostaElement.innerHTML = '🤔 Victorino está pensando...';
        respostaElement.style.display = 'block';

        // Simular resposta
        setTimeout(() => {
            let resposta = '';
            
            if (pergunta.toLowerCase().includes('economizar')) {
                resposta = '💡 <strong>Dica do Victorino:</strong> Comece anotando todos os gastos por uma semana!';
            } else if (pergunta.toLowerCase().includes('investir')) {
                resposta = '💰 <strong>Estratégia Victorino:</strong> Reserve 10% do seu salário para investimentos!';
            } else {
                resposta = '🤖 <strong>FinAssistant Victorino:</strong> Posso ajudar com controle de gastos, economia e investimentos!';
            }
            
            respostaElement.innerHTML = resposta;
            console.log('✅ Resposta exibida!');
        }, 1000);
    }

    carregarDados() {
        const dados = localStorage.getItem('financasVictorino');
        console.log('📂 Dados carregados:', dados ? JSON.parse(dados).length : 0);
        return dados ? JSON.parse(dados) : [];
    }

    salvarDados() {
        localStorage.setItem('financasVictorino', JSON.stringify(this.transacoes));
        console.log('💾 Dados salvos:', this.transacoes.length);
    }

    atualizarInterface() {
        console.log('🔄 Atualizando interface...');
        
        // Calcular totais
        const receitas = this.transacoes.filter(t => t.tipo === 'receita').reduce((s, t) => s + t.valor, 0);
        const despesas = this.transacoes.filter(t => t.tipo === 'despesa').reduce((s, t) => s + t.valor, 0);
        const saldo = receitas - despesas;

        console.log('📊 Totais:', { saldo, receitas, despesas });

        // Atualizar display
        const saldoEl = document.getElementById('saldo');
        const receitasEl = document.getElementById('total-receitas');
        const despesasEl = document.getElementById('total-despesas');
        
        if (saldoEl) {
            saldoEl.textContent = `R$ ${saldo.toFixed(2)}`;
            saldoEl.style.color = saldo >= 0 ? 'green' : 'red';
        }
        if (receitasEl) receitasEl.textContent = `R$ ${receitas.toFixed(2)}`;
        if (despesasEl) despesasEl.textContent = `R$ ${despesas.toFixed(2)}`;

        // Atualizar lista
        this.atualizarListaTransacoes();
    }

    atualizarListaTransacoes() {
        const lista = document.getElementById('lista-transacoes');
        if (!lista) {
            console.error('❌ Elemento lista-transacoes não encontrado!');
            return;
        }

        if (this.transacoes.length === 0) {
            lista.innerHTML = '<p style="text-align: center; color: #666;">Nenhuma transação cadastrada</p>';
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

        console.log('✅ Lista atualizada!');
    }
}

// Criar instância global quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM Carregado - Iniciando FinAssistant...');
    window.appVictorino = new FinancialAssistant();
    console.log('✅ FinAssistant iniciado com sucesso!');
});

// Funções globais para os botões
function adicionarTransacao() {
    if (window.appVictorino) {
        window.appVictorino.adicionarTransacao();
    } else {
        console.error('❌ appVictorino não encontrado!');
        alert('Erro: Sistema não carregado. Recarregue a página.');
    }
}

function perguntarAssistente() {
    if (window.appVictorino) {
        window.appVictorino.perguntarAssistente();
    } else {
        console.error('❌ appVictorino não encontrado!');
        alert('Erro: Sistema não carregado. Recarregue a página.');
    }
}

console.log('📄 app.js carregado - aguardando DOM...');