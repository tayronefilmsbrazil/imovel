# Setup — imovelal.com.br · Wish Residence

Guia de configuração dos integrações externas (Google Sheets, n8n, Telegram).

---

## 1. Google Apps Script (salvar leads na planilha)

### Passo a passo

1. Acesse [script.google.com](https://script.google.com) e crie um novo projeto
2. Apague o código padrão e cole o conteúdo de `google-apps-script.js`
3. Edite as constantes no topo do arquivo:
   ```js
   const SHEET_ID   = 'ID_DA_SUA_PLANILHA';   // veja abaixo como obter
   const N8N_WEBHOOK_URL = 'URL_DO_WEBHOOK';   // veja seção 2
   ```
4. Para obter o `SHEET_ID`:
   - Crie uma planilha em [sheets.google.com](https://sheets.google.com)
   - A URL tem o formato: `https://docs.google.com/spreadsheets/d/**ID_AQUI**/edit`
   - Copie o ID entre `/d/` e `/edit`
5. Salve o projeto (Ctrl+S)
6. Clique em **Implantar → Nova implantação**
   - Tipo: Aplicativo da Web
   - Execute como: **Eu mesmo**
   - Quem tem acesso: **Qualquer pessoa**
   - Clique em **Implantar**
7. Copie a **URL do aplicativo da Web** gerada
8. No `index.html`, localize:
   ```js
   var GSHEET_URL = 'SEU_GOOGLE_APPS_SCRIPT_URL';
   ```
   E substitua pela URL copiada.

---

## 2. n8n — Importar workflow

### Pré-requisito
- n8n rodando (cloud ou self-hosted)
- URL pública acessível (ex.: `https://meu-n8n.com`)

### Passo a passo

1. Acesse seu painel do n8n
2. Clique em **Workflows → Import from File**
3. Selecione o arquivo `n8n-workflow.json`
4. O workflow será importado com todos os nós configurados
5. Configure as credenciais do Telegram (ver seção 3)
6. Ative o workflow e copie a URL do nó **Webhook - Novo Lead**
   - Formato: `https://seu-n8n.com/webhook/wish-residence-lead`
7. No `index.html`, localize:
   ```js
   var N8N_URL = 'SEU_WEBHOOK_N8N_AQUI';
   ```
   E substitua pela URL do webhook.
8. No `google-apps-script.js`, atualize também:
   ```js
   const N8N_WEBHOOK_URL = 'URL_COPIADA';
   ```

---

## 3. Telegram — Configurar bot e obter Chat IDs

### Criar bot

1. Abra o Telegram e pesquise por `@BotFather`
2. Digite `/newbot` e siga as instruções
3. Anote o **token do bot** (formato: `123456:ABC-DEF...`)

### Obter Chat ID do vendedor (você)

1. Envie uma mensagem qualquer para o bot recém-criado
2. Acesse: `https://api.telegram.org/bot<SEU_TOKEN>/getUpdates`
3. Localize `"chat":{"id":NUMERO}` — esse é o seu Chat ID

### Configurar no n8n

1. No painel do n8n, vá em **Credentials → New → Telegram**
2. Cole o token do bot
3. Nos nós do Telegram, substitua:
   - `SEU_CHAT_ID_TELEGRAM` → Chat ID do vendedor (para alertas imediatos)
   - `SEU_BOT_CANAL_LEADS` → Chat ID do bot que envia para os leads
     > **Atenção:** para enviar mensagens para leads via Telegram, o lead precisa ter iniciado uma conversa com o bot. Considere integrar com WhatsApp Business API para comunicação outbound.

---

## 4. Imagem OG (Open Graph)

1. Exporte uma foto do imóvel em **1200×630px**
2. Hospede em qualquer CDN (ex.: suba no próprio repositório GitHub como `/og-image.jpg`)
3. No `index.html`, substitua todos os `https://imovelal.com.br/og-image.jpg` pela URL final

---

## 5. Deploy após configurações

```bash
cd /Users/tayronefilms/Documents/Clientes/IMOVEIS
git add index.html google-apps-script.js n8n-workflow.json blog/ SETUP.md
git commit -m "feat: config integrações Google Sheets + n8n + Telegram"
git push
```

O Netlify publica automaticamente em ~30 segundos.

---

## Checklist final

- [ ] Google Apps Script implantado e URL no index.html
- [ ] n8n workflow importado e webhook ativo
- [ ] Chat ID Telegram configurado nos nós do n8n
- [ ] Imagem OG 1200×630px hospedada
- [ ] Teste: preencher formulário e verificar chegada no Google Sheets e Telegram
- [ ] Verificar Schema.org em: [search.google.com/test/rich-results](https://search.google.com/test/rich-results)
