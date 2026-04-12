/* SPDX-FileCopyrightText: 2026 Neil Brandt
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// numberToHangeul.js - Utility for converting numbers to pure Korean Hangeul spelling

const pureUnits = ['', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉'];
const pureTens = ['', '열', '스물', '서른', '마흔', '쉰', '예순', '일흔', '여든', '아흔'];
const pureUnitsShort = {
  '하나': '한',
  '둘': '두',
  '셋': '세',
  '넷': '네'
}
function toPureUnits(num0to9, usePrefixForm){
  let unitTrans = pureUnits[num0to9];
  if (usePrefixForm){
    // Some of the numbers have shortened prefix forms before a noun
    unitTrans = pureUnitsShort[unitTrans] || unitTrans;
  }
  return unitTrans;
}

const sinoDigits = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];

/**
 * Converts a number from 1 to 100 to its pure Korean Hangeul spelling
 *
 * Problematic phoneme changes not yet captured:
 *
 * https://en.wikipedia.org/wiki/Korean_numerals
 * The cardinals for three and four have alternative forms in front of some measure words:
 *   석 달 seok dal ("three months")
 *   넉 잔 neok jan ("four cups")
 * 
 * @param {number} num - The number to convert (1-100)
 * @param {boolean} usePrefixForm  - True to use the short from of '하나', '둘', '셋', '넷'
 * @returns {string} The Hangeul spelling
 */
export function numberToPureKoreanHangeul(num, usePrefixForm) {
  if (num < 1 || num > 100) {
    throw new Error('Number must be between 1 and 100');
  }
  if (num === 100) {
    return '백';
  }
  const ten = Math.floor(num / 10);
  const unit = num % 10;
  if (ten === 0) {
    return toPureUnits(unit, usePrefixForm);
  }
  if (unit === 0) {
    return pureTens[ten];
  }
  return pureTens[ten] + toPureUnits(unit, usePrefixForm);
}

function fourDigitSino(num, abbreviation) {
  // Converts 0-9999 to Sino-Korean (without leading '일' for place values)
  if (num < 0 || num > 9999) {
    throw new Error('fourDigitSino expects 0-9999');
  }
  if (num === 0) {
    return '';
  }

  const thousands = Math.floor(num / 1000);
  const hundreds = Math.floor((num % 1000) / 100);
  const tens = Math.floor((num % 100) / 10);
  const units = num % 10;

  let result = '';
  if (thousands) {
    result += (thousands === 1 ? '천' : `${sinoDigits[thousands]}천`);
  }
  if (hundreds) {
    result += (hundreds === 1 ? '백' : `${sinoDigits[hundreds]}백`);
  }
  if (tens) {
    let tensWord = '십';
    if (abbreviation == "month" && units == 0){
      tensWord = '지';
    }
    result += (tens === 1 ? tensWord : `${sinoDigits[tens]}${tensWord}`);
  }
  if (units) {
    let unitsWord = sinoDigits[units];
    if (abbreviation == "month" && units == 6){
      unitsWord = "유";
    }
    result += unitsWord;
  }

  return result;
}

/**
 * Converts a number from 0 to 9,999,999 to its Sino-Korean Hangeul spelling.
 * @param {number} num - The number to convert (0-9,999,999)
 * @returns {string} The Hangeul spelling
 */
export function numberToSinoKoreanHangeul(num, abbreviation) {
  if (num < 0 || num > 9999999) {
    throw new Error('Number must be between 0 and 9,999,999. Was: '+num );
  }
  if (num === 0) {
    return '영';
  }

  const man = Math.floor(num / 10000);
  const rest = num % 10000;

  let result = '';
  if (man) {
    result += (man === 1 ? '만' : `${fourDigitSino(man)}만`);
  }
  if (rest) {
    result += fourDigitSino(rest, abbreviation);
  }

  return result;
}

/**
 * Converts a JavaScript Date object to Korean date spelling format.
 * Format: "YYYY년 MM월 DD일" with numbers converted to Sino-Korean Hangeul
 * @param {Date} date - The date to convert
 * @returns {string} The Korean date spelling (e.g., "이천스물육년 삼월 십칠일")
 */
export function dateToKoreanSpelling(date, mode) {
  if (!(date instanceof Date)) {
    throw new Error('Input must be a Date object');
  }
  
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();
  
  let yearSpelling = numberToSinoKoreanHangeul(year) + "년";
  let monthSpelling = numberToSinoKoreanHangeul(month, "month") + "월";
  let daySpelling = numberToSinoKoreanHangeul(day) + "일";
  
  if (mode == "year-month"){
    return `${yearSpelling} ${monthSpelling}`;
  }
  else if (mode == "month-day"){
    return `${monthSpelling} ${daySpelling}`
  }
  return `${yearSpelling} ${monthSpelling} ${daySpelling}`;
}

/**
 * Converts a JavaScript Date object to Korean time spelling format.
 * Format: "오전/오후 HH시 MM분" with numbers converted to Sino-Korean Hangeul
 * @param {Date} date - The date from which to extract time
 * @returns {string} The Korean time spelling (e.g., "오후 구시 삼십오분")
 */
export function timeToKoreanSpelling(date) {
  if (!(date instanceof Date)) {
    throw new Error('Input must be a Date object');
  }
  
  const hours24 = date.getHours(); // 0-23
  const minutes = date.getMinutes(); // 0-59
  
  // Determine AM/PM and convert to 12-hour format
  const isAM = hours24 < 12;
  const ampm = isAM ? '오전' : '오후';
  const hours12 = hours24 % 12 || 12; // Convert to 1-12 (12 for midnight/noon)
  
  const hoursSpelling = numberToPureKoreanHangeul(hours12, true);

  let minutesSpelling = ""
  if (minutes != 0)
    minutesSpelling = numberToSinoKoreanHangeul(minutes) + "분";
  
  return `${ampm} ${hoursSpelling}시 ${minutesSpelling}`;
}
