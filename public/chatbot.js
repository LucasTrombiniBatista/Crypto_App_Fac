document.addEventListener("DOMContentLoaded", function () {
    const chatbotContainer = document.getElementById("chatbot-container");
    const closeBtn = document.getElementById("close-btn");
    const sendBtn = document.getElementById("send-btn");
    const chatBotInput = document.getElementById("chatbot-input");
    const chatbotMessages = document.getElementById("chatbot-messages");
    const chatbotIcon = document.getElementById("chatbot-icon");
  
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
  
  // Função para obter resposta da API Gemini
  async function getBotResponse(userMessage) {
    // Substitua por sua chave API real
    API_KEY= 00
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  
    try {
      // Remover indicador de digitação quando a resposta chegar
      const removeTypingIndicator = () => {
        const typingIndicator = document.getElementById("typing-indicator");
        if (typingIndicator) {
          typingIndicator.remove();
        }
      };
  
      // Enviar solicitação para a API Gemini
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { 
                  text: `Você é um assistente especializado em criptomoedas. Responda de forma breve e útil à seguinte pergunta: ${userMessage}` 
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
