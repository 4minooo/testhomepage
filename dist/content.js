export const cities = {
  seoul: { name: '서울', latitude: 37.5665, longitude: 126.978 },
  busan: { name: '부산', latitude: 35.1796, longitude: 129.0756 },
  incheon: { name: '인천', latitude: 37.4563, longitude: 126.7052 },
  daegu: { name: '대구', latitude: 35.8714, longitude: 128.6014 },
  daejeon: { name: '대전', latitude: 36.3504, longitude: 127.3845 },
  gwangju: { name: '광주', latitude: 35.1595, longitude: 126.8526 },
  jeju: { name: '제주', latitude: 33.4996, longitude: 126.5312 },
};

// 저작권이 만료된 고전의 구절을 의역. 원전 위치는 README에 기록.
export const quotes = [
  { text: '천 리 길도\n한 걸음에서 시작된다.', author: '노자' },
  { text: '세 사람이 함께 길을 걸으면,\n그중에는 반드시 나의 스승이 있다.', author: '공자' },
  { text: '배우고 때때로 익히면,\n이 또한 기쁘지 않은가.', author: '공자' },
  { text: '아는 것을 안다고 하고,\n모르는 것을 모른다고 하는 것이 앎이다.', author: '공자' },
  { text: '남을 아는 것은 지혜이고,\n자신을 아는 것은 밝음이다.', author: '노자' },
  { text: '가진 것에 만족하는 사람이\n풍요로운 사람이다.', author: '노자' },
  { text: '우리를 괴롭히는 것은 사건이 아니라,\n사건을 바라보는 우리의 생각이다.', author: '에픽테토스' },
  { text: '좋은 사람이 무엇인지 논하기를 멈추고,\n좋은 사람이 되어라.', author: '마르쿠스 아우렐리우스' },
  { text: '행복한 삶에는\n아주 적은 것이 필요하다.', author: '마르쿠스 아우렐리우스' },
  { text: '시간이 부족한 것이 아니라,\n우리가 많은 시간을 흘려보내는 것이다.', author: '세네카' },
];

export function pickQuoteIndex(previous = -1, random = Math.random) {
  if (previous < 0 || previous >= quotes.length) return Math.floor(random() * quotes.length);
  const index = Math.floor(random() * (quotes.length - 1));
  return index >= previous ? index + 1 : index;
}

export function weatherDescription(code, isDay = true) {
  if (code === 0) return { label: '맑음', symbol: isDay ? '☀️' : '🌙' };
  if (code === 1 || code === 2) return { label: '구름 조금', symbol: isDay ? '🌤️' : '☁️' };
  if (code === 3) return { label: '흐림', symbol: '☁️' };
  if ([45, 48].includes(code)) return { label: '안개', symbol: '🌫️' };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: '이슬비', symbol: '🌧️' };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: '비', symbol: '🌧️' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: '눈', symbol: '🌨️' };
  if ([95, 96, 99].includes(code)) return { label: '뇌우', symbol: '⛈️' };
  return { label: '날씨 정보 없음', symbol: '🌡️' };
}

export function forecastUrl(location) {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.search = new URLSearchParams({
    latitude: location.latitude, longitude: location.longitude,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto', forecast_days: '1', wind_speed_unit: 'ms',
  });
  return url;
}
