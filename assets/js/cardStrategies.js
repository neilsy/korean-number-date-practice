// pureKoreanNumbers.js - Module for pure Korean number cards (low numbers)

import { numberToPureKoreanHangeul, numberToSinoKoreanHangeul, dateToKoreanSpelling, timeToKoreanSpelling } from './numberToHangeul.js';
import { koreanCountersA } from "./countWords.js";

let lastFiveValues = [0];

function isInLastFive(value){
  return lastFiveValues.includes(value);
}

function storeValue(value){
  lastFiveValues.push(value);
  if (lastFiveValues.length > 5){
    lastFiveValues.shift();
  }
}


/**
 * Generates a random pure Korean number card
 * @returns {Object} Card object with prompt, answer, and mode
 */
export function getRandomPureKoreanCard(previousCard) {
  let number = previousCard.value;
  while (number == previousCard.value || isInLastFive(number)){
    number = Math.ceil(99 * Math.random());
  }
  storeValue(number);

  const spelling = numberToPureKoreanHangeul(number);

  return {
    value: number,
    prompt: String(number),
    answer: spelling,
    mode: "pure-korean-1-99"
  };
}

/**
 * Generates a random pure Korean number card
 * @returns {Object} Card object with prompt, answer, and mode
 */
export function getRandomSinoKorean100Card(previousCard) {
  let number = previousCard.value;
  while (number == previousCard.value || isInLastFive(number)){
    number = Math.floor(101 * Math.random());
  }
  storeValue(number);

  const spelling = numberToSinoKoreanHangeul(number);

  return {
    value: number,
    prompt: String(number),
    answer: spelling,
    mode: "sino-korean-0-100"
  };
}

/**
 * Generates a random pure Korean number card
 * @returns {Object} Card object with prompt, answer, and mode
 */
export function getRandomSinoKorean10000000Card(previousCard) {
  // Note this approach is designed to give numbers of different lengths.
  // Just choosing a random number up to 9,999,999 will usually give you
  // a very large number, but practice with thousands and 10's of thousands
  // is important too.

  // The final number of digits will be 3 - 7 (100-9,000,000)
  const ten_exp = 3 + Math.ceil( 4 * Math.random() );
  // Less significant figures: large numbers typically have trailing zeros
  const sig_figs = ten_exp - Math.floor( ten_exp * Math.random() );
  // Generate the random significant figures (dropping the decimals)
  let number = Math.floor( 10**sig_figs * Math.random() );
  // Shift left
  number *= 10 ** (ten_exp - sig_figs);
  const spelling = numberToSinoKoreanHangeul(number);

  return {
    value: number,
    prompt: number.toLocaleString('en-US'),
    answer: spelling,
    mode: "sino-korean-100-10m",
    longAnswers: true
  };
}

/**
 * Generates a date card with Korean spelling
 * @returns {Object} Card object with prompt, answer, and mode
 */
export function getRandomDateCard(_previousCard) {
  let date = new Date(
    1980 + Math.floor(Math.random()*50),
    Math.floor(Math.random()*12),
    Math.floor(Math.random()*31),
  );
  let mode = "full";
  let options = { year: 'numeric', month: 'long', day: 'numeric' };
  if (Math.random() < 0.15){
    // Test just "January 2026"
    options = { year: 'numeric', month: 'long'};
    mode = "year-month";
  }
  if (Math.random() < 0.15){
    // Test just "May 31"
    options = { month: 'long', day: 'numeric' };
    mode = "month-day";
  }
  const dateString = date.toLocaleDateString("en-US", options);

  const koreanSpelling = dateToKoreanSpelling(date, mode);

  return {
    value: date,
    prompt: dateString,
    answer: koreanSpelling,
    mode: "date-korean",
    longAnswers: true
  };
}

/**
 * Generates a random time card with Korean spelling
 * @returns {Object} Card object with prompt, answer, and mode
 */
export function getRandomTimeCard(_previousCard) {
  const date = new Date();
  const hours = Math.floor(Math.random() * 24);
  let minutes = Math.floor(Math.random() * 60);
  if (Math.random()<0.8){
    // prefer rounded 5 minute intervals for the minutes
    minutes = 5 * Math.floor(Math.random() * 12);
  }
  date.setHours(hours, minutes, 0, 0);
  const koreanSpelling = timeToKoreanSpelling(date);
  const timeString = date.toLocaleTimeString("en-US", {hour:"numeric", minute:'2-digit'});

  return {
    value: date,
    prompt: timeString,
    answer: koreanSpelling,
    mode: "time-korean",
    longAnswers: true
  };
}

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const kWeekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

/**
 * Generates a random weekday card
 * @returns {Object} Card object with prompt, answer, and mode
 */
export function getRandomWeekdayCard(previousCard) {
  let number = previousCard.value;
  while (number == previousCard.value || isInLastFive(number)){
    number = Math.floor(7 * Math.random());
  }
  storeValue(number);

  return {
    value: number,
    prompt: weekdays[number],
    answer: kWeekdays[number],
    mode: "weekdays"
  };
}

const colors = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "brown",
  "grey",
  "black",
  "white",
  "navy blue",
  "sky blue"
];

const kColors = [
  "빨간색",
  "주황색",
  "노란색 / 황색",
  "초록색 / 녹색",
  "파란색",
  "보라색",
  "분홍색",
  "갈색",
  "회색",
  "검정색 / 까만색 / 검(은)",
  "흰색 / 하얀색",
  "남색",
  "하늘색"
];

/**
 * Generates a random colour card
 * @param {Object} previousCard 
 * @returns {Object} Card object with prompt, answer, and mode
 */
export function getRandomColourCard(previousCard) {
  let number = previousCard.value;
  while (number == previousCard.value || isInLastFive(number)){
    number = Math.floor(colors.length * Math.random());
  }
  storeValue(number);

  return {
    value: number,
    prompt: colors[number],
    answer: kColors[number],
    mode: "colours",
    longAnswers: true
  };
}

/**
 * Generates a random count-word card
 * @param {Object} previousCard 
 * @returns {Object} Card object with prompt, answer, and mode
 */
export function getRandomCountWordACard(previousCard){
  let number = previousCard.value;
  let countWordInfo, example;
  while (number == previousCard.value || isInLastFive(number)){
    // The countWords list index will be multiplied x 10
    const listIndex = Math.floor(koreanCountersA.length * Math.random());
    countWordInfo = koreanCountersA[listIndex];
    // 1's digit will be the example for the word
    const exampleIndex = Math.floor(countWordInfo.englishExamples.length * Math.random());
    example = countWordInfo.englishExamples[exampleIndex];
    number = listIndex * 10 + exampleIndex; // this assumes no more than 10 examples - right now they only have 1 or 2
  }

  const amount = Math.floor(1 + 9*Math.random());

  const prompt = `${amount} ${amount == 1 ? example.singular : example.plural}`;
  
  let answer = example.korean ? `${example.korean} ` : "";
  const answerAmount = (countWordInfo.numeralType=="native") ?
    numberToPureKoreanHangeul(amount, true) :
    numberToSinoKoreanHangeul(amount) ;
  answer += `${answerAmount} ${countWordInfo.korean}`

  return {
    value: number,
    prompt: prompt,
    answer: answer,
    mode: "countWordsA",
    longAnswers: true
  };
}

const kDayDurations = [
  "하루",
  "이틀",
  "사흘",
  "나흘",
  "닷새",
  "엿새",
  "이레",
  "여드레",
  "아흐레",
  "열흘"
];

const dayDurations = [
  "one day",
  "two days",
  "three days",
  "four days",
  "five days",
  "six days",
  "seven days",
  "eight days",
  "nine days",
  "ten days"
];

/**
 * Generates a random day duration word card
 * @param {Object} previousCard 
 * @returns {Object} Card object with prompt, answer, and mode
 */
export function getRandomDayDurationWordCard(previousCard) {
  let number = previousCard.value;
  while (number == previousCard.value || isInLastFive(number)){
    number = Math.floor(dayDurations.length * Math.random());
  }
  storeValue(number);

  return {
    value: number,
    prompt: dayDurations[number],
    answer: kDayDurations[number],
    mode: "day-durations",
    longAnswers: true
  };
}
