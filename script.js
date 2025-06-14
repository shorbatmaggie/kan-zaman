// Normalize digits: Arabic → Latin
function normalizeDigits(input) {
  return input.replace(/[\u0660-\u0669]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
}

// Format Hijrī date in IJMES transliteration + Arabic
function formatHijriOutput([year, month, day]) {
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
  return `${day} ${translitMonth} ${year} AH / ${day} ${arabicMonth} ${year} هـ`;
}

// Format CE date in English + Arabic
function formatCEOutput([year, month, day]) {
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
  const [engMonth, arMonth] = months[month - 1];
  return `${day} ${engMonth} ${year} CE / ${day} ${arMonth} ${year} م`;
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

  // CE year → Hijrī year range
  window.convertCEYearToHijriRange = function () {
    const year = parseInt(normalizeDigits(document.getElementById("ce-range-year").value));
    if (!year) return;

    const start = convertGregorianToHijri(year, 1, 1);
    const end = convertGregorianToHijri(year, 12, 31);

    document.getElementById("hijri-range-output").innerText =
      `Start: ${formatHijriOutput(start)}\nEnd: ${formatHijriOutput(end)}`;
  };

  // Hijrī year → CE year range
  window.convertHijriYearToCERange = function () {
    const year = parseInt(normalizeDigits(document.getElementById("hijri-range-year").value));
    if (!year) return;

    const start = convertHijriToGregorian(year, 1, 1);
    const end = convertHijriToGregorian(year, 12, 30);

    document.getElementById("ce-range-output").innerText =
      `Start: ${formatCEOutput(start)}\nEnd: ${formatCEOutput(end)}`;
  };

  // Hijrī → CE exact date
  window.convertHijriToCE = function () {
    const day = parseInt(normalizeDigits(document.getElementById("hijri-day").value));
    const month = parseInt(document.getElementById("hijri-month").value);
    const year = parseInt(normalizeDigits(document.getElementById("hijri-year").value));
    if (!day || !month || !year) return;

    const greg = convertHijriToGregorian(year, month, day);
    const weekday = getWeekdayFromHijri(year, month, day);
    document.getElementById("ce-output").innerText =
      `${formatCEOutput(greg)}\n${formatDayOfWeek(weekday)}`;
  };

  // CE → Hijrī exact date
  window.convertCEtoHijri = function () {
    const day = parseInt(normalizeDigits(document.getElementById("ce-day").value));
    const month = parseInt(document.getElementById("ce-month").value);  // Keep 1–12
    const year = parseInt(normalizeDigits(document.getElementById("ce-year").value));
    if (!day || !month || !year) return;

    const hijri = convertGregorianToHijri(year, month, day);
    const weekday = getWeekdayFromGregorian(year, month, day);
    document.getElementById("hijri-output").innerText =
      `${formatHijriOutput(hijri)}\n${formatDayOfWeek(weekday)}`;
  };
});
