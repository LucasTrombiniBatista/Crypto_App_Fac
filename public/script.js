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
  
  cryptos.forEach(crypto => {
    // Obtenha os dados específicos para esta criptomoeda
    const price = crypto.quote[currentCurrency].price;
    const change1h = crypto.quote[currentCurrency].percent_change_1h;
    const change24h = crypto.quote[currentCurrency].percent_change_24h;
    const change7d = crypto.quote[currentCurrency].percent_change_7d;
    const change30d = crypto.quote[currentCurrency].percent_change_30d;
    const change60d = crypto.quote[currentCurrency].percent_change_60d;
    const change90d = crypto.quote[currentCurrency].percent_change_90d;
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
    
    // Cria o botão de detalhes
    const detailsButton = document.createElement('button');
    detailsButton.className = 'details-btn';
    detailsButton.textContent = 'Graficos';
    
    // Armazena os dados completos da criptomoeda no botão como um atributo de dados
    detailsButton.dataset.crypto = JSON.stringify({
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
      price: price,
      change1h: change1h,
      change24h: change24h,
      change7d: change7d,
      change30d: change30d,
      change60d: change60d,
      change90d: change90d
    });
    
    // Adicione o evento de clique
    detailsButton.addEventListener('click', function() {
      // Parse os dados JSON armazenados no botão
      const cryptoData = JSON.parse(this.dataset.crypto);
      openCryptoDetails(cryptoData);
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
function openCryptoDetails(cryptoData) {
  // Crie o elemento da tela se ainda não existir
  let modal = document.getElementById('crypto-details-modal');
  
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'crypto-details-modal';
    modal.className = 'modal';
    
    // Crie a estrutura interna da tela
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2 id="modal-crypto-name">Detalhes da Criptomoeda</h2>
        <div id="modal-crypto-details">
          <div class="crypto-price-summary">
            <div class="current-price"></div>
            <div class="price-changes"></div>
          </div>
          <div class="chart-container">
            <canvas id="crypto-chart"></canvas>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Adicione evento para fechar a tela
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
    });
    
    // Fechar a tela se clicar fora dele
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
  
  // Atualize o conteúdo da tela para a criptomoeda atual
  const modalTitle = document.getElementById('modal-crypto-name');
  const modalDetails = document.getElementById('modal-crypto-details');
  const priceSummary = modalDetails.querySelector('.crypto-price-summary');
  
  modalTitle.textContent = `${cryptoData.name} (${cryptoData.symbol})`;
  
  if (priceSummary) {
    const currentPrice = priceSummary.querySelector('.current-price');
    const priceChanges = priceSummary.querySelector('.price-changes');
    
    currentPrice.innerHTML = `
      <h3>Preço Atual</h3>
      <p class="price-value">${formatCurrency(cryptoData.price)}</p>
    `;
    
    priceChanges.innerHTML = `
      <h3>Variações</h3>
      <p>1h: <span class="${getChangeClass(cryptoData.change1h)}">${formatChange(cryptoData.change1h)}</span></p>
      <p>24h: <span class="${getChangeClass(cryptoData.change24h)}">${formatChange(cryptoData.change24h)}</span></p>
      <p>7d: <span class="${getChangeClass(cryptoData.change7d)}">${formatChange(cryptoData.change7d)}</span></p>
      <p>30d: <span class="${getChangeClass(cryptoData.change30d)}">${formatChange(cryptoData.change30d)}</span></p>
      <p>60d: <span class="${getChangeClass(cryptoData.change60d)}">${formatChange(cryptoData.change60d)}</span></p>
      <p>90d: <span class="${getChangeClass(cryptoData.change90d)}">${formatChange(cryptoData.change90d)}</span></p>
    `;
  }
  
  // Renderiza o gráfico com os dados específicos desta criptomoeda
  renderCryptoChart(cryptoData);
  
  // Mostrar a tela
  modal.style.display = 'block';
}

// Função para renderizar o gráfico
function renderCryptoChart(cryptoData) {
  // Obtém o contexto do canvas
  const ctx = document.getElementById('crypto-chart').getContext('2d');
  
  // Prepara os dados para o gráfico
  const chartData = {
    labels: ['90 dias atrás', '60 dias atrás', '30 dias atrás', '7 dias atrás', '24 horas atrás', '1 hora atrás', 'Agora'],
    datasets: [{
      label: `${cryptoData.symbol} Preço (${currentCurrency})`,
      data: [
        calculatePriceFromChange(cryptoData.price, cryptoData.change90d),
        calculatePriceFromChange(cryptoData.price, cryptoData.change60d),
        calculatePriceFromChange(cryptoData.price, cryptoData.change30d),
        calculatePriceFromChange(cryptoData.price, cryptoData.change7d),
        calculatePriceFromChange(cryptoData.price, cryptoData.change24h),
        calculatePriceFromChange(cryptoData.price, cryptoData.change1h),
        cryptoData.price
      ],
      borderColor: '#4a6cf7',
      backgroundColor: 'rgb(71, 71, 72)',
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: '#4a6cf7',
      tension: 0.2 // Adiciona uma curva suave
    }]
  };
  
  // Cria o gráfico
  if (window.cryptoChart) {
    window.cryptoChart.destroy();
  }
  
  window.cryptoChart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: function(value) {
              return formatCurrencyShort(value);
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return formatCurrency(context.parsed.y);
            }
          }
        },
        legend: {
          display: true,
          position: 'top'
        }
      }
    }
  });
}

// Função para calcular o preço anterior baseado na variação percentual
function calculatePriceFromChange(currentPrice, percentChange) {
  return currentPrice / (1 + (percentChange / 100));
}

// Função para formatar valores monetários de forma curta (para os eixos)
function formatCurrencyShort(value) {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currentCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  return formatter.format(value);
}

// Carregue a biblioteca Chart.js
function loadChartJs() {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.1/chart.min.js';
  script.onload = function() {
    console.log('Chart.js carregado com sucesso');
  };
  document.head.appendChild(script);
}

// Execute quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  loadChartJs();
  // O resto da inicialização que você já tem
  fetchCryptoData();
});
// Event Listeners
currencySelect.addEventListener('change', (e) => {
  currentCurrency = e.target.value;
  fetchCryptoData();
});

// Atualiza os dados ao clicar no botão de refresh
refreshBtn.addEventListener('click', fetchCryptoData);

// Inicialização
document.addEventListener('DOMContentLoaded', fetchCryptoData);