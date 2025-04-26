const cryptoData = [
          { 
            id: 'bitcoin', 
            symbol: 'btc', 
            name: 'Bitcoin', 
            image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
            current_price: 45632.78,
            market_cap: 861200000000,
            volume_24h: 28100000000,
            price_change_percentage_24h: 2.4,
            price_change_percentage_7d: 5.2,
            high_24h: 46214.35,
            low_24h: 44782.14,
            open_24h: 44582.21,
            sparkline_7d: [43200, 43800, 44500, 44200, 44800, 45400, 45632],
            rank: 1
          },
          { 
            id: 'ethereum', 
            symbol: 'eth', 
            name: 'Ethereum', 
            image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
            current_price: 2432.56,
            market_cap: 293400000000,
            volume_24h: 14500000000,
            price_change_percentage_24h: -1.8,
            price_change_percentage_7d: 3.5,
            high_24h: 2467.89,
            low_24h: 2398.21,
            open_24h: 2464.32,
            sparkline_7d: [2350, 2380, 2420, 2400, 2450, 2420, 2432],
            rank: 2
          },
          { 
            id: 'binancecoin', 
            symbol: 'bnb', 
            name: 'Binance Coin', 
            image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
            current_price: 567.34,
            market_cap: 87900000000,
            volume_24h: 1820000000,
            price_change_percentage_24h: 0.7,
            price_change_percentage_7d: 1.2,
            high_24h: 573.12,
            low_24h: 562.45,
            open_24h: 564.25,
            sparkline_7d: [560, 562, 565, 568, 570, 565, 567],
            rank: 3
          },
          { 
            id: 'solana', 
            symbol: 'sol', 
            name: 'Solana', 
            image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
            current_price: 142.78,
            market_cap: 58200000000,
            volume_24h: 2340000000,
            price_change_percentage_24h: 5.2,
            price_change_percentage_7d: 8.7,
            high_24h: 145.32,
            low_24h: 135.67,
            open_24h: 136.25,
            sparkline_7d: [130, 132, 135, 138, 140, 142, 143],
            rank: 4
          },
          { 
            id: 'cardano', 
            symbol: 'ada', 
            name: 'Cardano', 
            image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
            current_price: 0.498,
            market_cap: 17600000000,
            volume_24h: 678000000,
            price_change_percentage_24h: 1.3,
            price_change_percentage_7d: -0.8,
            high_24h: 0.508,
            low_24h: 0.487,
            open_24h: 0.492,
            sparkline_7d: [0.50, 0.51, 0.505, 0.495, 0.49, 0.495, 0.498],
            rank: 5
          },
          { 
            id: 'ripple', 
            symbol: 'xrp', 
            name: 'XRP', 
            image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
            current_price: 0.612,
            market_cap: 33200000000,
            volume_24h: 1420000000,
            price_change_percentage_24h: -0.5,
            price_change_percentage_7d: 2.1,
            high_24h: 0.623,
            low_24h: 0.608,
            open_24h: 0.615,
            sparkline_7d: [0.60, 0.605, 0.615, 0.62, 0.618, 0.615, 0.612],
            rank: 6
          },
          { 
            id: 'dogecoin', 
            symbol: 'doge', 
            name: 'Dogecoin', 
            image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
            current_price: 0.134,
            market_cap: 18900000000,
            volume_24h: 875000000,
            price_change_percentage_24h: 8.2,
            price_change_percentage_7d: 12.5,
            high_24h: 0.142,
            low_24h: 0.126,
            open_24h: 0.124,
            sparkline_7d: [0.118, 0.120, 0.125, 0.127, 0.130, 0.132, 0.134],
            rank: 7
          },
          { 
            id: 'polkadot', 
            symbol: 'dot', 
            name: 'Polkadot', 
            image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
            current_price: 6.89,
            market_cap: 9400000000,
            volume_24h: 367000000,
            price_change_percentage_24h: 2.1,
            price_change_percentage_7d: -1.3,
            high_24h: 7.02,
            low_24h: 6.75,
            open_24h: 6.76,
            sparkline_7d: [7.00, 6.95, 6.90, 6.85, 6.80, 6.87, 6.89],
            rank: 8
          }
        ];
      
        // Dados simulados de gráficos
        const marketChartData = [2.1, 2.15, 2.18, 2.2, 2.25, 2.27, 2.3];
        const volumeChartData = [95, 92, 88, 90, 92, 91, 92.1];
        const dominanceChartData = [47.3, 47.5, 47.8, 48.0, 48.1, 48.2, 48.2];
      
        // Dados de gráfico simulados para diferentes períodos
        const generateChartData = (basePrice, volatility, dataPoints) => {
          let price = basePrice;
          const data = [];
          const now = new Date();
          
          for (let i = dataPoints; i >= 0; i--) {
            const timestamp = new Date(now);
            timestamp.setHours(now.getHours() - i);
            
            // Simular flutuações de preço
            let change = (Math.random() - 0.5) * volatility;
            price = Math.max(0, price + change);
            
            data.push({
              timestamp,
              price
            });
          }
          
          return data;
        };
      
        // Gerar dados para diferentes períodos de tempo
        const timeframes = {
          '1d': generateChartData(45632.78, 200, 24),
          '1w': generateChartData(45632.78, 400, 24 * 7),
          '1m': generateChartData(45632.78, 800, 24 * 30),
          '3m': generateChartData(45632.78, 1600, 24 * 90),
          '1y': generateChartData(45632.78, 3000, 24 * 365),
          'all': generateChartData(45632.78, 5000, 24 * 365 * 3)
        };
      
        // Estado da aplicação
        let state = {
          selectedCoin: cryptoData[0],
          timeframe: '1m',
          chartType: 'line',
          isDarkMode: false,
          mainChart: null,
          marketChart: null,
          volumeChart: null,
          dominanceChart: null
        };
      
        // Referências a elementos DOM
        const elements = {
          themeToggle: document.getElementById('theme-toggle'),
          selectedCoin: document.getElementById('selected-coin'),
          coinDropdown: document.getElementById('coin-dropdown'),
          coinList: document.getElementById('coin-list'),
          coinSearch: document.getElementById('coin-search'),
          currentPrice: document.getElementById('current-price'),
          priceChange: document.getElementById('price-change'),
          chartLoading: document.getElementById('chart-loading'),
          priceChart: document.getElementById('price-chart'),
          marketChart: document.getElementById('market-chart'),
          volumeChart: document.getElementById('volume-chart'),
          dominanceChart: document.getElementById('dominance-chart'),
          marketCap: document.getElementById('market-cap'),
          volume: document.getElementById('volume'),
          high24h: document.getElementById('high-24h'),
          low24h: document.getElementById('low-24h'),
          openPrice: document.getElementById('open-price'),
          assetsTableBody: document.getElementById('assets-table-body'),
          timeFilter: document.getElementById('time-filter'),
          chartTypeButtons: document.querySelectorAll('.chart-type-btn')
        };
      
        // Inicialização
        function init() {
          renderCoinList();
          renderAssetsTable();
          updateSelectedCoin(state.selectedCoin);
          initCharts();
          
          // Esconder o loader após a inicialização
          setTimeout(() => {
            elements.chartLoading.style.display = 'none';
          }, 800);
          
          setupEventListeners();
        }
      
        // Renderização da lista de moedas no dropdown
        function renderCoinList() {
          elements.coinList.innerHTML = '';
          
          cryptoData.forEach(coin => {
            const coinItem = document.createElement('div');
            coinItem.className = 'coin-item';
            coinItem.innerHTML = `
              <img src="${coin.image}" alt="${coin.name}">
              <div>
                <div class="coin-item-name">${coin.name}</div>
                <div class="coin-item-symbol">${coin.symbol.toUpperCase()}</div>
              </div>
            `;
            
            coinItem.addEventListener('click', () => {
              updateSelectedCoin(coin);
              toggleCoinDropdown();
            });
            
            elements.coinList.appendChild(coinItem);
          });
        }
      
        // Renderização da tabela de ativos
        function renderAssetsTable() {
          elements.assetsTableBody.innerHTML = '';
          
          cryptoData.forEach(coin => {
            const tr = document.createElement('tr');
            
            const change24hClass = coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative';
            const change7dClass = coin.price_change_percentage_7d >= 0 ? 'positive' : 'negative';
            
            tr.innerHTML = `
              <td>${coin.rank}</td>
              <td>
                <div class="coin-cell">
                  <img src="${coin.image}" alt="${coin.name}">
                  <div class="coin-info">
                    <span class="coin-name">${coin.name}</span>
                    <span class="coin-symbol">${coin.symbol.toUpperCase()}</span>
                  </div>
                </div>
              </td>
              <td>$${formatNumber(coin.current_price)}</td>
              <td class="change-cell ${change24hClass}">
                ${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(1)}%
              </td>
              <td class="change-cell ${change7dClass}">
                ${coin.price_change_percentage_7d >= 0 ? '+' : ''}${coin.price_change_percentage_7d.toFixed(1)}%
              </td>
              <td>$${formatMarketValue(coin.market_cap)}</td>
              <td>$${formatMarketValue(coin.volume_24h)}</td>
              <td>
                <canvas class="sparkline" id="sparkline-${coin.id}"></canvas>
              </td>
            `;
            
            tr.addEventListener('click', () => {
              updateSelectedCoin(coin);
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            });
            
            elements.assetsTableBody.appendChild(tr);
          });
          
          // Renderizar sparklines para cada moeda
          setTimeout(() => {
            cryptoData.forEach(coin => {
              renderSparkline(coin);
            });
          }, 100);
        }
      
        // Renderizar sparkline para uma moeda
        function renderSparkline(coin) {
          const canvas = document.getElementById(`sparkline-${coin.id}`);
          if (!canvas) return;
          
          const ctx = canvas.getContext('2d');
          const isPositive = coin.price_change_percentage_7d >= 0;
          const color = isPositive ? '#22C55E' : '#EF4444';
          
          new Chart(ctx, {
            type: 'line',
            data: {
              labels: ['', '', '', '', '', '', ''],
              datasets: [{
                data: coin.sparkline_7d,
                borderColor: color,
                borderWidth: 2,
                fill: false,
                pointRadius: 0,
                tension: 0.4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
              },
              scales: {
                x: { display: false },
                y: { display: false }
              },
              animation: false
            }
          });
        }
      
        // Atualiza a moeda selecionada
        function updateSelectedCoin(coin) {
          state.selectedCoin = coin;
          
          // Atualizar o elemento de moeda selecionada
          elements.selectedCoin.innerHTML = `
            <img src="${coin.image}" alt="${coin.name}">
            <div>
              <h2>${coin.name}</h2>
              <span>${coin.symbol.toUpperCase()}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          `;
          
          // Atualizar as informações de preço
          elements.currentPrice.textContent = `$${formatNumber(coin.current_price)}`;
          
          const priceChangeEl = elements.priceChange;
          const isPositive = coin.price_change_percentage_24h >= 0;
          
          priceChangeEl.className = isPositive ? 'price-change positive' : 'price-change negative';
          priceChangeEl.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              ${isPositive 
                ? '<path d="m6 9 6-6 6 6"/><path d="M6 12h12"/><path d="m6 15 6 6 6-6"/>'
                : '<path d="m6 15 6 6 6-6"/><path d="M6 12h12"/><path d="m6 9 6-6 6 6"/>'}
            </svg>
            <span>${Math.abs(coin.price_change_percentage_24h).toFixed(1)}%</span>
          `;
          
          // Atualizar dados de mercado
          elements.marketCap.textContent = `$${formatMarketValue(coin.market_cap)}`;
          elements.volume.textContent = `$${formatMarketValue(coin.volume_24h)}`;
          elements.high24h.textContent = `$${formatNumber(coin.high_24h)}`;
          elements.low24h.textContent = `$${formatNumber(coin.low_24h)}`;
          elements.openPrice.textContent = `$${formatNumber(coin.open_24h)}`;
          
          // Atualizar o gráfico
          updateMainChart();
        }
      
        // Inicializa os gráficos
        function initCharts() {
          initMainChart();
          initOverviewCharts();
        }
      
        // Inicializa o gráfico principal
        function initMainChart() {
          const ctx = elements.priceChart.getContext('2d');
          
          // Configurações de cores baseadas no tema
          const isDark = state.isDarkMode;
          const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
          const textColor = isDark ? '#94A3B8' : '#64748B';
          
          // Criação do gráfico
          state.mainChart = new Chart(ctx, {
            type: 'line',
            data: {
              datasets: [{
                label: state.selectedCoin.name,
                data: [],
                borderColor: '#8B5CF6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#8B5CF6',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
                tension: 0.4,
                fill: true
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                  backgroundColor: isDark ? '#1E293B' : '#FFF',
                  titleColor: isDark ? '#FFF' : '#1E293B',
                  bodyColor: isDark ? '#CBD5E1' : '#64748B',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                  borderWidth: 1,
                  titleFont: {
                    size: 14,
                    weight: 'bold'
                  },
                  bodyFont: {
                    size: 12
                  },
                  padding: 12,
                  displayColors: false,
                  callbacks: {
                    title: function(tooltipItems) {
                      const date = new Date(tooltipItems[0].parsed.x);
                      return date.toLocaleString();
                    },
                    label: function(context) {
                      return `$${formatNumber(context.parsed.y)}`;
                    }
                  }
                }
              },
              scales: {
                x: {
                  type: 'time',
                  time: {
                    unit: 'day',
                    tooltipFormat: 'PP'
                  },
                  grid: {
                    display: false
                  },
                  ticks: {
                    color: textColor,
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 6
                  }
                },
                y: {
                  grid: {
                    color: gridColor
                  },
                  ticks: {
                    color: textColor,
                    callback: function(value) {
                      return '$' + formatNumber(value);
                    }
                  }
                }
              },
              interaction: {
                mode: 'index',
                intersect: false
              },
              hover: {
                mode: 'index',
                intersect: false
              }
            }
          });
          
          // Atualizar os dados do gráfico
          updateMainChart();
        }
      
        // Inicializa os gráficos de visão geral
        function initOverviewCharts() {
          // Configurações comuns para os gráficos de visão geral
          const commonOptions = {
            type: 'line',
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false }
              },
              scales: {
                x: { display: false },
                y: { display: false }
              },
              elements: {
                point: { radius: 0 },
                line: { tension: 0.4 }
              }
            }
          };
          
          // Gráfico de Market Cap
          state.marketChart = new Chart(elements.marketChart.getContext('2d'), {
            ...commonOptions,
            data: {
              labels: ['', '', '', '', '', '', ''],
              datasets: [{
                data: marketChartData,
                borderColor: '#8B5CF6',
                borderWidth: 2,
                fill: true,
                backgroundColor: 'rgba(139, 92, 246, 0.1)'
              }]
            }
          });
          
          // Gráfico de Volume
          state.volumeChart = new Chart(elements.volumeChart.getContext('2d'), {
            ...commonOptions,
            data: {
              labels: ['', '', '', '', '', '', ''],
              datasets: [{
                data: volumeChartData,
                borderColor: '#EF4444',
                borderWidth: 2,
                fill: true,
                backgroundColor: 'rgba(239, 68, 68, 0.1)'
              }]
            }
          });
          
          // Gráfico de Dominância BTC
          state.dominanceChart = new Chart(elements.dominanceChart.getContext('2d'), {
            ...commonOptions,
            data: {
              labels: ['', '', '', '', '', '', ''],
              datasets: [{
                data: dominanceChartData,
                borderColor: '#F97316',
                borderWidth: 2,
                fill: true,
                backgroundColor: 'rgba(249, 115, 22, 0.1)'
              }]
            }
          });
        }
      
        // Atualiza os dados do gráfico principal
        function updateMainChart() {
          if (!state.mainChart) return;
          
          elements.chartLoading.style.display = 'flex';
          
          // Simular carregamento de dados
          setTimeout(() => {
            // Obter dados para o período de tempo selecionado
            const chartData = timeframes[state.timeframe];
            
            // Ajustar a escala de tempo baseada no período de tempo
            let timeUnit = 'hour';
            if (state.timeframe === '1w') timeUnit = 'day';
            if (state.timeframe === '1m' || state.timeframe === '3m') timeUnit = 'day';
            if (state.timeframe === '1y' || state.timeframe === 'all') timeUnit = 'month';
            
            state.mainChart.options.scales.x.time.unit = timeUnit;
            
            // Atualizar dados do gráfico
            state.mainChart.data.datasets[0].label = state.selectedCoin.name;
            
            // Converter dados para o formato esperado pelo Chart.js
            const formattedData = chartData.map(item => ({
              x: item.timestamp,
              y: item.price * (state.selectedCoin.current_price / 45632.78) // Ajustar para o preço atual da moeda
        // Chave API da CoinMarketCap
        const apiKey = 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c';
        
        // Estado da aplicação
        let state = {
          selectedCoin: null,
          timeframe: '1m',
          chartType: 'line',
          isDarkMode: false,
          mainChart: null,
          marketChart: null,
          volumeChart: null,
          dominanceChart: null,
          cryptoData: []
        };
      
        // Referências a elementos DOM
        const elements = {
          themeToggle: document.getElementById('theme-toggle'),
          selectedCoin: document.getElementById('selected-coin'),
          coinDropdown: document.getElementById('coin-dropdown'),
          coinList: document.getElementById('coin-list'),
          coinSearch: document.getElementById('coin-search'),
          currentPrice: document.getElementById('current-price'),
          priceChange: document.getElementById('price-change'),
          chartLoading: document.getElementById('chart-loading'),
          priceChart: document.getElementById('price-chart'),
          marketChart: document.getElementById('market-chart'),
          volumeChart: document.getElementById('volume-chart'),
          dominanceChart: document.getElementById('dominance-chart'),
          marketCap: document.getElementById('market-cap'),
          volume: document.getElementById('volume'),
          high24h: document.getElementById('high-24h'),
          low24h: document.getElementById('low-24h'),
          openPrice: document.getElementById('open-price'),
          assetsTableBody: document.getElementById('assets-table-body'),
          timeFilter: document.getElementById('time-filter'),
          chartTypeButtons: document.querySelectorAll('.chart-type-btn')
        };
      
        // Inicialização
        async function init() {
          // Mostrar o loader durante a inicialização
          elements.chartLoading.style.display = 'flex';
          
          try {
      