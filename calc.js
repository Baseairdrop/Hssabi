/*
 * Hssabi — moteur de calcul (aucune dépendance, testable sous Node).
 * TOUTES les valeurs fiscales sont dans CONFIG : à mettre à jour chaque loi de finances.
 */
(function (root) {
  'use strict';

  var CONFIG = {
    year: 2026,
    lastVerified: '2026-11',
    // Barème IR annuel (art. 73 CGI) : [plafond de tranche, taux]
    irBrackets: [
      [40000, 0.00],
      [60000, 0.10],
      [80000, 0.20],
      [100000, 0.30],
      [180000, 0.34],
      [Infinity, 0.37]
    ],
    cnss: { rate: 0.0448, ceilingMonthly: 6000 },
    amo: { rate: 0.0226 },
    fraisPro: {
      lowThresholdAnnual: 78000, lowRate: 0.35, lowCapAnnual: 30000,
      highRate: 0.25, highCapAnnual: 35000
    },
    family: { perPersonAnnual: 600, maxPersons: 6 },
    // Vignette (TSAV) : [CV max, essence, diesel]
    vignette: [
      [7, 350, 700],
      [10, 650, 1500],
      [14, 3000, 6000],
      [Infinity, 8000, 20000]
    ],
    debtRatio: 0.40
  };

  function round2(n) { return Math.round(n * 100) / 100; }
  function num(v) { v = Number(v); return isFinite(v) ? v : 0; }

  // ---------- IR ----------
  function irAnnual(sni) {
    sni = Math.max(0, num(sni));
    var tax = 0, prev = 0, i, cap, rate;
    for (i = 0; i < CONFIG.irBrackets.length; i++) {
      cap = CONFIG.irBrackets[i][0];
      rate = CONFIG.irBrackets[i][1];
      if (sni > prev) tax += (Math.min(sni, cap) - prev) * rate;
      prev = cap;
      if (sni <= cap) break;
    }
    return tax;
  }

  function marginalRate(sni) {
    var i;
    for (i = 0; i < CONFIG.irBrackets.length; i++) {
      if (sni <= CONFIG.irBrackets[i][0]) return CONFIG.irBrackets[i][1];
    }
    return CONFIG.irBrackets[CONFIG.irBrackets.length - 1][1];
  }

  function fraisProAnnual(sbiAnnual) {
    var f = CONFIG.fraisPro;
    if (sbiAnnual <= f.lowThresholdAnnual) return Math.min(sbiAnnual * f.lowRate, f.lowCapAnnual);
    return Math.min(sbiAnnual * f.highRate, f.highCapAnnual);
  }

  /**
   * Salaire brut mensuel -> net mensuel.
   * opts: gross, dependents, cimr (cotisation retraite mensuelle déductible)
   */
  function netFromGross(opts) {
    var gross = Math.max(0, num(opts.gross));
    var dependents = Math.max(0, Math.floor(num(opts.dependents)));
    var cimr = Math.max(0, num(opts.cimr));

    var cnss = Math.min(gross, CONFIG.cnss.ceilingMonthly) * CONFIG.cnss.rate;
    var amo = gross * CONFIG.amo.rate;
    var sbi = Math.max(0, gross - cnss - amo - cimr);
    var sbiA = sbi * 12;
    var fpA = fraisProAnnual(sbiA);
    var sniA = Math.max(0, sbiA - fpA);
    var irGrossA = irAnnual(sniA);
    var famA = Math.min(dependents, CONFIG.family.maxPersons) * CONFIG.family.perPersonAnnual;
    var irA = Math.max(0, irGrossA - famA);

    var ir = irA / 12;
    var net = gross - cnss - amo - cimr - ir;

    return {
      gross: round2(gross),
      cnss: round2(cnss),
      amo: round2(amo),
      cimr: round2(cimr),
      sbi: round2(sbi),
      fraisPro: round2(fpA / 12),
      sni: round2(sniA / 12),
      irGross: round2(irGrossA / 12),
      familyReduction: round2(Math.min(famA, irGrossA) / 12),
      ir: round2(ir),
      net: round2(net),
      netAnnual: round2(net * 12),
      marginalRate: marginalRate(sniA),
      effectiveRate: gross > 0 ? (gross - net) / gross : 0
    };
  }

  /** Net mensuel souhaité -> brut mensuel (recherche dichotomique). */
  function grossFromNet(opts) {
    var target = Math.max(0, num(opts.net));
    var lo = target, hi = Math.max(target * 3, 1000), i, mid;
    var base = { dependents: opts.dependents, cimr: opts.cimr };
    function f(g) { return netFromGross({ gross: g, dependents: base.dependents, cimr: base.cimr }).net; }
    while (f(hi) < target && hi < 5e7) hi *= 2;
    for (i = 0; i < 80; i++) {
      mid = (lo + hi) / 2;
      if (f(mid) < target) lo = mid; else hi = mid;
    }
    return netFromGross({ gross: hi, dependents: opts.dependents, cimr: opts.cimr });
  }

  // ---------- Crédit ----------
  function monthlyPayment(principal, annualRatePct, years) {
    var n = Math.round(num(years) * 12);
    var mr = num(annualRatePct) / 1200;
    if (n <= 0) return 0;
    if (mr === 0) return principal / n;
    return principal * mr / (1 - Math.pow(1 + mr, -n));
  }

  function loan(opts) {
    var P = Math.max(0, num(opts.principal));
    var rate = Math.max(0, num(opts.annualRate));
    var years = Math.max(0, num(opts.years));
    var insPct = Math.max(0, num(opts.insurancePct));   // % annuel du capital initial
    var feesPct = Math.max(0, num(opts.feesPct));       // % frais de dossier, une fois
    var n = Math.round(years * 12);
    var pmt = monthlyPayment(P, rate, years);
    var ins = P * insPct / 1200;
    var fees = P * feesPct / 100;
    var mr = rate / 1200;
    var bal = P, rows = [], m, interest, princ, yr = null, y;

    for (m = 1; m <= n; m++) {
      interest = bal * mr;
      princ = pmt - interest;
      if (m === n) princ = bal;
      bal = Math.max(0, bal - princ);
      y = Math.ceil(m / 12);
      if (!yr || yr.year !== y) {
        yr = { year: y, paid: 0, interest: 0, principal: 0, balance: 0 };
        rows.push(yr);
      }
      yr.paid += pmt;
      yr.interest += interest;
      yr.principal += princ;
      yr.balance = bal;
    }

    return {
      months: n,
      payment: round2(pmt),
      insuranceMonthly: round2(ins),
      paymentWithInsurance: round2(pmt + ins),
      totalInterest: round2(pmt * n - P),
      totalInsurance: round2(ins * n),
      fees: round2(fees),
      totalCost: round2(pmt * n + ins * n + fees),
      schedule: rows.map(function (r) {
        return {
          year: r.year, paid: round2(r.paid), interest: round2(r.interest),
          principal: round2(r.principal), balance: round2(r.balance)
        };
      })
    };
  }

  /** Capital empruntable pour une mensualité donnée. */
  function maxLoan(monthly, annualRatePct, years) {
    var n = Math.round(num(years) * 12);
    var mr = num(annualRatePct) / 1200;
    monthly = Math.max(0, num(monthly));
    if (n <= 0) return 0;
    if (mr === 0) return round2(monthly * n);
    return round2(monthly * (1 - Math.pow(1 + mr, -n)) / mr);
  }

  // ---------- Vignette ----------
  function vignette(cv, fuel, pickupDiesel) {
    cv = Math.floor(num(cv));
    if (cv < 1) return 0;
    var useDiesel = fuel === 'diesel' && !pickupDiesel;
    var i;
    for (i = 0; i < CONFIG.vignette.length; i++) {
      if (cv <= CONFIG.vignette[i][0]) return CONFIG.vignette[i][useDiesel ? 2 : 1];
    }
    return 0;
  }

  // ---------- TVA ----------
  function vat(amount, ratePct, mode) {
    amount = Math.max(0, num(amount));
    var r = Math.max(0, num(ratePct)) / 100;
    var ht, ttc;
    if (mode === 'ttc') { ttc = amount; ht = ttc / (1 + r); }
    else { ht = amount; ttc = ht * (1 + r); }
    return { ht: round2(ht), vat: round2(ttc - ht), ttc: round2(ttc) };
  }

  root.Hssabi = {
    CONFIG: CONFIG,
    irAnnual: irAnnual,
    netFromGross: netFromGross,
    grossFromNet: grossFromNet,
    monthlyPayment: monthlyPayment,
    loan: loan,
    maxLoan: maxLoan,
    vignette: vignette,
    vat: vat
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.Hssabi;
})(typeof self !== 'undefined' ? self : this);
