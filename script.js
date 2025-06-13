document.addEventListener("DOMContentLoaded", function () {
  const hijriMonths = [
    "", "Muḥarram", "Ṣafar", "Rabīʿ I", "Rabīʿ II", "Jumādā I", "Jumādā II",
    "Rajab", "Shaʿbān", "Ramaḍān", "Shawwāl", "Dhū al-Qaʿda", "Dhū al-Ḥijja"
  ];

  const hijriMonthsArabic = [
    "", "محرم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة",
    "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
  ];

  const ceMonthsArabic = [
    "", "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];

  const dayOfWeekMap = [
    ["Sunday", "al-Aḥad", "الأحد"],
    ["Monday", "al-Ithnayn", "الاثنين"],
    ["Tuesday", "al-Thulāthāʾ", "الثلاثاء"],
    ["Wednesday", "al-Arbiʿāʾ", "الأربعاء"],
    ["Thursday", "al-Khamīs", "الخميس"],
    ["Friday", "al-Jumʿa", "الجمعة"],
    ["Saturday", "al-Sabt", "السبت"]
  ];

  function normalizeDigits(input) {
    return input.replace(/[\u0660-\u0669]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
  }

  function toArabicNumerals(str) {
    return str.replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
  }

  function formatCEOutput(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const weekday = dayOfWeekMap[date.getDay()];

    const en = `${day} ${date.toLocaleString('en-US', { month: 'long' })} ${year} CE`;
    const ar = `${toArabicNumerals(day.toString())} ${ceMonthsArabic[month]} ${toArabicNumerals(year.toString())} م`;

    return `${en} / ${ar}\n${weekday[0]} / ${weekday[1]} / ${weekday[2]}`;
  }

  function formatHijriOutput(h) {
    const day = h.day;
    const month = h.month;
    const year = h.year;
    const weekday = dayOfWeekMap[h.weekday];

    const trans = `${day} ${hijriMonths[month]} ${year} AH`;
    const ar = `${toArabicNumerals(day.toString())} ${hijriMonthsArabic[month]} ${toArabicNumerals(year.toString())} هـ`;

    return `${trans} / ${ar}\n${weekday[0]} / ${weekday[1]} / ${weekday[2]}`;
  }

  window.convertCEtoHijri = function () {
    const day = parseInt(normalizeDigits(document.getElementById("ce-day").value));
    const month = parseInt(normalizeDigits(document.getElementById("ce-month").value));
    const year = parseInt(normalizeDigits(document.getElementById("ce-year").value));
    if (!day || !month || !year) return;

    const date = new Date(year, month - 1, day);
    const h = Muqawwim.Islamic.fromGregorian(date);
    document.getElementById("hijri-output").innerText = formatHijriOutput(h);
  };

  window.convertHijriToCE = function () {
    const day = parseInt(normalizeDigits(document.getElementById("hijri-day").value));
    const month = parseInt(normalizeDigits(document.getElementById("hijri-month").value));
    const year = parseInt(normalizeDigits(document.getElementById("hijri-year").value));
    if (!day || !month || !year) return;

    const g = Muqawwim.Gregorian.fromIslamic(year, month, day);
    const date = new Date(g.year, g.month - 1, g.day);
    document.getElementById("ce-output").innerText = formatCEOutput(date);
  };

  window.convertHijriYearToCERange = function () {
    const year = parseInt(normalizeDigits(document.getElementById("hijri-range-year").value));
    if (!year) return;

    const start = Muqawwim.Gregorian.fromIslamic(year, 1, 1);
    const end = Muqawwim.Gregorian.fromIslamic(year, 12, 30);
    const startDate = new Date(start.year, start.month - 1, start.day);
    const endDate = new Date(end.year, end.month - 1, end.day);

    document.getElementById("ce-range-output").innerText =
      `Start: ${formatCEOutput(startDate)}\nEnd: ${formatCEOutput(endDate)}`;
  };

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

  window.toggleDyslexiaMode = function () {
    document.body.classList.toggle("dyslexic-mode");
  };
});
