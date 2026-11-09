const H = require('./calc.js');
let fail = 0;
function eq(name, got, want, tol = 0.01) {
  const ok = Math.abs(got - want) <= tol;
  if (!ok) fail++;
  console.log((ok ? 'OK   ' : 'FAIL ') + name + ' got=' + got + ' want=' + want);
}

// Continuité du barème : IR = SNI*taux - somme à déduire
const deds = [[40000, 0, 0], [60000, .10, 4000], [80000, .20, 10000], [100000, .30, 18000], [180000, .34, 22000], [300000, .37, 27400]];
deds.forEach(([sni, r, d]) => eq('IR annuel @' + sni, H.irAnnual(sni), Math.max(0, sni * r - d)));

// Exemple de référence (Upsilon) : brut 12 000, 3 personnes à charge -> IR ≈ 939
const r = H.netFromGross({ gross: 12000, dependents: 3 });
eq('CNSS 12000', r.cnss, 268.80);
eq('AMO 12000', r.amo, 271.20);
eq('IR 12000 (3 pers.)', r.ir, 939, 1);

// Exemple clicpaie : brut 6000 -> CNSS 268.80, AMO 135.60
const r2 = H.netFromGross({ gross: 6000, dependents: 0 });
eq('CNSS 6000', r2.cnss, 268.80);
eq('AMO 6000', r2.amo, 135.60);

// SMIG-like : brut 3111 -> IR = 0
eq('IR SMIG', H.netFromGross({ gross: 3111 }).ir, 0);

// Aller-retour net -> brut
[3500, 8000, 15000, 40000].forEach(g => {
  const n = H.netFromGross({ gross: g, dependents: 2, cimr: 0 }).net;
  const back = H.grossFromNet({ net: n, dependents: 2, cimr: 0 }).gross;
  eq('round-trip ' + g, back, g, 0.02);
});

// Crédit : 1 000 000 MAD, 5 %, 20 ans -> 6599.56
const L = H.loan({ principal: 1000000, annualRate: 5, years: 20 });
eq('mensualité', L.payment, 6599.56);
eq('capital remboursé = principal', L.schedule.reduce((a, y) => a + y.principal, 0), 1000000, 0.5);
eq('solde final', L.schedule[L.schedule.length - 1].balance, 0);
eq('taux 0 %', H.loan({ principal: 120000, annualRate: 0, years: 10 }).payment, 1000);
eq('max loan inverse', H.maxLoan(6599.56, 5, 20), 1000000, 5);

// Vignette
eq('vig 6CV essence', H.vignette(6, 'essence'), 350);
eq('vig 7CV diesel', H.vignette(7, 'diesel'), 700);
eq('vig 8CV diesel', H.vignette(8, 'diesel'), 1500);
eq('vig 10CV essence', H.vignette(10, 'essence'), 650);
eq('vig 11CV diesel', H.vignette(11, 'diesel'), 6000);
eq('vig 14CV essence', H.vignette(14, 'essence'), 3000);
eq('vig 15CV diesel', H.vignette(15, 'diesel'), 20000);
eq('vig pickup diesel 8CV', H.vignette(8, 'diesel', true), 650);

// TVA
eq('TVA HT->TTC', H.vat(100, 20, 'ht').ttc, 120);
eq('TVA TTC->HT', H.vat(120, 20, 'ttc').ht, 100);

console.log(fail ? '\n' + fail + ' ÉCHEC(S)' : '\nTous les tests passent');
process.exit(fail ? 1 : 0);
