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