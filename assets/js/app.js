/* ═══════════════════════════════════════════════════════════════
   Конфигуратор: выбор, состояние и связь с рамкой предпросмотра.

   Состояние целиком лежит в адресе страницы (#n=...&t=...&b=...),
   поэтому собранный вариант можно отправить ссылкой - откроется
   ровно он. Ничего никуда не уходит: страница собирается в браузере.

   Рамка показывает сайт в натуральную величину: на широком экране
   ширина рамки равна свободному месту на столе, уменьшение включается
   только если места меньше 900 px. Телефон - всегда ровно 390 px.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var CFG = window.CFG;
  var PV = window.CFGPreview;
  var lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';
  var T = CFG.ui[lang];
  var byId = PV.byId;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var NARROW = 1040;

  var state = {
    niche: CFG.niches[0].id,
    theme: CFG.themes[0].id,
    blocks: CFG.blocks.filter(function (b) { return b.on; }).map(function (b) { return b.id; }),
    device: 'desktop'
  };
  var deviceChosen = false; // пока человек сам не выбрал, рамка следует за шириной экрана
  var frame, screen, deskArea, brief, tally, stageTitle, doc = null;

  /* ── Адрес страницы хранит сборку ────────────────────────────── */
  function ordered() {
    return CFG.blocks.map(function (b) { return b.id; })
      .filter(function (id) { return state.blocks.indexOf(id) >= 0; });
  }

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

  function hashPart() { return '#n=' + state.niche + '&t=' + state.theme + '&b=' + ordered().join(','); }
  function writeHash() { if (location.hash !== hashPart()) history.replaceState(null, '', hashPart()); }
  function buildUrl() { return location.href.split('#')[0] + hashPart(); }

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

  function step(num, title, note, body) {
    return '<li class="step"><div class="step__head"><span class="step__n">' + num + '</span>' +
      '<h2 class="step__t">' + title + '</h2></div>' +
      '<p class="step__note">' + note + '</p>' + body + '</li>';
  }

  function panel() {
    var html = '';

    html += step(1, T.steps[0], T.stepNote[0],
      '<div class="opts opts--niche">' + CFG.niches.map(function (n) {
        return '<label class="opt"><input type="radio" name="niche" value="' + n.id + '"' +
          (n.id === state.niche ? ' checked' : '') + '>' +
          '<span class="opt__body">' + icon(n.icon) +
          '<span class="opt__t">' + n.label[lang] + '</span>' +
          '<span class="opt__h">' + n.hint[lang] + '</span></span></label>';
      }).join('') + '</div>');

    html += step(2, T.steps[1], T.stepNote[1],
      '<div class="opts opts--theme">' + CFG.themes.map(function (t) {
        var k = t.tokens;
        var style = '--t-bg:' + k.bg + ';--t-ink:' + k.ink + ';--t-accent:' + k.accent + ';';
        return '<label class="opt"><input type="radio" name="theme" value="' + t.id + '"' +
          (t.id === state.theme ? ' checked' : '') + '>' +
          '<span class="opt__body">' +
          '<span class="thumb" style="' + style + '" aria-hidden="true">' +
          '<i class="thumb__h"></i><i class="thumb__p"></i><i class="thumb__p2"></i><i class="thumb__btn"></i></span>' +
          '<span class="opt__t">' + t.label[lang] + '</span>' +
          '<span class="opt__h">' + t.hint[lang] + '</span></span></label>';
      }).join('') + '</div>');

    html += step(3, T.steps[2], T.stepNote[2],
      '<div class="opts">' + CFG.blocks.map(function (b) {
        return '<label class="opt opt--switch"><input type="checkbox" name="block" value="' + b.id + '"' +
          (state.blocks.indexOf(b.id) >= 0 ? ' checked' : '') + '>' +
          '<span class="opt__body">' +
          '<span class="opt__t">' + b.label[lang] + '</span>' +
          '<span class="opt__h">' + b.hint[lang] + '</span>' +
          '<span class="switch"></span></span></label>';
      }).join('') + '</div>');

    html += step(4, T.steps[3], T.stepNote[3],
      '<div class="sum">' +
      '<dl class="brief" id="brief"></dl>' +
      '<div class="quote">' +
      '<p class="quote__main">' + T.priceMain + '</p>' +
      '<p class="quote__note">' + T.priceMainNote + '</p>' +
      '<ul class="quote__rows">' + T.priceRows.map(function (r) {
        return '<li><span>' + r[0] + '</span><span class="dots"></span><b>' + r[1] + '</b></li>';
      }).join('') + '</ul>' +
      '<p class="quote__note">' + T.priceNote + '</p></div>' +
      '<div class="acts">' +
      '<button class="btn btn--primary" type="button" data-act="tg">' + T.tg + '</button>' +
      '<div class="acts acts--row">' +
      '<button class="btn" type="button" data-act="mail">' + T.mail + '</button>' +
      '<button class="btn" type="button" data-act="link">' + T.copyLink + '</button>' +
      '</div></div>' +
      '<p class="acts__note">' + T.tgNote + ' ' + T.copyLinkNote + '</p>' +
      '<p class="acts__note"><a href="https://vk.com/' + CFG.contacts.vk + '" target="_blank" rel="noopener">' + T.vk + '</a>, ' +
      '<a href="mailto:' + CFG.contacts.mail + '">' + CFG.contacts.mail + '</a></p>' +
      '</div>');

    return html;
  }

  /* ── Сборка интерфейса ───────────────────────────────────────── */
  function init() {
    readHash();
    writeHash();
    if (window.innerWidth < 700) state.device = 'mobile';

    document.querySelector('[data-steps]').innerHTML = panel();
    brief = document.getElementById('brief');
    tally = document.querySelector('[data-tally]');
    stageTitle = document.querySelector('[data-stage-title]');
    screen = document.querySelector('[data-stage]');
    deskArea = screen.parentNode;
    markDevice();

    frame = document.createElement('iframe');
    frame.title = T.previewTitle;
    frame.srcdoc = PV.shell();
    screen.appendChild(frame);
    frame.addEventListener('load', function () {
      doc = frame.contentDocument;
      PV.setTheme(doc, byId(CFG.themes, state.theme));
      PV.render(doc, state, lang, !reduced.matches);
    });

    size();
    if ('ResizeObserver' in window) new ResizeObserver(size).observe(deskArea);
    window.addEventListener('resize', size);

    document.addEventListener('change', onChange);
    document.addEventListener('click', onClick);
    window.addEventListener('hashchange', function () { readHash(); sync(); });

    // переключатель языка уносит сборку с собой: она лежит в адресе
    Array.prototype.forEach.call(document.querySelectorAll('[data-lang-switch]'), function (link) {
      var base = link.getAttribute('href').split('#')[0];
      link.addEventListener('click', function () { link.setAttribute('href', base + hashPart()); });
    });

    updateSummary();
  }

  /* рамка: ширина равна свободному месту (уменьшаем, только если тесно) */
  function autoDevice() {
    if (deviceChosen) return;
    var want = window.innerWidth < 700 ? 'mobile' : 'desktop';
    if (want === state.device) return;
    state.device = want;
    markDevice();
  }

  function markDevice() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-device]'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-device') === state.device));
    });
    screen.classList.toggle('screen--phone', state.device === 'mobile');
  }

  function size() {
    autoDevice();
    var cs = window.getComputedStyle(deskArea);
    var availW = deskArea.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var availH = deskArea.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    if (availW < 200 || availH < 200) return;
    var w = state.device === 'mobile' ? 390 : Math.max(900, Math.floor(availW)); // 900 - ниже этого собранная страница сама переходит в узкую раскладку
    var h = Math.max(state.device === 'mobile' ? 420 : 620, Math.floor(availH));
    var scale = Math.min(1, availW / w, availH / h);
    frame.style.width = w + 'px';
    frame.style.height = h + 'px';
    frame.style.transform = scale === 1 ? 'none' : 'scale(' + scale + ')';
    screen.style.width = Math.round(w * scale) + 'px';
    screen.style.height = Math.round(h * scale) + 'px';
  }

  /* на узком экране стол стоит над выбором: подводим страницу к нему */
  function showStage() {
    if (window.innerWidth > NARROW) return;
    var r = screen.getBoundingClientRect();
    if (r.bottom > 160 && r.top < window.innerHeight - 180) return;
    // при уменьшенном движении переносимся сразу, а не плавно
    window.scrollTo({ top: Math.max(0, window.scrollY + r.top - 70), behavior: reduced.matches ? 'auto' : 'smooth' });
  }

  /* ── Действия ────────────────────────────────────────────────── */
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
        var added = PV.toggle(doc, state, lang, id, on, reduced.matches);
        if (added && id !== 'messengers') {
          added.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'center' });
        }
      }
    } else return;
    writeHash();
    updateSummary();
    showStage();
  }

  function onClick(e) {
    var dev = e.target.closest('[data-device]');
    if (dev) {
      state.device = dev.getAttribute('data-device');
      deviceChosen = true;
      markDevice();
      size();
      return;
    }
    var act = e.target.closest('[data-act]');
    if (!act) return;
    var kind = act.getAttribute('data-act');
    if (kind === 'reset') {
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

  /* ── Итог: ТЗ, счётчик и подпись над столом ──────────────────── */
  function names() {
    return {
      niche: byId(CFG.niches, state.niche).label[lang],
      theme: byId(CFG.themes, state.theme).label[lang],
      blocks: CFG.blocks.filter(function (b) { return state.blocks.indexOf(b.id) >= 0; })
        .map(function (b) { return b.label[lang]; })
    };
  }

  function blocksWord(n) {
    var w = T.blocksN;
    if (lang !== 'ru') return n + ' ' + (n === 1 ? w[0] : w[1]);
    var t = n % 100;
    if (t > 10 && t < 20) return n + ' ' + w[2];
    var o = n % 10;
    if (o === 1) return n + ' ' + w[0];
    if (o > 1 && o < 5) return n + ' ' + w[1];
    return n + ' ' + w[2];
  }

  function updateSummary() {
    var v = names();
    brief.innerHTML =
      '<div><dt>' + T.briefNiche + '</dt><dd>' + v.niche + '</dd></div>' +
      '<div><dt>' + T.briefTheme + '</dt><dd>' + v.theme + '</dd></div>' +
      '<div><dt>' + T.briefBlocks + '</dt><dd>' + (v.blocks.length ? v.blocks.join(', ') : T.none) + '</dd></div>';
    tally.innerHTML = '<b>' + blocksWord(v.blocks.length) + ' ' + T.inBuild + '</b>' + T.tallyPrice;
    stageTitle.innerHTML = '<b>' + v.niche + '</b>, ' + v.theme.toLowerCase();
  }

  function briefText() {
    var v = names();
    return T.briefHead + '\n' +
      T.briefLine[0] + ': ' + v.niche + '\n' +
      T.briefLine[1] + ': ' + v.theme + '\n' +
      T.briefLine[2] + ': ' + (v.blocks.length ? v.blocks.join(', ') : T.none) + '\n' +
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
      try { document.execCommand('copy'); } catch (err) { /* без буфера остаётся ссылка в адресе */ }
      document.body.removeChild(a);
    }
  }

  function flash(btn) {
    if (btn.dataset.busy) return;
    btn.dataset.busy = '1';
    var old = btn.textContent;
    btn.textContent = T.copied;
    btn.classList.add('is-done');
    setTimeout(function () {
      btn.textContent = old;
      btn.classList.remove('is-done');
      delete btn.dataset.busy;
    }, 1500);
  }

  /* ── Привести интерфейс к состоянию (сброс, переход по ссылке) ── */
  function sync() {
    Array.prototype.forEach.call(document.querySelectorAll('input[name="niche"]'), function (i) { i.checked = i.value === state.niche; });
    Array.prototype.forEach.call(document.querySelectorAll('input[name="theme"]'), function (i) { i.checked = i.value === state.theme; });
    Array.prototype.forEach.call(document.querySelectorAll('input[name="block"]'), function (i) { i.checked = state.blocks.indexOf(i.value) >= 0; });
    if (doc) {
      PV.setTheme(doc, byId(CFG.themes, state.theme));
      PV.render(doc, state, lang, !reduced.matches);
    }
    updateSummary();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
