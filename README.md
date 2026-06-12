# 웨딩 청첩장 프로젝트

디지털 모바일 청첩장 웹사이트.

---

## 기술 스택

- **React 19** + **Vite 7**
- **Tailwind CSS v4** (PostCSS 방식)
- **Framer Motion** — 스크롤 애니메이션
- **Supabase** — 방명록 백엔드 (실시간 CRUD)
- **react-kakao-maps-sdk** — 카카오맵 지도 표시
- **Lucide React** — 아이콘
- **Pretendard** + **Dancing Script** + **NanumGaRamYeonGgoc** — 폰트

---

## 프로젝트 구조

```
wedding-invitation/
├── <concept>/                  # 컨셉 디렉토리 (예: classic, b 등)
│   ├── index.html              # HTML 엔트리 (Kakao Maps SDK 스크립트 포함)
│   ├── public/                 # 컨셉 고유 정적 파일 (공통 에셋은 shared/public/ 사용)
│   └── src/
│       ├── App.jsx             # 메인 컴포넌트 (대부분의 섹션 포함)
│       ├── main.jsx            # React 렌더링 엔트리
│       ├── index.css           # 글로벌 스타일 + 유틸리티 클래스
│       ├── lib/
│       │   └── supabaseClient.js
│       └── components/
│           ├── Guestbook.jsx   # 방명록 (Supabase 연동, 페이지 크기 10)
│           ├── Map.jsx         # 지도 + 대중교통 안내
│           ├── ScrollAnimationWrapper.jsx
│           └── ...             # 기타 컴포넌트
├── shared/
│   ├── data/
│   │   └── info.js             # 웨딩 데이터 — 모든 컨셉 공통 사용 (@shared alias)
│   └── public/                 # 모든 컨셉 공통 정적 에셋 (vite.config.js publicDir)
│       ├── images/             # 갤러리, 러브스토리, 일러스트, 장소 사진
│       ├── fonts/              # 로컬 폰트 파일
│       └── videos/             # 인트로 영상
├── .github/workflows/
│   └── deploy.yml              # GitHub Pages 자동 배포 (main 브랜치 push 시 트리거)
├── vite.config.js              # 멀티 컨셉 빌드 설정 (@shared alias 포함)
├── package.json                # 루트 패키지 (scripts: dev, build, lint)
├── redirect.html               # 루트 → 컨셉 디렉토리 리다이렉트
└── .env.example                # 필요한 환경변수 목록
```

---

## 환경변수

`.env` 파일을 루트에 생성하고 아래 값을 설정해야 한다.

```
VITE_SUPABASE_URL=        # Supabase 프로젝트 URL
VITE_SUPABASE_ANON_KEY=   # Supabase anon key
VITE_KAKAO_MAP_KEY=       # Kakao Developers 앱 키 (JavaScript 키)
```

GitHub Actions 배포 시에는 Repository Secrets에 동일한 이름으로 등록되어 있어야 한다.

---

## 개발 서버 실행

```bash
npm install
npm run dev
```

빌드:
```bash
npm run build                      # vite.config.js 기본값 컨셉 빌드
CONCEPT=<concept> npm run build    # 명시적 컨셉 지정
```

---

## 멀티 컨셉 아키텍처

`vite.config.js`는 `CONCEPT` 환경변수로 빌드 대상 디렉토리를 결정한다.
새 디자인 컨셉을 추가하려면:
1. 루트에 새 디렉토리를 생성하고 기존 컨셉과 같은 내부 구조로 구성
2. 웨딩 데이터는 `shared/data/info.js`를 `@shared/data/info`로 임포트해 공통 사용
3. `redirect.html`에 분기 조건 한 줄 추가 (파일 내 주석 참고)
4. GitHub Actions가 `index.html`이 있는 모든 디렉토리를 자동으로 빌드함

---

## 배포

`main` 브랜치에 push하면 GitHub Actions(`.github/workflows/deploy.yml`)가 자동으로:
1. 모든 컨셉 디렉토리 빌드 → `dist/<concept>/`
2. `redirect.html` → `dist/index.html` 복사
3. GitHub Pages에 배포

---

## 주요 섹션 (App.jsx 렌더링 순서)

1. **인트로 오버레이** — 타이핑 애니메이션으로 이름 표시, 자동 사라짐
2. **히어로** — 메인 커플 사진
3. **인사말** — 청첩 메시지 + 참석 의사 전달 버튼
4. **우리의 소개** — 신랑·신부 프로필 카드
5. **예식 안내** — 달력, D-day 카운트다운
6. **우리의 이야기** — 러브스토리 폴라로이드 그리드
7. **갤러리** — 3열 그리드, 클릭 시 전체화면 라이트박스
8. **안내사항** — 신부대기실/연회장 탭 + 이미지
9. **오시는 길** — 카카오맵 + 티맵/네이버/카카오 네비 링크 + 대중교통 안내
10. **마음 전하실 곳** — 계좌번호 아코디언 (신랑측/신부측)
11. **방명록** — Supabase 실시간 메시지
12. **RSVP** — 참석 의사 전달 모달

---

## 디자인 시스템

- **배경색**: `#ece8e2` (따뜻한 베이지)
- **최대 너비**: `480px` (모바일 퍼스트)
- **주요 유틸 클래스** (`index.css`에 정의됨):
  - `.soft-card` — 연한 카드 배경
  - `.soft-card-strong` — 강조 카드 (흰 배경 + 그림자)
  - `.soft-chip` — 태그/버튼 스타일
  - `.soft-input` — 입력 필드 스타일
  - `.point-text` — 포인트 폰트(나눔가람연꽃) 적용
  - `.section-block` — 섹션 공통 패딩/레이아웃
