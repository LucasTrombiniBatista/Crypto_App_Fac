// Constantes
const ICON_URL = 'https://s2.coinmarketcap.com/static/img/coins/64x64/';
const API_BASE_URL = 'http://localhost:3000/api/crypto';

// Elementos do DOM
const cryptoContainer = document.getElementById('crypto-container');
const currencySelect = document.getElementById('currency-select');
const refreshBtn = document.getElementById('refresh-btn');
const updateTimeElement = document.getElementById('update-time');

// Moeda padrão
let currentCurrency = 'BRL';
let price;
let change1h;
let change24h;
let change7d;

// Função para buscar dados da API
async function fetchCryptoData() {
  try {
    // Mostrar estado de carregamento
    cryptoContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Carregando dados...</div>';
    
    // Verifica se a moeda selecionada é válida
    const response = await fetch(`${API_BASE_URL}?currency=${currentCurrency}`);
    

    // Verifica se a resposta da API é válida
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    // Verifica se a resposta é válida
    const data = await response.json();
    displayCryptoData(data.data);
    
    // Atualizar horário da última atualização
    updateTimeElement.textContent = data.timestamp;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    cryptoContainer.innerHTML = `<div class="loading error">Erro ao carregar dados: ${error.message}</div>`;
  }
}

// Função para exibir os dados das criptomoedas
function displayCryptoData(cryptos) {
  cryptoContainer.innerHTML = '';
  
  // Ordena as criptomoedas por preço em ordem decrescente
  cryptos.forEach(crypto => {
    price = crypto.quote[currentCurrency].price;
    change1h = crypto.quote[currentCurrency].percent_change_1h;
    change24h = crypto.quote[currentCurrency].percent_change_24h;
    change7d = crypto.quote[currentCurrency].percent_change_7d;
    console.log(crypto.name);                            // Adiciona log para verificar os dados da criptomoeda
    // Cria o card da criptomoeda
    const cryptoCard = document.createElement('div');
    cryptoCard.className = 'crypto-card';
    
    // Adiciona o conteúdo do card
    cryptoCard.innerHTML = `
      <div class="crypto-header">
        <img src="${ICON_URL}${crypto.id}.png" alt="${crypto.name}" class="crypto-icon" onerror="this.src='https://via.placeholder.com/40'">
        <div>
          <div class="crypto-name">${crypto.name}</div>
          <div class="crypto-symbol">${crypto.symbol}</div>
        </div>
      </div>
      <div class="crypto-price">${formatCurrency(price)}</div>
      <div class="crypto-change">
        <span>1h: <span class="${getChangeClass(change1h)}">${formatChange(change1h)}</span></span>
        <span>24h: <span class="${getChangeClass(change24h)}">${formatChange(change24h)}</span></span>
        <span>7d: <span class="${getChangeClass(change7d)}">${formatChange(change7d)}</span></span>
      </div>
    `;
    const detailsButton = document.createElement('button');
    detailsButton.className = 'details-btn';
    detailsButton.textContent = 'Graficos';
    detailsButton.dataset.id = crypto.id; // Ou qualquer identificador único da moeda
    
    // Adicione o evento de clique
    detailsButton.addEventListener('click', function() {
      openCryptoDetails(this.dataset.id);
    });
    
    // Anexe o botão ao card
    cryptoCard.appendChild(detailsButton);
    // Adiciona o card ao container
    cryptoContainer.appendChild(cryptoCard);
  });
}

// Funções auxiliares para formatação
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currentCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  }).format(value);
}

// Formata a mudança percentual
function formatChange(value) {
  return value ? `${value > 0 ? '+' : ''}${value.toFixed(2)}%` : '-';
}

// Retorna a classe CSS para mudança positiva ou negativa
function getChangeClass(value) {
  if (!value) return '';
  return value > 0 ? 'positive' : 'negative';
}
function openCryptoDetails(cryptoId) {
  // Crie o elemento modal se ainda não existir
  let modal = document.getElementById('crypto-details-modal');
  
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'crypto-details-modal';
    modal.className = 'modal';
    
    // Crie a estrutura interna do modal
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2 id="modal-crypto-name">Detalhes da Criptomoeda</h2>
        <div id="modal-crypto-details">
          <!-- Aqui você adicionará as informações adicionais -->
          <p>Carregando detalhes da moeda ${cryptoId}...</p>
          <!-- Espaço para informações futuras -->
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Adicione evento para fechar o modal
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
    });
    
    // Fechar o modal se clicar fora dele
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
  
  // Atualize o conteúdo do modal para a criptomoeda atual
  document.getElementById('modal-crypto-name').textContent = `Detalhes de: ${cryptoId}`;
  
  // Aqui você pode buscar e exibir informações adicionais sobre a moeda
  // fetchCryptoDetails(cryptoId);
  
  // Mostrar o modal
  modal.style.display = 'block';
}
// Event Listeners
currencySelect.addEventListener('change', (e) => {
  currentCurrency = e.target.value;
  fetchCryptoData();
});

// Atualiza os dados ao clicar no botão de refresh
refreshBtn.addEventListener('click', fetchCryptoData);

// Inicialização
document.addEventListener('DOMContentLoaded', fetchCryptoData);