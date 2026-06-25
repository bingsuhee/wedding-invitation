# AI 작업 지침

## 빌드 검증 원칙

- 코드 수정 후에는 반드시 `npm run build`로 빌드를 실행해 오류 없이 완료되는지 확인한다.
- 빌드 오류가 발생하면 원인을 파악하고 수정한 뒤 다시 빌드가 통과될 때까지 반복한다.

## README.md 참조 및 유지

- 매 요청 시작 시 `README.md`를 읽고 프로젝트 구조와 맥락을 파악한다.
- 작업 결과로 프로젝트 구조, 기술 스택, 주요 파일, 설계 방식 등에 변경이 생기면 작업 완료 후 `README.md`를 갱신한다.
- `README.md`에는 프로젝트 설명만 기재한다. AI 작업 지침은 `CLAUDE.md`, `AGENTS.md`에만 기재한다.

## 규칙 파일 유지 원칙

- `CLAUDE.md`와 `AGENTS.md`는 항상 동일한 내용을 유지한다. 한 쪽을 수정하면 반드시 나머지도 동일하게 반영한다.
- 아래 변화가 생기면 작업 완료 후 두 파일을 모두 업데이트한다.
  - `shared/lib/` 또는 `shared/components/`에 공통 모듈·컴포넌트 추가
  - `package.json`에 새로운 npm 스크립트 추가 및 사용 방법 정립
  - 프로젝트 전반에 적용할 새로운 컨벤션·워크플로우 확립
  - 기존 규칙이 현실과 달라졌을 때(규칙 수정 또는 삭제)

## 개인정보 취급 원칙

- `README.md`, `CLAUDE.md`, `AGENTS.md`, 주석, 커밋 메시지 등 어디에도 개인정보를 기재하지 않는다.
- 이름, 연락처, 계좌번호, 주소, 날짜 등 실제 웨딩 데이터는 `shared/data/info.js`에만 존재한다.

## 데이터 수정 원칙

- 웨딩 정보(날짜, 장소, 러브스토리 등)는 반드시 `shared/data/info.js`만 수정한다.
- `App.jsx`에 하드코딩된 값이 있다면 `info.js`와 일관성을 맞춰야 한다.

## 컨셉 디렉토리 주의사항

- 컨셉 디렉토리명은 `a`, `b`, `version1` 등 프로젝트에 따라 다르다.
- 특정 디렉토리명(`a/`, `b/` 등)을 README나 주석에 고정해서 기재하지 않는다.
- 구조나 경로를 설명할 때는 `<concept>/`와 같이 범용적으로 표기한다.

## 공통 모듈 관리 원칙

- supabaseClient, 공통 유틸리티 등 여러 컨셉에서 공유하는 모듈은 반드시 `shared/lib/`에 위치시킨다.
- 새 컨셉 생성 시 `<concept>/src/lib/` 안에 동일한 파일을 새로 만들지 않는다.
- 각 컨셉에서는 `@shared/lib/...` 경로로 import해 사용한다.

## Git Push 안전 원칙

- `git push` 전에 원격에 pull할 커밋이 있는지 확인한다 (`git fetch` 후 `git status` 또는 `git log HEAD..origin/브랜치` 확인).
- pull할 내용이 있으면 먼저 pull한 뒤, 다음 기준으로 사용자 확인이 필요한지 판단한다:
  - pull된 커밋이 현재 push할 파일과 **동일한 파일을 수정**한 경우
  - pull로 인해 **로컬 작업 내용이 덮어쓰이거나 사라질 위험**이 있는 경우
  - **merge conflict** 가 발생하거나 발생 가능성이 있는 경우
  - pull된 변경이 현재 작업의 **의도나 방향과 충돌**할 가능성이 있는 경우
- 위 기준 중 하나라도 해당하면 push를 멈추고 사용자에게 pull 내용을 요약해 알린 뒤 진행 여부를 확인받는다.
- 충돌 위험이 없고 단순히 fast-forward만 필요한 경우에는 pull 후 바로 push해도 된다.

## 이미지 최적화 원칙

- `shared/public/images/`에 1MB 이상 이미지를 추가할 때는 다음 두 가지를 반드시 함께 적용한다.
  1. `npm run optimize-images`를 실행해 WebP 변환본을 `shared/public/images/webp/`에 생성하고 PNG/JPG 원본과 함께 커밋한다.
     - PNG → WebP lossless (화질 손실 없음)
     - JPEG → WebP quality 90 (JPEG 대비 30~50% 용량 절감)
     - 이미 WebP가 존재하면 자동으로 skip된다.
  2. 즉시 로드되는 이미지(배경, 첫 화면 노출)는 해당 컨셉의 `index.html`에 preload를 추가한다.
     ```html
     <link rel="preload" as="image" href="./images/webp/파일명.webp" type="image/webp" fetchpriority="high" />
     ```
- 코드에서는 `<WebpImage>` 컴포넌트를 사용한다. PNG 경로만 넘기면 WebP 경로를 자동으로 파생한다.
  ```jsx
  import { WebpImage } from '@shared/components/WebpImage';
  <WebpImage src={IMAGE_URL} alt="..." className="..." />
  ```
- CSS `background-image`처럼 컴포넌트를 쓸 수 없는 경우에는 `toWebpSrc()`를 사용한다.
  ```jsx
  import { toWebpSrc } from '@shared/lib/image';
  style={{ backgroundImage: `url(${toWebpSrc(IMAGE_URL)})` }}
  ```
- 이미지 화질 저하(lossy 재압축)는 적용하지 않는다.
