const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para consultar DeepSeek API
app.post('/api/assistant', async (req, res) => {
    try {
        const { message, financialData } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Mensagem é obrigatória' });
        }

        // Verificar se é a primeira mensagem (apresentação)
        if (message.toLowerCase().includes('oi') || message.toLowerCase().includes('olá') || message.trim() === '') {
            return res.json({
                success: true,
                response: "**Olá! Eu sou o seu assistente financeiro pessoal criado por Victorino Sérgio com a ajuda do DeepSeek!** 💰\n\nComo posso ajudar você hoje? Posso auxiliar com:\n\n• 📊 Controle de gastos\n• 💰 Economia e investimentos\n• 🎯 Metas financeiras\n• 📈 Análise do seu orçamento\n\nEm que posso ser útil?",
                isGreeting: true
            });
        }

        // Verificar se a API key existe
        if (!process.env.DEEPSEEK_API_KEY) {
            return res.status(500).json({ 
                error: 'API key não configurada',
                message: 'Configure a DEEPSEEK_API_KEY no Render'
            });
        }

        const prompt = `
        Você é o FinAssistant, um assistente financeiro especializado criado por Victorino Sérgio.
        Seja prático, direto e útil, sempre com tom amigável e profissional.

        Dados do usuário (se disponíveis):
        - Saldo: R$ ${financialData?.saldo || 'N/A'}
        - Receitas: R$ ${financialData?.receitas || 'N/A'}
        - Despesas: R$ ${financialData?.despesas || 'N/A'}
        - Transações: ${financialData?.transacoes || 0}

        Pergunta do usuário: "${message}"

        Forneça uma resposta:
        1. Prática e acionável
        2. Com números específicos quando possível  
        3. Focada em melhorar a saúde financeira
        4. Em português do Brasil
        5. Máximo 200 palavras
        6. Assine como "FinAssistant - Criado por Victorino Sérgio"
        `;

        const response = await axios.post('https://api.deepseek.com/chat/completions', {
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: 'Você é o FinAssistant, assistente financeiro criado por Victorino Sérgio. Seja direto, prático e sempre assine como "FinAssistant - Criado por Victorino Sérgio".'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 500,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });

        const aiResponse = response.data.choices[0].message.content;
        
        res.json({ 
            success: true,
            response: aiResponse + "\n\n---\n*FinAssistant - Criado por Victorino Sérgio*",
            usage: response.data.usage
        });

    } catch (error) {
        console.error('❌ Erro na API DeepSeek:', error.response?.data || error.message);
        
        // Fallback personalizado
        const fallbackResponse = generateFallbackResponse(req.body.message);
        
        res.json({
            success: false,
            response: fallbackResponse + "\n\n---\n*FinAssistant - Criado por Victorino Sérgio*",
            error: 'Usando modo fallback - ' + (error.response?.data?.error?.message || error.message)
        });
    }
});

// Respostas de fallback personalizadas
function generateFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('economizar') || lowerMessage.includes('gastar menos')) {
        return "💡 **Dica para economizar do Victorino:**\n\n1. Rastreie todos os gastos por 15 dias\n2. Corte 3 gastos desnecessários este mês\n3. Use a regra 50-30-20 (necessidades-lazer-investimentos)\n4. Estabeleça metas semanais de economia\n\n*Comece hoje mesmo!*";
    }
    
    if (lowerMessage.includes('investir') || lowerMessage.includes('aplicar')) {
        return "💰 **Estratégia de investimentos do Victorino:**\n\n1. Reserva de emergência primeiro (6 meses)\n2. Tesouro Direto para segurança\n3. Diversificação é a chave\n4. Invista regularmente, não espere o momento perfeito\n\n*Sugestão: Reserve 15% da renda*";
    }
    
    if (lowerMessage.includes('dívida') || lowerMessage.includes('divida')) {
        return "🎯 **Plano anti-dívidas do Victorino:**\n\n1. Liste TODAS as dívidas\n2. Ataque as de juros mais altos primeiro\n3. Renegocie com credores\n4. Congere novas dívidas por 30 dias\n\n*Foco: Liberdade financeira!*";
    }
    
    if (lowerMessage.includes('saldo') || lowerMessage.includes('como estou')) {
        return "📊 **Análise financeira do Victorino:**\n\nPara uma análise completa:\n1. Adicione suas receitas e despesas\n2. Classifique por categorias\n3. Acompanhe diariamente\n4. Estabeleça metas realistas\n\n*Vamos começar? Adicione sua primeira transação!*";
    }
    
    return "🤖 **FinAssistant aqui! Criado por Victorino Sérgio**\n\nNo momento estou com limitações técnicas, mas posso ajudar com:\n\n• Controle financeiro básico\n• Dicas de economia\n• Estratégias simples de investimento\n\n*Qual sua dúvida financeira?*";
}

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Assistente Financeiro do Victorino está rodando!',
        author: 'Victorino Sérgio',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Assistente do Victorino rodando na porta ${PORT}`);
    console.log(`👨 Criado por: Victorino Sérgio`);
    console.log(`🤖 Integração: DeepSeek API`);
});
