/* ═══════════════════════════════════════════════════════════════
   Конфигуратор: выбор, состояние и связь с рамкой предпросмотра.

   Состояние целиком лежит в адресе страницы (#n=…&t=…&b=…), поэтому
   собранный вариант можно отправить ссылкой — откроется ровно он.
   Ничего никуда не отправляется: страница собирается в браузере.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var CFG = window.CFG;
  var PV = window.CFGPreview;
  var lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';
  var T = CFG.ui[lang];
  var byId = PV.byId;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Рамка рисует настоящую ширину устройства, а в столбец вписывается уменьшением.
  // 1024 вместо 1280: в узком столбце текст 1280-й страницы читался бы слишком мелко.
  var FRAME = { desktop: { w: 1024, h: 760 }, mobile: { w: 390, h: 640 } };
  var NARROW = 1040;

  /* ── Состояние ───────────────────────────────────────────────── */
  var state = {
    niche: CFG.niches[0].id,
    theme: CFG.themes[0].id,
    blocks: CFG.blocks.filter(function (b) { return b.on; }).map(function (b) { return b.id; }),
    device: 'desktop'
  };

  function readHash() {
    var h = location.hash.replace(/^#/, '');
    if (!h) return;
    var q = {};
    h.split('&').forEach(function (part) {
      var kv = part.split('=');
      if (kv.length === 2) q[kv[0]] = decodeURIComponent(kv[1]);
    });
    if (q.n && byId(CFG.niches, q.n).id === q.n) state.niche = q.n;
    if (q.t && byId(CFG.themes, q.t).id === q.t) state.theme = q.t;
    if (typeof q.b === 'string') {
      var ids = CFG.blocks.map(function (b) { return b.id; });
      state.blocks = q.b ? q.b.split(',').filter(function (x) { return ids.indexOf(x) >= 0; }) : [];
    }
  }

  // блоки держим в порядке страницы: так ссылка и ТЗ читаются ровно
  function ordered() {
    var ids = CFG.blocks.map(function (x) { return x.id; });
    return ids.filter(function (id) { return state.blocks.indexOf(id) >= 0; });
  }

  function writeHash() {
    var h = '#n=' + state.niche + '&t=' + state.theme + '&b=' + ordered().join(',');
    if (location.hash !== h) history.replaceState(null, '', h);
  }

  function buildUrl() {
    return location.href.split('#')[0] + '#n=' + state.niche + '&t=' + state.theme + '&b=' + ordered().join(',');
  }

  /* ── Разметка выбора ─────────────────────────────────────────── */
  var icons = {
    cake: 'M4 20h16M5 20v-6h14v6M7 14V9h10v5M12 9V5m0 0-1.6 1.6M12 5l1.6 1.6',
    bolt: 'M13 3 5 14h5l-1 7 8-11h-5l1-7Z',
    spark: 'M12 3v6m0 6v6M3 12h6m6 0h6M6.5 6.5l3 3m5 5 3 3m0-11-3 3m-5 5-3 3',
    hand: 'M7 11V5.5a1.5 1.5 0 0 1 3 0V11m0 0V4.5a1.5 1.5 0 0 1 3 0V11m0 0V6.5a1.5 1.5 0 0 1 3 0V13c0 4-2.5 7-6 7s-6-2.5-6-6v-3a1.5 1.5 0 0 1 3 0',
    tool: 'M14 6a4 4 0 1 0 4 4l3 3-4 4-3-3a4 4 0 0 1-4-4M9 9 4 4m0 0v4m0-4h4',
    book: 'M4 5h7v15H6a2 2 0 0 1-2-2V5Zm16 0h-7v15h5a2 2 0 0 0 2-2V5ZM11 5v15'
  };

  function icon(name) {
    return '<svg class="opt__ico" viewBox="0 0 24 24" aria-hidden="true"><path d="' + icons[name] + '"/></svg>';
  }

  function panel() {
    var html = '';

    // 1. Ниша
    html += step(1, T.steps[0], T.stepNote[0],
      '<div class="opts opts--niche">' + CFG.niches.map(function (n) {
        return '<label class="opt"><input type="radio" name="niche" value="' + n.id + '"' +
          (n.id === state.niche ? ' checked' : '') + '>' +
          '<span class="opt__body">' + icon(n.icon) +
          '<span class="opt__t">' + n.label[lang] + '</span>' +
          '<span class="opt__h">' + n.hint[lang] + '</span></span></label>';
      }).join('') + '</div>');

    // 2. Оформление
    html += step(2, T.steps[1], T.stepNote[1],
      '<div class="opts opts--theme">' + CFG.themes.map(function (t) {
        return '<label class="opt"><input type="radio" name="theme" value="' + t.id + '"' +
          (t.id === state.theme ? ' checked' : '') + '>' +
          '<span class="opt__body"><span class="swatch" aria-hidden="true">' +
          t.swatch.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') + '</span>' +
          '<span class="opt__t">' + t.label[lang] + '</span>' +
          '<span class="opt__h">' + t.hint[lang] + '</span></span></label>';
      }).join('') + '</div>');

    // 3. Блоки
    html += step(3, T.steps[2], T.stepNote[2],
      '<div class="opts opts--block">' + CFG.blocks.map(function (b) {
        return '<label class="opt opt--check"><input type="checkbox" name="block" value="' + b.id + '"' +
          (state.blocks.indexOf(b.id) >= 0 ? ' checked' : '') + '>' +
          '<span class="opt__body"><span class="tick" aria-hidden="true"></span>' +
          '<span class="opt__t">' + b.label[lang] + '</span>' +
          '<span class="opt__h">' + b.hint[lang] + '</span></span></label>';
      }).join('') + '</div>');

    // 4. Итог
    html += step(4, T.steps[3], T.stepNote[3],
      '<div class="sum">' +
      '<dl class="brief" id="brief"></dl>' +
      '<div class="pricebox">' +
      '<h4>' + T.priceTitle + '</h4>' +
      '<p class="pricebox__main">' + T.priceMain + '</p>' +
      '<p class="pricebox__note">' + T.priceMainNote + '</p>' +
      '<ul class="pricebox__rows">' + T.priceRows.map(function (r) {
        return '<li><span>' + r[0] + '</span><span class="dots"></span><b>' + r[1] + '</b></li>';
      }).join('') + '</ul>' +
      '<p class="pricebox__note">' + T.priceNote + '</p></div>' +
      '<h4>' + T.sendTitle + '</h4>' +
      '<div class="acts">' +
      '<button class="btn btn--primary" type="button" data-act="tg">' + T.tg + '</button>' +
      '<button class="btn" type="button" data-act="mail">' + T.mail + '</button>' +
      '<button class="btn" type="button" data-act="link">' + T.copyLink + '</button>' +
      '</div>' +
      '<p class="acts__note">' + T.tgNote + ' · ' + T.copyLinkNote + '</p>' +
      '<p class="acts__note"><a href="https://vk.com/' + CFG.contacts.vk + '" target="_blank" rel="noopener">' + T.vk + '</a> · ' +
      '<a href="mailto:' + CFG.contacts.mail + '">' + CFG.contacts.mail + '</a></p>' +
      '</div>');

    return html;
  }

  function step(num, title, note, body) {
    return '<li class="step reveal"><div class="step__head"><span class="step__n">0' + num + '</span>' +
      '<div><h3 class="step__t">' + title + '</h3><p class="step__note">' + note + '</p></div></div>' + body + '</li>';
  }

  /* ── Сборка интерфейса ───────────────────────────────────────── */
  var frame, stage, doc = null, brief;
  var deviceChosen = false; // пока человек сам не выбрал, рамка следует за шириной экрана

  function init() {
    readHash();
    writeHash();
    if (window.innerWidth < 700) state.device = 'mobile';

    document.querySelector('[data-steps]').innerHTML = panel();
    brief = document.getElementById('brief');

    Array.prototype.forEach.call(document.querySelectorAll('[data-device]'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-device') === state.device));
    });

    stage = document.querySelector('[data-stage]');
    frame = document.createElement('iframe');
    frame.className = 'pv__frame';
    frame.title = T.previewTitle;
    frame.setAttribute('scrolling', 'yes');
    frame.srcdoc = PV.shell();
    stage.appendChild(frame);
    frame.addEventListener('load', function () {
      doc = frame.contentDocument;
      PV.setTheme(doc, byId(CFG.themes, state.theme));
      PV.render(doc, state, lang, !reduced.matches);
    });

    size();
    if ('ResizeObserver' in window) new ResizeObserver(size).observe(stage.parentNode);
    window.addEventListener('resize', size);

    document.addEventListener('change', onChange);
    document.addEventListener('click', onClick);
    window.addEventListener('hashchange', function () {
      readHash();
      sync();
    });
    // переключатель языка уносит сборку с собой: она лежит в адресе
    Array.prototype.forEach.call(document.querySelectorAll('[data-lang-switch]'), function (link) {
      var base = link.getAttribute('href').split('#')[0];
      link.addEventListener('click', function () { link.setAttribute('href', base + location.hash); });
    });

    updateBrief();
    reveal();
  }

  /* масштаб: рамка всегда рисует настоящую ширину (1280 или 390),
     а в панель вписывается уменьшением */
  function autoDevice() {
    if (deviceChosen) return;
    var want = window.innerWidth < 700 ? 'mobile' : 'desktop';
    if (want === state.device) return;
    state.device = want;
    Array.prototype.forEach.call(document.querySelectorAll('[data-device]'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-device') === want));
    });
  }

  function size() {
    autoDevice();
    var f = FRAME[state.device];
    var narrow = window.innerWidth <= NARROW;
    var box = stage.parentNode.getBoundingClientRect().width - 20; // минус отступы рамки
    var maxH = window.innerHeight * (narrow ? 0.92 : 0.78);
    var scale = Math.min(1, box / f.w, maxH / f.h);
    frame.style.width = f.w + 'px';
    frame.style.height = f.h + 'px';
    frame.style.transform = 'scale(' + scale + ')';
    stage.style.width = Math.round(f.w * scale) + 'px';
    stage.style.height = Math.round(f.h * scale) + 'px';
  }

  // На телефоне предпросмотр стоит над шагами: если он уехал с экрана,
  // подводим страницу к нему, чтобы изменение было видно.
  function showStage() {
    if (window.innerWidth > NARROW || reduced.matches) return;
    var r = stage.getBoundingClientRect();
    if (r.bottom > 140 && r.top < window.innerHeight - 160) return;
    window.scrollTo({ top: Math.max(0, window.scrollY + r.top - 76), behavior: 'smooth' });
  }

  function onChange(e) {
    var el = e.target;
    if (el.name === 'niche') {
      state.niche = el.value;
      if (doc) {
        PV.render(doc, state, lang, !reduced.matches);
        if (doc.defaultView) doc.defaultView.scrollTo(0, 0);
      }
    } else if (el.name === 'theme') {
      state.theme = el.value;
      if (doc) PV.setTheme(doc, byId(CFG.themes, state.theme));
    } else if (el.name === 'block') {
      var id = el.value;
      var on = el.checked;
      var i = state.blocks.indexOf(id);
      if (on && i < 0) state.blocks.push(id);
      if (!on && i >= 0) state.blocks.splice(i, 1);
      if (doc) {
        var added = PV.toggle(doc, state, lang, id, on);
        if (added && !reduced.matches && id !== 'messengers') {
          added.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    } else return;
    writeHash();
    updateBrief();
    showStage();
  }

  function onClick(e) {
    var dev = e.target.closest('[data-device]');
    if (dev) {
      state.device = dev.getAttribute('data-device');
      deviceChosen = true;
      Array.prototype.forEach.call(document.querySelectorAll('[data-device]'), function (b) {
        b.setAttribute('aria-pressed', String(b === dev));
      });
      size();
      return;
    }
    var act = e.target.closest('[data-act]');
    if (!act) return;
    var kind = act.getAttribute('data-act');
    if (kind === 'full') {
      var blob = new Blob([PV.standalone(state, lang)], { type: 'text/html' });
      window.open(URL.createObjectURL(blob), '_blank', 'noopener');
    } else if (kind === 'reset') {
      state.niche = CFG.niches[0].id;
      state.theme = CFG.themes[0].id;
      state.blocks = CFG.blocks.filter(function (b) { return b.on; }).map(function (b) { return b.id; });
      sync();
      writeHash();
    } else if (kind === 'tg') {
      copy(briefText());
      flash(act);
      window.open('https://t.me/' + CFG.contacts.tg, '_blank', 'noopener');
    } else if (kind === 'mail') {
      location.href = 'mailto:' + CFG.contacts.mail + '?subject=' + encodeURIComponent(T.mailSubject) +
        '&body=' + encodeURIComponent(briefText());
    } else if (kind === 'link') {
      copy(buildUrl());
      flash(act);
    }
  }

  /* ── Итоговое ТЗ ─────────────────────────────────────────────── */
  function names() {
    var n = byId(CFG.niches, state.niche);
    var t = byId(CFG.themes, state.theme);
    var bs = CFG.blocks.filter(function (b) { return state.blocks.indexOf(b.id) >= 0; })
      .map(function (b) { return b.label[lang]; });
    return { niche: n.label[lang], theme: t.label[lang], blocks: bs };
  }

  function updateBrief() {
    var v = names();
    brief.innerHTML =
      '<div><dt>' + T.briefNiche + '</dt><dd>' + v.niche + '</dd></div>' +
      '<div><dt>' + T.briefTheme + '</dt><dd>' + v.theme + '</dd></div>' +
      '<div><dt>' + T.briefBlocks + '</dt><dd>' + (v.blocks.length ? v.blocks.join(', ') : '—') + '</dd></div>';
  }

  function briefText() {
    var v = names();
    return T.briefHead + '\n' +
      T.briefLine[0] + ': ' + v.niche + '\n' +
      T.briefLine[1] + ': ' + v.theme + '\n' +
      T.briefLine[2] + ': ' + (v.blocks.length ? v.blocks.join(', ') : '—') + '\n' +
      T.briefLine[3] + ': ' + buildUrl();
  }

  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(fallback);
    } else fallback();
    function fallback() {
      var a = document.createElement('textarea');
      a.value = text;
      a.setAttribute('readonly', '');
      a.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(a);
      a.select();
      try { document.execCommand('copy'); } catch (err) { /* ничего не делаем */ }
      document.body.removeChild(a);
    }
  }

  function flash(btn) {
    var old = btn.getAttribute('data-label') || btn.textContent;
    btn.setAttribute('data-label', old);
    btn.textContent = T.copied;
    btn.classList.add('is-done');
    setTimeout(function () {
      btn.textContent = old;
      btn.classList.remove('is-done');
    }, 1600);
  }

  /* ── Привести интерфейс к состоянию (после reset и hashchange) ── */
  function sync() {
    Array.prototype.forEach.call(document.querySelectorAll('input[name="niche"]'), function (i) { i.checked = i.value === state.niche; });
    Array.prototype.forEach.call(document.querySelectorAll('input[name="theme"]'), function (i) { i.checked = i.value === state.theme; });
    Array.prototype.forEach.call(document.querySelectorAll('input[name="block"]'), function (i) { i.checked = state.blocks.indexOf(i.value) >= 0; });
    if (doc) {
      PV.setTheme(doc, byId(CFG.themes, state.theme));
      PV.render(doc, state, lang, !reduced.matches);
    }
    updateBrief();
  }

  /* ── Появление блоков конфигуратора при прокрутке ─────────────── */
  function reveal() {
    var items = document.querySelectorAll('.reveal');
    if (reduced.matches || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
