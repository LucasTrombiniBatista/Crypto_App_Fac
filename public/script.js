// Constantes
const ICON_URL = 'https://s2.coinmarketcap.com/static/img/coins/64x64/';
const API_BASE_URL = 'http://localhost:3000/api/crypto';
const apiKey = process.env.COINMARKET_API_KEY;


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
    
    const response = await fetch(`${API_BASE_URL}?currency=${currentCurrency}`);
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    
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
    const price = crypto.quote[currentCurrency].price;
    const change1h = crypto.quote[currentCurrency].percent_change_1h;
    const change24h = crypto.quote[currentCurrency].percent_change_24h;
    const change7d = crypto.quote[currentCurrency].percent_change_7d;
    
    const cryptoCard = document.createElement('div');
    cryptoCard.className = 'crypto-card';
    
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

function formatChange(value) {
  return value ? `${value > 0 ? '+' : ''}${value.toFixed(2)}%` : '-';
}

function getChangeClass(value) {
  if (!value) return '';
  return value > 0 ? 'positive' : 'negative';
}

// Event Listeners
currencySelect.addEventListener('change', (e) => {
  currentCurrency = e.target.value;
  fetchCryptoData();
});

refreshBtn.addEventListener('click', fetchCryptoData);

// Inicialização
document.addEventListener('DOMContentLoaded', fetchCryptoData);


// Substitua a função fetchCryptoData por esta:
async function fetchCryptoData() {
  // Mostrar carregamento
  elements.chartLoader.style.display = 'flex';
  
  try {
      // Obter o ID da moeda selecionada
      const coinId = getCoinId(state.selectedCoin);
      
      // Buscar dados históricos
      const interval = state.timeframe === '1' ? 'h1' : 'd1';
      const historyResponse = await fetch(`https://api.coincap.io/v2/assets/${coinId}/history?interval=${interval}&start=${getStartTime()}&end=${Date.now()}`);
      const historyData = await historyResponse.json();
      
      // Buscar dados atuais
      const coinResponse = await fetch(`https://api.coincap.io/v2/assets/${coinId}`);
      const coinData = await coinResponse.json();
      
      // Atualizar o gráfico
      updateChart(historyData.data);
      
      // Atualizar informações
      updateCoinInfo(coinData.data);
      
  } catch (error) {
      console.error('Erro ao buscar dados:', error);
      alert('Erro ao buscar dados. Verifique o console para mais detalhes.');
  } finally {
      // Esconder carregamento
      elements.chartLoader.style.display = 'none';
  }
}

// Função para obter o timestamp inicial baseado no timeframe
function getStartTime() {
  const now = Date.now();
  const days = parseInt(state.timeframe);
  return now - (days * 24 * 60 * 60 * 1000);
}

// Mapear IDs para a API CoinCap
function getCoinId(cmcId) {
  const idMap = {
      '1': 'bitcoin',
      '1027': 'ethereum',
      '1839': 'binance-coin',
      '5426': 'solana',
      '52': 'xrp',
      '2010': 'cardano',
      '74': 'dogecoin'
  };
  
  return idMap[cmcId] || 'bitcoin';
}

// Modificar a função updateChart
function updateChart(priceData) {
  // Processar dados para o gráfico
  const labels = [];
  const prices = [];
  
  priceData.forEach(dataPoint => {
      const date = new Date(dataPoint.time);
      const formattedDate = formatDate(date);
      labels.push(formattedDate);
      prices.push(parseFloat(dataPoint.priceUsd));
  });
  
  // Atualizar dados do gráfico
  state.priceChart.data.labels = labels;
  state.priceChart.data.datasets[0].data = prices;
  
  // Atualizar o título do gráfico
  const coinName = elements.coinSelect.options[elements.coinSelect.selectedIndex].text;
  state.priceChart.data.datasets[0].label = `${coinName} - Preço USD`;
  
  // Atualizar o gráfico
  state.priceChart.update();
}

// Modificar a função updateCoinInfo
function updateCoinInfo(coinData) {
  // Atualizar preço atual
  elements.currentPrice.textContent = `$${formatNumber(parseFloat(coinData.priceUsd))}`;
  
  // Atualizar capitalização de mercado
  elements.marketCap.textContent = `$${formatLargeNumber(parseFloat(coinData.marketCapUsd))}`;
  
  // Atualizar volume 24h
  elements.volume24h.textContent = `$${formatLargeNumber(parseFloat(coinData.volumeUsd24Hr))}`;
  
  // Atualizar variação de preço 24h
  const change24h = parseFloat(coinData.changePercent24Hr);
  elements.change24h.textContent = `${change24h >= 0 ? '+' : ''}${formatNumber(change24h)}%`;
  elements.change24h.className = change24h >= 0 ? 'positive' : 'negative';
}