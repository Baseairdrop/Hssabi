# حسابي / Hssabi

تطبيق ويب تقدّمي (PWA) ثنائي اللغة (عربية / فرنسية) يعمل بدون إنترنت:
الأجر الصافي (CNSS + AMO + IR) · القرض · فينيت السيارة · TVA.

## الملفات
| الملف | الدور |
|---|---|
| `index.html`, `style.css`, `app.js` | الواجهة |
| `calc.js` | **كل الحسابات والمعدلات** (الكائن `CONFIG` في أعلاه) |
| `i18n.js` | النصوص بالعربية والفرنسية |
| `sw.js`, `manifest.webmanifest`, `icons/` | العمل بدون إنترنت والتثبيت |
| `privacy.html` | سياسة الخصوصية (يطلبها Google Play) — بدّل البريد `CONTACT@EXEMPLE.MA` |
| `test.js` | اختبارات الحسابات: `node test.js` |

## جرّبه محليًا
```
cd hssabi
python3 -m http.server 8080
```
ثم افتح `http://localhost:8080` (الـ Service Worker يحتاج http أو https، لا يعمل من file://).

## تحديث المعدلات كل سنة
عدّل `CONFIG` في `calc.js` (شرائح IR، الأعباء العائلية، تعريفة الفينيت، سقف CNSS)،
ثم شغّل `node test.js`، ثم غيّر `VERSION` في `sw.js` (مثلًا `hssabi-v2`) حتى يتحدث التطبيق عند المستخدمين.

> الأعباء العائلية: المصادر تذكر 500 ثم 600 درهم للشخص سنويًا. الموضوع الآن 600 (سقف 6 أشخاص). تحقق منه في قانون المالية.

## النشر
1. ارفع المجلد على استضافة HTTPS مجانية (Cloudflare Pages أو Netlify أو GitHub Pages).
2. **مسار سريع إلى Google Play:** افتح الرابط في https://www.pwabuilder.com وأنشئ حزمة Android (TWA)، ثم ارفع ملف `.aab` في Play Console.
3. **إذا أردت إعلانات AdMob:** لفّ المجلد بـ Capacitor وأضف إضافة AdMob (الـ TWA لا يدعمها).
4. قبل أي شيء تأكد من إمكانية استلام الأرباح (AdMob / Play) من المغرب.
5. أسماء مقترحة للحزمة: `ma.hssabi.app`. غيّر الاسم إن كان محجوزًا.
