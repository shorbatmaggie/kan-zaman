// Clear all canlendar inputs
function clearCalendar(event) {
  event.preventDefault();

  // Reset all forms to clear user inputs
  document.querySelectorAll('form').forEach(form => form.reset());

  // Clear all output paragraphs
  document.getElementById('ce-range-output').textContent = '';
  document.getElementById('hijri-range-output').textContent = '';
  document.getElementById('hijri-output').textContent = '';
  document.getElementById('ce-output').textContent = '';
}

// Normalize digits: Arabic → Latin
function normalizeDigits(input) {
  return input.replace(/[\u0660-\u0669]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
}

// Arabic digit formatter (Latin → Arabic-Indic)
function formatArabicDigits(str) {
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
  return str.toString().replace(/\d/g, d => arabicDigits[d]);
}

// Format CE year range output
function formatYearRange(start, end) {
  const latinRange = `${start}–${end}`;
  const arabicRange = latinRange.replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
  return `${latinRange}\n${arabicRange}`;
}

// Month maps
const hijriMonths = [
  ["Muḥarram", "محرم"],
  ["Ṣafar", "صفر"],
  ["Rabīʿ al-Awwal", "ربيع الأول"],
  ["Rabīʿ al-Ākhir", "ربيع الآخر"],
  ["Jumādā al-Ūlā", "جمادى الأولى"],
  ["Jumādā al-Ākhira", "جمادى الآخرة"],
  ["Rajab", "رجب"],
  ["Shaʿbān", "شعبان"],
  ["Ramaḍān", "رمضان"],
  ["Shawwāl", "شوال"],
  ["Dhū al-Qaʿda", "ذو القعدة"],
  ["Dhū al-Ḥijja", "ذو الحجة"]
];

const ceMonths = [
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

    const [gy, gm, gd] = greg;
    const [engMonth, arMonth] = ceMonths[gm - 1];

    document.getElementById("ce-output").innerHTML =
      `${gd} ${engMonth} ${gy} CE<br>` +
      `<span dir="rtl">${formatArabicDigits(gd)} ${arMonth} ${formatArabicDigits(gy)} م</span><br>` +
      `${formatDayOfWeek(weekday)}`;
  };

  // CE → Hijrī exact date
  window.convertCEtoHijri = function () {
    const day = parseInt(normalizeDigits(document.getElementById("ce-day").value));
    const month = parseInt(document.getElementById("ce-month").value);
    const year = parseInt(normalizeDigits(document.getElementById("ce-year").value));
    if (!day || !month || !year) return;

    const hijri = convertGregorianToHijri(year, month, day);
    const weekday = getWeekdayFromGregorian(year, month, day);

    const [hy, hm, hd] = hijri;
    const [translitMonth, arMonth] = hijriMonths[hm - 1];

    document.getElementById("hijri-output").innerHTML =
      `${hd} ${translitMonth} ${hy} AH<br>` +
      `<span dir="rtl">${formatArabicDigits(hd)} ${arMonth} ${formatArabicDigits(hy)} هـ</span><br>` +
      `${formatDayOfWeek(weekday)}`;
  };
});
