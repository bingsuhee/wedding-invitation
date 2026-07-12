# 웨딩 청첩장 프로젝트

모바일 중심으로 감상하는 웨딩 청첩장 프로젝트입니다.

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
│  ├─ history.html
│  └─ index.html
├─ shared/
│  ├─ data/
│  │  └─ info.js
│  └─ public/
├─ project_report.html
├─ requirements.txt
├─ vite.config.js
└─ package.json
```

## 데이터 관리 방식

- 웨딩 정보는 `shared/data/info.js`에서 관리합니다.
- 각 콘셉트는 공통 데이터를 불러오되, 화면 구성과 연출 방식만 다르게 표현합니다.
- 현재 콘셉트 구성에는 스크롤형 청첩장 레이아웃과 아이폰 홈 화면처럼 앱을 선택해 내용을 전환하는 모바일형 레이아웃이 포함되어 있습니다.
- 공유 메타 제목과 설명은 빌드 시 `shared/data/info.js`에서 생성되어 HTML에 주입됩니다.
- 공유 메타의 절대 URL은 기본 GitHub Pages 주소를 사용하며, 다른 도메인에서는 `VITE_SITE_URL`로 재정의할 수 있습니다.

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
