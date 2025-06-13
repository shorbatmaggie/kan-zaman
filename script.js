// Hijrī month names (IJMES)
const hijriMonths = [
  "", "Muḥarram", "Ṣafar", "Rabīʿ I", "Rabīʿ II", "Jumādā I", "Jumādā II",
  "Rajab", "Shaʿbān", "Ramaḍān", "Shawwāl", "Dhū al-Qaʿda", "Dhū al-Ḥijja"
];

// Arabic Gregorian month names
const ceMonthsArabic = [
  "", "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

// Day of week: [EN, translit, AR]
const dayOfWeekMap = [
  ["Monday", "al-Ithnayn", "الاثنين"],
  ["Tuesday", "al-Thulāthāʾ", "الثلاثاء"],
  ["Wednesday", "al-Arbiʿāʾ", "الأربعاء"],
  ["Thursday", "al-Khamīs", "الخميس"],
  ["Friday", "al-Jumʿa", "الجمعة"],
  ["Saturday", "al-Sabt", "السبت"],
  ["Sunday", "al-Aḥad", "الأحد"]
];

// Converts Arabic-script digits (٠١٢٣...) to Western (0123...)
function normalizeDigits(input) {
  return input.replace(/[\u0660-\u0669]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
}

// Converts Western digits (0123...) to Arabic (٠١٢٣...)
function toArabicNumerals(str) {
  return str.replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
}

// Format CE output
function formatCEOutput(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1; // JS months are 0-based
  const year = date.getFullYear();

  const weekday = dayOfWeekMap[date.getDay()];
  const en = `${day} ${date.toLocaleString('en-US', { month: 'long' })} ${year} CE`;
  const ar = `${toArabicNumerals(day.toString())} ${ceMonthsArabic[month]} ${toArabicNumerals(year.toString())} م`;

  return `${en} / ${ar}\n${weekday[0]} / ${weekday[1]} / ${weekday[2]}`;
}

// Format Hijrī output
function formatHijriOutput(h) {
  const day = h.day;
  const month = h.month;
  const year = h.year;

  const weekday = dayOfWeekMap[h.weekday];
  const trans = `${day} ${hijriMonths[month]} ${year} AH`;
  const ar = `${toArabicNumerals(day.toString())} ${hijriMonthArabic(month)} ${toArabicNumerals(year.toString())} هـ`;

  return `${trans} / ${ar}\n${weekday[0]} / ${weekday[1]} / ${weekday[2]}`;
}

// Arabic Hijri month names
function hijriMonthArabic(m) {
  return [
    "", "محرم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة",
    "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
  ][m];
}

// Handle CE → Hijrī conversion
function convertCEtoHijri() {
  const day = parseInt(normalizeDigits(document.getElementById("ce-day").value));
  const month = parseInt(normalizeDigits(document.getElementById("ce-month").value));
  const year = parseInt(normalizeDigits(document.getElementById("ce-year").value));

  if (!day || !month || !year) return;

  const date = new Date(year, month - 1, day);
  const h = Muqawwim.Islamic.fromGregorian(date);
  const output = formatHijriOutput(h);

  document.getElementById("hijri-output").innerText = output;
}

// Handle Hijrī → CE conversion
function convertHijriToCE() {
  const day = parseInt(normalizeDigits(document.getElementById("hijri-day").value));
  const month = parseInt(normalizeDigits(document.getElementById("hijri-month").value));
  const year = parseInt(normalizeDigits(document.getElementById("hijri-year").value));

  if (!day || !month || !year) return;

  const g = Muqawwim.Gregorian.fromIslamic(year, month, day);
  const date = new Date(g.year, g.month - 1, g.day);
  const output = formatCEOutput(date);

  document.getElementById("ce-output").innerText = output;
}

// Toggle OpenDyslexic font
function toggleDyslexiaMode() {
  document.body.classList.toggle('dyslexic-mode');
}

