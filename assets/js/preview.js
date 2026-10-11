/* ═══════════════════════════════════════════════════════════════
   Сборка страницы в рамке предпросмотра.

   Рамка - <iframe> с srcdoc, то есть того же происхождения: можно
   менять её содержимое из родительской страницы. Поэтому страница
   не перезагружается на каждый щелчок - меняются переменные темы и
   добавляются или убираются отдельные блоки. За счёт этого видно,
   как сайт собирается: блок приезжает снизу, цвета переходят плавно.

   Внутри рамки - собственный маленький набор стилей, он не связан
   со стилями конфигуратора: тема задаётся переменными на :root.
   ═══════════════════════════════════════════════════════════════ */

window.CFGPreview = (function () {
  'use strict';

  var CFG = window.CFG;
  var ORDER = CFG.blocks.map(function (b) { return b.id; });

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  // h1 и lead приходят с <br>, их пропускаем как есть
  function raw(s) { return String(s); }

  function photo(label, cls) {
    return '<div class="ph ' + (cls || '') + '" aria-hidden="true"><svg viewBox="0 0 100 70" preserveAspectRatio="none">' +
      '<line x1="0" y1="0" x2="100" y2="70"/><line x1="100" y1="0" x2="0" y2="70"/></svg><span>' + esc(label) + '</span></div>';
  }

  /* ── Стили собранной страницы ─────────────────────────────────── */
  var CSS = [
    '*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}',
    ':root{--bg:#fff;--surface:#f4f6f9;--ink:#111;--muted:#666;--line:#e3e3e3;--accent:#2F5BFF;--accent-2:#2F5BFF;--on-accent:#fff;--accent-soft:rgba(47,91,255,.08);',
    '--display:system-ui,sans-serif;--body:system-ui,sans-serif;--display-weight:800;--display-tracking:-.02em;--display-case:none;',
    '--radius:16px;--radius-sm:10px;--btn-radius:10px;--hero-pad:88px;--shadow:0 18px 40px rgba(0,0,0,.07);',
    '--ease:cubic-bezier(.2,0,0,1)}',
    'html{background:var(--bg)}',
    'body{background:var(--bg);color:var(--ink);font-family:var(--body);font-size:16px;line-height:1.6;',
    'transition:background-color .45s var(--ease),color .45s var(--ease)}',
    'h1,h2,h3,.logo__name,.stat__v,.price__v{font-family:var(--display);font-weight:var(--display-weight);letter-spacing:var(--display-tracking);line-height:1.08}',
    'h2{font-size:clamp(24px,3.4vw,38px);text-transform:var(--display-case)}',
    'h3{font-size:19px;line-height:1.25}',
    'section{padding:clamp(40px,6vw,72px) 0;border-top:1px solid var(--line)}',
    'section:first-of-type{border-top:0}',
    '.wrap{width:100%;max-width:1120px;margin:0 auto;padding:0 clamp(18px,4vw,40px)}',
    '.kicker{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent-2);font-weight:500}',
    '.lead{color:var(--muted);font-size:clamp(15px,1.5vw,18px);max-width:52ch}',
    '.note{color:var(--muted);font-size:13px}',
    /* шапка */
    '.hd{position:sticky;top:0;z-index:5;display:flex;align-items:center;gap:20px;justify-content:space-between;',
    'padding:14px clamp(18px,4vw,40px);background:var(--bg);border-bottom:1px solid var(--line)}',
    '@supports (backdrop-filter:blur(2px)){.hd{background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(10px)}}',
    '.logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:inherit}',
    '.logo__mark{width:30px;height:30px;border-radius:var(--radius-sm);background:var(--accent);color:var(--on-accent);',
    'display:grid;place-items:center;font-size:12px;font-weight:600;font-family:var(--display);letter-spacing:0}',
    '.logo__name{font-size:16px;text-transform:var(--display-case)}',
    '.hd nav{display:flex;gap:18px}',
    '.hd a.nav{color:var(--muted);text-decoration:none;font-size:14px}',
    '.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 20px;',
    'border:1px solid var(--accent);border-radius:var(--btn-radius);background:var(--accent);color:var(--on-accent);',
    'font:inherit;font-size:15px;font-weight:500;text-decoration:none;cursor:pointer;transition:transform .14s var(--ease)}',
    '.btn:active{transform:scale(.985)}',
    '.btn--ghost{background:transparent;color:var(--ink);border-color:var(--line)}',
    '.btn--sm{min-height:38px;padding:0 14px;font-size:14px}',
    /* первый экран */
    '.hero{padding-top:var(--hero-pad);padding-bottom:var(--hero-pad)}',
    '.hero__in{display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(24px,4vw,56px);align-items:center}',
    '.hero h1{font-size:clamp(30px,4.6vw,56px);text-transform:var(--display-case);margin:14px 0 16px}',
    '.row{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}',
    '.stats{list-style:none;display:flex;flex-wrap:wrap;gap:22px;margin-top:32px;padding-top:22px;border-top:1px solid var(--line)}',
    '.stat__v{display:block;font-size:20px}',
    '.stat__k{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}',
    /* заполнитель фото */
    '.ph{position:relative;display:grid;place-items:center;background:var(--surface);border:1px solid var(--line);',
    'border-radius:var(--radius);overflow:hidden;aspect-ratio:4/3;color:var(--muted)}',
    '.ph svg{position:absolute;inset:0;width:100%;height:100%;stroke:var(--line);stroke-width:1;vector-effect:non-scaling-stroke}',
    '.ph span{position:relative;font-size:11px;letter-spacing:.18em;padding:4px 10px;border-radius:999px;background:var(--bg);border:1px solid var(--line)}',
    '.ph--hero{aspect-ratio:5/4;box-shadow:var(--shadow)}',
    /* услуги, галерея, прайс */
    '.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:28px}',
    '.card{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:22px}',
    '.card p{color:var(--muted);font-size:15px;margin-top:8px}',
    '.gal{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:28px}',
    '.gal figcaption{font-size:13px;color:var(--muted);margin-top:8px}',
    '.price{list-style:none;margin-top:24px;border-top:1px solid var(--line)}',
    '.price li{display:flex;align-items:baseline;gap:12px;padding:16px 0;border-bottom:1px solid var(--line)}',
    '.price__t{font-weight:500}.price__d{color:var(--muted);font-size:14px}',
    '.price__dots{flex:1;border-bottom:1px dotted var(--line)}',
    '.price__v{white-space:nowrap;color:var(--accent-2);font-size:17px}',
    /* отзывы */
    '.rev{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:28px}',
    '.rev__who{display:flex;align-items:center;gap:10px;margin-top:16px}',
    '.rev__av{width:34px;height:34px;border-radius:999px;background:var(--accent-soft);border:1px solid var(--line)}',
    '.rev__n{font-size:14px;font-weight:500}.rev__s{font-size:12px;color:var(--muted)}',
    /* вопросы */
    '.faq{margin-top:24px;border-top:1px solid var(--line)}',
    '.faq details{border-bottom:1px solid var(--line)}',
    '.faq summary{display:flex;justify-content:space-between;gap:16px;align-items:center;padding:18px 0;cursor:pointer;font-weight:500;list-style:none}',
    '.faq summary::-webkit-details-marker{display:none}',
    '.faq summary::after{content:"+";color:var(--accent-2);font-size:20px;line-height:1}',
    '.faq details[open] summary::after{content:"-"}',
    '.faq p{color:var(--muted);padding-bottom:18px;max-width:60ch}',
    /* запись */
    '.chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}',
    '.chip{min-height:44px;padding:0 16px;display:inline-flex;align-items:center;border:1px solid var(--line);',
    'border-radius:var(--btn-radius);background:var(--surface);color:var(--ink);font:inherit;font-size:15px;cursor:pointer;',
    'transition:background-color .14s var(--ease),color .14s var(--ease),border-color .14s var(--ease),transform .14s var(--ease)}',
    '.chip:active{transform:scale(.985)}',
    '.chip[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:var(--on-accent)}',
    '.sub{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-top:24px}',
    /* карта и форма */
    '.map{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:26px;align-items:stretch}',
    '.map__box{position:relative;border:1px solid var(--line);border-radius:var(--radius);background-color:var(--surface);background-image:',
    'repeating-linear-gradient(0deg,transparent 0 23px,var(--line) 23px 24px),repeating-linear-gradient(90deg,transparent 0 23px,var(--line) 23px 24px);',
    'min-height:220px;display:grid;place-items:center}',
    '.map__pin{width:16px;height:16px;border-radius:999px;background:var(--accent);box-shadow:0 0 0 7px var(--accent-soft)}',
    '.map__note{position:absolute;bottom:10px;left:10px;font-size:11px;letter-spacing:.14em;background:var(--bg);',
    'border:1px solid var(--line);border-radius:999px;padding:4px 10px;color:var(--muted)}',
    '.addr{list-style:none;display:grid;gap:10px;align-content:center}',
    '.addr li{display:flex;gap:10px;align-items:baseline}',
    '.addr b{font-weight:500;min-width:92px;color:var(--muted);font-size:13px}',
    '.form{display:grid;gap:12px;margin-top:24px;max-width:520px}',
    '.field{display:grid;gap:6px}',
    '.field span{font-size:13px;color:var(--muted)}',
    '.field input,.field textarea{min-height:46px;padding:12px 14px;border:1px solid var(--line);border-radius:var(--radius-sm);',
    'background:var(--surface);color:var(--ink);font:inherit;font-size:15px;width:100%}',
    '.field textarea{min-height:84px;resize:vertical}',
    /* подвал и мессенджеры */
    'footer{padding:28px 0 40px;border-top:1px solid var(--line);color:var(--muted);font-size:13px}',
    'footer .wrap{display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;align-items:center}',
    '.msg{position:fixed;right:18px;bottom:18px;z-index:9;display:flex;flex-direction:column;gap:10px;align-items:flex-end}',
    '.msg__b{display:inline-flex;align-items:center;gap:8px;min-height:48px;padding:0 18px;border-radius:999px;',
    'background:var(--accent);color:var(--on-accent);text-decoration:none;font-size:15px;font-weight:500;box-shadow:var(--shadow)}',
    '.msg__b--2{background:var(--surface);color:var(--ink);border:1px solid var(--line)}',
    /* приход и уход блока: едет высота, содержимое подхватывает */
    '.slot{display:grid;grid-template-rows:1fr;transition:grid-template-rows .48s var(--ease)}',
    '.slot > *{min-height:0;overflow:hidden}',
    '.slot.is-shut{grid-template-rows:0fr}',
    '.slot .wrap{transition:opacity .34s var(--ease),transform .34s var(--ease)}',
    '.slot.is-shut .wrap{opacity:0;transform:translateY(10px)}',
    '.msg{transition:opacity .34s var(--ease),transform .34s var(--ease)}',
    '.msg.is-shut{opacity:0;transform:translateY(12px)}',
    /* первая сборка: блоки приезжают по очереди */
    '@keyframes pvIn{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}',
    '.pv-in{animation:pvIn .48s var(--ease) both;animation-delay:var(--d,0s)}',
    '@media (max-width:860px){',
    '.hero__in,.map{grid-template-columns:1fr}.grid3,.rev{grid-template-columns:1fr}.gal{grid-template-columns:1fr 1fr}',
    '.hd nav{display:none}.hero{padding-top:52px;padding-bottom:52px}',
    '.stats{gap:16px}.stat__v{font-size:18px}',
    '}',
    '@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}'
  ].join('');

  /* маленький сценарий внутри рамки: кнопки записи переключаются,
     форма ничего не отправляет */
  var SCRIPT = [
    "document.addEventListener('click',function(e){",
    "var c=e.target.closest('.chip');",
    "if(c){var g=c.parentNode;Array.prototype.forEach.call(g.children,function(x){x.setAttribute('aria-pressed',x===c?'true':'false')});}",
    "var b=e.target.closest('button[type=submit],.btn');if(b&&b.closest('form'))e.preventDefault();",
    "},false);",
    "document.addEventListener('submit',function(e){e.preventDefault();},false);"
  ].join('');

  function shell() {
    return '<!DOCTYPE html><html><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
      '<link id="pv-font" rel="stylesheet" href="">' +
      '<style>' + CSS + '</style></head><body><script>' + SCRIPT + '<\/script></body></html>';
  }

  function setTheme(doc, theme) {
    var root = doc.documentElement;
    Object.keys(theme.tokens).forEach(function (k) { root.style.setProperty('--' + k, theme.tokens[k]); });
    var link = doc.getElementById('pv-font');
    var href = 'https://fonts.googleapis.com/css2?' + theme.font + '&display=swap';
    if (link && link.getAttribute('href') !== href) link.setAttribute('href', href);
  }

  /* ── Разметка блоков ─────────────────────────────────────────── */
  function head(n, lang) {
    var nav = n.nav[lang].map(function (t) { return '<a class="nav" href="#">' + esc(t) + '</a>'; }).join('');
    return '<header class="hd"><a class="logo" href="#"><span class="logo__mark">' + esc(n.mark[lang]) + '</span>' +
      '<span class="logo__name">' + esc(n.brand[lang]) + '</span></a>' +
      '<nav>' + nav + '</nav>' +
      '<a class="btn btn--sm" href="#">' + esc(n.cta[lang]) + '</a></header>';
  }

  function hero(n, lang, t) {
    var stats = n.stats[lang].map(function (s) {
      return '<li><span class="stat__v">' + esc(s[1]) + '</span><span class="stat__k">' + esc(s[0]) + '</span></li>';
    }).join('');
    return '<section class="hero"><div class="wrap"><div class="hero__in"><div>' +
      '<p class="kicker">' + esc(n.label[lang]) + '</p>' +
      '<h1>' + raw(n.h1[lang]) + '</h1>' +
      '<p class="lead">' + esc(n.lead[lang]) + '</p>' +
      '<div class="row"><a class="btn" href="#">' + esc(n.cta[lang]) + '</a>' +
      '<a class="btn btn--ghost" href="#">' + esc(n.cta2[lang]) + '</a></div>' +
      '<ul class="stats">' + stats + '</ul></div>' +
      photo(t.photo, 'ph--hero') + '</div></div></section>';
  }

  function services(n, lang, t) {
    var cards = n.services[lang].map(function (s) {
      return '<article class="card"><h3>' + esc(s[0]) + '</h3><p>' + esc(s[1]) + '</p></article>';
    }).join('');
    return '<section><div class="wrap"><h2>' + esc(t.services) + '</h2><div class="grid3">' + cards + '</div></div></section>';
  }

  var sections = {
    gallery: function (n, lang, t) {
      var tiles = n.gallery[lang].map(function (c) {
        return '<figure>' + photo(t.photo) + '<figcaption>' + esc(c) + '</figcaption></figure>';
      }).join('');
      return '<h2>' + esc(t.gallery) + '</h2><p class="note">' + esc(t.galleryNote) + '</p><div class="gal">' + tiles + '</div>';
    },
    price: function (n, lang, t) {
      var rows = n.price[lang].map(function (p) {
        return '<li><span class="price__t">' + esc(p[0]) + '</span><span class="price__d">' + esc(p[1]) + '</span>' +
          '<span class="price__dots"></span><span class="price__v">' + esc(t.priceValue) + '</span></li>';
      }).join('');
      return '<h2>' + esc(t.price) + '</h2><p class="note">' + esc(t.priceNote) + '</p><ul class="price">' + rows + '</ul>';
    },
    reviews: function (n, lang, t) {
      var one = '<article class="card"><p>' + esc(t.reviewText) + '</p><div class="rev__who"><span class="rev__av"></span>' +
        '<span><span class="rev__n">' + esc(t.reviewName) + '</span><br><span class="rev__s">' + esc(t.reviewSrc) + '</span></span></div></article>';
      return '<h2>' + esc(t.reviews) + '</h2><div class="rev">' + one + one + one + '</div>';
    },
    faq: function (n, lang, t) {
      var items = n.faq[lang].map(function (f, i) {
        return '<details' + (i === 0 ? ' open' : '') + '><summary>' + esc(f[0]) + '</summary><p>' + esc(f[1]) + '</p></details>';
      }).join('');
      return '<h2>' + esc(t.faq) + '</h2><div class="faq">' + items + '</div>';
    },
    booking: function (n, lang, t) {
      var days = t.days.map(function (d, i) {
        return '<button class="chip" type="button" aria-pressed="' + (i === 1 ? 'true' : 'false') + '">' + esc(d) + '</button>';
      }).join('');
      var times = t.times.map(function (x, i) {
        return '<button class="chip" type="button" aria-pressed="' + (i === 2 ? 'true' : 'false') + '">' + esc(x) + '</button>';
      }).join('');
      return '<h2>' + esc(t.booking) + '</h2><p class="note">' + esc(t.bookingNote) + '</p>' +
        '<div class="chips">' + days + '</div><div class="chips">' + times + '</div>' +
        '<div class="row"><button class="btn" type="button">' + esc(t.bookingBtn) + '</button></div>';
    },
    map: function (n, lang, t) {
      var p = n.place[lang];
      return '<h2>' + esc(t.map) + '</h2><div class="map">' +
        '<div class="map__box"><span class="map__pin"></span><span class="map__note">' + esc(t.mapNote) + '</span></div>' +
        '<ul class="addr"><li><b>' + esc(p[0]) + '</b><span>' + esc(p[1]) + '</span></li>' +
        '<li><b>' + esc(t.contacts) + '</b><span>' + esc(t.phone) + ' <span class="rev__s">(' + esc(t.phoneNote) + ')</span></span></li>' +
        '<li><b>&nbsp;</b><span>' + esc(p[2]) + '</span></li></ul></div>';
    },
    form: function (n, lang, t) {
      return '<h2>' + esc(t.form) + '</h2><p class="note">' + esc(t.formNote) + '</p><form class="form" action="#">' +
        '<label class="field"><span>' + esc(t.fields[0]) + '</span><input type="text" name="name" autocomplete="name"></label>' +
        '<label class="field"><span>' + esc(t.fields[1]) + '</span><input type="text" name="contact"></label>' +
        '<label class="field"><span>' + esc(t.fields[2]) + '</span><textarea name="task"></textarea></label>' +
        '<div class="row"><button class="btn" type="submit">' + esc(t.formBtn) + '</button></div></form>';
    }
  };

  function sectionEl(doc, id, n, lang, t) {
    if (id === 'messengers') {
      var d = doc.createElement('div');
      d.className = 'msg';
      d.setAttribute('data-block', 'messengers');
      d.innerHTML = '<a class="msg__b" href="#">' + esc(t.write) + '</a>' +
        '<a class="msg__b msg__b--2" href="#">' + esc(t.call) + '</a>';
      return d;
    }
    var slot = doc.createElement('div');
    slot.className = 'slot';
    slot.setAttribute('data-block', id);
    slot.innerHTML = '<section><div class="wrap">' + sections[id](n, lang, t) + '</div></section>';
    return slot;
  }

  /* ── Полная отрисовка ────────────────────────────────────────── */
  function render(doc, state, lang, animate) {
    var n = byId(CFG.niches, state.niche);
    var t = CFG.pv[lang];
    doc.documentElement.setAttribute('lang', lang);
    doc.body.setAttribute('data-niche', n.id);
    var html = head(n, lang) + '<main>' + hero(n, lang, t) + services(n, lang, t) + '</main>' +
      '<footer><div class="wrap"><span>' + esc(n.brand[lang]) + '</span><span>' + esc(t.footer) + '</span></div></footer>';
    var old = doc.querySelector('.pv-root');
    var root = doc.createElement('div');
    root.className = 'pv-root';
    root.innerHTML = html;
    if (old) old.parentNode.replaceChild(root, old); else doc.body.appendChild(root);
    var main = root.querySelector('main');
    ORDER.forEach(function (id) {
      if (state.blocks.indexOf(id) < 0) return;
      var el = sectionEl(doc, id, n, lang, t);
      if (id === 'messengers') root.appendChild(el); else main.appendChild(el);
    });
    if (animate) {
      var all = root.querySelectorAll('.hero, main > section, main > .slot, .msg');
      Array.prototype.forEach.call(all, function (el, i) {
        el.style.setProperty('--d', Math.min(i * 0.07, 0.7) + 's');
        el.classList.add('pv-in');
      });
    }
  }

  /* ── Один блок включили или выключили ────────────────────────── */
  function toggle(doc, state, lang, id, on, instant) {
    var root = doc.querySelector('.pv-root');
    if (!root) return null;
    var existing = root.querySelector('[data-block="' + id + '"]');
    if (!on) {
      if (!existing) return null;
      if (instant) { existing.parentNode.removeChild(existing); return null; }
      existing.classList.add('is-shut');
      var gone = false;
      var drop = function () {
        if (gone || !existing.parentNode) return;
        gone = true;
        existing.parentNode.removeChild(existing);
      };
      existing.addEventListener('transitionend', drop);
      setTimeout(drop, 650); // если переход не случился (вкладка в фоне)
      return null;
    }
    if (existing) return null;
    var n = byId(CFG.niches, state.niche);
    var el = sectionEl(doc, id, n, lang, CFG.pv[lang]);
    if (!instant) el.classList.add('is-shut');
    if (id === 'messengers') {
      root.appendChild(el);
    } else {
      var main = root.querySelector('main');
      var idx = ORDER.indexOf(id);
      var next = null;
      Array.prototype.forEach.call(main.querySelectorAll('[data-block]'), function (sl) {
        if (next) return;
        if (ORDER.indexOf(sl.getAttribute('data-block')) > idx) next = sl;
      });
      main.insertBefore(el, next);
    }
    if (!instant) {
      // следующий кадр: высота едет от нуля к своей
      var win = doc.defaultView;
      win.requestAnimationFrame(function () {
        win.requestAnimationFrame(function () { el.classList.remove('is-shut'); });
      });
    }
    return el;
  }

  function byId(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return list[0];
  }

  return { shell: shell, setTheme: setTheme, render: render, toggle: toggle, byId: byId };
})();
