# Landing Page de Imóvel — Tayrone Films

Sistema de landing page **monoproduto**: um imóvel por vez, gerado pelo painel admin como arquivo HTML único, publicado no Netlify sem necessidade de desenvolvedor.

---

## Arquivos do sistema

| Arquivo | Função |
|---------|--------|
| `index.html` | Landing page do imóvel ativo (substituída a cada novo imóvel) |
| `admin.html` | Painel de edição — abrir localmente no navegador |
| `admin.js` | Lógica do painel (geração do HTML, upload de fotos/vídeo) |
| `template.js` | Template da landing page — não edite manualmente |
| `deploy.sh` | Script de deploy para o Netlify CLI |
| `README.md` | Este arquivo |

---

## Como usar o painel admin

1. Abra o arquivo `admin.html` diretamente no seu navegador (duplo clique ou arraste para o Chrome/Safari/Firefox)
2. Quando solicitado, digite a senha: **`admin2025`**
3. Preencha todos os campos do formulário com os dados do imóvel
4. Faça upload das fotos na seção **Galeria** (até 10 fotos)
5. Opcionalmente, adicione um vídeo (veja seção de vídeo abaixo)
6. Clique em **"Pré-visualizar"** para conferir o resultado numa nova aba
7. Quando estiver satisfeito, clique em **"Baixar HTML"**
8. O arquivo `index.html` será baixado para a sua pasta de downloads
9. Substitua o `index.html` desta pasta pelo arquivo baixado
10. Faça deploy (veja seção abaixo)

---

## Como trocar a senha do admin

Abra o arquivo `admin.js` num editor de texto e localize a linha:

```js
var ADMIN_PASSWORD = 'admin2025';
```

Troque `'admin2025'` pela senha desejada e salve.

> **Atenção:** a senha é uma proteção básica de interface. Qualquer pessoa com acesso ao arquivo `admin.js` pode ver a senha. Não use o painel em redes públicas sem uma proteção adicional.

---

## Como fazer deploy no Netlify

### Opção 1 — Arrasto (mais simples)

1. Acesse [app.netlify.com](https://app.netlify.com)
2. Faça login
3. Na tela inicial, arraste a **pasta inteira** (`IMOVEIS/`) para a área de drop
4. Aguarde o upload — em segundos o site estará no ar com uma URL gerada automaticamente
5. Para atualizar: arraste novamente com o `index.html` novo

### Opção 2 — CLI (mais rápido para atualizações frequentes)

**Pré-requisitos:**
- Node.js instalado ([nodejs.org](https://nodejs.org))
- Netlify CLI: `npm install -g netlify-cli`
- Login: `netlify login`

**Primeiro deploy:**
```bash
bash deploy.sh
```

Na primeira vez, o script perguntará se quer criar um site novo ou vincular a um existente. Após isso, fica configurado e o próximo deploy é só rodar o script novamente.

**Atualizações seguintes:**
```bash
bash deploy.sh
```

---

## Como ativar o Meta Pixel (Facebook Ads)

1. Acesse o [Gerenciador de Eventos do Meta](https://business.facebook.com/events_manager)
2. Copie o seu Pixel ID (número de 15–16 dígitos)
3. No painel admin, cole o ID no campo **"Meta Pixel ID"** (seção Rastreamento)
4. Gere e baixe o HTML normalmente — o código do pixel será incluído automaticamente
5. Cada clique em botão WhatsApp dispara um evento `Lead` com a origem (`hero`, `gallery`, etc.)

---

## Como ativar o Google Analytics 4

1. Acesse o [Google Analytics](https://analytics.google.com)
2. Copie o Measurement ID (formato `G-XXXXXXXXXX`)
3. No painel admin, cole no campo **"Google Analytics 4 ID"**
4. Cada clique WhatsApp dispara um evento `whatsapp_click` com o parâmetro `source`

---

## Vídeo por upload vs. vídeo por URL

### Upload de arquivo (modo local)

- Selecione a opção **"Upload de arquivo"** no painel
- Envie um arquivo MP4, MOV ou WEBM do seu computador
- O vídeo é **embutido diretamente no HTML** (base64) — funciona offline, sem servidor
- **Recomendado para vídeos até 50 MB** — acima disso o arquivo HTML fica muito pesado
- O vídeo toca automaticamente (mudo) quando aparece na tela, com controles para o usuário

### URL do YouTube

- Selecione **"Link do YouTube"**
- Cole o link do vídeo (formatos aceitos: `youtube.com/watch?v=`, `youtu.be/`, `/shorts/`, ou o ID de 11 caracteres)
- O embed é responsivo e ocupa a largura total da página
- **Recomendado para vídeos acima de 50 MB ou quando quiser analytics do YouTube**

### URL do Instagram

- Selecione **"Link do Instagram"**
- Cole o link completo de um post ou reel público (`instagram.com/reel/...` ou `instagram.com/p/...`)
- Exige JavaScript habilitado no navegador do visitante
- Se o Instagram demorar para carregar, aparece um link direto para o post como fallback

### Sem vídeo

- Deixe selecionado **"Sem vídeo"** — nenhum bloco de vídeo aparecerá na página

---

## Fluxo completo: "Vendeu — como coloco o próximo imóvel?"

1. **Abra `admin.html`** no navegador e faça login
2. **Apague todos os campos** com os dados do imóvel anterior (ou reuse a estrutura)
3. **Preencha os novos dados**: título, preço, localização, diferenciais, etc.
4. **Faça upload das novas fotos** e configure o vídeo (se houver)
5. **Pré-visualize** para conferir
6. Clique **"Baixar HTML"** — o arquivo `index.html` será baixado
7. **Substitua** o `index.html` desta pasta pelo arquivo baixado
8. **Publique** via arrasto no Netlify ou `bash deploy.sh`
9. ✅ O site já está exibindo o novo imóvel

O processo todo leva menos de 15 minutos.

---

## Limitações conhecidas

- **Senha do admin:** proteção de interface apenas — não é autenticação real. Quem tiver o arquivo `admin.js` pode ver a senha.
- **Vídeos grandes:** arquivos acima de 50 MB embutidos em base64 geram HTMLs pesados. Use YouTube para esses casos.
- **Instagram embed:** requer JavaScript no navegador e conexão com o servidor do Instagram. Em ambientes offline ou bloqueados, aparece um link de fallback.
- **Netlify free tier:** limite de 100 MB por deploy e 100 GB de banda/mês — mais que suficiente para uma landing page de imóvel.
- **Fotos sem compressão:** o admin não comprime as imagens. Para melhor performance, comprima as fotos antes do upload (recomendado: máximo 300 KB por foto, use [squoosh.app](https://squoosh.app)).

---

## Contato

- **WhatsApp:** +55 82 99972-3040
- **Email:** contato@tayronefilms.com.br
