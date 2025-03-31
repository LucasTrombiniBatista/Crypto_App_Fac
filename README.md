
# Monitoramento Automatizado de Criptomoedas 📈💰

Um sistema que coleta, armazena e analisa valores de criptomoedas em tempo real usando uma API pública e banco de dados MySQL.

## 🔍 Visão Geral

Este projeto foi desenvolvido para:
- Coletar dados atualizados das principais criptomoedas (Bitcoin, Ethereum, etc.)
- Armazenar historicamente os valores em banco de dados
- Permitir análises temporais e identificação de tendências
- Servir como base para aplicações mais complexas

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js
- **Banco de Dados**: MySQL
- **API de Criptomoedas**: CoinMarketCap (versão gratuita)

## ⚙️ Funcionalidades Principais

✔ Coleta automática de preços em intervalos configuráveis  
✔ Armazenamento histórico em banco de dados relacional  
✔ Estrutura preparada para expansão e análises futuras  
✔ Solução 100% gratuita usando API pública  

## 📌 Próximas Melhorias (Roadmap)

- [ ] Adicionar dashboard visual com gráficos
- [ ] Implementar sistema de alertas por e-mail
- [ ] Incluir análise de tendências básica
- [ ] Expandir para mais criptomoedas

## 🚀 Como Executar o Projeto

1. **Pré-requisitos**:
   - Node.js instalado
   - Servidor MySQL
   - Conta na CoinMarketCap (para chave API gratuita)

2. **Configuração**:
   ```bash
   git clone [URL do repositório]
   cd monitoramento-criptomoedas
   npm install
   ```

3. **Configurar variáveis de ambiente**:
   Criar arquivo `.env` com:
   ```
   DB_HOST=seu_host
   DB_USER=seu_usuario
   DB_PASS=sua_senha
   DB_NAME=nome_banco
   API_KEY=sua_chave_api
   ```

4. **Executar**:
   ```bash
   npm start
   ```

## 🤝 Como Contribuir

Contribuições são bem-vindas! Siga os passos:
1. Faça um Fork do projeto
2. Crie sua Branch (`git checkout -b feature/sua-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a Branch (`git push origin feature/sua-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

# npm v11.1.0
# node v20.17.0