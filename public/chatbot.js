document.addEventListener("DOMContentLoaded", function () {
  const chatbotContainer = document.getElementById("chatbot-container");
  const closeBtn = document.getElementById("close-btn");
  const sendBtn = document.getElementById("send-btn");
  const chatBotInput = document.getElementById("chatbot-input");
  const chatbotMessages = document.getElementById("chatbot-messages");
  const chatbotIcon = document.getElementById("chatbot-icon");

  // API Base URL para os dados de criptomoedas
  const API_BASE_URL = 'http://localhost:3000/api/crypto';
  const CRYPTO_CURRENCY = 'BRL'; // Moeda padrão

  // Animação de mostrar chatbot
  chatbotIcon.addEventListener("click", () => {
    chatbotContainer.classList.remove("hidden");
    chatbotIcon.style.display = "none";
    
    // Scroll para a última mensagem
    setTimeout(() => {
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }, 100);
  });
  
  // Animação de esconder chatbot
  closeBtn.addEventListener("click", () => {
    chatbotContainer.classList.add("hidden");
    chatbotIcon.style.display = "flex";
  });

  // Enviar mensagem ao clicar no botão
  sendBtn.addEventListener("click", sendMessage);

  // Enviar mensagem ao pressionar Enter
  chatBotInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // Focar no input quando o chatbot abrir
  chatbotIcon.addEventListener("click", () => {
    setTimeout(() => {
      chatBotInput.focus();
    }, 300);
  });
});

// Função para enviar mensagem
function sendMessage() {
  const userMessage = document.getElementById("chatbot-input").value.trim();
  if (userMessage) {
    appendMessage("user", userMessage);
    document.getElementById("chatbot-input").value = ""; // Limpa o campo de input
    
    // Adiciona um indicador de digitação
    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("message", "bot", "typing");
    typingIndicator.id = "typing-indicator";
    typingIndicator.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    document.getElementById("chatbot-messages").appendChild(typingIndicator);
    document.getElementById("chatbot-messages").scrollTop = document.getElementById("chatbot-messages").scrollHeight;
    
    // Obtém resposta do bot
    getBotResponse(userMessage);
  }
}

// Função para adicionar mensagem ao chat
function appendMessage(sender, message) {
  const messageContainer = document.getElementById("chatbot-messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);
  messageElement.textContent = message;
  messageContainer.appendChild(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Função para formatar os dados de criptomoeda para o contexto
function formatCryptoDataForContext(cryptos) {
  // Limitamos a 5 criptomoedas para não sobrecarregar o contexto
  const topCryptos = cryptos.slice(0, 5);
  
  let formattedData = "Dados de criptomoedas atualizados:\n";
  topCryptos.forEach(crypto => {
    const price = crypto.quote.BRL.price;
    const change24h = crypto.quote.BRL.percent_change_24h;
    
    formattedData += `${crypto.name} (${crypto.symbol}): ${formatCurrency(price)} | 24h: ${formatChange(change24h)}\n`;
  });
  return formattedData;
}

// Função para obter resposta da API Gemini, incluindo dados de criptomoedas
async function getBotResponse(userMessage) {
  // Chave da API do Gemini
  API_KEY="AIzaSyBboZnQRSQSN_truHu4sUg_ANWHuHkNxIw";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  const CRYPTO_API_URL = 'http://localhost:3000/api/crypto?currency=BRL';

  try {
    // Remover indicador de digitação quando a resposta chegar
    const removeTypingIndicator = () => {
      const typingIndicator = document.getElementById("typing-indicator");
      if (typingIndicator) {
        typingIndicator.remove();
      }
    };

    // Primeiro, buscar dados da API de criptomoedas
    let cryptoContext = "";
    try {
      const cryptoResponse = await fetch(CRYPTO_API_URL);
      if (cryptoResponse.ok) {
        const cryptoData = await cryptoResponse.json();
        cryptoContext = formatCryptoDataForContext(cryptoData.data);
      }
    } catch (cryptoError) {
      console.error("Erro ao buscar dados de criptomoedas:", cryptoError);
      // Continuamos mesmo se falhar a busca dos dados de cripto
    }

    // Enviar solicitação para a API Gemini, incluindo os dados de cripto
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { 
                text: `Você é um assistente especializado exclusivamente em criptomoedas. Responda apenas perguntas relacionadas a criptomoedas, incluindo Bitcoin, Ethereum, altcoins, blockchain, carteiras digitais, exchanges, segurança, mineração, NFTs e tendências de mercado. Ignore ou recuse educadamente qualquer pergunta que não seja sobre criptomoedas.

${cryptoContext}

Pergunta do usuário: ${userMessage}

Responda de forma breve e útil.` 
              }
            ],
          },
        ],
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 800,
        }
      }),
    });

    const data = await response.json();

    // Verificar se temos candidatos na resposta
    if (!data.candidates || !data.candidates.length) {
      throw new Error("Nenhuma resposta da API Gemini");
    }

    // Extrair a mensagem da resposta
    const botMessage = data.candidates[0].content.parts[0].text;
    
    // Remover indicador de digitação e adicionar a resposta
    removeTypingIndicator();
    appendMessage("bot", botMessage);
    
  } catch (error) {
    console.error("Erro:", error);
    
    // Em caso de erro, remover indicador de digitação e mostrar mensagem de erro
    const typingIndicator = document.getElementById("typing-indicator");
    if (typingIndicator) {
      typingIndicator.remove();
    }
    
    appendMessage(
      "bot",
      "Desculpe, estou com problemas para responder no momento. Por favor, tente novamente."
    );
  }
}

// Funções auxiliares para formatação
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  }).format(value);
}

// Formata a mudança percentual
function formatChange(value) {
  return value ? `${value > 0 ? '+' : ''}${value.toFixed(2)}%` : '-';
}

// Implementação da função para buscar informações específicas de criptomoedas
async function getCryptoInfo(cryptoSymbol) {
  const API_BASE_URL = 'http://localhost:3000/api/crypto';
  const currency = 'BRL';
  
  try {
    // Buscar todos os dados de criptomoedas
    const response = await fetch(`${API_BASE_URL}?currency=${currency}`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados de criptomoedas: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Encontrar a criptomoeda específica pelo símbolo
    const crypto = data.data.find(c => 
      c.symbol.toLowerCase() === cryptoSymbol.toLowerCase() || 
      c.name.toLowerCase().includes(cryptoSymbol.toLowerCase())
    );
    
    if (!crypto) {
      return null; // Criptomoeda não encontrada
    }
    
    // Extrair informações relevantes
    const price = crypto.quote[currency].price;
    const change1h = crypto.quote[currency].percent_change_1h;
    const change24h = crypto.quote[currency].percent_change_24h;
    const change7d = crypto.quote[currency].percent_change_7d;
    
    return {
      name: crypto.name,
      symbol: crypto.symbol,
      price: formatCurrency(price),
      change1h: formatChange(change1h),
      change24h: formatChange(change24h), 
      change7d: formatChange(change7d),
      trend: change24h > 0 ? "em alta" : "em baixa"
    };
  } catch (error) {
    console.error("Erro ao buscar informações da criptomoeda:", error);
    return null;
  }
}

// Função para detectar e processar perguntas específicas sobre criptomoedas
async function processSpecificCryptoQuestions(userMessage) {
  // Padrões para detectar perguntas sobre criptomoedas específicas
  const bitcoinPattern = /\b(bitcoin|btc)\b/i;
  const ethereumPattern = /\b(ethereum|eth)\b/i;
  const pricePattern = /\b(preço|valor|cotação|custa|vale)\b/i;
  const trendPattern = /\b(tendência|subindo|caindo|alta|baixa)\b/i;
  
  // Verificar se a mensagem contém referências a criptomoedas comuns
  let cryptoSymbol = null;
  
  if (bitcoinPattern.test(userMessage)) {
    cryptoSymbol = "BTC";
  } else if (ethereumPattern.test(userMessage)) {
    cryptoSymbol = "ETH";
  } else {
    // Procurar por outras criptomoedas comuns
    const cryptoMatches = userMessage.match(/\b(ada|sol|bnb|xrp|doge|dot|avax|shib)\b/i);
    if (cryptoMatches) {
      cryptoSymbol = cryptoMatches[0].toUpperCase();
    }
  }
  
  // Se encontrou referência a uma criptomoeda e a pergunta é sobre preço ou tendência
  if (cryptoSymbol && (pricePattern.test(userMessage) || trendPattern.test(userMessage))) {
    const cryptoInfo = await getCryptoInfo(cryptoSymbol);
    
    if (cryptoInfo) {
      // Construir resposta com dados atualizados da API
      let response = `Aqui estão as informações atualizadas sobre ${cryptoInfo.name} (${cryptoInfo.symbol}):\n`;
      response += `Preço atual: ${cryptoInfo.price}\n`;
      response += `Variação 1h: ${cryptoInfo.change1h}\n`;
      response += `Variação 24h: ${cryptoInfo.change24h}\n`;
      response += `Variação 7d: ${cryptoInfo.change7d}\n`;
      response += `Tendência atual: ${cryptoInfo.trend}`;
      
      return response;
    }
  }
  
  // Se não conseguir processar localmente, retornar null para usar o Gemini
  return null;
}

// Modificação na função getBotResponse para usar processamento local quando possível
async function getBotResponse(userMessage) {
  // Chave da API do Gemini
  API_KEY="AIzaSyBboZnQRSQSN_truHu4sUg_ANWHuHkNxIw";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  const CRYPTO_API_URL = 'http://localhost:3000/api/crypto?currency=BRL';

  try {
    // Remover indicador de digitação quando a resposta chegar
    const removeTypingIndicator = () => {
      const typingIndicator = document.getElementById("typing-indicator");
      if (typingIndicator) {
        typingIndicator.remove();
      }
    };

    // Primeiro, tentar processar localmente perguntas específicas sobre criptomoedas
    const localResponse = await processSpecificCryptoQuestions(userMessage);
    
    if (localResponse) {
      // Se conseguimos processar localmente, use essa resposta
      removeTypingIndicator();
      appendMessage("bot", localResponse);
      return;
    }

    // Caso contrário, buscar dados gerais da API de criptomoedas para contexto
    let cryptoContext = "";
    try {
      const cryptoResponse = await fetch(CRYPTO_API_URL);
      if (cryptoResponse.ok) {
        const cryptoData = await cryptoResponse.json();
        cryptoContext = formatCryptoDataForContext(cryptoData.data);
      }
    } catch (cryptoError) {
      console.error("Erro ao buscar dados de criptomoedas:", cryptoError);
      // Continuamos mesmo se falhar a busca dos dados de cripto
    }

    // Enviar solicitação para a API Gemini, incluindo os dados de cripto
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { 
                text: `Você é um assistente especializado exclusivamente em criptomoedas. Responda apenas perguntas relacionadas a criptomoedas, incluindo Bitcoin, Ethereum, altcoins, blockchain, carteiras digitais, exchanges, segurança, mineração, NFTs e tendências de mercado. Ignore ou recuse educadamente qualquer pergunta que não seja sobre criptomoedas.

${cryptoContext}

Pergunta do usuário: ${userMessage}

Responda de forma breve e útil.` 
              }
            ],
          },
        ],
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 800,
        }
      }),
    });

    const data = await response.json();

    // Verificar se temos candidatos na resposta
    if (!data.candidates || !data.candidates.length) {
      throw new Error("Nenhuma resposta da API Gemini");
    }

    // Extrair a mensagem da resposta
    const botMessage = data.candidates[0].content.parts[0].text;
    
    // Remover indicador de digitação e adicionar a resposta
    removeTypingIndicator();
    appendMessage("bot", botMessage);
    
  } catch (error) {
    console.error("Erro:", error);
    
    // Em caso de erro, remover indicador de digitação e mostrar mensagem de erro
    const typingIndicator = document.getElementById("typing-indicator");
    if (typingIndicator) {
      typingIndicator.remove();
    }
    
    appendMessage(
      "bot",
      "Desculpe, estou com problemas para responder no momento. Por favor, tente novamente."
    );
  }
}

