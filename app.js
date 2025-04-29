// app.js - Servidor Node.js para API de criptomoedas
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

// Configurações da API
const API_KEY = '3dc4359d-095b-4db8-91ff-984f85d5123e';
const API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

// Inicializando o Express
const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS
app.use(cors());

// Configurando o middleware para arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota para buscar dados de criptomoedas
app.get('/api/crypto', async (req, res) => {
  const currency = req.query.currency || 'BRL';
  const limit = req.query.limit || 20;

  // Validação de parâmetros
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY,
        'Accept': 'application/json'
      },
      params: {
        convert: currency,
        limit: limit
      }
    });

    // Adicionar timestamp atual
    const data = {
      data: response.data.data,
      timestamp: new Date().toLocaleString('pt-BR')
    };

    // Adiciona o timestamp atual à resposta
    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar dados da API:', error.message);
    res.status(500).json({ 
      error: `Erro ao buscar dados: ${error.response?.data?.status?.error_message || error.message}` 
    });
  }
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});



// //------------------------------------------------27/04/25----Lucas alter----test---------------------------------------------------------------------//
// // Rota para buscar IDs de criptomoedas
// // Esta rota retorna os IDs, nomes e símbolos das criptomoedas disponíveis na API
// // O endpoint é acessível em /api/crypto-ids

// app.get('/api/crypto-ids', async (req, res) => {
//   try{
//     const response = await axios.get(API_URL, {
//       headers: {
//         'X-CMC_PRO_API_KEY': API_KEY,
//         'Accept': 'application/json'
//       },
//       params: {
//         limit: 100 
//       }
//     });

//     const cryptoIds = response.data.data.map(crypto => ({
//       id: crypto.id,
//       name: crypto.name,
//       symbol: crypto.symbol
//     }));

//     res.json(cryptoIds);
//   } catch (error) {
//     console.error('Erro:', error.message);
//     res.status(500).json({ error: error.message });
//   }
// });