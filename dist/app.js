import { cities, quotes, pickQuoteIndex, weatherDescription, forecastUrl } from './content.js';

const $ = (id) => document.getElementById(id);
const citySelect = $('city');
let currentLocation = cities.seoul;
let deviceLocation;
let quoteIndex = -1;
let weatherController;
let locating = false;

function updateDate() {
  const now = new Date();
  $('header-date').dateTime = now.toISOString();
  $('header-date').textContent = new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' }).format(now);
}
updateDate();
setInterval(updateDate, 60000);

function showQuote() {
  quoteIndex = pickQuoteIndex(quoteIndex);
  $('quote-text').textContent = quotes[quoteIndex].text;
  $('quote-author').textContent = quotes[quoteIndex].author;
  const container = document.querySelector('.quote-content');
  container.classList.remove('changed');
  void container.offsetWidth;
  container.classList.add('changed');
}
$('new-quote').addEventListener('click', showQuote);
showQuote();

const number = (value, suffix = '') => Number.isFinite(value) ? `${Math.round(value)}${suffix}` : '—';

function showError(message, detail) {
  const container = document.createElement('div');
  container.className = 'weather-error';
  const heading = document.createElement('p');
  heading.textContent = message;
  const description = document.createElement('span');
  description.textContent = detail;
  container.append(heading, description);
  $('weather-result').replaceChildren(container);
  $('weather-updated').textContent = '날씨를 불러오지 못했습니다';
}

function renderWeather(data, location) {
  if (!data.current || !data.daily || !Number.isFinite(data.current.temperature_2m)) throw new Error('Invalid forecast');
  const current = data.current;
  const daily = data.daily;
  const weather = weatherDescription(current.weather_code, current.is_day === 1);
  const main = document.createElement('div');
  main.className = 'weather-main';
  const summary = document.createElement('div');
  const temperature = document.createElement('div');
  temperature.className = 'temperature';
  temperature.textContent = number(current.temperature_2m);
  const unit = document.createElement('small');
  unit.textContent = '°C';
  temperature.append(unit);
  const description = document.createElement('p');
  description.className = 'weather-description';
  description.textContent = `${location.name} · ${weather.label}`;
  summary.append(temperature, description);
  const symbol = document.createElement('span');
  symbol.className = 'weather-symbol';
  symbol.setAttribute('aria-hidden', 'true');
  symbol.textContent = weather.symbol;
  main.append(summary, symbol);
  const details = document.createElement('dl');
  details.className = 'weather-details';
  const values = [
    ['최저 / 최고', `${number(daily.temperature_2m_min?.[0], '°')} / ${number(daily.temperature_2m_max?.[0], '°')}`],
    ['체감 온도', number(current.apparent_temperature, '°C')],
    ['습도', number(current.relative_humidity_2m, '%')],
    ['강수 확률', number(daily.precipitation_probability_max?.[0], '%')],
  ];
  for (const [label, value] of values) {
    const group = document.createElement('div');
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = label;
    dd.textContent = value;
    group.append(dt, dd);
    details.append(group);
  }
  $('weather-result').replaceChildren(main, details);
  const observedTime = current.time?.split('T')[1]?.slice(0, 5);
  $('weather-updated').textContent = `${observedTime ? `${observedTime} 기준 · ` : ''}${data.timezone || '현지 시간'} · 오늘의 예보`;
}

async function loadWeather(location = currentLocation) {
  weatherController?.abort();
  const controller = new AbortController();
  weatherController = controller;
  currentLocation = location;
  $('weather').setAttribute('aria-busy', 'true');
  $('refresh-weather').disabled = true;
  $('weather-result').textContent = '';
  const loading = document.createElement('div');
  loading.className = 'weather-loading';
  loading.textContent = `${location.name} 날씨를 불러오는 중입니다…`;
  $('weather-result').append(loading);
  $('weather-updated').textContent = '현재 날씨 · 오늘의 예보';
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(forecastUrl(location), { signal: controller.signal });
    if (!response.ok) throw new Error(`Weather HTTP ${response.status}`);
    const data = await response.json();
    if (weatherController !== controller) return;
    renderWeather(data, location);
  } catch {
    if (weatherController !== controller) return;
    showError('날씨를 불러오지 못했어요.', '인터넷 연결을 확인한 후, 오른쪽 위 새로고침 버튼을 눌러 주세요.');
  } finally {
    clearTimeout(timeout);
    if (weatherController === controller) {
      $('weather').setAttribute('aria-busy', 'false');
      $('refresh-weather').disabled = locating;
    }
  }
}

citySelect.addEventListener('change', () => loadWeather(cities[citySelect.value] || deviceLocation));
$('refresh-weather').addEventListener('click', () => loadWeather());
$('my-location').addEventListener('click', () => {
  if (!navigator.geolocation) {
    showError('이 브라우저는 위치 기능을 지원하지 않아요.', '목록에서 도시를 선택해 주세요.');
    return;
  }
  locating = true;
  $('my-location').disabled = true;
  $('my-location').textContent = '위치 확인 중…';
  citySelect.disabled = true;
  $('refresh-weather').disabled = true;
  const finish = () => {
    locating = false;
    $('my-location').disabled = false;
    $('my-location').textContent = '⌖ 내 위치';
    citySelect.disabled = false;
    $('refresh-weather').disabled = $('weather').getAttribute('aria-busy') === 'true';
  };
  navigator.geolocation.getCurrentPosition((position) => {
    let option = citySelect.querySelector('[value="current"]');
    if (!option) {
      option = new Option('현재 위치', 'current');
      citySelect.add(option);
    }
    citySelect.value = 'current';
    const location = { name: '현재 위치', latitude: position.coords.latitude, longitude: position.coords.longitude };
    deviceLocation = location;
    finish();
    loadWeather(location);
  }, (error) => {
    // 진행 중인 도시 응답이 위치 오류 메시지를 덮지 않도록 취소.
    weatherController?.abort();
    weatherController = null;
    $('weather').setAttribute('aria-busy', 'false');
    finish();
    showError(error.code === 1 ? '위치 접근이 허용되지 않았어요.' : '현재 위치를 확인하지 못했어요.', '도시를 선택하거나, 브라우저에서 위치 권한을 허용한 후 다시 시도해 주세요.');
  }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
});

loadWeather();
