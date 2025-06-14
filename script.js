// Normalize digits: Arabic → Latin
function normalizeDigits(input) {
  return input.replace(/[\u0660-\u0669]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
}

// Format Hijrī date in IJMES transliteration + Arabic
function formatHijriParts([year, month, day]) {
  const months = [
    ["Muḥarram", "محرم"],
    ["Ṣafar", "صفر"],
    ["Rabīʿ al-Awwal", "ربيع الأول"],
    ["Rabīʿ al-Thānī", "ربيع الآخر"],
    ["Jumādā al-Ūlā", "جمادى الأولى"],
    ["Jumādā al-Ākhira", "جمادى الآخرة"],
    ["Rajab", "رجب"],
    ["Shaʿbān", "شعبان"],
    ["Ramaḍān", "رمضان"],
    ["Shawwāl", "شوال"],
    ["Dhū al-Qaʿda", "ذو القعدة"],
    ["Dhū al-Ḥijja", "ذو الحجة"]
  ];
  const [translitMonth, arabicMonth] = months[month - 1];
  return { day, year, translitMonth, arabicMonth };
}

// Format CE date in English + Arabic
function formatCEParts([year, month, day]) {
  const months = [
    ["January", "يناير"],
    ["February", "فبراير"],
    ["March", "مارس"],
    ["April", "أبريل"],
    ["May", "مايو"],
    ["June", "يونيو"],
    ["July", "يوليو"],
    ["August", "أغسطس"],
    ["September", "سبتمبر"],
    ["October", "أكتوبر"],
    ["November", "نوفمبر"],
    ["December", "ديسمبر"]
  ];
  const [engMonth, arabicMonth] = months[month - 1];
  return { day, year, engMonth, arabicMonth };
}

// Day of week output
const dayOfWeekMap = [
  ["Sunday", "al-Aḥad", "الأحد"],
  ["Monday", "al-Ithnayn", "الاثنين"],
  ["Tuesday", "al-Thulāthāʾ", "الثلاثاء"],
  ["Wednesday", "al-Arbiʿāʾ", "الأربعاء"],
  ["Thursday", "al-Khamīs", "الخميس"],
  ["Friday", "al-Jumʿa", "الجمعة"],
  ["Saturday", "al-Sabt", "السبت"]
];

function formatDayOfWeek(index) {
  const [eng, translit, arabic] = dayOfWeekMap[index];
  return `${eng} / ${translit} / ${arabic}`;
}

document.addEventListener("DOMContentLoaded", function () {
  // Dyslexia font toggle
  const toggle = document.getElementById("dyslexiaToggle");
  if (toggle) {
    toggle.addEventListener("change", function () {
      document.body.classList.toggle("dyslexia-mode", toggle.checked);
    });
  }

  // Helper for year range display
  function formatYearRange(start, end) {
    const latinRange = `${start}–${end}`;
    const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
    const arabicRange = latinRange.replace(/\d/g, d => arabicDigits[d]);
    return `${latinRange}\n${arabicRange}`;
  }

  // Hijrī → CE year range
  window.convertHijriYearToCERange = function () {
    const year = parseInt(normalizeDigits(document.getElementById("hijri-range-year").value));
    if (!year) return;

    const start = convertHijriToGregorian(year, 1, 1)[0];
    const end = convertHijriToGregorian(year, 12, 30)[0];

    document.getElementById("ce-range-output").innerText = formatYearRange(start, end);
  };

  // CE → Hijrī year range
  window.convertCEYearToHijriRange = function () {
    const year = parseInt(normalizeDigits(document.getElementById("ce-range-year").value));
    if (!year) return;

    const start = convertGregorianToHijri(year, 1, 1)[0];
    const end = convertGregorianToHijri(year, 12, 31)[0];

    document.getElementById("hijri-range-output").innerText = formatYearRange(start, end);
  };

  // Hijrī → CE exact date
  window.convertHijriToCE = function () {
    const day = parseInt(normalizeDigits(document.getElementById("hijri-day").value));
    const month = parseInt(document.getElementById("hijri-month").value);
    const year = parseInt(normalizeDigits(document.getElementById("hijri-year").value));
    if (!day || !month || !year) return;

    const greg = convertHijriToGregorian(year, month, day);
    const weekday = getWeekdayFromHijri(year, month, day);
    const { day: d, year: y, engMonth, arabicMonth } = formatCEParts(greg);

    document.getElementById("ce-output").innerText =
      `${d} ${engMonth} ${y} CE\n` +
      `${d} ${arabicMonth} ${y} م\n` +
      `${formatDayOfWeek(weekday)}`;
  };

  // CE → Hijrī exact date
  window.convertCEtoHijri = function () {
    const day = parseInt(normalizeDigits(document.getElementById("ce-day").value));
    const month = parseInt(document.getElementById("ce-month").value);
    const year = parseInt(normalizeDigits(document.getElementById("ce-year").value));
    if (!day || !month || !year) return;

    const hijriDate = convertGregorianToHijri(year, month, day);
    const weekday = getWeekdayFromGregorian(year, month, day);
    const { day: d, year: y, translitMonth, arabicMonth } = formatHijriParts(hijriDate);

    document.getElementById("hijri-output").innerText =
      `${d} ${translitMonth} ${y} AH\n` +
      `${d} ${arabicMonth} ${y} هـ\n` +
      `${formatDayOfWeek(weekday)}`;
  };
});
