const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.APISPORTS_KEY) {
  console.warn("Warning: APISPORTS_KEY não definido. Configure .env com APISPORTS_KEY");
}
if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
  console.warn("Warning: TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID não definidos. Configure .env");
}

app.use(cors());
app.use(express.json());

// Serve arquivos estáticos (para imagens em public/images/)
app.use('/images', express.static('public/images'));
app.use(express.static('public')); // servir o frontend em public/

/* rate limiting básico */
const limiter = rateLimit({
  windowMs: 10 * 1000, // 10s
  max: 100 // requisições por IP por window
});
app.use(limiter);

// Proxy para fixtures
app.get('/api/fixtures', async (req, res) => {
  try {
    const query = new URLSearchParams(req.query).toString();
    const url = `https://v3.football.api-sports.io/fixtures${query ? '?' + query : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'x-apisports-key': process.env.APISPORTS_KEY }
    });
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no proxy de fixtures' });
  }
});

// Proxy para statistics
app.get('/api/statistics', async (req, res) => {
  try {
    const query = new URLSearchParams(req.query).toString();
    const url = `https://v3.football.api-sports.io/fixtures/statistics${query ? '?' + query : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'x-apisports-key': process.env.APISPORTS_KEY }
    });
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no proxy de statistics' });
  }
});

// Endpoint para enviar mensagens ao Telegram (o frontend envia o texto; as credenciais ficam no servidor)
app.post('/api/notify', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'message required' });

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!botToken || !chatId) return res.status(500).json({ error: 'Telegram não configurado no servidor' });

    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
    const data = await tgRes.json();
    if (!tgRes.ok) return res.status(500).json({ error: 'Erro ao enviar telegram', details: data });
    res.json({ ok: true, result: data.result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no envio para Telegram' });
  }
});

app.get('/api/ping', (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));