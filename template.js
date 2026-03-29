/**
 * template.js — Gerador de landing page de imóvel
 * Exporta: window.LandingTemplate.generateLandingPage(data)
 * Retorna: string HTML completa, self-contained, sem dependências externas
 */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     DEFAULTS — valores padrão para todos os campos
  ───────────────────────────────────────────── */
  var DEFAULTS = {
    propertyName: 'Imóvel à Venda',
    condoName: '',
    location: '',
    price: '',
    eyebrow: '',
    headline: '',
    type: '',
    view: '',
    urgency: '',
    heroImage: null,
    heroGradient: 'linear-gradient(135deg, #0C1420 0%, #1a3a52 30%, #3A7D94 65%, #0C1420 100%)',
    chips: [],
    photos: [],
    videoMode: 'none',
    videoBase64: null,
    videoMimeType: 'video/mp4',
    youtubeUrl: null,
    instagramUrl: null,
    features: [],
    numbers: [],
    mapEmbedUrl: null,
    mapTitle: '',
    distances: [],
    sellerPhoto: null,
    sellerName: '',
    sellerTitle: '',
    sellerBio: '',
    sellerBio2: '',
    badges: [],
    whatsappNumber: '',
    wppHero: '',
    wppGallery: '',
    wppFloat: '',
    wppSticky: '',
    wppFinalCta: '',
    email: '',
    metaPixelId: '',
    ga4Id: '',
    pageTitle: 'Imóvel à Venda',
    metaDescription: '',
  };

  /* ─────────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────────── */

  function mergeDefaults(data) {
    var d = {};
    for (var k in DEFAULTS) d[k] = DEFAULTS[k];
    for (var k in data) if (data[k] !== undefined && data[k] !== null || typeof DEFAULTS[k] !== 'string') d[k] = data[k];
    // garante que strings vazias do usuário não substituam defaults de strings
    for (var k in data) if (data[k] !== undefined) d[k] = data[k];
    return d;
  }

  function encodeWpp(number, message) {
    if (!number) return '#';
    return 'https://wa.me/' + number + '?text=' + encodeURIComponent(message);
  }

  function youtubeEmbedUrl(raw) {
    if (!raw) return null;
    raw = raw.trim();
    // Tenta extrair ID de várias formas
    var m = raw.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/);
    if (m) return 'https://www.youtube.com/embed/' + m[1] + '?rel=0';
    // ID puro (11 chars)
    if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return 'https://www.youtube.com/embed/' + raw + '?rel=0';
    return null;
  }

  function e(str) {
    // Escapa para uso em HTML attributes
    return String(str).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function initials(name) {
    if (!name) return '?';
    return name.split(' ').slice(0,2).map(function(p){ return p[0]; }).join('').toUpperCase();
  }

  /* ─────────────────────────────────────────────
     BLOCOS HTML
  ───────────────────────────────────────────── */

  function trackingScripts(d) {
    var out = '';
    if (d.metaPixelId) {
      out += `
<!-- Meta Pixel -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${e(d.metaPixelId)}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${e(d.metaPixelId)}&ev=PageView&noscript=1"/></noscript>`;
    }
    if (d.ga4Id) {
      out += `
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${e(d.ga4Id)}"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${e(d.ga4Id)}');
</script>`;
    }
    return out;
  }

  function buildCSS(d) {
    return `<style>
/* ── Reset e base ── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;font-size:16px}
body{font-family:'DM Sans',sans-serif;background:var(--white);color:var(--dark);line-height:1.6;overflow-x:hidden}
img{max-width:100%;display:block}
a{text-decoration:none;color:inherit}
button{cursor:pointer;border:none;background:none;font-family:inherit}

/* ── Variáveis CSS ── */
:root{
  --dark:#0C1420;
  --navy:#142030;
  --sand:#EAE0CA;
  --gold:#C8A45A;
  --ocean:#3A7D94;
  --wpp:#25D366;
  --white:#FDFAF5;
  --radius:12px;
  --shadow:0 4px 24px rgba(0,0,0,0.10);
}

/* ── Scroll reveal ── */
.reveal{opacity:0;transform:translateY(28px);transition:opacity .65s ease,transform .65s ease}
.reveal.visible{opacity:1;transform:translateY(0)}

/* ── Tipografia ── */
.font-serif{font-family:'Cormorant Garant',serif}
.eyebrow{font-size:.75rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--gold)}
h1,h2{font-family:'Cormorant Garant',serif;line-height:1.15}
h2{font-size:clamp(1.8rem,4vw,2.6rem);color:var(--dark)}

/* ── Botão WhatsApp ── */
.btn-wpp{
  display:inline-flex;align-items:center;gap:.55rem;
  background:var(--wpp);color:#fff;font-weight:600;font-size:1rem;
  padding:.85rem 1.75rem;border-radius:50px;transition:filter .2s,transform .2s;
  white-space:nowrap;
}
.btn-wpp:hover{filter:brightness(1.08);transform:translateY(-2px)}
.btn-wpp svg{width:22px;height:22px;flex-shrink:0}

/* ── HERO ── */
#hero{
  position:relative;min-height:100svh;display:flex;align-items:flex-end;
  background:${d.heroImage ? 'url("' + d.heroImage + '") center/cover no-repeat' : d.heroGradient};
}
#hero::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(to top,rgba(12,20,32,.90) 0%,rgba(12,20,32,.35) 55%,transparent 100%);
}
.hero-content{position:relative;z-index:1;padding:clamp(2rem,6vw,5rem) clamp(1.25rem,5vw,4rem);max-width:780px;color:#fff}
.hero-content .eyebrow{color:var(--gold);margin-bottom:.75rem}
.hero-content h1{font-size:clamp(2.2rem,6vw,4rem);margin-bottom:.75rem}
.hero-price{font-size:clamp(1.4rem,3.5vw,2rem);color:var(--sand);font-family:'Cormorant Garant',serif;font-weight:600;margin-bottom:1.75rem}
.hero-price span{color:var(--gold)}

/* ── CHIPS ── */
#chips{background:var(--sand);padding:1rem clamp(1rem,4vw,3rem);overflow-x:auto}
.chips-inner{display:flex;gap:.6rem;width:max-content}
.chip{
  background:#fff;border:1.5px solid rgba(12,20,32,.12);border-radius:50px;
  padding:.4rem 1rem;font-size:.82rem;font-weight:500;white-space:nowrap;color:var(--dark);
}

/* ── GALERIA ── */
#gallery{padding:clamp(3rem,7vw,6rem) clamp(1rem,5vw,4rem);background:var(--white)}
#gallery h2{text-align:center;margin-bottom:.5rem}
.gallery-sub{text-align:center;color:#666;margin-bottom:2rem;font-size:.95rem}
.gallery-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;max-width:900px;margin:0 auto}
.gallery-thumb{position:relative;aspect-ratio:4/3;overflow:hidden;border-radius:8px;cursor:zoom-in}
.gallery-thumb img{width:100%;height:100%;object-fit:cover;transition:transform .4s ease}
.gallery-thumb:hover img{transform:scale(1.05)}
.gallery-thumb:first-child{grid-column:span 2;aspect-ratio:16/7}
.gallery-placeholder{
  border:2px dashed var(--sand);border-radius:var(--radius);padding:3rem 2rem;
  text-align:center;color:#888;max-width:900px;margin:0 auto;
}
.gallery-placeholder p{margin-bottom:1.5rem;font-size:1.05rem}
.gallery-actions{text-align:center;margin-top:1.75rem}

/* ── VIDEO ── */
.video-wrapper{max-width:900px;margin:2rem auto 0;border-radius:var(--radius);overflow:hidden;background:#000}
.video-wrapper video{width:100%;display:block}
.video-responsive{position:relative;padding-bottom:56.25%;height:0;overflow:hidden}
.video-responsive iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:0}
.instagram-wrapper{max-width:540px;margin:2rem auto 0}

/* ── LIGHTBOX ── */
#lightbox{
  display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.92);
  align-items:center;justify-content:center;
}
#lightbox.open{display:flex}
#lightbox-img{max-width:90vw;max-height:88vh;object-fit:contain;border-radius:6px;user-select:none}
#lightbox-close{position:absolute;top:1rem;right:1.25rem;color:#fff;font-size:2rem;background:none;border:none;cursor:pointer;line-height:1;opacity:.8}
#lightbox-close:hover{opacity:1}
#lightbox-prev,#lightbox-next{
  position:absolute;top:50%;transform:translateY(-50%);color:#fff;
  background:rgba(255,255,255,.12);border:none;border-radius:50%;
  width:48px;height:48px;font-size:1.4rem;cursor:pointer;
  display:flex;align-items:center;justify-content:center;transition:background .2s;
}
#lightbox-prev{left:1rem}#lightbox-next{right:1rem}
#lightbox-prev:hover,#lightbox-next:hover{background:rgba(255,255,255,.28)}
#lightbox-counter{position:absolute;bottom:1.25rem;left:50%;transform:translateX(-50%);color:rgba(255,255,255,.7);font-size:.85rem}

/* ── DIFERENCIAIS ── */
#features{padding:clamp(3rem,7vw,6rem) clamp(1rem,5vw,4rem);background:var(--sand)}
#features h2{text-align:center;margin-bottom:2.5rem}
.features-grid{display:grid;gap:1.5rem;max-width:960px;margin:0 auto}
.feature-card{background:#fff;border-radius:var(--radius);padding:2rem 1.75rem;box-shadow:var(--shadow)}
.feature-icon{font-size:2.2rem;margin-bottom:.75rem}
.feature-title{font-family:'Cormorant Garant',serif;font-size:1.3rem;font-weight:600;margin-bottom:.5rem;color:var(--dark)}
.feature-desc{color:#555;font-size:.95rem;line-height:1.65}

/* ── NÚMEROS DO INVESTIMENTO ── */
#numbers{padding:clamp(3rem,7vw,6rem) clamp(1rem,5vw,4rem);background:var(--navy)}
#numbers h2{text-align:center;color:var(--sand);margin-bottom:2.5rem}
.numbers-grid{display:grid;gap:1.25rem;max-width:960px;margin:0 auto}
.number-card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10);border-radius:var(--radius);padding:2rem 1.75rem;text-align:center}
.number-label{font-size:.78rem;text-transform:uppercase;letter-spacing:.1em;color:var(--gold);margin-bottom:.75rem}
.number-value{font-family:'Cormorant Garant',serif;font-size:clamp(2rem,5vw,2.8rem);font-weight:600;color:#fff;margin-bottom:.5rem}
.number-note{font-size:.88rem;color:rgba(255,255,255,.55)}

/* ── MAPA ── */
#map{padding:clamp(3rem,7vw,6rem) clamp(1rem,5vw,4rem);background:var(--white)}
#map h2{text-align:center;margin-bottom:2rem}
.map-container{max-width:900px;margin:0 auto}
.map-iframe-wrap{border-radius:var(--radius);overflow:hidden;height:360px;margin-bottom:1.5rem;background:var(--sand)}
.map-iframe-wrap iframe{width:100%;height:100%;border:0}
.map-placeholder{height:260px;display:flex;align-items:center;justify-content:center;border:2px dashed var(--sand);border-radius:var(--radius);color:#aaa;font-size:.9rem}
.distances-table{width:100%;border-collapse:collapse;font-size:.93rem}
.distances-table tr{border-bottom:1px solid var(--sand)}
.distances-table td{padding:.65rem .5rem}
.distances-table td:last-child{text-align:right;font-weight:600;color:var(--ocean)}

/* ── CREDIBILIDADE ── */
#credibility{padding:clamp(3rem,7vw,6rem) clamp(1rem,5vw,4rem);background:var(--dark);color:#fff}
#credibility h2{text-align:center;color:var(--sand);margin-bottom:2.5rem}
.cred-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:2rem;text-align:center}
.seller-avatar{width:120px;height:120px;border-radius:50%;object-fit:cover;border:3px solid var(--gold)}
.seller-initials{width:120px;height:120px;border-radius:50%;background:var(--ocean);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garant',serif;font-size:2.5rem;font-weight:600;color:#fff;border:3px solid var(--gold)}
.seller-name{font-family:'Cormorant Garant',serif;font-size:1.4rem;font-weight:600;color:var(--sand);margin-bottom:.25rem}
.seller-title{font-size:.85rem;color:var(--gold);letter-spacing:.08em;margin-bottom:1rem}
.seller-bio{color:rgba(255,255,255,.78);line-height:1.75;font-size:.97rem}
.badges{display:flex;flex-wrap:wrap;justify-content:center;gap:.6rem;margin-top:1.25rem}
.badge{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:50px;padding:.35rem 1rem;font-size:.82rem;color:rgba(255,255,255,.85)}

/* ── CTA FINAL ── */
#cta-final{padding:clamp(3.5rem,8vw,7rem) clamp(1rem,5vw,4rem);background:var(--dark);text-align:center}
.urgency-pill{display:inline-block;background:rgba(200,164,90,.15);border:1px solid var(--gold);color:var(--gold);border-radius:50px;padding:.4rem 1.25rem;font-size:.82rem;letter-spacing:.08em;margin-bottom:1.5rem}
#cta-final h2{color:#fff;margin-bottom:.75rem}
#cta-final p{color:rgba(255,255,255,.65);margin-bottom:2rem;max-width:520px;margin-left:auto;margin-right:auto}
.btn-wpp-pulse{animation:pulse 2.2s infinite}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(37,211,102,.45)}50%{box-shadow:0 0 0 14px rgba(37,211,102,0)}}

/* ── FOOTER ── */
footer{background:var(--navy);color:rgba(255,255,255,.5);text-align:center;padding:2rem 1rem;font-size:.85rem}
footer a{color:var(--ocean)}

/* ── BOTÃO FLUTUANTE (desktop) ── */
#float-wpp{
  position:fixed;bottom:2rem;right:2rem;z-index:500;
  display:none;
  background:var(--wpp);color:#fff;border-radius:50px;
  padding:.75rem 1.4rem;font-weight:600;font-size:.95rem;
  gap:.5rem;align-items:center;
  box-shadow:0 6px 24px rgba(37,211,102,.35);
  transition:filter .2s,transform .2s;
}
#float-wpp:hover{filter:brightness(1.1);transform:translateY(-3px)}
#float-wpp svg{width:22px;height:22px}

/* ── BARRA STICKY (mobile) ── */
#sticky-bar{
  display:none;position:fixed;bottom:0;left:0;right:0;z-index:500;
  background:var(--dark);border-top:1px solid rgba(255,255,255,.08);
  padding:.75rem 1.25rem;align-items:center;justify-content:space-between;gap:1rem;
}
.sticky-price{color:var(--sand);font-family:'Cormorant Garant',serif;font-size:1.15rem;font-weight:600;white-space:nowrap}
#sticky-bar .btn-wpp{font-size:.88rem;padding:.65rem 1.25rem}

/* ── RESPONSIVO DESKTOP ── */
@media(min-width:768px){
  .gallery-grid{grid-template-columns:repeat(3,1fr)}
  .gallery-thumb:first-child{grid-column:span 2;aspect-ratio:4/3}
  .features-grid{grid-template-columns:repeat(3,1fr)}
  .numbers-grid{grid-template-columns:repeat(3,1fr)}
  .cred-inner{flex-direction:row;text-align:left;align-items:flex-start}
  #float-wpp{display:inline-flex}
  #sticky-bar{display:none!important}
}
@media(max-width:767px){
  #sticky-bar{display:flex}
  body{padding-bottom:72px}
}
</style>`;
  }

  function buildJS(d) {
    var photosJson = JSON.stringify(d.photos || []);
    return `<script>
(function(){
'use strict';

/* ── Fotos para o lightbox ── */
var PHOTOS = ${photosJson};

/* ── Lightbox ── */
var lb = document.getElementById('lightbox');
var lbImg = document.getElementById('lightbox-img');
var lbCounter = document.getElementById('lightbox-counter');
var lbCurrent = 0;
var lbTouchX = null;

function lbOpen(idx){
  if(!PHOTOS.length) return;
  lbCurrent = idx;
  lbImg.src = PHOTOS[idx];
  lbCounter.textContent = (idx+1) + ' / ' + PHOTOS.length;
  lb.classList.add('open');
  document.body.style.overflow='hidden';
}
function lbClose(){lb.classList.remove('open');document.body.style.overflow='';}
function lbNav(dir){lbCurrent=(lbCurrent+dir+PHOTOS.length)%PHOTOS.length;lbImg.src=PHOTOS[lbCurrent];lbCounter.textContent=(lbCurrent+1)+' / '+PHOTOS.length;}

if(lb){
  document.getElementById('lightbox-close').addEventListener('click',lbClose);
  document.getElementById('lightbox-prev').addEventListener('click',function(){lbNav(-1);});
  document.getElementById('lightbox-next').addEventListener('click',function(){lbNav(1);});
  lb.addEventListener('click',function(e){if(e.target===lb)lbClose();});
  document.addEventListener('keydown',function(e){
    if(!lb.classList.contains('open')) return;
    if(e.key==='Escape')lbClose();
    else if(e.key==='ArrowLeft')lbNav(-1);
    else if(e.key==='ArrowRight')lbNav(1);
  });
  /* Swipe mobile */
  lb.addEventListener('touchstart',function(e){lbTouchX=e.changedTouches[0].clientX;},{passive:true});
  lb.addEventListener('touchend',function(e){
    if(lbTouchX===null) return;
    var dx=e.changedTouches[0].clientX-lbTouchX;
    if(Math.abs(dx)>50) lbNav(dx<0?1:-1);
    lbTouchX=null;
  },{passive:true});
}

/* Abre lightbox ao clicar nas thumbs */
var thumbs = document.querySelectorAll('.gallery-thumb');
thumbs.forEach(function(t,i){t.addEventListener('click',function(){lbOpen(i);});});

/* ── Scroll Reveal ── */
var revealObserver = new IntersectionObserver(function(entries){
  entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('visible');}});
},{threshold:0.15});
document.querySelectorAll('.reveal').forEach(function(el){revealObserver.observe(el);});

/* ── Autoplay do vídeo ao entrar na viewport ── */
var video = document.getElementById('lp-video');
if(video){
  var videoObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(en){en.isIntersecting ? video.play().catch(function(){}) : video.pause();});
  },{threshold:0.5});
  videoObserver.observe(video);
}

/* ── Rastreamento WhatsApp ── */
document.querySelectorAll('[data-wpp-source]').forEach(function(el){
  el.addEventListener('click',function(){
    var src = el.getAttribute('data-wpp-source');
    if(typeof fbq==='function') fbq('track','Lead',{content_name:src});
    if(typeof gtag==='function') gtag('event','whatsapp_click',{source:src});
  });
});

})();
<\/script>`;
  }

  /* ── Blocos de seção ── */

  function heroBlock(d) {
    var wppUrl = encodeWpp(d.whatsappNumber, d.wppHero);
    return `
<!-- HERO -->
<section id="hero">
  <div class="hero-content">
    ${d.eyebrow ? `<p class="eyebrow">${e(d.eyebrow)}</p>` : ''}
    <h1 class="font-serif">${e(d.headline || d.propertyName)}</h1>
    ${d.price ? `<p class="hero-price">A partir de <span>${e(d.price)}</span></p>` : ''}
    <a href="${wppUrl}" target="_blank" rel="noopener" class="btn-wpp" data-wpp-source="hero">
      ${wppIcon()} Tenho interesse — fale comigo
    </a>
  </div>
</section>`;
  }

  function chipsBlock(d) {
    if (!d.chips || !d.chips.length) return '';
    return `
<!-- CHIPS -->
<div id="chips">
  <div class="chips-inner">
    ${d.chips.map(function(c){ return `<span class="chip">${e(c)}</span>`; }).join('\n    ')}
  </div>
</div>`;
  }

  function galleryBlock(d) {
    var wppUrl = encodeWpp(d.whatsappNumber, d.wppGallery);
    var gridHTML = '';
    if (d.photos && d.photos.length) {
      gridHTML = `<div class="gallery-grid">
    ${d.photos.map(function(p,i){ return `<div class="gallery-thumb"><img src="${p}" alt="Foto ${i+1} do imóvel" loading="lazy"></div>`; }).join('\n    ')}
  </div>`;
    } else {
      gridHTML = `<div class="gallery-placeholder">
    <p>📷 Fotos disponíveis sob consulta — solicite via WhatsApp</p>
    <a href="${wppUrl}" target="_blank" rel="noopener" class="btn-wpp" data-wpp-source="gallery">
      ${wppIcon()} Solicitar fotos
    </a>
  </div>`;
    }

    var videoHTML = videoBlock(d);

    return `
<!-- GALERIA -->
<section id="gallery" class="reveal">
  <h2 class="font-serif">Galeria de Fotos</h2>
  <p class="gallery-sub">${d.photos && d.photos.length ? 'Clique em qualquer foto para ampliar' : 'Solicite fotos e vídeo completo via WhatsApp'}</p>
  ${gridHTML}
  ${videoHTML}
  ${d.photos && d.photos.length ? `<div class="gallery-actions"><a href="${wppUrl}" target="_blank" rel="noopener" class="btn-wpp" data-wpp-source="gallery">${wppIcon()} Solicitar mais fotos via WhatsApp</a></div>` : ''}
</section>`;
  }

  function videoBlock(d) {
    if (!d.videoMode || d.videoMode === 'none') return '';
    if (d.videoMode === 'upload' && d.videoBase64) {
      return `
  <!-- Player de vídeo (arquivo local) -->
  <div class="video-wrapper reveal" style="margin-top:1.5rem">
    <video id="lp-video" src="${d.videoBase64}" type="${e(d.videoMimeType || 'video/mp4')}"
      muted playsinline controls preload="metadata"
      ${d.photos && d.photos[0] ? `poster="${d.photos[0]}"` : ''}>
      Seu navegador não suporta vídeo HTML5.
    </video>
  </div>`;
    }
    if (d.videoMode === 'youtube' && d.youtubeUrl) {
      var embedUrl = youtubeEmbedUrl(d.youtubeUrl);
      if (!embedUrl) return '';
      return `
  <!-- Player YouTube -->
  <div class="video-wrapper reveal" style="margin-top:1.5rem">
    <div class="video-responsive">
      <iframe src="${embedUrl}" title="Vídeo do imóvel" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
    </div>
  </div>`;
    }
    if (d.videoMode === 'instagram' && d.instagramUrl) {
      return `
  <!-- Embed Instagram -->
  <div class="instagram-wrapper reveal">
    <blockquote class="instagram-media" data-instgrm-permalink="${e(d.instagramUrl)}" data-instgrm-version="14" style="max-width:540px;width:100%;margin:0 auto">
      <div style="padding:16px;text-align:center">
        <a href="${e(d.instagramUrl)}" target="_blank" rel="noopener">Ver vídeo no Instagram</a>
      </div>
    </blockquote>
    <script async src="//www.instagram.com/embed.js"><\/script>
    <script>
    setTimeout(function(){
      if(typeof window.instgrm==='undefined'){
        document.querySelector('.instagram-media').innerHTML='<p style="text-align:center;padding:2rem"><a href="${e(d.instagramUrl)}" target="_blank" rel="noopener" style="color:var(--ocean)">▶ Assistir vídeo no Instagram</a></p>';
      }
    },3000);
    <\/script>
  </div>`;
    }
    return '';
  }

  function featuresBlock(d) {
    if (!d.features || !d.features.length) return '';
    return `
<!-- DIFERENCIAIS -->
<section id="features">
  <h2 class="font-serif reveal">Por que este imóvel?</h2>
  <div class="features-grid">
    ${d.features.map(function(f){ return `<div class="feature-card reveal">
      <div class="feature-icon">${f.icon || '✦'}</div>
      <div class="feature-title">${e(f.title)}</div>
      <div class="feature-desc">${e(f.desc)}</div>
    </div>`; }).join('\n    ')}
  </div>
</section>`;
  }

  function numbersBlock(d) {
    if (!d.numbers || !d.numbers.length) return '';
    return `
<!-- NÚMEROS DO INVESTIMENTO -->
<section id="numbers">
  <h2 class="font-serif reveal">Números do Investimento</h2>
  <div class="numbers-grid">
    ${d.numbers.map(function(n){ return `<div class="number-card reveal">
      <div class="number-label">${e(n.label)}</div>
      <div class="number-value">${e(n.value)}</div>
      <div class="number-note">${e(n.note)}</div>
    </div>`; }).join('\n    ')}
  </div>
</section>`;
  }

  function mapBlock(d) {
    var mapContent = '';
    if (d.mapEmbedUrl) {
      mapContent = `<div class="map-iframe-wrap">
      <iframe src="${e(d.mapEmbedUrl)}" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" title="Localização do imóvel"></iframe>
    </div>`;
    } else {
      mapContent = `<div class="map-placeholder">📍 ${d.mapTitle ? e(d.mapTitle) : 'Localização disponível sob consulta'}</div>`;
    }
    var distRows = '';
    if (d.distances && d.distances.length) {
      distRows = `<table class="distances-table">
      ${d.distances.map(function(r){ return `<tr><td>${e(r.place)}</td><td>${e(r.distance)}</td></tr>`; }).join('\n      ')}
    </table>`;
    }
    return `
<!-- MAPA -->
<section id="map" class="reveal">
  <h2 class="font-serif">${d.mapTitle ? e(d.mapTitle) : 'Localização'}</h2>
  <div class="map-container">
    ${mapContent}
    ${distRows}
  </div>
</section>`;
  }

  function credibilityBlock(d) {
    var photoHTML = d.sellerPhoto
      ? `<img src="${d.sellerPhoto}" alt="${e(d.sellerName)}" class="seller-avatar">`
      : `<div class="seller-initials">${initials(d.sellerName)}</div>`;
    var badgesHTML = d.badges && d.badges.length
      ? `<div class="badges">${d.badges.map(function(b){ return `<span class="badge">${e(b)}</span>`; }).join('')}</div>` : '';
    return `
<!-- CREDIBILIDADE -->
<section id="credibility">
  <h2 class="font-serif reveal">Quem está vendendo</h2>
  <div class="cred-inner reveal">
    ${photoHTML}
    <div>
      <div class="seller-name">${e(d.sellerName)}</div>
      <div class="seller-title">${e(d.sellerTitle)}</div>
      <p class="seller-bio">${e(d.sellerBio)}</p>
      ${d.sellerBio2 ? `<p class="seller-bio" style="margin-top:.75rem">${e(d.sellerBio2)}</p>` : ''}
      ${badgesHTML}
    </div>
  </div>
</section>`;
  }

  function finalCtaBlock(d) {
    var wppUrl = encodeWpp(d.whatsappNumber, d.wppFinalCta);
    return `
<!-- CTA FINAL -->
<section id="cta-final">
  ${d.urgency ? `<div class="urgency-pill">${e(d.urgency)}</div>` : ''}
  <h2 class="font-serif reveal">${e(d.price ? d.price + ' — Fale direto com o proprietário' : 'Entre em contato agora')}</h2>
  <p class="reveal">Sem intermediários. Resposta rápida. Condições reais.</p>
  <a href="${wppUrl}" target="_blank" rel="noopener" class="btn-wpp btn-wpp-pulse reveal" data-wpp-source="final-cta">
    ${wppIcon()} Quero saber mais — WhatsApp
  </a>
</section>`;
  }

  function footerBlock(d) {
    return `
<!-- FOOTER -->
<footer>
  <p>${e(d.condoName || d.propertyName)} &mdash; ${e(d.location)}</p>
  ${d.email ? `<p><a href="mailto:${e(d.email)}">${e(d.email)}</a></p>` : ''}
  ${d.whatsappNumber ? `<p><a href="https://wa.me/${e(d.whatsappNumber)}" target="_blank" rel="noopener">WhatsApp: +${e(d.whatsappNumber)}</a></p>` : ''}
  <p style="margin-top:1rem;font-size:.75rem">Venda direta com o proprietário &mdash; Tayrone Films</p>
</footer>`;
  }

  function floatingWpp(d) {
    var wppUrl = encodeWpp(d.whatsappNumber, d.wppFloat);
    return `
<!-- Botão flutuante WhatsApp (desktop) -->
<a id="float-wpp" href="${wppUrl}" target="_blank" rel="noopener" data-wpp-source="float">
  ${wppIcon()} WhatsApp
</a>`;
  }

  function stickyBar(d) {
    var wppUrl = encodeWpp(d.whatsappNumber, d.wppSticky);
    return `
<!-- Barra sticky (mobile) -->
<div id="sticky-bar">
  ${d.price ? `<span class="sticky-price">${e(d.price)}</span>` : ''}
  <a href="${wppUrl}" target="_blank" rel="noopener" class="btn-wpp" data-wpp-source="sticky">
    ${wppIcon()} WhatsApp
  </a>
</div>`;
  }

  function lightboxMarkup() {
    return `
<!-- Lightbox -->
<div id="lightbox" role="dialog" aria-modal="true" aria-label="Galeria de fotos">
  <button id="lightbox-close" aria-label="Fechar">&times;</button>
  <button id="lightbox-prev" aria-label="Foto anterior">&#8592;</button>
  <img id="lightbox-img" src="" alt="Foto ampliada do imóvel">
  <button id="lightbox-next" aria-label="Próxima foto">&#8594;</button>
  <div id="lightbox-counter"></div>
</div>`;
  }

  function wppIcon() {
    return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
  }

  /* ─────────────────────────────────────────────
     FUNÇÃO PRINCIPAL
  ───────────────────────────────────────────── */

  function generateLandingPage(data) {
    var d = mergeDefaults(data || {});

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${e(d.pageTitle)}</title>
  ${d.metaDescription ? `<meta name="description" content="${e(d.metaDescription)}">` : ''}
  <meta property="og:title" content="${e(d.pageTitle)}">
  ${d.metaDescription ? `<meta property="og:description" content="${e(d.metaDescription)}">` : ''}
  <meta property="og:type" content="website">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  ${trackingScripts(d)}
  ${buildCSS(d)}
</head>
<body>
  ${heroBlock(d)}
  ${chipsBlock(d)}
  ${galleryBlock(d)}
  ${featuresBlock(d)}
  ${numbersBlock(d)}
  ${mapBlock(d)}
  ${credibilityBlock(d)}
  ${finalCtaBlock(d)}
  ${footerBlock(d)}
  ${floatingWpp(d)}
  ${stickyBar(d)}
  ${lightboxMarkup()}
  ${buildJS(d)}
</body>
</html>`;
  }

  /* Exporta para o browser */
  window.LandingTemplate = { generateLandingPage: generateLandingPage };

})();
