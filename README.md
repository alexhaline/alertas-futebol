# ALERTA DO MELHOR — Alertas Futebol

Este projeto reúne um pequeno backend (Express) que atua como proxy para a API-SPORTS e envia notificações ao Telegram, e um frontend leve (public/index.html) com regras dinâmicas para detectar jogos que correspondem a critérios (chutes no 1º tempo, tendência Over 2.5 no 2º tempo), além de controles para imagem de fundo.

Principais recursos
- Backend proxy para API-SPORTS (mantém a chave segura).
- Endpoint /api/notify para enviar mensagens ao Telegram usando credenciais do servidor.
- Frontend com:
  - Regras dinâmicas (thresholds) salvas em localStorage.
  - Presets (agressivo, balanced, conservative).
  - Auto-refresh configurável.
  - Controles de background (presets Unsplash + upload local + salvar preferência).
  - Persistência de notificações já enviadas (localStorage).

Como rodar localmente
1. Instale dependências:

```bash
npm install
```

2. Crie um arquivo `.env` na raiz com as variáveis (veja .env.example).

3. Coloque imagens próprias em `public/images/` (ex: `public/images/maracana-flamengo.jpg`) se quiser usar uma imagem local.

4. Rode em desenvolvimento:

```bash
npm run dev
```

ou produção:

```bash
npm start
```

5. Acesse o frontend em:
- http://localhost:3000/index.html

Testando envio de Telegram (curl)

```bash
curl -X POST http://localhost:3000/api/notify \
  -H "Content-Type: application/json" \
  -d '{"message":"[TESTE] Alerta do Melhor — teste"}'
```

Notas de segurança
- Nunca commit .env com chaves reais.
- Em produção, use HTTPS e restrinja acesso aos endpoints sensíveis.
- Verifique licenciamento/uso de imagens e logos antes de uso comercial.

Melhorias possíveis
- Persistir regras e histórico de notificações no servidor (Redis/DB).
- Autenticação no endpoint /api/notify.
- Painel de gerenciamento de imagens no servidor.
