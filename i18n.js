/* Textes FR / AR. Les chiffres restent en chiffres latins (usage au Maroc). */
(function (root) {
  'use strict';
  root.I18N = {
    fr: {
      dir: 'ltr', lang: 'fr', switchTo: 'العربية',
      appName: 'Hssabi', tagline: 'Vos calculs du quotidien, au Maroc',
      cur: 'MAD', perMonth: '/mois', perYear: '/an',
      tabSalary: 'Salaire', tabLoan: 'Crédit', tabCar: 'Vignette', tabVat: 'TVA',
      install: 'Installer l’appli', installed: 'Installée',

      // Salaire
      salaryTitle: 'Salaire net',
      modeGrossNet: 'Brut → Net', modeNetGross: 'Net → Brut',
      grossLabel: 'Salaire brut mensuel', netLabel: 'Salaire net souhaité (mensuel)',
      dependentsLabel: 'Personnes à charge', dependentsHint: 'Conjoint et enfants, 6 au maximum',
      cimrLabel: 'Retraite complémentaire (CIMR), par mois', optional: 'facultatif',
      netResult: 'Salaire net mensuel', grossResult: 'Salaire brut mensuel nécessaire',
      netYear: 'Net sur 12 mois',
      legendNet: 'Net perçu', legendCnss: 'CNSS', legendAmo: 'AMO', legendCimr: 'CIMR', legendIr: 'IR',
      rowCnss: 'CNSS (4,48 %, plafonnée à 6 000)', rowAmo: 'AMO (2,26 %)', rowCimr: 'CIMR',
      rowIr: 'Impôt sur le revenu (IR)',
      detailsTitle: 'Détail du calcul',
      dSbi: 'Salaire brut imposable', dFp: 'Frais professionnels', dSni: 'Salaire net imposable',
      dIrGross: 'IR avant charges de famille', dFam: 'Réduction charges de famille',
      dMarginal: 'Taux marginal', dEffective: 'Prélèvements totaux / brut',
      salaryNote: 'Estimation basée sur le barème IR, la CNSS et l’AMO en vigueur. Primes, avantages en nature et indemnités exonérées ne sont pas pris en compte. Votre fiche de paie fait foi.',

      // Crédit
      loanTitle: 'Crédit',
      modePayment: 'Mensualité', modeCapacity: 'Capacité d’emprunt',
      amountLabel: 'Montant emprunté', rateLabel: 'Taux annuel (%)', yearsLabel: 'Durée (années)',
      insLabel: 'Assurance (% du capital, par an)', feesLabel: 'Frais de dossier (%)',
      incomeLabel: 'Revenu net mensuel', debtsLabel: 'Crédits en cours (mensualités)',
      ratioLabel: 'Taux d’endettement maximal (%)',
      paymentResult: 'Mensualité', withIns: 'assurance comprise', monthsCount: '{n} mensualités',
      totalInterest: 'Intérêts totaux', totalCost: 'Coût total du crédit', fees: 'Frais de dossier',
      capacityResult: 'Montant empruntable', maxMonthly: 'Mensualité maximale',
      yearly: 'Récapitulatif par année', cYear: 'Année', cPaid: 'Payé', cInterest: 'Intérêts', cPrincipal: 'Capital', cBalance: 'Reste dû',
      loanNote: 'Simulation indicative à taux fixe. Les conditions réelles dépendent de votre banque.',

      // Vignette
      carTitle: 'Vignette auto',
      cvLabel: 'Puissance fiscale (CV)', cvHint: 'Indiquée sur la carte grise',
      fuelLabel: 'Carburant', fuelPetrol: 'Essence', fuelDiesel: 'Diesel',
      pickupLabel: 'Pick-up diesel d’un particulier', pickupHint: 'Taxé au tarif essence',
      carResult: 'Vignette annuelle',
      gridTitle: 'Grille tarifaire',
      gridRow: ['Jusqu’à 7 CV', '8 à 10 CV', '11 à 14 CV', '15 CV et plus'],
      carNote: 'Tarifs reconduits pour 2026. Vérifiez votre cas sur le site officiel de la DGI avant de payer.',

      // TVA
      vatTitle: 'TVA',
      modeHtTtc: 'HT → TTC', modeTtcHt: 'TTC → HT',
      vatAmountHt: 'Montant hors taxe (HT)', vatAmountTtc: 'Montant toutes taxes comprises (TTC)',
      vatRate: 'Taux de TVA', vatOther: 'Autre',
      rHt: 'Montant HT', rVat: 'TVA', rTtc: 'Montant TTC',

      empty: 'Saisissez un montant pour voir le résultat.',
      footer: 'Barèmes mis à jour : {d}. Résultats indicatifs, sans valeur légale.',
      privacy: 'Confidentialité'
    },

    ar: {
      dir: 'rtl', lang: 'ar', switchTo: 'Français',
      appName: 'حسابي', tagline: 'حساباتك اليومية في المغرب',
      cur: 'درهم', perMonth: '/شهر', perYear: '/سنة',
      tabSalary: 'الأجر', tabLoan: 'القرض', tabCar: 'الفينيت', tabVat: 'TVA',
      install: 'تثبيت التطبيق', installed: 'تم التثبيت',

      salaryTitle: 'الأجر الصافي',
      modeGrossNet: 'من الإجمالي إلى الصافي', modeNetGross: 'من الصافي إلى الإجمالي',
      grossLabel: 'الأجر الإجمالي الشهري', netLabel: 'الأجر الصافي المطلوب (شهريًا)',
      dependentsLabel: 'الأشخاص في الكفالة', dependentsHint: 'الزوج(ة) والأبناء، بحد أقصى 6',
      cimrLabel: 'التقاعد التكميلي (CIMR) شهريًا', optional: 'اختياري',
      netResult: 'الأجر الصافي الشهري', grossResult: 'الأجر الإجمالي اللازم شهريًا',
      netYear: 'الصافي خلال 12 شهرًا',
      legendNet: 'الصافي المستلم', legendCnss: 'CNSS', legendAmo: 'AMO', legendCimr: 'CIMR', legendIr: 'الضريبة',
      rowCnss: 'الضمان الاجتماعي CNSS (4.48%، بسقف 6000)', rowAmo: 'التأمين الصحي AMO (2.26%)', rowCimr: 'CIMR',
      rowIr: 'الضريبة على الدخل (IR)',
      detailsTitle: 'تفاصيل الحساب',
      dSbi: 'الأجر الإجمالي الخاضع للضريبة', dFp: 'المصاريف المهنية', dSni: 'الأجر الصافي الخاضع للضريبة',
      dIrGross: 'الضريبة قبل التخفيض العائلي', dFam: 'تخفيض الأعباء العائلية',
      dMarginal: 'النسبة الهامشية', dEffective: 'مجموع الاقتطاعات من الإجمالي',
      salaryNote: 'تقدير مبني على سلم الضريبة على الدخل والضمان الاجتماعي والتأمين الإجباري عن المرض الجاري بها العمل. لا يشمل المنح والمزايا العينية والتعويضات المعفاة. المعتمد هو ورقة الأداء.',

      loanTitle: 'القرض',
      modePayment: 'القسط الشهري', modeCapacity: 'قدرة الاقتراض',
      amountLabel: 'مبلغ القرض', rateLabel: 'النسبة السنوية (%)', yearsLabel: 'المدة (بالسنوات)',
      insLabel: 'التأمين (% من رأس المال سنويًا)', feesLabel: 'مصاريف الملف (%)',
      incomeLabel: 'الدخل الصافي الشهري', debtsLabel: 'أقساط القروض الجارية',
      ratioLabel: 'نسبة المديونية القصوى (%)',
      paymentResult: 'القسط الشهري', withIns: 'مع التأمين', monthsCount: '{n} قسطًا شهريًا',
      totalInterest: 'مجموع الفوائد', totalCost: 'الكلفة الإجمالية للقرض', fees: 'مصاريف الملف',
      capacityResult: 'المبلغ الذي يمكنك اقتراضه', maxMonthly: 'أقصى قسط شهري',
      yearly: 'ملخص حسب السنة', cYear: 'السنة', cPaid: 'المؤدى', cInterest: 'الفوائد', cPrincipal: 'الأصل', cBalance: 'المتبقي',
      loanNote: 'محاكاة تقريبية بنسبة ثابتة. الشروط الفعلية تحددها وكالتك البنكية.',

      carTitle: 'فينيت السيارة',
      cvLabel: 'القوة الجبائية (CV)', cvHint: 'مكتوبة في البطاقة الرمادية',
      fuelLabel: 'نوع الوقود', fuelPetrol: 'بنزين', fuelDiesel: 'ديزل',
      pickupLabel: 'بيك آب ديزل مملوكة لشخص ذاتي', pickupHint: 'تُؤدى بتعريفة البنزين',
      carResult: 'الفينيت السنوية',
      gridTitle: 'التعريفة',
      gridRow: ['حتى 7 CV', 'من 8 إلى 10 CV', 'من 11 إلى 14 CV', '15 CV فما فوق'],
      carNote: 'التعريفة نفسها لسنة 2026. تأكد من وضعيتك في الموقع الرسمي للمديرية العامة للضرائب قبل الأداء.',

      vatTitle: 'TVA',
      modeHtTtc: 'من HT إلى TTC', modeTtcHt: 'من TTC إلى HT',
      vatAmountHt: 'المبلغ دون احتساب الضريبة (HT)', vatAmountTtc: 'المبلغ بجميع الضرائب (TTC)',
      vatRate: 'نسبة TVA', vatOther: 'أخرى',
      rHt: 'المبلغ HT', rVat: 'قيمة TVA', rTtc: 'المبلغ TTC',

      empty: 'أدخل مبلغًا لتظهر النتيجة.',
      footer: 'آخر تحديث للمعدلات: {d}. النتائج تقريبية وليست لها قيمة قانونية.',
      privacy: 'الخصوصية'
    }
  };
})(typeof self !== 'undefined' ? self : this);
