# TEST 홈페이지

ChatGPT에서 영감을 받은 밝고 간결한 화면에 **오늘의 날씨**와 **랜덤 명언**만 구성한 반응형 웹사이트입니다. OpenAI와 제휴한 서비스가 아닙니다.

## 실행

Node.js 20 이상에서 프로젝트 폴더를 열고 실행합니다. 외부 패키지 설치나 API 키는 필요하지 않습니다.

```sh
npm run dev
```

브라우저: http://127.0.0.1:5173

HTML 파일을 더블클릭하는 대신 로컬 서버로 실행하세요. JavaScript 모듈은 `file://`에서 제한됩니다. 서버 종료: 터미널에서 Ctrl+C.

```sh
npm run check
```

구문 검사, 핵심 동작 테스트, 배포 파일 생성을 실행합니다. `npm run build`는 `public/`을 `dist/`로 복사합니다.

## 기능

- 서울 기본 날씨, 7개 도시 선택, 수동 새로고침.
- 사용자 클릭 및 위치 권한 허용 후 현재 위치의 날씨. 좌표는 Open-Meteo로 전송되며 앱에 저장되지 않습니다. 위치 기능은 HTTPS 또는 localhost에서 동작합니다.
- 현재 기온·날씨, 오늘의 최저/최고, 체감 온도, 습도, 일별 최대 강수 확률. API가 반환한 현지 시간대 표시.
- 로딩, 요청 시간 초과, API 실패, 위치 권한 거부 안내. 오류 시 가짜 날씨를 표시하지 않습니다.
- 10개 명언 중 무작위 선택. 직전 명언은 연속으로 나오지 않습니다.
- 모바일 레이아웃, 키보드 포커스, 스크린리더 알림, 모션 감소 설정 대응.

## GitHub 업로드 준비

이 폴더의 파일을 새 저장소 루트에 업로드합니다. 기존 저장소의 하위 폴더로 올린다면 Vercel의 Root Directory를 `테스트 홈페이지`로 지정하세요.

Git을 사용하는 경우 이 폴더에서 다음을 실행합니다. `<저장소-URL>`을 본인 저장소 주소로 바꾸세요.

```sh
git init
git add .
git commit -m "Create TEST homepage"
git branch -M main
git remote add origin <저장소-URL>
git push -u origin main
```

`dist/`는 빌드 결과이므로 GitHub에 올리지 않아도 됩니다. 소스는 `public/`, 빌드 및 로컬 서버는 `scripts/`에 있습니다. 아직 Git 초기화, 업로드, 배포는 실행하지 않았습니다.

## Vercel 배포 직전 설정

1. GitHub 저장소를 Vercel의 새 프로젝트로 연결합니다.
2. 프로젝트 루트는 이 폴더로 지정합니다.
3. Framework Preset: **Other**.
4. Build Command: `npm run build`, Output Directory: `dist`.
5. 환경 변수는 필요하지 않습니다. `vercel.json`에 빌드 설정과 기본 보안 헤더를 준비했습니다.
6. 검토 후 본인이 Deploy를 누르면 됩니다. 연결 및 Deploy는 아직 수행하지 않았습니다.

날씨 조회와 명언만 제공하므로 Firebase, 데이터베이스, 로그인 서버는 필요하지 않습니다. 이후 사용자 계정이나 데이터 저장이 필요할 때 추가할 수 있습니다.

## 데이터 및 수정

날씨: [Open-Meteo 공식 문서](https://open-meteo.com/en/docs). 테스트·비상업 용도의 공개 API를 이용합니다. 실제 수치 대신 예측 모델 기반 현재 날씨이며 외부 API 장애 시 조회가 불가능합니다. 상업 서비스 전환 시 [이용 조건과 요금](https://open-meteo.com/en/pricing)을 확인하세요. 데이터 출처는 화면 하단에 표시합니다.

명언: `public/content.js`에서 수정합니다. 고전 구절의 한국어 의역이며 번역문을 직접 인용하지 않습니다. 원전: 도덕경 33·64장, 논어 학이 1·위정 17·술이 22, 에픽테토스 엥케이리디온 5, 명상록 7.67·10.16, 세네카 인생의 짧음에 대하여 1.3.

디자인: `public/styles.css`. 문구·구조: `public/index.html`. 날씨·명언 동작: `public/app.js`.

배포 설정 참고: [Vercel 공식 문서](https://vercel.com/docs/project-configuration).
