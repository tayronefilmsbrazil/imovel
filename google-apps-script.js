// ═══════════════════════════════════════════════════════════════════════════
// GOOGLE APPS SCRIPT — imovelal.com.br · Wish Residence
// Cole este código em: script.google.com → Novo projeto
// Depois: Implantar → Nova implantação → Aplicativo da Web
//   Execute como: eu mesmo | Quem acessa: Qualquer pessoa
// Copie a URL do deploy e cole em index.html onde está SEU_GOOGLE_APPS_SCRIPT_URL
// ═══════════════════════════════════════════════════════════════════════════

const SHEET_ID   = 'SEU_GOOGLE_SHEET_ID_AQUI';   // TODO
const SHEET_NAME = 'Leads Wish Residence';
const N8N_WEBHOOK_URL = 'SEU_WEBHOOK_N8N_AQUI';  // TODO

function doPost(e) {
  try {
    const data  = JSON.parse(e.postData.contents);
    const ss    = SpreadsheetApp.openById(SHEET_ID);
    let sheet   = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Data/Hora','Nome','WhatsApp','Perfil',
        'Prazo','Entrada','Canal','IP','User Agent','Imóvel','Preço'
      ]);
      sheet.getRange(1,1,1,11).setFontWeight('bold');
    }

    sheet.appendRow([
      new Date().toLocaleString('pt-BR'),
      data.nome        || '',
      data.whatsapp    || '',
      data.perfil      || '',
      data.prazo       || '',
      data.entrada     || '',
      data.canal       || '',
      data.ip          || '',
      data.userAgent   || '',
      data.imovel      || 'Wish Residence',
      data.preco       || 'R$ 1.050.000'
    ]);

    // Disparar n8n webhook
    if (N8N_WEBHOOK_URL !== 'SEU_WEBHOOK_N8N_AQUI') {
      UrlFetchApp.fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        contentType: 'application/json',
        payload: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          imovel: 'Wish Residence',
          preco: 'R$ 1.050.000'
        })
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'online', service: 'imovelal-leads' }))
    .setMimeType(ContentService.MimeType.JSON);
}
