function gregorian_to_jd(year, month, day) {
  const GREGORIAN_EPOCH = 1721425.5;
  return (GREGORIAN_EPOCH - 1) +
    (365 * (year - 1)) +
    Math.floor((year - 1) / 4) -
    Math.floor((year - 1) / 100) +
    Math.floor((year - 1) / 400) +
    Math.floor((((367 * month) - 362) / 12) +
      ((month <= 2) ? 0 : (leap_gregorian(year) ? -1 : -2)) +
      day);
}

function jd_to_gregorian(jd) {
  const GREGORIAN_EPOCH = 1721425.5;
  const wjd = Math.floor(jd - 0.5) + 0.5;
  const depoch = wjd - GREGORIAN_EPOCH;
  const quadricent = Math.floor(depoch / 146097);
  const dqc = depoch % 146097;
  const cent = Math.floor(dqc / 36524);
  const dcent = dqc % 36524;
  const quad = Math.floor(dcent / 1461);
  const dquad = dcent % 1461;
  const yindex = Math.floor(dquad / 365);
  let year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
  if (!(cent === 4 || yindex === 4)) year++;
  const jan1 = gregorian_to_jd(year, 1, 1);
  const yearday = wjd - jan1;
  const leapadj = ((wjd < gregorian_to_jd(year, 3, 1)) ? 0 : (leap_gregorian(year) ? 1 : 2));
  const month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
  const day = (wjd - gregorian_to_jd(year, month, 1)) + 1;
  return [year, month, Math.floor(day)];
}

function islamic_to_jd(year, month, day) {
  const ISLAMIC_EPOCH = 1948439.5;
  return day +
    Math.ceil(29.5 * (month - 1)) +
    (year - 1) * 354 +
    Math.floor((3 + (11 * year)) / 30) +
    ISLAMIC_EPOCH - 1;
}

function jd_to_islamic(jd) {
  const ISLAMIC_EPOCH = 1948439.5;
  jd = Math.floor(jd) + 0.5;
  const year = Math.floor((30 * (jd - ISLAMIC_EPOCH) + 10646) / 10631);
  let i = 1;
  while (jd >= islamic_to_jd(year, i, 30)) i++;
  const month = i;
  const day = jd - islamic_to_jd(year, month, 1) + 1;
  return [year, month, Math.floor(day)];
}

function weekday_from_jd(jd) {
  return Math.floor(jd + 1.5) % 7;
}

function leap_gregorian(year) {
  return ((year % 4) === 0) && (!((year % 100) === 0 && (year % 400) !== 0));
}

// Helpers
function convertHijriToGregorian(year, month, day) {
  const jd = islamic_to_jd(year, month, day);
  return jd_to_gregorian(jd);
}

function convertGregorianToHijri(year, month, day) {
  const jd = gregorian_to_jd(year, month, day);
  return jd_to_islamic(jd);
}

function getWeekdayFromGregorian(year, month, day) {
  return weekday_from_jd(gregorian_to_jd(year, month, day));
}

function getWeekdayFromHijri(year, month, day) {
  return weekday_from_jd(islamic_to_jd(year, month, day));
}
