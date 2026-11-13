/* ==========================================================================
   BATOOL ABAYA - MAIN SCRIPT (plain JavaScript, no libraries)
   --------------------------------------------------------------------------
   WHAT TO EDIT
   - WhatsApp number, texts ....... Section 0A (CONFIG)
   - Products (names, colours...) .. Section 0C (PRODUCTS)
   - Colour names and hex codes .... Section 0B (COLOURS)

   CONTENTS
    0. Settings: A CONFIG, B COLOURS, C PRODUCTS
    1. Helpers
    2. Garment artwork (SVG drawings used when a product has no photo)
    3. Header and mobile menu
    4. Product cards and category filters
    5. Product lightbox (details, colour choice, order button)
    6. Forms (open WhatsApp with the enquiry filled in)
    7. Pointer effects (card tilt, magnetic buttons)
    8. Scroll reveal
    9. Preloader
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 0A. CONFIG: edit these ---------- */
  var CONFIG = {
    whatsapp:    '919327009696',   // WhatsApp number: country code + number, no spaces or +
    brand:       'Batool Abaya',   // used inside WhatsApp messages
    priceText:   'Price on enquiry', // shown when a product has no price (set price:'Rs 2,499' on a product to override)
    sizesText:   'On request, custom fit available'
  };

  /* ---------- 0B. COLOURS: name -> hex code. Names are used in the PRODUCTS list below ---------- */
  var COLOURS = {
    Black:'#14120f', Navy:'#1d2433', Emerald:'#1e3a32', Taupe:'#8b7d6c',
    Sand:'#e4dac8', Cream:'#efe6d4', Gold:'#b08d4f', Silver:'#c9c9c9', Pearl:'#efe9dc'
  };
  /* Panel (background) colours for product pictures */
  var PANELS = { sand:'#e4dac8', stone:'#cbbfa9', olive:'#d8cfbd', taupe:'#8b7d6c', black:'#14120f' };

  /* ---------- 0C. PRODUCTS: edit, add or delete items ----------
     type     : abaya | burqa | dupatta | coat | nose
     colours  : colours offered (names from COLOURS above)
     shown    : the colour drawn first (must be one of colours)
     panel    : background colour of the picture (name from PANELS)
     price    : optional, e.g. 'Rs 2,499'  (leave out for "Price on enquiry")
     photo    : optional, e.g. 'images/noor-abaya.jpg' (replaces the drawing)            */
  var PRODUCTS = [
    { id:'a1', type:'abaya', name:'Noor Crepe Abaya', about:'Straight cut with a concealed front closure and a fluid drape. No embellishment.', fabric:'Crepe', colours:['Black','Taupe'], shown:'Black', panel:'sand' },
    { id:'a2', type:'abaya', name:'Dubai Open Abaya', about:'Open front with tonal piping at the cuff. Light enough for warm days.', fabric:'Nida', colours:['Black','Navy'], shown:'Navy', panel:'stone' },
    { id:'a3', type:'abaya', name:'Istanbul Kimono Abaya', about:'Wide sleeve with a soft belt. A Turkish-inspired cut in a heavy, quiet fabric.', fabric:'Crepe', colours:['Emerald','Black'], shown:'Emerald', panel:'olive' },
    { id:'a4', type:'abaya', name:'Gold Trim Abaya', about:'Black with a single narrow gold trim down the placket.', fabric:'Nida', colours:['Black'], shown:'Black', panel:'taupe' },
    { id:'a5', type:'abaya', name:'Everyday Taupe Abaya', about:'A relaxed daily abaya in a muted neutral.', fabric:'Linen blend', colours:['Taupe','Sand'], shown:'Taupe', panel:'black' },
    { id:'b1', type:'burqa', name:'Classic Nida Burqa', about:'Everyday burqa in breathable nida with a structured flare.', fabric:'Nida', colours:['Black'], shown:'Black', panel:'sand' },
    { id:'b2', type:'burqa', name:'Layered Niqab Set', about:'Burqa with a two-layer face veil, sold with a matching dupatta.', fabric:'Nida and chiffon', colours:['Black','Navy'], shown:'Navy', panel:'stone' },
    { id:'b3', type:'burqa', name:'Travel Burqa', about:'Wrinkle-resistant fabric with deep pockets for long journeys.', fabric:'Poly crepe', colours:['Black','Taupe'], shown:'Black', panel:'taupe' },
    { id:'d1', type:'dupatta', name:'Chiffon Dupatta', about:'Sheer, light and easy to drape. Finished with a narrow hem.', fabric:'Chiffon', colours:['Cream','Black','Sand'], shown:'Cream', panel:'black' },
    { id:'d2', type:'dupatta', name:'Georgette Dupatta', about:'A fuller drape with a soft matte finish.', fabric:'Georgette', colours:['Taupe','Navy','Black'], shown:'Taupe', panel:'sand' },
    { id:'c1', type:'coat', name:'Long Coat Abaya', about:'Tailored long coat with a single-line closure.', fabric:'Wool blend', colours:['Black','Navy'], shown:'Black', panel:'stone' },
    { id:'c2', type:'coat', name:'Winter Coat', about:'A warmer coat cut for layering over an abaya.', fabric:'Wool blend', colours:['Black','Taupe'], shown:'Taupe', panel:'black' },
    { id:'n1', type:'nose', name:'Gold Nosepiece', about:'Slim nosepiece with an adjustable fit in a gold finish.', fabric:'Gold-tone metal', colours:['Gold'], shown:'Gold', panel:'black' },
    { id:'n2', type:'nose', name:'Pearl Nosepiece', about:'A small pearl detail on a fine band, light for all-day wear.', fabric:'Metal and pearl', colours:['Pearl','Gold','Silver'], shown:'Pearl', panel:'black' },
    { id:'n3', type:'nose', name:'Plain Black Nosepiece', about:'Matte black and minimal, sized for light and heavy veils.', fabric:'Matte metal', colours:['Black'], shown:'Black', panel:'sand' }
  ];
  var TYPE_NAME = { abaya:'Abaya', burqa:'Burqa', dupatta:'Dupatta', coat:'Coat', nose:'Nosepiece' };


  /* ---------- 1. HELPERS ---------- */
  var root = document.documentElement;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function waLink(text) { return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text); }
  var finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;


  /* ---------- 2. GARMENT ARTWORK (inline SVG, works from any folder) ---------- */
  var GOLD = '#b08d4f';
  var sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<symbol id="g-abaya" viewBox="0 0 100 140"><path fill="currentColor" d="M50 8c-9 0-15 6-15 15 0 6 2 10 5 12-10 5-15 17-18 38-3 28-8 50-14 67h84c-6-17-11-39-14-67-3-21-8-33-18-38 3-2 5-6 5-12 0-9-6-15-15-15z"/><path fill="none" stroke="' + GOLD + '" stroke-width="1.2" d="M50 38v98M12 136h76"/><path fill="none" stroke="' + GOLD + '" stroke-width=".8" opacity=".5" d="M38 62c-2 30-6 52-12 74M62 62c2 30 6 52 12 74"/></symbol>' +
    '<symbol id="g-burqa" viewBox="0 0 100 140"><path fill="currentColor" d="M50 6c-14 0-24 10-24 26 0 8 3 14 6 18-12 6-18 20-20 42-2 22-6 36-12 44h100c-6-8-10-22-12-44-2-22-8-36-20-42 3-4 6-10 6-18 0-16-10-26-24-26z"/><path fill="none" stroke="' + GOLD + '" stroke-width="1.2" d="M33 48c11 9 23 9 34 0M40 30h20M6 134h88"/><path fill="none" stroke="' + GOLD + '" stroke-width=".8" opacity=".5" d="M36 78c-2 22-5 38-10 54M64 78c2 22 5 38 10 54"/></symbol>' +
    '<symbol id="g-dupatta" viewBox="0 0 100 140"><path fill="currentColor" d="M24 8c18 10 34-10 52 0v112c-18-10-34 10-52 0z"/><path fill="none" stroke="' + GOLD + '" stroke-width="1.2" d="M30 124v12M40 128v12M50 130v10M60 128v12M70 124v12M31 16v96"/></symbol>' +
    '<symbol id="g-coat" viewBox="0 0 100 140"><path fill="currentColor" d="M33 10l17 14 17-14 23 14 7 42-11 5-3 65H20l-3-65-11-5 7-42z"/><path fill="none" stroke="' + GOLD + '" stroke-width="1.2" d="M50 24v112M20 136h60"/><path fill="none" stroke="' + GOLD + '" stroke-width=".8" opacity=".5" d="M27 30l-6 36M73 30l6 36"/><circle cx="44" cy="62" r="1.8" fill="' + GOLD + '"/><circle cx="44" cy="84" r="1.8" fill="' + GOLD + '"/><circle cx="44" cy="106" r="1.8" fill="' + GOLD + '"/></symbol>' +
    '<symbol id="g-nose" viewBox="0 0 100 140"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" d="M14 56c8 30 64 30 72 0"/><circle cx="27.5" cy="73" r="2.4" fill="currentColor"/><circle cx="72.5" cy="73" r="2.4" fill="currentColor"/><circle cx="50" cy="84" r="5" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="1.2" d="M50 89v14"/><circle cx="50" cy="106" r="2.4" fill="currentColor"/></symbol>' +
    '</defs></svg>';
  document.body.insertAdjacentHTML('afterbegin', sprite);

  /* The picture inside a product panel: photo if given, otherwise the drawing */
  function art(p) {
    if (p.photo) { return '<img class="pimg" src="' + p.photo + '" alt="' + p.name + '" loading="lazy">'; }
    return '<span class="arch"></span><svg class="g" viewBox="0 0 100 140" aria-hidden="true"><use href="#g-' + p.type + '"/></svg>';
  }


  /* ---------- 3. HEADER AND MOBILE MENU ---------- */
  var header = $('.site-header'), hero = $('.hero');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
    // Hero ribbons drift slightly while the hero is on screen. The value is set on the hero only, so the rest of the page is not re-styled on every scroll.
    if (hero && window.scrollY < hero.offsetHeight + 100) { hero.style.setProperty('--sy', Math.min(window.scrollY, 800)); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var burger = $('.burger');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  burger.addEventListener('click', function () { setMenu(!document.body.classList.contains('menu-open')); });
  $('.scrim').addEventListener('click', function () { setMenu(false); });
  $$('.drawer a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });


  /* ---------- 4. PRODUCT CARDS AND CATEGORY FILTERS ---------- */
  var shown = [];   // the products currently displayed (the lightbox steps through these)

  function card(p) {
    return '<button class="card" data-id="' + p.id + '" data-cat="' + p.type + '">' +
      '<div class="ph" style="--bg:' + PANELS[p.panel] + ';--fg:' + COLOURS[p.shown] + '">' + art(p) + '<span class="reveal">View details</span></div>' +
      '<h3>' + p.name + '</h3><span class="price">' + TYPE_NAME[p.type] + ' &middot; ' + (p.price || CONFIG.priceText) + '</span></button>';
  }
  function renderGrid(grid, filter) {
    var limit = +grid.dataset.limit || 999;           // data-limit="4" on the grid shows only 4 products
    shown = PRODUCTS.filter(function (p) { return filter === 'all' || p.type === filter; }).slice(0, limit);
    grid.innerHTML = shown.map(card).join('');
    $$('.card', grid).forEach(function (c) { c.addEventListener('click', function () { openLightbox(c.dataset.id); }); });
    reveal($$('.card', grid));
  }
  $$('[data-grid]').forEach(function (grid) {
    var buttons = $$('.filters button');
    function setFilter(filter) {                       // show one category and highlight its button
      if (!TYPE_NAME[filter]) { filter = 'all'; }
      buttons.forEach(function (b) { b.classList.toggle('on', b.dataset.f === filter); });
      renderGrid(grid, filter);
    }
    setFilter((location.hash || '').slice(1));         // collections.html#abaya opens filtered
    buttons.forEach(function (b) { b.addEventListener('click', function () { setFilter(b.dataset.f); }); });
    window.addEventListener('hashchange', function () { setFilter((location.hash || '').slice(1)); });
  });


  /* ---------- 5. PRODUCT LIGHTBOX ---------- */
  var lb = $('.lb'), lbIndex = 0, lbOpener = null;

  function lbShow(i) {
    lbIndex = (i + shown.length) % shown.length;
    var p = shown[lbIndex], ph = $('.ph', lb);
    ph.style.setProperty('--bg', PANELS[p.panel]);
    ph.style.setProperty('--fg', COLOURS[p.shown]);
    ph.setAttribute('data-cat', p.type);
    ph.innerHTML = art(p);
    $('h3', lb).textContent = p.name;
    $('.d', lb).textContent = p.about;
    $('dl', lb).innerHTML = '<dt>Category</dt><dd>' + TYPE_NAME[p.type] + '</dd><dt>Fabric</dt><dd>' + p.fabric + '</dd><dt>Colours</dt><dd>' + p.colours.join(', ') + '</dd><dt>Sizes</dt><dd>' + CONFIG.sizesText + '</dd><dt>Price</dt><dd>' + (p.price || CONFIG.priceText) + '</dd>';

    /* Colour dots: pick one to recolour the drawing and add the colour to the order message */
    var sw = $('.sws', lb);
    if (!sw) { sw = document.createElement('div'); sw.className = 'sws'; $('dl', lb).after(sw); }
    sw.innerHTML = '<span class="cn">' + p.shown + '</span>' + p.colours.map(function (n) {
      return '<button type="button" class="sw" data-n="' + n + '" style="--c:' + COLOURS[n] + '" aria-label="' + n + '" aria-pressed="' + (n === p.shown) + '"></button>';
    }).join('');
    function setOrder(colour) { $('.btn', lb).href = waLink('Hello ' + CONFIG.brand + ', I would like to order: ' + p.name + ' in ' + colour); }
    setOrder(p.shown);
    sw.onclick = function (e) {
      var b = e.target.closest('.sw'); if (!b) return;
      $$('.sw', sw).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      ph.style.setProperty('--fg', COLOURS[b.dataset.n]);
      $('.cn', sw).textContent = b.dataset.n;
      setOrder(b.dataset.n);
    };
  }
  function openLightbox(id) {
    if (!lb) return;
    lbOpener = document.activeElement;
    lbShow(shown.map(function (p) { return p.id; }).indexOf(id));
    lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lb-open');
    $('.x', lb).focus();
  }
  function closeLightbox() {
    lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lb-open');
    if (lbOpener) lbOpener.focus();
  }
  if (lb) {
    $('.x', lb).addEventListener('click', closeLightbox);
    $('.prev', lb).addEventListener('click', function () { lbShow(lbIndex - 1); });
    $('.next', lb).addEventListener('click', function () { lbShow(lbIndex + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
      if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
      if (e.key === 'Tab') {                           // keep keyboard focus inside the lightbox
        var f = $$('.x,.nb,.sw,.btn', lb), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    var touchX = 0;                                    // swipe left/right on phones
    lb.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 60) lbShow(lbIndex + (dx < 0 ? 1 : -1));
    });
  }


  /* ---------- 6. FORMS: check the fields, then open WhatsApp with the message ---------- */
  $$('form[data-wa]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = $('.note', form);
      if (!form.checkValidity()) { note.textContent = 'Please complete the required fields.'; form.reportValidity(); return; }
      var body = $$('input,select,textarea', form).map(function (f) { return f.name + ': ' + f.value; }).join('\n');
      window.open(waLink(form.dataset.wa + '\n' + body), '_blank', 'noopener');
      note.textContent = 'Opening WhatsApp with your enquiry.';
      form.reset();
    });
  });


  /* ---------- 7. POINTER EFFECTS (mouse devices only) ---------- */
  if (finePointer) {
    document.addEventListener('pointermove', function (e) {
      var c = e.target.closest && e.target.closest('.card,.cat');
      if (c) {                                           // cards tilt toward the pointer
        var ph = $('.ph', c), r = ph.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        ph.style.transform = 'perspective(900px) rotateY(' + (x * 7).toFixed(2) + 'deg) rotateX(' + (-y * 7).toFixed(2) + 'deg)';
      }
      var b = e.target.closest && e.target.closest('.btn.solid');
      if (b) {                                           // gold buttons lean toward the pointer
        var q = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - q.left - q.width / 2) * 0.12).toFixed(1) + 'px,' + ((e.clientY - q.top - q.height / 2) * 0.2).toFixed(1) + 'px)';
      }
    });
    /* Reset only when the pointer truly leaves (not when it moves between a card's inner parts) */
    document.addEventListener('pointerout', function (e) {
      var c = e.target.closest && e.target.closest('.card,.cat');
      if (c && !c.contains(e.relatedTarget)) { $('.ph', c).style.transform = ''; }
      var b = e.target.closest && e.target.closest('.btn.solid');
      if (b && !b.contains(e.relatedTarget)) { b.style.transform = ''; }
    });
  }


  /* ---------- 8. SCROLL REVEAL ----------
     Everything is visible by default. Only items that start below the fold slide up slightly. */
  var observer = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); observer.unobserve(en.target); } });
  }, { threshold: 0.08 }) : null;
  function reveal(list) {
    if (!observer) return;
    list.forEach(function (el, i) {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('rv'); el.style.transitionDelay = (i % 4) * 80 + 'ms'; observer.observe(el);
      }
    });
  }
  reveal($$('.cat,.facts>div,.steps li,.mapf'));


  /* ---------- 9. PRELOADER (once per browser session) ---------- */
  var pl = $('.pl');
  if (pl && !root.classList.contains('no-pl')) {
    document.body.classList.add('loading');
    setTimeout(function () {
      pl.classList.add('done');
      document.body.classList.remove('loading');
      try { sessionStorage.setItem('pl', '1'); } catch (err) {}
      setTimeout(function () { pl.remove(); }, 1400);
    }, 2700);
  }
})();
