// modes.js - Single source of truth for available practice modes

import { 
  getRandomPureKoreanCard, 
  getRandomSinoKorean100Card, 
  getRandomSinoKorean10000000Card, 
  getRandomDateCard, 
  getRandomTimeCard,
  getRandomWeekdayCard,
  getRandomColourCard,
  getRandomCountWordACard,
  getRandomDayDurationWordCard
} from './cardStrategies.js';

export const modes = [
  {
    id: 'pure-korean-1-99',
    label: 'Pure Korean 1–99',
    enabled: true,
    strategy: getRandomPureKoreanCard
  },
  {
    id: 'sino-korean-0-100',
    label: 'Sino-Korean 0–100',
    enabled: true,
    strategy: getRandomSinoKorean100Card
  },
  {
    id: 'sino-korean-100-10m',
    label: 'Sino-Korean 100–10M',
    enabled: true,
    strategy: getRandomSinoKorean10000000Card
  },
  {
    id: 'dates',
    label: 'Dates',
    enabled: true,
    strategy: getRandomDateCard
  },
  {
    id: 'times',
    label: 'Times',
    enabled: true,
    strategy: getRandomTimeCard
  },
  {
    id: 'weekdays',
    label: 'Weekdays',
    enabled: true,
    strategy: getRandomWeekdayCard
  },
  {
    id: 'colours',
    label: 'Colours',
    enabled: true,
    strategy: getRandomColourCard
  },
  {
    id: 'count-words',
    label: 'Count Words - Common',
    enabled: true,
    strategy: getRandomCountWordACard
  },
  {
    id: 'day-duration-words',
    label: 'Day Duration Words',
    enabled: true,
    strategy: getRandomDayDurationWordCard
  },
];