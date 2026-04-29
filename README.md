# swing

기준 HTML 프로토타입을 웹서비스로 옮기는 프로젝트입니다.

## 구조
- `web/`
  - 실제 실행되는 Next.js 웹앱
- `docs/`
  - 기획, 구조, 기능명세, 작업 계획 문서
- `AGENTS.md`
  - 이 프로젝트 작업 규칙
- `skills.md`
  - 이 프로젝트에서 반복 사용할 작업 스킬 메모

## 실행
```bash
cd web
npm install
npm run dev
```

## 주요 명령어
```bash
cd web
npm run lint
npm run typecheck
npm test
npm run build
```

## docs에는 무엇이 들어가나
`docs/`는 실행 코드가 아니라,
프로젝트를 이해하고 안전하게 바꾸기 위한 문서를 두는 곳입니다.

현재 문서:
- `docs/web-service-structure.md`
  - 웹서비스 폴더 구조와 계층 구조
- `docs/functional-spec.md`
  - 기능 명세
- `docs/cleanup-plan-web-move.md`
  - 웹 코드를 `web/`로 옮긴 정리 계획

앞으로 넣기 좋은 문서:
- 요구사항 정리
- API 명세
- 지표 계산 규칙
- 시그널 점수 규칙
- 배포 체크리스트
- 리팩터 계획
- 장애/이슈 메모

## 문서 배치 기준
- 실행되는 코드: `web/`
- 프로젝트 규칙/기획/명세/계획: `docs/`

## 현재 상태
- 웹앱 실행 코드는 `web/`에 정리됨
- 루트는 문서와 기준 파일 중심으로 유지됨
