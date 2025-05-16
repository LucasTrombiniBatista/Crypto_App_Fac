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

// Símbolo de moeda por código ISO
const CURRENCY_SYMBOLS = {
  'USD': '$',
  'BRL': 'R$',
  'EUR': '€',
  'GBP': '£',
  'JPY': '¥',
  'CNY': '¥',
  'KRW': '₩',
  'CAD': 'CA$',
  'AUD': 'A$',
  'HKD': 'HK$',
  'SGD': 'S$',
  'INR': '₹',
  'RUB': '₽'
};

// Função para buscar dados da API
async function fetchCryptoData() {
  try {
    // Mostrar estado de carregamento
    cryptoContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Carregando dados...</div>';
    
    // Chamada da API com a moeda selecionada
    const response = await fetch(`${API_BASE_URL}?currency=${currentCurrency}`);
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Verifica se os dados seguem o formato esperado da API CoinMarketCap
    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error('Formato de dados inválido recebido da API');
    }
    
    // Exibe os dados no dashboard
    displayCryptoData(data.data);
    
    // Atualiza o timestamp da última atualização
    if (data.status && data.status.timestamp) {
      const timestamp = new Date(data.status.timestamp).toLocaleString();
      updateTimeElement.textContent = timestamp;
    }
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    cryptoContainer.innerHTML = `<div class="loading error">Erro ao carregar dados: ${error.message}</div>`;
  }
}

// Função para exibir os dados das criptomoedas
function displayCryptoData(cryptos) {
  cryptoContainer.innerHTML = '';
  
  cryptos.forEach(crypto => {
    // Verifica se a criptomoeda tem dados na moeda atual
    if (!crypto.quote || !crypto.quote[currentCurrency]) {
      return; // Pula esta criptomoeda
    }
    
    const quoteData = crypto.quote[currentCurrency];
    const price = quoteData.price;
    const change1h = quoteData.percent_change_1h;
    const change24h = quoteData.percent_change_24h;
    const change7d = quoteData.percent_change_7d;
    
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
      <div class="crypto-price">${formatCurrencyByPrecision(price)}</div>
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
    
    // Armazena os dados completos para usar no modal
    const cryptoDetails = {
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
      price: price,
      change1h: change1h,
      change24h: change24h,
      change7d: change7d,
      change30d: quoteData.percent_change_30d || 0,
      change60d: quoteData.percent_change_60d || 0,
      change90d: quoteData.percent_change_90d || 0,
      market_cap: quoteData.market_cap || 0,
      volume_24h: quoteData.volume_24h || 0
    };
    
    detailsButton.dataset.crypto = JSON.stringify(cryptoDetails);
    
    // Adiciona evento de clique para abrir o modal
    detailsButton.addEventListener('click', function() {
      const cryptoData = JSON.parse(this.dataset.crypto);
      openCryptoDetails(cryptoData);
    });
    
    // Adiciona o botão ao card
    cryptoCard.appendChild(detailsButton);
    
    // Adiciona o card ao container
    cryptoContainer.appendChild(cryptoCard);
  });
}

// Função para formatar valores de moeda com precisão variável
function formatCurrencyByPrecision(value) {
  // Obtém o símbolo da moeda
  const symbol = CURRENCY_SYMBOLS[currentCurrency] || currentCurrency;
  
  // Determina a precisão adequada com base no valor
  let precision = 2;
  
  if (value < 1) {
    // Para valores pequenos, use mais casas decimais
    if (value < 0.0001) {
      precision = 8;
    } else if (value < 0.01) {
      precision = 6;
    } else if (value < 0.1) {
      precision = 4;
    }
  }
  
  // Formata o número de acordo com a moeda
  let formattedNumber;
  if (currentCurrency === 'BRL' || currentCurrency === 'EUR') {
    // Formato: 1.234,56
    formattedNumber = value.toFixed(precision).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  } else {
    // Formato: 1,234.56
    formattedNumber = value.toFixed(precision).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  return `${symbol} ${formattedNumber}`;
}

// Formata a mudança percentual
function formatChange(value) {
  if (value === null || value === undefined) return '-';
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
}

// Retorna a classe CSS para mudança positiva ou negativa
function getChangeClass(value) {
  if (value === null || value === undefined) return '';
  return value > 0 ? 'positive' : 'negative';
}

// Função para abrir o modal com detalhes da criptomoeda
function openCryptoDetails(cryptoData) {
  // Cria o modal se ainda não existir
  let modal = document.getElementById('crypto-details-modal');
  
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'crypto-details-modal';
    modal.className = 'modal';
    
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
    
    // Adiciona evento para fechar o modal
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
    });
    
    // Fecha o modal ao clicar fora dele
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
  
  // Atualiza o conteúdo do modal
  const modalTitle = document.getElementById('modal-crypto-name');
  const modalDetails = document.getElementById('modal-crypto-details');
  const priceSummary = modalDetails.querySelector('.crypto-price-summary');
  
  modalTitle.textContent = `${cryptoData.name} (${cryptoData.symbol})`;
  
  if (priceSummary) {
    const currentPrice = priceSummary.querySelector('.current-price');
    const priceChanges = priceSummary.querySelector('.price-changes');
    
    currentPrice.innerHTML = `
      <h3>Preço Atual</h3>
      <p class="price-value">${formatCurrencyByPrecision(cryptoData.price)}</p>
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
  
  // Renderiza o gráfico
  renderCryptoChart(cryptoData);
  
  // Exibe o modal
  modal.style.display = 'block';
}

// Função para renderizar o gráfico de preços
function renderCryptoChart(cryptoData) {
  const ctx = document.getElementById('crypto-chart').getContext('2d');
  
  // Dados históricos calculados com base nas variações percentuais
  const pastPrices = [
    {days: 90, change: cryptoData.change90d},
    {days: 60, change: cryptoData.change60d},
    {days: 30, change: cryptoData.change30d},
    {days: 7, change: cryptoData.change7d},
    {days: 1, change: cryptoData.change24h},
    {hours: 1, change: cryptoData.change1h}
  ];
  
  // Calcula os preços passados
  const prices = [];
  const labels = [];
  
  // Adiciona primeiro o preço atual (último ponto do gráfico)
  prices.push(cryptoData.price);
  labels.push('Agora');
  
  // Adiciona os preços históricos (do mais recente para o mais antigo)
  pastPrices.forEach(period => {
    if (period.change !== null && period.change !== undefined) {
      const pastPrice = calculatePastPrice(cryptoData.price, period.change);
      prices.unshift(pastPrice);
      
      if (period.hours) {
        labels.unshift(`${period.hours}h atrás`);
      } else {
        labels.unshift(`${period.days}d atrás`);
      }
    }
  });
  
  // Verifica se Chart.js está disponível
  if (typeof Chart === 'undefined') {
    // Carrega Chart.js se não estiver disponível
    loadChartJs(() => createChart(ctx, labels, prices, cryptoData.symbol));
  } else {
    // Cria o gráfico diretamente se Chart.js já estiver carregado
    createChart(ctx, labels, prices, cryptoData.symbol);
  }
}

// Função para calcular o preço no passado com base na variação percentual
function calculatePastPrice(currentPrice, percentChange) {
  if (percentChange === 0) return currentPrice;
  return currentPrice / (1 + (percentChange / 100));
}

// Função para criar o gráfico
function createChart(ctx, labels, prices, symbol) {
  // Destrói o gráfico anterior se existir
  if (window.cryptoChart) {
    window.cryptoChart.destroy();
  }
  
  // Cria o novo gráfico
  window.cryptoChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: `${symbol} Preço (${currentCurrency})`,
        data: prices,
        borderColor: '#4a6cf7',
        backgroundColor: 'rgba(74, 108, 247, 0.1)',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#4a6cf7',
        tension: 0.2,
        fill: true
      }]
    },
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
              return formatCurrencyByPrecision(context.parsed.y);
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

// Função para formatar valores monetários de forma curta (para os eixos do gráfico)
function formatCurrencyShort(value) {
  const symbol = CURRENCY_SYMBOLS[currentCurrency] || currentCurrency;
  
  let suffix = '';
  let divisor = 1;
  
  // Simplifica números grandes
  if (value >= 1e9) {
    suffix = 'B';
    divisor = 1e9;
  } else if (value >= 1e6) {
    suffix = 'M';
    divisor = 1e6;
  } else if (value >= 1e3) {
    suffix = 'K';
    divisor = 1e3;
  }
  
  // Formata o número simplificado
  let formattedValue;
  if (currentCurrency === 'BRL' || currentCurrency === 'EUR') {
    formattedValue = (value / divisor).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  } else {
    formattedValue = (value / divisor).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  return `${symbol} ${formattedValue}${suffix}`;
}

// Carrega Chart.js de forma assíncrona
function loadChartJs(callback) {
  if (document.querySelector('script[src*="chart.min.js"]')) {
    // Evita carregar várias vezes
    if (callback) setTimeout(callback, 500);
    return;
  }
  
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.1/chart.min.js';
  script.async = true;
  
  script.onload = function() {
    if (callback && typeof callback === 'function') {
      callback();
    }
  };
  
  document.head.appendChild(script);
}

// Event Listeners
currencySelect.addEventListener('change', (e) => {
  currentCurrency = e.target.value;
  fetchCryptoData();
});

refreshBtn.addEventListener('click', () => fetchCryptoData());

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Carrega Chart.js antecipadamente
  loadChartJs();
  
  // Carrega os dados iniciais
  fetchCryptoData();
});