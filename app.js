(function () {
  'use strict';
  var H = window.Hssabi, I = window.I18N;

  var DEFAULTS = {
    lang: null, tab: 'salary',
    salary: { mode: 'gn', amount: '', deps: 0, cimr: '' },
    loan: { mode: 'pay', amount: '', rate: '5', years: '20', ins: '', fees: '', income: '', debts: '', ratio: String(H.CONFIG.debtRatio * 100) },
    car: { cv: '', fuel: 'essence', pickup: false },
    vat: { mode: 'ht', amount: '', rate: '20', custom: '' }
  };
  var S = load();

  function load() {
    var s = JSON.parse(JSON.stringify(DEFAULTS));
    try {
      var raw = localStorage.getItem('hssabi.state');
      if (raw) {
        var p = JSON.parse(raw);
        Object.keys(s).forEach(function (k) {
          if (p[k] !== undefined) s[k] = (typeof s[k] === 'object' && s[k] !== null) ? Object.assign(s[k], p[k]) : p[k];
        });
      }
    } catch (e) { /* stockage indisponible : on continue sans */ }
    if (!s.lang) {
      var nav = (navigator.language || 'fr').toLowerCase();
      s.lang = nav.indexOf('ar') === 0 ? 'ar' : 'fr';
    }
    return s;
  }
  function save() { try { localStorage.setItem('hssabi.state', JSON.stringify(S)); } catch (e) {} }

  var T = function () { return I[S.lang]; };
  var $ = function (id) { return document.getElementById(id); };

  // ---------- Utilitaires ----------
  function parse(v) {
    var n = parseFloat(String(v == null ? '' : v).replace(/\s/g, '').replace(',', '.'));
    return isFinite(n) ? n : 0;
  }
  var nf = {};
  function fmt(n, d) {
    d = d == null ? 2 : d;
    if (!nf[d]) nf[d] = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });
    return nf[d].format(n).replace(/[  ]/g, ' ');
  }
  function money(n, d) { return '<span class="n">' + fmt(n, d) + '</span> ' + T().cur; }
  function bigMoney(n, noDecimals) {
    if (noDecimals) return '<span class="n">' + fmt(n, 0) + '</span><span class="cur">' + T().cur + '</span>';
    var parts = fmt(n, 2).split(',');
    return '<span class="n">' + parts[0] + '<span class="dec">,' + parts[1] + '</span></span><span class="cur">' + T().cur + '</span>';
  }
  function pct(x, d) { return '<span class="n">' + fmt(x * 100, d == null ? 1 : d) + ' %</span>'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // ---------- Composants ----------
  function seg(key, options) {
    return '<div class="seg" role="group">' + options.map(function (o) {
      return '<button type="button" data-seg="' + key + '" data-v="' + o[0] + '" aria-pressed="' + (get(key) === o[0]) + '">' + esc(o[1]) + '</button>';
    }).join('') + '</div>';
  }
  function field(key, label, opts) {
    opts = opts || {};
    return '<div class="field"><label for="f-' + key + '"><span>' + esc(label) + '</span>' +
      (opts.optional ? '<span class="opt">' + esc(T().optional) + '</span>' : '') + '</label>' +
      '<div class="input"><input id="f-' + key + '" data-k="' + key + '" type="text" inputmode="decimal" autocomplete="off" value="' + esc(get(key)) + '">' +
      (opts.unit ? '<span class="unit">' + esc(opts.unit) + '</span>' : '') + '</div>' +
      (opts.hint ? '<div class="hint">' + esc(opts.hint) + '</div>' : '') + '</div>';
  }
  function row(label, value, strong) {
    return '<div class="row' + (strong ? ' strong' : '') + '"><span>' + label + '</span><span>' + value + '</span></div>';
  }
  function get(path) { var p = path.split('.'); return S[p[0]][p[1]]; }
  function set(path, v) { var p = path.split('.'); S[p[0]][p[1]] = v; save(); }

  // ---------- Onglets ----------
  var ICONS = {
    salary: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6.5 9.5v.01M17.5 14.5v.01"/>',
    loan: '<path d="M3 10l9-6 9 6"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8"/><path d="M3 20h18"/>',
    car: '<path d="M5 16l1.5-5.5A2 2 0 0 1 8.4 9h7.2a2 2 0 0 1 1.9 1.5L19 16"/><rect x="3" y="16" width="18" height="3.5" rx="1"/>',
    vat: '<path d="M19 5L5 19"/><circle cx="7" cy="7" r="2.2"/><circle cx="17" cy="17" r="2.2"/>'
  };
  var TABS = ['salary', 'loan', 'car', 'vat'];

  function renderChrome() {
    var t = T();
    document.documentElement.lang = t.lang;
    document.documentElement.dir = t.dir;
    document.title = t.appName + ' — ' + t.tagline;
    $('appName').textContent = t.appName;
    $('tagline').textContent = t.tagline;
    $('langBtn').textContent = t.switchTo;
    $('langBtn').setAttribute('lang', S.lang === 'ar' ? 'fr' : 'ar');
    $('footTxt').textContent = t.footer.replace('{d}', H.CONFIG.lastVerified);
    $('privLink').textContent = t.privacy;
    var ib = $('installBtn'); ib.textContent = t.install;
    $('tabs').innerHTML = TABS.map(function (k) {
      var label = t['tab' + k.charAt(0).toUpperCase() + k.slice(1)];
      return '<button type="button" role="tab" data-tab="' + k + '" aria-selected="' + (S.tab === k) + '">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[k] + '</svg><span>' + esc(label) + '</span></button>';
    }).join('');
  }

  // ---------- Écrans ----------
  var VIEWS = {
    salary: {
      form: function (t) {
        var gn = S.salary.mode === 'gn';
        var d = S.salary.deps;
        return {
          top: '<h1>' + esc(t.salaryTitle) + '</h1>' +
            seg('salary.mode', [['gn', t.modeGrossNet], ['ng', t.modeNetGross]]) +
            '<div class="form">' + field('salary.amount', gn ? t.grossLabel : t.netLabel, { unit: t.cur }) + '</div>',
          more: '<div class="form">' +
            '<div class="field"><div class="lab"><span>' + esc(t.dependentsLabel) + '</span></div>' +
            '<div class="stepper"><button type="button" data-step="-1" aria-label="-">−</button><output id="deps">' + d + '</output>' +
            '<button type="button" data-step="1" aria-label="+">+</button></div>' +
            '<div class="hint">' + esc(t.dependentsHint) + '</div></div>' +
            field('salary.cimr', t.cimrLabel, { unit: t.cur, optional: true }) + '</div>'
        };
      },
      out: function (t) {
        var amt = parse(S.salary.amount);
        if (amt <= 0) return { hero: '<div class="empty">' + esc(t.empty) + '</div>', rest: '' };
        var o = { dependents: S.salary.deps, cimr: parse(S.salary.cimr) };
        var gn = S.salary.mode === 'gn';
        var r = gn ? H.netFromGross(Object.assign({ gross: amt }, o)) : H.grossFromNet(Object.assign({ net: amt }, o));
        var parts = [
          [r.net, 'var(--blue)', t.legendNet], [r.cnss, 'var(--saffron)', t.legendCnss],
          [r.amo, 'var(--teal)', t.legendAmo], [r.cimr, 'var(--violet)', t.legendCimr], [r.ir, 'var(--rose)', t.legendIr]
        ].filter(function (p) { return p[0] > 0; });
        var bar = parts.map(function (p) { return '<i style="width:' + (p[0] / r.gross * 100).toFixed(2) + '%;background:' + p[1] + '"></i>'; }).join('');
        var legend = parts.map(function (p) { return '<span><b style="background:' + p[1] + '"></b>' + esc(p[2]) + '</span>'; }).join('');
        var heroLabel = gn ? t.netResult : t.grossResult;
        var heroVal = gn ? r.net : r.gross;
        var sub = gn ? t.netYear + ' : ' + money(r.netAnnual, 0) : t.netResult + ' : ' + money(r.net);
        var hero = '<div class="hero"><div class="cap">' + esc(heroLabel) + '</div><div class="big">' + bigMoney(heroVal) + '</div>' +
          '<div class="sub">' + sub + '</div><div class="bar" role="img" aria-label="' + esc(t.salaryTitle) + '">' + bar + '</div><div class="legend">' + legend + '</div></div>';
        return { hero: hero, rest: '<div class="rows">' +
          row(esc(t.rowCnss), '− ' + money(r.cnss)) + row(esc(t.rowAmo), '− ' + money(r.amo)) +
          (r.cimr > 0 ? row(esc(t.rowCimr), '− ' + money(r.cimr)) : '') +
          row(esc(t.rowIr), '− ' + money(r.ir)) + '</div>' +
          '<details><summary>' + esc(t.detailsTitle) + '</summary><div class="rows">' +
          row(esc(t.dSbi), money(r.sbi)) + row(esc(t.dFp), '− ' + money(r.fraisPro)) + row(esc(t.dSni), money(r.sni)) +
          row(esc(t.dIrGross), money(r.irGross)) + row(esc(t.dFam), '− ' + money(r.familyReduction)) +
          row(esc(t.dMarginal), pct(r.marginalRate, 0)) + row(esc(t.dEffective), pct(r.effectiveRate)) +
          '</div></details><p class="note">' + esc(t.salaryNote) + '</p>' };
      }
    },

    loan: {
      form: function (t) {
        var pay = S.loan.mode === 'pay';
        var top = '<h1>' + esc(t.loanTitle) + '</h1>' + seg('loan.mode', [['pay', t.modePayment], ['cap', t.modeCapacity]]) + '<div class="form">' +
          (pay ? field('loan.amount', t.amountLabel, { unit: t.cur }) : field('loan.income', t.incomeLabel, { unit: t.cur })) +
          field('loan.rate', t.rateLabel, { unit: '%' }) + field('loan.years', t.yearsLabel, { unit: '' }) + '</div>';
        var more = '<div class="form">' + (pay
          ? field('loan.ins', t.insLabel, { unit: '%', optional: true }) + field('loan.fees', t.feesLabel, { unit: '%', optional: true })
          : field('loan.debts', t.debtsLabel, { unit: t.cur, optional: true }) + field('loan.ratio', t.ratioLabel, { unit: '%' })) + '</div>';
        return { top: top, more: more };
      },
      out: function (t) {
        var L = S.loan, rate = parse(L.rate), years = parse(L.years);
        if (S.loan.mode === 'cap') {
          var income = parse(L.income);
          if (income <= 0 || years <= 0) return { hero: '<div class="empty">' + esc(t.empty) + '</div>', rest: '' };
          var monthly = Math.max(0, income * parse(L.ratio) / 100 - parse(L.debts));
          var cap = H.maxLoan(monthly, rate, years);
          return { hero: '<div class="hero"><div class="cap">' + esc(t.capacityResult) + '</div><div class="big">' + bigMoney(cap) + '</div>' +
            '<div class="sub">' + esc(t.maxMonthly) + ' : ' + money(monthly) + '</div></div>', rest: '<p class="note">' + esc(t.loanNote) + '</p>' };
        }
        var P = parse(L.amount);
        if (P <= 0 || years <= 0) return { hero: '<div class="empty">' + esc(t.empty) + '</div>', rest: '' };
        var r = H.loan({ principal: P, annualRate: rate, years: years, insurancePct: parse(L.ins), feesPct: parse(L.fees) });
        var showIns = r.insuranceMonthly > 0;
        var table = '<div class="rows"><div class="scroll"><table><thead><tr><th>' + esc(t.cYear) + '</th><th>' + esc(t.cPaid) + '</th><th>' + esc(t.cInterest) +
          '</th><th>' + esc(t.cPrincipal) + '</th><th>' + esc(t.cBalance) + '</th></tr></thead><tbody>' +
          r.schedule.map(function (y) {
            return '<tr><td>' + y.year + '</td><td>' + fmt(y.paid, 0) + '</td><td>' + fmt(y.interest, 0) + '</td><td>' + fmt(y.principal, 0) + '</td><td>' + fmt(y.balance, 0) + '</td></tr>';
          }).join('') + '</tbody></table></div></div>';
        var heroL = '<div class="hero"><div class="cap">' + esc(t.paymentResult) + '</div><div class="big">' + bigMoney(showIns ? r.paymentWithInsurance : r.payment) + '</div>' +
          '<div class="sub">' + (showIns ? esc(t.withIns) + ' · ' : '') + esc(t.monthsCount.replace('{n}', r.months)) + '</div></div>';
        return { hero: heroL, rest:
          '<div class="rows">' + row(esc(t.totalInterest), money(r.totalInterest)) +
          (showIns ? row(esc(t.insLabel.split('(')[0].trim()), money(r.totalInsurance)) : '') +
          (r.fees > 0 ? row(esc(t.fees), money(r.fees)) : '') +
          row(esc(t.totalCost), money(r.totalCost), true) + '</div>' +
          '<details><summary>' + esc(t.yearly) + '</summary>' + table + '</details><p class="note">' + esc(t.loanNote) + '</p>' };
      }
    },

    car: {
      form: function (t) {
        return {
          top: '<h1>' + esc(t.carTitle) + '</h1><div class="form">' +
            field('car.cv', t.cvLabel, { hint: t.cvHint }) +
            '<div class="field"><div class="lab"><span>' + esc(t.fuelLabel) + '</span></div>' +
            seg('car.fuel', [['essence', t.fuelPetrol], ['diesel', t.fuelDiesel]]) + '</div></div>',
          more: S.car.fuel === 'diesel' ? '<div class="form"><label class="check"><input type="checkbox" data-chk="car.pickup"' + (S.car.pickup ? ' checked' : '') + '><span>' + esc(t.pickupLabel) + '<br><small style="color:var(--muted)">' + esc(t.pickupHint) + '</small></span></label></div>' : ''
        };
      },
      out: function (t) {
        var cv = parse(S.car.cv);
        var grid = '<details><summary>' + esc(t.gridTitle) + '</summary><div class="rows">' +
          t.gridRow.map(function (lab, i) {
            var g = H.CONFIG.vignette[i];
            return row(esc(lab), '<span class="n">' + fmt(g[1], 0) + '</span> / <span class="n">' + fmt(g[2], 0) + '</span>');
          }).join('') + '</div></details>';
        var tail = grid + '<p class="note">' + esc(t.carNote) + '</p>';
        if (cv < 1) return { hero: '<div class="empty">' + esc(t.empty) + '</div>', rest: tail };
        var v = H.vignette(cv, S.car.fuel, S.car.pickup);
        return { hero: '<div class="hero"><div class="cap">' + esc(t.carResult) + '</div><div class="big">' + bigMoney(v, true) + '</div>' +
          '<div class="sub">' + esc(S.car.fuel === 'diesel' && !S.car.pickup ? t.fuelDiesel : t.fuelPetrol) + ' · <span class="n">' + Math.floor(cv) + '</span> CV</div></div>', rest: tail };
      }
    },

    vat: {
      form: function (t) {
        var ht = S.vat.mode === 'ht';
        var rates = ['20', '10', '7'];
        var chips = rates.map(function (r) {
          return '<button type="button" data-seg="vat.rate" data-v="' + r + '" aria-pressed="' + (S.vat.rate === r) + '">' + r + ' %</button>';
        }).join('') + '<button type="button" data-seg="vat.rate" data-v="other" aria-pressed="' + (S.vat.rate === 'other') + '">' + esc(t.vatOther) + '</button>';
        return {
          top: '<h1>' + esc(t.vatTitle) + '</h1>' + seg('vat.mode', [['ht', t.modeHtTtc], ['ttc', t.modeTtcHt]]) +
            '<div class="form">' + field('vat.amount', ht ? t.vatAmountHt : t.vatAmountTtc, { unit: t.cur }) +
            '<div class="field"><div class="lab"><span>' + esc(t.vatRate) + '</span></div><div class="chips">' + chips + '</div></div>' +
            (S.vat.rate === 'other' ? field('vat.custom', t.vatRate, { unit: '%' }) : '') + '</div>',
          more: ''
        };
      },
      out: function (t) {
        var amt = parse(S.vat.amount);
        if (amt <= 0) return { hero: '<div class="empty">' + esc(t.empty) + '</div>', rest: '' };
        var rate = S.vat.rate === 'other' ? parse(S.vat.custom) : parse(S.vat.rate);
        var r = H.vat(amt, rate, S.vat.mode);
        var main = S.vat.mode === 'ht' ? r.ttc : r.ht;
        return { hero: '<div class="hero"><div class="cap">' + esc(S.vat.mode === 'ht' ? t.rTtc : t.rHt) + '</div><div class="big">' + bigMoney(main) + '</div></div>',
          rest: '<div class="rows">' + row(esc(t.rHt), money(r.ht)) + row(esc(t.rVat) + ' (<span class="n">' + fmt(rate, rate % 1 ? 1 : 0) + '</span> %)', money(r.vat)) + row(esc(t.rTtc), money(r.ttc), true) + '</div>' };
      }
    }
  };

  // ---------- Rendu ----------
  function renderView() {
    var t = T(), v = VIEWS[S.tab], f = v.form(t), o = v.out(t);
    $('view').innerHTML = f.top + '<div id="hero">' + o.hero + '</div>' + f.more + '<div id="out">' + o.rest + '</div>';
  }
  function renderOut() {
    var o = VIEWS[S.tab].out(T());
    $('hero').innerHTML = o.hero;
    $('out').innerHTML = o.rest;
  }
  function renderAll() { renderChrome(); renderView(); }

  // ---------- Événements ----------
  document.addEventListener('input', function (e) {
    var k = e.target.getAttribute && e.target.getAttribute('data-k');
    if (!k) return;
    set(k, e.target.value);
    renderOut();
  });
  document.addEventListener('change', function (e) {
    var k = e.target.getAttribute && e.target.getAttribute('data-chk');
    if (!k) return;
    set(k, e.target.checked);
    renderOut();
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('button') : null;
    if (!b) return;
    if (b.id === 'langBtn') { S.lang = S.lang === 'ar' ? 'fr' : 'ar'; save(); renderAll(); return; }
    if (b.hasAttribute('data-tab')) { S.tab = b.getAttribute('data-tab'); save(); renderAll(); window.scrollTo(0, 0); return; }
    if (b.hasAttribute('data-seg')) { set(b.getAttribute('data-seg'), b.getAttribute('data-v')); renderView(); return; }
    if (b.hasAttribute('data-step')) {
      var d = Math.max(0, Math.min(H.CONFIG.family.maxPersons, S.salary.deps + parseInt(b.getAttribute('data-step'), 10)));
      S.salary.deps = d; save(); $('deps').textContent = d; renderOut(); return;
    }
  });

  // Installation PWA
  var deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); deferred = e; $('installBtn').hidden = false;
  });
  $('installBtn').addEventListener('click', function () {
    if (!deferred) return;
    deferred.prompt();
    deferred.userChoice.then(function () { deferred = null; $('installBtn').hidden = true; });
  });
  window.addEventListener('appinstalled', function () { $('installBtn').hidden = true; });

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }

  renderAll();
})();
