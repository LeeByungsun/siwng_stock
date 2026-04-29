# 웹서비스 구조

## 목표
- 현재 대시보드 구현을 유지보수 가능한 웹서비스 구조로 전환한다.
- 초기 서비스 범위는 미국 주식 티커 기반 시세 조회와 기술적 지표 기반 시그널 대시보드다.

## 제안 스택
- Frontend: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- Chart: Lightweight Charts
- Server layer: Next.js Route Handler
- Test: Vitest 또는 Jest

선정 이유:
- 현재 HTML 프로토타입을 컴포넌트 단위로 옮기기 쉽다.
- 서버에서 외부 시세 API를 중계해 CORS와 키 노출 문제를 줄일 수 있다.
- 이후 회원 기능, 관심종목, 알림 기능 확장이 쉽다.

## 서비스 레이어 구조
1. Presentation
   - 사용자 화면
   - 입력 폼
   - 카드, 차트, 배지, 상태 메시지

2. Application
   - 티커 조회 흐름 제어
   - 자동 새로고침
   - 에러 상태 전환
   - 로딩 상태 전환

3. Domain
   - 캔들 데이터 모델
   - 지표 계산
   - 시그널 점수 계산
   - 레벨/문구 매핑

4. Infrastructure
   - 외부 시세 API 호출
   - 응답 정규화
   - fallback mock 데이터
   - 캐시 정책

## 추천 디렉터리 구조
```text
app/
  page.tsx                     # 기본 대시보드
  layout.tsx
  api/
    market/
      [ticker]/route.ts        # 시세 조회 API

components/
  dashboard/
    dashboard-page.tsx
    header-search.tsx
    ticker-summary.tsx
    signal-card.tsx
    signal-meter.tsx
    indicator-cards.tsx
    price-chart.tsx
    disclaimer-banner.tsx
    fetch-status.tsx

lib/
  market/
    fetch-market-data.ts       # 외부 API 호출
    normalize-market-data.ts   # 응답 정규화
    mock-market-data.ts        # fallback 생성
    market.types.ts
  indicators/
    sma.ts
    ema.ts
    rsi.ts
    bollinger.ts
    macd.ts
    volume.ts
    index.ts
  signals/
    score-signal.ts
    map-signal-level.ts
    signal.types.ts
  format/
    price.ts
    number.ts
    date.ts
  constants/
    market.ts
    ui.ts

hooks/
  use-ticker-dashboard.ts      # 조회, 로딩, 자동 갱신 제어
  use-auto-refresh.ts

public/
  images/

docs/
  web-service-structure.md
  functional-spec.md
```

## 주요 컴포넌트 책임
- `header-search`
  - 티커 입력
  - 조회 버튼
  - Enter 입력 처리

- `ticker-summary`
  - 티커명
  - 현재가
  - 등락액, 등락률
  - 마지막 갱신 시각

- `signal-card`
  - 시그널 배지
  - 점수
  - RSI/MA/볼린저 해석 문구

- `signal-meter`
  - 1~5 단계 시각화
  - 활성 레벨 강조

- `indicator-cards`
  - RSI
  - MACD
  - Signal/Histo
  - 평균 거래량

- `price-chart`
  - 캔들
  - MA20
  - MA50
  - 볼린저 상단/하단
  - 거래량 히스토그램

- `disclaimer-banner`
  - 투자 유의문구
  
## 데이터 흐름
1. 사용자가 티커 입력
2. 클라이언트가 `/api/market/[ticker]` 호출
3. 서버가 외부 시세 API 호출
4. 서버가 캔들 데이터 정규화
5. 실패 시 mock fallback 생성
6. 클라이언트가 지표 계산 또는 서버 계산 결과 수신
7. 시그널 엔진이 점수와 레벨 계산
8. UI가 카드와 차트를 갱신
9. 60초 주기로 자동 재조회

## API 초안
### GET `/api/market/[ticker]`
응답 예시:
```json
{
  "ticker": "AAPL",
  "source": "Yahoo Finance",
  "fallback": false,
  "fetchedAt": "2026-04-29T06:00:00.000Z",
  "data": [
    {
      "time": 1714348800,
      "open": 210.12,
      "high": 212.20,
      "low": 209.75,
      "close": 211.84,
      "volume": 53200000
    }
  ]
}
```

에러 응답 예시:
```json
{
  "ticker": "AAPL",
  "source": "Mock Fallback",
  "fallback": true,
  "error": "Yahoo Finance fetch failed",
  "fetchedAt": "2026-04-29T06:00:00.000Z",
  "data": []
}
```

## 상태 모델
- `idle`
- `loading`
- `success`
- `fallback`
- `error`

각 상태에서 보여줄 것:
- `loading`: 조회 중 메시지, 버튼 비활성화
- `success`: 정상 데이터와 소스 표시
- `fallback`: fallback 안내와 원본 실패 사유 표시
- `error`: 데이터 부족 또는 초기화 오류 표시

## 도메인 모델
### Candle
- `time`
- `open`
- `high`
- `low`
- `close`
- `volume`

### SignalResult
- `text`
- `score`
- `level`
- `rsiCondition`
- `maCondition`
- `bbCondition`
- `tone`

## 이후 확장 구조
- `/watchlist`
  - 관심 티커 저장
- `/about-signal`
  - 지표 설명
- `/settings`
  - 새로고침 주기
  - 기본 티커
  - 표시 지표 on/off
- `/news`
  - 관련 뉴스 요약

## 1차 MVP 범위
- 단일 대시보드 페이지
- 티커 조회
- 외부 시세 조회 + fallback
- 지표 계산
- 시그널 배지와 레벨 미터
- 차트 렌더링
- 자동 새로고침
- 유의문구 노출

## 제외 범위
- 로그인
- 결제
- 실거래 연동
- 푸시 알림
- 사용자별 포트폴리오
- 투자 자문성 추천 기능
