import test from 'node:test';
import assert from 'node:assert/strict';
import { quotes, pickQuoteIndex, weatherDescription, forecastUrl, cities } from '../public/content.js';
test('Every quote can be selected, excluding the current quote', () => {
  for (let previous = 0; previous < quotes.length; previous++) {
    const results = new Set();
    for (let i = 0; i < quotes.length - 1; i++) results.add(pickQuoteIndex(previous, () => (i + .5) / (quotes.length - 1)));
    assert.equal(results.size, quotes.length - 1);
    assert.equal(results.has(previous), false);
  }
});
test('WMO precipitation codes and night skies display correct conditions', () => {
  for (const code of [61, 63, 65, 66, 67, 80, 81, 82]) assert.equal(weatherDescription(code).label, '비');
  for (const code of [71, 73, 75, 77, 85, 86]) assert.equal(weatherDescription(code).label, '눈');
  assert.equal(weatherDescription(0, false).symbol, '🌙');
  assert.equal(weatherDescription(999).label, '날씨 정보 없음');
});
test('Weather requests use the selected coordinates and local daily forecast', () => {
  const url = forecastUrl(cities.busan);
  assert.equal(url.protocol, 'https:');
  assert.equal(url.searchParams.get('latitude'), String(cities.busan.latitude));
  assert.equal(url.searchParams.get('timezone'), 'auto');
  assert.equal(url.searchParams.get('forecast_days'), '1');
  assert.match(url.searchParams.get('daily'), /precipitation_probability_max/);
});
