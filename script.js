// Normalize digits: Arabic → Latin
function normalizeDigits(input) {
  return input.replace(/[\u0660-\u0669]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
}

// Format Hijrī date in IJMES transliteration + Arabic
function formatHijriOutput(hijriDate) {
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
  const day = hijriDate.getDate();
  const monthIndex = hijriDate.getMonth();
  const year = hijriDate.getFullYear();

  const [translitMonth, arabicMonth] = months[monthIndex];
  return `${day} ${translitMonth} ${year} AH / ${day} ${arabicMonth} ${year} هـ`;
}

// Format CE date in English + Arabic
function formatCEOutput(date) {
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
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const [engMonth, arMonth] = months[monthIndex];
  return `${day} ${engMonth} ${year} CE / ${day} ${arMonth} ${year} م`;
}

// Day of week output
const dayOfWeekMap = [
  ["Monday", "al-Ithnayn", "الاثنين"],
  ["Tuesday", "al-Thulāthāʾ", "الثلاثاء"],
  ["Wednesday", "al-Arbiʿāʾ", "الأربعاء"],
  ["Thursday", "al-Khamīs", "الخميس"],
  ["Friday", "al-Jumʿa", "الجمعة"],
  ["Saturday", "al-Sabt", "السبت"],
  ["Sunday", "al-Aḥad", "الأحد"]
];

function formatDayOfWeek(date) {
  const dayIndex = date.getDay();
  const [eng, translit, arabic] = dayOfWeekMap[dayIndex];
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

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const start = Muqawwim.Islamic.fromGregorian(startDate);
    const end = Muqawwim.Islamic.fromGregorian(endDate);

    document.getElementById("hijri-range-output").innerText =
      `Start: ${formatHijriOutput(start)}\nEnd: ${formatHijriOutput(end)}`;
  };

  // Hijrī year → CE year range
  window.convertHijriYearToCERange = function () {
    const year = parseInt(normalizeDigits(document.getElementById("hijri-range-year").value));
    if (!year) return;

    const start = new Muqawwim.Islamic(year, 0, 1).toGregorian();
    const end = new Muqawwim.Islamic(year, 11, 30).toGregorian();

    document.getElementById("ce-range-output").innerText =
      `Start: ${formatCEOutput(start)}\nEnd: ${formatCEOutput(end)}`;
  };

  // Hijrī → CE exact date
  window.convertHijriDate = function () {
    const day = parseInt(normalizeDigits(document.getElementById("hijri-day").value));
    const month = parseInt(document.getElementById("hijri-month").value); // 0–11
    const year = parseInt(normalizeDigits(document.getElementById("hijri-year").value));
    if (!day || !month || !year) return;

    const gregDate = new Muqawwim.Islamic(year, month, day).toGregorian();
    document.getElementById("gregorian-output").innerText =
      `${formatCEOutput(gregDate)}\n${formatDayOfWeek(gregDate)}`;
  };

  // CE → Hijrī exact date
  window.convertGregorianDate = function () {
    const day = parseInt(normalizeDigits(document.getElementById("gregorian-day").value));
    const month = parseInt(document.getElementById("gregorian-month").value); // 0–11
    const year = parseInt(normalizeDigits(document.getElementById("gregorian-year").value));
    if (!day || !month || !year) return;

    const hijriDate = Muqawwim.Islamic.fromGregorian(new Date(year, month, day));
    document.getElementById("hijri-output").innerText =
      `${formatHijriOutput(hijriDate)}\n${formatDayOfWeek(new Date(year, month, day))}`;
  };
});