/**
 * admin.js — Lógica do painel de administração
 * Depende de: template.js (deve ser carregado antes)
 * Uso: incluído ao final do <body> em admin.html
 */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     CONFIGURAÇÃO — edite aqui para trocar a senha
  ───────────────────────────────────────────── */
  var ADMIN_PASSWORD = 'admin2025';

  /* ─────────────────────────────────────────────
     CONTRATO DE IDs — todos os inputs do form
  ───────────────────────────────────────────── */
  var F = {
    propertyName:  'lp-propertyName',
    condoName:     'lp-condoName',
    location:      'lp-location',
    price:         'lp-price',
    eyebrow:       'lp-eyebrow',
    headline:      'lp-headline',
    type:          'lp-type',
    view:          'lp-view',
    urgency:       'lp-urgency',
    pageTitle:     'lp-pageTitle',
    metaDesc:      'lp-metaDesc',
    // chips (6)
    chips:         ['lp-chip1','lp-chip2','lp-chip3','lp-chip4','lp-chip5','lp-chip6'],
    // diferenciais (3×3)
    featIcon:      ['lp-feat1icon','lp-feat2icon','lp-feat3icon'],
    featTitle:     ['lp-feat1title','lp-feat2title','lp-feat3title'],
    featDesc:      ['lp-feat1desc','lp-feat2desc','lp-feat3desc'],
    // números (3×3)
    numLabel:      ['lp-num1label','lp-num2label','lp-num3label'],
    numValue:      ['lp-num1value','lp-num2value','lp-num3value'],
    numNote:       ['lp-num1note','lp-num2note','lp-num3note'],
    // mapa
    mapEmbedUrl:   'lp-mapEmbedUrl',
    mapTitle:      'lp-mapTitle',
    distPlace:     ['lp-dist1p','lp-dist2p','lp-dist3p','lp-dist4p','lp-dist5p','lp-dist6p'],
    distKm:        ['lp-dist1k','lp-dist2k','lp-dist3k','lp-dist4k','lp-dist5k','lp-dist6k'],
    // fotos/vídeo
    photoInput:    'lp-photoInput',
    heroPhotoInput:'lp-heroPhotoInput',
    photoGrid:     'lp-photoGrid',
    videoMode:     'lp-videoMode',        // name do grupo de radios
    videoFile:     'lp-videoFile',
    videoYouTube:  'lp-videoYouTube',
    videoInsta:    'lp-videoInsta',
    videoBanner:   'lp-videoBanner',
    // credibilidade
    sellerPhotoInput: 'lp-sellerPhotoInput',
    sellerPhotoPreview: 'lp-sellerPhotoPreview',
    sellerName:    'lp-sellerName',
    sellerTitle:   'lp-sellerTitle',
    sellerBio:     'lp-sellerBio',
    sellerBio2:    'lp-sellerBio2',
    badges:        ['lp-badge1','lp-badge2','lp-badge3','lp-badge4','lp-badge5'],
    // contato
    whatsappNumber:'lp-whatsappNumber',
    email:         'lp-email',
    wppHero:       'lp-wppHero',
    wppGallery:    'lp-wppGallery',
    wppFloat:      'lp-wppFloat',
    wppSticky:     'lp-wppSticky',
    wppFinalCta:   'lp-wppFinalCta',
    metaPixelId:   'lp-metaPixelId',
    ga4Id:         'lp-ga4Id',
    gadsId:        'lp-gadsId',
  };

  /* ─────────────────────────────────────────────
     ESTADO INTERNO (fonte única de verdade)
  ───────────────────────────────────────────── */
  var photoBase64Array = [];   // até 10 fotos (base64 data URIs)
  var heroPhotoBase64 = null;  // foto de destaque separada
  var videoBase64Cache = null; // base64 do vídeo (modo upload)
  var videoMimeCache = 'video/mp4';
  var sellerPhotoBase64 = null;

  /* ─────────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────────── */

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function fileToBase64(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function (e) { resolve(e.target.result); };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function parseYouTubeId(raw) {
    if (!raw) return null;
    raw = raw.trim();
    var m = raw.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
    if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;
    return null;
  }

  function parseInstagramUrl(raw) {
    if (!raw) return null;
    raw = raw.trim();
    if (/instagram\.com\/(p|reel)\//.test(raw)) return raw.split('?')[0];
    return null;
  }

  function showBanner(id, msg, type) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.style.display = msg ? 'block' : 'none';
    el.className = 'admin-banner admin-banner--' + (type || 'warn');
  }

  /* ─────────────────────────────────────────────
     GRID DE FOTOS
  ───────────────────────────────────────────── */

  function renderPhotoGrid() {
    var grid = document.getElementById(F.photoGrid);
    if (!grid) return;
    grid.innerHTML = '';
    photoBase64Array.forEach(function (src, i) {
      var wrap = document.createElement('div');
      wrap.className = 'photo-thumb';
      var img = document.createElement('img');
      img.src = src;
      img.alt = 'Foto ' + (i + 1);
      var btn = document.createElement('button');
      btn.className = 'photo-remove';
      btn.textContent = '×';
      btn.title = 'Remover foto';
      btn.setAttribute('type', 'button');
      btn.addEventListener('click', function () {
        photoBase64Array.splice(i, 1);
        renderPhotoGrid();
      });
      wrap.appendChild(img);
      wrap.appendChild(btn);
      grid.appendChild(wrap);
    });
    // contador
    var counter = document.getElementById('lp-photoCounter');
    if (counter) counter.textContent = photoBase64Array.length + '/15 fotos';
  }

  function initPhotoGrid() {
    var input = document.getElementById(F.photoInput);
    if (!input) return;
    input.addEventListener('change', function () {
      var files = Array.from(input.files);
      var slots = 15 - photoBase64Array.length;
      if (files.length > slots) {
        alert('Máximo de 15 fotos. Apenas as primeiras ' + slots + ' serão adicionadas.');
        files = files.slice(0, slots);
      }
      Promise.all(files.map(fileToBase64)).then(function (results) {
        photoBase64Array = photoBase64Array.concat(results);
        renderPhotoGrid();
      });
      input.value = ''; // permite re-selecionar mesmo arquivo
    });

    // Foto hero separada
    var heroInput = document.getElementById(F.heroPhotoInput);
    if (heroInput) {
      heroInput.addEventListener('change', function () {
        if (!heroInput.files[0]) return;
        fileToBase64(heroInput.files[0]).then(function (b64) {
          heroPhotoBase64 = b64;
          var prev = document.getElementById('lp-heroPrev');
          if (prev) { prev.src = b64; prev.style.display = 'block'; }
        });
      });
    }
  }

  /* ─────────────────────────────────────────────
     MODO DE VÍDEO
  ───────────────────────────────────────────── */

  function initVideoMode() {
    var radios = document.querySelectorAll('[name="' + F.videoMode + '"]');
    var sections = {
      upload:    document.getElementById('video-section-upload'),
      youtube:   document.getElementById('video-section-youtube'),
      instagram: document.getElementById('video-section-instagram'),
    };

    function applyMode(mode) {
      Object.keys(sections).forEach(function (k) {
        if (sections[k]) sections[k].style.display = k === mode ? 'block' : 'none';
      });
    }

    radios.forEach(function (r) {
      r.addEventListener('change', function () { applyMode(r.value); });
    });
    applyMode('none');

    // Vídeo por upload
    var videoFileInput = document.getElementById(F.videoFile);
    if (videoFileInput) {
      videoFileInput.addEventListener('change', function () {
        var file = videoFileInput.files[0];
        if (!file) return;
        // Aviso de tamanho
        if (file.size > 50 * 1024 * 1024) {
          showBanner(F.videoBanner,
            '⚠️ Vídeo grande (' + (file.size / 1024 / 1024).toFixed(1) + ' MB). Para melhor resultado, recomendamos usar a opção YouTube ou Instagram para vídeos acima de 50 MB.',
            'warn');
        } else {
          showBanner(F.videoBanner, '', '');
        }
        videoMimeCache = file.type || 'video/mp4';
        fileToBase64(file).then(function (b64) { videoBase64Cache = b64; });
      });
    }
  }

  /* ─────────────────────────────────────────────
     FOTO DO VENDEDOR
  ───────────────────────────────────────────── */

  function initSellerPhoto() {
    var input = document.getElementById(F.sellerPhotoInput);
    if (!input) return;
    input.addEventListener('change', function () {
      if (!input.files[0]) return;
      fileToBase64(input.files[0]).then(function (b64) {
        sellerPhotoBase64 = b64;
        var prev = document.getElementById(F.sellerPhotoPreview);
        if (prev) { prev.src = b64; prev.style.display = 'block'; }
      });
    });
  }

  /* ─────────────────────────────────────────────
     COLETA TODOS OS DADOS DO FORM
  ───────────────────────────────────────────── */

  function collectFormData() {
    // Chips
    var chips = F.chips.map(function (id) { return val(id); }).filter(Boolean);

    // Diferenciais
    var features = [0, 1, 2].map(function (i) {
      return { icon: val(F.featIcon[i]), title: val(F.featTitle[i]), desc: val(F.featDesc[i]) };
    }).filter(function (f) { return f.title; });

    // Números
    var numbers = [0, 1, 2].map(function (i) {
      return { label: val(F.numLabel[i]), value: val(F.numValue[i]), note: val(F.numNote[i]) };
    }).filter(function (n) { return n.value; });

    // Distâncias
    var distances = [0, 1, 2, 3, 4, 5].map(function (i) {
      return { place: val(F.distPlace[i]), distance: val(F.distKm[i]) };
    }).filter(function (r) { return r.place; });

    // Badges
    var badges = F.badges.map(function (id) { return val(id); }).filter(Boolean);

    // Modo de vídeo
    var videoModeEl = document.querySelector('[name="' + F.videoMode + '"]:checked');
    var videoMode = videoModeEl ? videoModeEl.value : 'none';

    var youtubeUrl = null;
    var instagramUrl = null;
    var videoBase64 = null;
    var videoMimeType = 'video/mp4';

    if (videoMode === 'youtube') {
      var ytRaw = val(F.videoYouTube);
      var ytId = parseYouTubeId(ytRaw);
      youtubeUrl = ytId ? 'https://www.youtube.com/watch?v=' + ytId : null;
      if (ytRaw && !ytId) alert('URL do YouTube não reconhecida. Verifique o link.');
    } else if (videoMode === 'instagram') {
      instagramUrl = parseInstagramUrl(val(F.videoInsta));
      if (val(F.videoInsta) && !instagramUrl) alert('URL do Instagram não reconhecida. Use o link de um post ou reel.');
    } else if (videoMode === 'upload') {
      videoBase64 = videoBase64Cache;
      videoMimeType = videoMimeCache;
    }

    return {
      propertyName:  val(F.propertyName),
      condoName:     val(F.condoName),
      location:      val(F.location),
      price:         val(F.price),
      eyebrow:       val(F.eyebrow),
      headline:      val(F.headline),
      type:          val(F.type),
      view:          val(F.view),
      urgency:       val(F.urgency),
      pageTitle:     val(F.pageTitle) || val(F.propertyName),
      metaDescription: val(F.metaDesc),
      heroImage:     heroPhotoBase64,
      chips:         chips,
      photos:        photoBase64Array.slice(),
      videoMode:     videoMode,
      videoBase64:   videoBase64,
      videoMimeType: videoMimeType,
      youtubeUrl:    youtubeUrl,
      instagramUrl:  instagramUrl,
      features:      features,
      numbers:       numbers,
      mapEmbedUrl:   val(F.mapEmbedUrl) || null,
      mapTitle:      val(F.mapTitle),
      distances:     distances,
      sellerPhoto:   sellerPhotoBase64,
      sellerName:    val(F.sellerName),
      sellerTitle:   val(F.sellerTitle),
      sellerBio:     val(F.sellerBio),
      sellerBio2:    val(F.sellerBio2),
      badges:        badges,
      whatsappNumber: val(F.whatsappNumber),
      email:         val(F.email),
      wppHero:       val(F.wppHero),
      wppGallery:    val(F.wppGallery),
      wppFloat:      val(F.wppFloat),
      wppSticky:     val(F.wppSticky),
      wppFinalCta:   val(F.wppFinalCta),
      metaPixelId:   val(F.metaPixelId),
      ga4Id:         val(F.ga4Id),
      gadsId:        val(F.gadsId),
    };
  }

  /* ─────────────────────────────────────────────
     IMPORTAR HTML EXISTENTE
  ───────────────────────────────────────────── */

  function populateFields(data) {
    // Campos de texto simples
    var simple = {
      propertyName: F.propertyName, condoName: F.condoName,
      location: F.location, price: F.price, eyebrow: F.eyebrow,
      headline: F.headline, type: F.type, view: F.view, urgency: F.urgency,
      pageTitle: F.pageTitle, metaDescription: F.metaDesc,
      mapEmbedUrl: F.mapEmbedUrl, mapTitle: F.mapTitle,
      sellerName: F.sellerName, sellerTitle: F.sellerTitle,
      sellerBio: F.sellerBio, sellerBio2: F.sellerBio2,
      whatsappNumber: F.whatsappNumber, email: F.email,
      wppHero: F.wppHero, wppGallery: F.wppGallery, wppFloat: F.wppFloat,
      wppSticky: F.wppSticky, wppFinalCta: F.wppFinalCta,
      metaPixelId: F.metaPixelId, ga4Id: F.ga4Id, gadsId: F.gadsId,
      youtubeUrl: F.videoYouTube, instagramUrl: F.videoInsta,
    };
    for (var key in simple) {
      if (data[key] !== undefined) {
        var el = document.getElementById(simple[key]);
        if (el) el.value = data[key] || '';
      }
    }
    // Chips
    F.chips.forEach(function(id, i) {
      var el = document.getElementById(id);
      if (el) el.value = (data.chips && data.chips[i]) ? data.chips[i] : '';
    });
    // Diferenciais
    [0,1,2].forEach(function(i) {
      var feat = (data.features && data.features[i]) || {};
      var iconEl = document.getElementById(F.featIcon[i]);
      var titleEl = document.getElementById(F.featTitle[i]);
      var descEl = document.getElementById(F.featDesc[i]);
      if (iconEl) iconEl.value = feat.icon || '';
      if (titleEl) titleEl.value = feat.title || '';
      if (descEl) descEl.value = feat.desc || '';
    });
    // Números
    [0,1,2].forEach(function(i) {
      var num = (data.numbers && data.numbers[i]) || {};
      var lEl = document.getElementById(F.numLabel[i]);
      var vEl = document.getElementById(F.numValue[i]);
      var nEl = document.getElementById(F.numNote[i]);
      if (lEl) lEl.value = num.label || '';
      if (vEl) vEl.value = num.value || '';
      if (nEl) nEl.value = num.note || '';
    });
    // Distâncias
    [0,1,2,3,4,5].forEach(function(i) {
      var dist = (data.distances && data.distances[i]) || {};
      var pEl = document.getElementById(F.distPlace[i]);
      var kEl = document.getElementById(F.distKm[i]);
      if (pEl) pEl.value = dist.place || '';
      if (kEl) kEl.value = dist.distance || '';
    });
    // Badges
    F.badges.forEach(function(id, i) {
      var el = document.getElementById(id);
      if (el) el.value = (data.badges && data.badges[i]) ? data.badges[i] : '';
    });
  }

  function importFromHtml(file) {
    file.text().then(function(html) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');

      // Lê o bloco de dados embutido
      var dataEl = doc.getElementById('lp-data');
      if (!dataEl) {
        alert('⚠️ Este arquivo não foi gerado pelo painel admin (versão atual).\n\nGere um novo index.html pelo admin para habilitar a importação.');
        return;
      }
      var data;
      try { data = JSON.parse(dataEl.textContent); }
      catch(err) { alert('Erro ao ler os dados do arquivo. Pode estar corrompido.'); return; }

      // Popula campos de texto
      populateFields(data);

      // Extrai foto hero do background-image inline
      var heroEl = doc.getElementById('hero');
      if (heroEl) {
        var bg = heroEl.getAttribute('style') || '';
        var m = bg.match(/url\(["']?(data:[^"')]+)["']?\)/);
        if (m) {
          heroPhotoBase64 = m[1];
          var heroPrev = document.getElementById('lp-heroPrev');
          if (heroPrev) { heroPrev.src = heroPhotoBase64; heroPrev.style.display = 'block'; }
        }
      }

      // Extrai fotos da galeria
      var thumbImgs = doc.querySelectorAll('.gallery-thumb img');
      photoBase64Array = Array.from(thumbImgs).map(function(img) { return img.getAttribute('src'); });
      renderPhotoGrid();

      // Extrai foto do vendedor
      var sellerImg = doc.querySelector('.seller-avatar');
      if (sellerImg) {
        sellerPhotoBase64 = sellerImg.getAttribute('src');
        var sellerPrev = document.getElementById(F.sellerPhotoPreview);
        if (sellerPrev) { sellerPrev.src = sellerPhotoBase64; sellerPrev.style.display = 'block'; }
      }

      // Restaura modo de vídeo
      var videoMode = data.videoMode || 'none';
      var radioEl = document.querySelector('[name="' + F.videoMode + '"][value="' + videoMode + '"]');
      if (radioEl) { radioEl.checked = true; radioEl.dispatchEvent(new Event('change')); }

      if (videoMode === 'upload') {
        var videoEl = doc.getElementById('lp-video');
        if (videoEl) {
          videoBase64Cache = videoEl.getAttribute('src');
          videoMimeCache = videoEl.getAttribute('type') || 'video/mp4';
          showBanner(F.videoBanner, '✅ Vídeo restaurado. Clique em Pré-visualizar para confirmar.', 'ok');
        }
      }

      // Scroll até o topo do form
      document.getElementById('admin-body').scrollIntoView({ behavior: 'smooth' });
      alert('✅ Importado com sucesso! Confira os campos e clique em Pré-visualizar.');
    }).catch(function() {
      alert('Erro ao ler o arquivo. Tente novamente.');
    });
  }

  function initImport() {
    var input = document.getElementById('lp-importFile');
    if (!input) return;
    input.addEventListener('change', function() {
      if (input.files[0]) importFromHtml(input.files[0]);
      input.value = '';
    });
  }

  /* ─────────────────────────────────────────────
     GERAÇÃO DO HTML
  ───────────────────────────────────────────── */

  function buildHtml() {
    if (!window.LandingTemplate) {
      alert('Erro: template.js não carregado. Verifique se o arquivo está na mesma pasta.');
      return null;
    }
    var data = collectFormData();
    return window.LandingTemplate.generateLandingPage(data);
  }

  function generatePreview() {
    var html = buildHtml();
    if (!html) return;
    var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(function () { URL.revokeObjectURL(url); }, 90000);
  }

  function generateDownload() {
    var html = buildHtml();
    if (!html) return;
    var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 10000);
  }

  /* ─────────────────────────────────────────────
     PROTEÇÃO POR SENHA
  ───────────────────────────────────────────── */

  function initPasswordGate() {
    var body = document.getElementById('admin-body');
    var pw = prompt('🔒 Painel Admin — Digite a senha:');
    if (pw !== ADMIN_PASSWORD) {
      document.body.innerHTML = `
        <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:sans-serif;background:#0C1420;color:#EAE0CA;text-align:center;padding:2rem">
          <div>
            <p style="font-size:2rem;margin-bottom:1rem">🔒</p>
            <p style="font-size:1.1rem">Acesso negado. Recarregue a página para tentar novamente.</p>
          </div>
        </div>`;
      return false;
    }
    if (body) body.style.display = 'block';
    return true;
  }

  /* ─────────────────────────────────────────────
     INICIALIZAÇÃO
  ───────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    if (!initPasswordGate()) return;

    initPhotoGrid();
    initVideoMode();
    initSellerPhoto();

    initImport();

    var btnPreview = document.getElementById('btn-preview');
    var btnDownload = document.getElementById('btn-download');
    if (btnPreview) btnPreview.addEventListener('click', generatePreview);
    if (btnDownload) btnDownload.addEventListener('click', generateDownload);
  });

})();
