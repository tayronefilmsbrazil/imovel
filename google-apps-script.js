// ═══════════════════════════════════════════════════════════════════════════
// GOOGLE APPS SCRIPT — imovelal.com.br · Wish Residence
// Cole este código em: script.google.com → Novo projeto
// Depois: Implantar → Nova implantação → Aplicativo da Web
//   Execute como: eu mesmo | Quem acessa: Qualquer pessoa
// ═══════════════════════════════════════════════════════════════════════════

const SHEET_ID   = '1egoU6KD84iNh7p014TPBFFr_leCswm1N4PhWTZCNprw';
const SHEET_NAME = 'Leads Wish Residence';
const N8N_WEBHOOK_URL = 'https://motionlesswhaleshark-n8n.cloudfy.live/webhook/wish-residence-lead';

function doPost(e) {
  try {
    const data  = JSON.parse(e.postData.contents);
    const ss    = SpreadsheetApp.openById(SHEET_ID);
    let sheet   = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Data/Hora','Nome','WhatsApp','E-mail','Perfil',
        'Prazo','Entrada','Canal','User Agent','Imóvel','Preço'
      ]);
      sheet.getRange(1,1,1,11).setFontWeight('bold');
    }

    sheet.appendRow([
      new Date().toLocaleString('pt-BR'),
      data.nome        || '',
      data.whatsapp    || '',
      data.email       || '',
      data.perfil      || '',
      data.prazo       || '',
      data.entrada     || '',
      data.canal       || '',
      data.userAgent   || '',
      data.imovel      || 'Wish Residence',
      data.preco       || 'R$ 1.000.000'
    ]);

    // Disparar n8n webhook
    if (N8N_WEBHOOK_URL !== 'SEU_WEBHOOK_N8N_AQUI') {
      UrlFetchApp.fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        contentType: 'application/json',
        payload: JSON.stringify({
          ...data,
          timestamp: new Date().toLocaleString('pt-BR'),
          imovel: 'Wish Residence',
          preco: 'R$ 1.000.000'
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
