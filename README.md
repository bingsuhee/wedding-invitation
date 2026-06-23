# 웨딩 청첩장 프로젝트

모바일 중심의 웨딩 청첩장 사이트 프로젝트입니다.

## 기술 스택

- React 19
- Vite 7
- Tailwind CSS v4
- Framer Motion
- Supabase
- react-kakao-maps-sdk

## 프로젝트 구조

```text
wedding-invitation/
├─ <concept>/
│  ├─ public/
│  ├─ src/
│  │  ├─ App.jsx
│  │  ├─ index.css
│  │  └─ components/
│  └─ history.html
├─ shared/
│  ├─ data/
│  │  └─ info.js
│  └─ public/
├─ project_report.html
├─ requirements.txt
├─ vite.config.js
└─ package.json
```

## 데이터 관리 원칙

- 웨딩 정보는 `shared/data/info.js`에서 관리합니다.
- 각 콘셉트는 공통 데이터를 불러와 화면 표현만 다르게 구성합니다.
- 최근 `cookierun` 콘셉트에는 상단 이름 강조, 소개 밑줄 제거, 더 단정해진 타이틀 브러시 배경, 카드형 `우리의 이야기`와 `갤러리` 재노출, 주요 섹션 재정렬이 반영되었습니다.

## 실행 방법

```bash
npm install
npm run dev
```

## 빌드 방법

```bash
npm run build
```

특정 콘셉트를 지정해 빌드할 때는 환경 변수 `CONCEPT`를 사용합니다.
