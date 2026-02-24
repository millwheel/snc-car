# Task: 파트너사 섹션 추가

> 참고: `reference/partner.md`, `reference/partner-ref.png`

---

## T001. 파트너 데이터 정의

- `/public/images/partners/` 내 이미지 파일 20개를 순서대로 배열로 정의
- 파일명: `src/data/partners.ts`
- 타입: `{ id: number; src: string; alt: string }[]`
- 이미지 경로는 `/images/partners/S_main_partner_XX.png` 형식

---

## T002. PartnerSection 컴포넌트 구현

- 파일 위치: `src/components/sections/PartnerSection.tsx`
- 섹션 제목: **"에쓰엔씨오토홀딩스 주요 파트너사"**
  - 레퍼런스 기준 앞부분(회사명)과 뒷부분(주요 파트너사)을 색상으로 구분
- 카드 그리드: **2행 × 5열** 고정 (한 페이지에 카드 10개 노출)
- 카드 디자인
  - 흰 배경, 라운드 테두리, border 적용
  - 로고 이미지를 카드 중앙에 `object-contain`으로 배치
  - hover 시 shadow 강조
- 좌/우 방향 버튼
  - 섹션 양쪽 끝에 배치 (레퍼런스 참고)
  - `globals.css` 테마 컬러 활용

---

## T003. 슬라이드 로직 구현

### 조건
- 슬라이더는 **1열 단위**로 이동
- **자동 슬라이드**: 2초마다 오른쪽으로 1열 이동
- **수동 슬라이드**: 방향 버튼 클릭 시 해당 방향으로 1열 이동
- 마지막 열에서 오른쪽 이동 시 처음으로 순환 (무한 루프)
- 수동 조작 시 자동 슬라이드 타이머 리셋

### 구현 방법
- `useRef` + CSS `transform: translateX()` 방식으로 부드러운 슬라이드 구현
- `transition: transform 0.4s ease` 적용
- 17개 이미지 기준 열 수: 9열 (행 2개 × 9열 = 18칸, 마지막 칸 빈 칸 처리)

---

## T004. 애니메이션 적용

- 슬라이드 이동 시 `transition: transform 0.4s ease` 부드럽게 전환
- 섹션 진입 시 FadeInUp 애니메이션 적용 (`FadeInUp` 컴포넌트 재사용)

---

## T005. 메인 페이지에 섹션 삽입

- 파일: `src/app/page.tsx`
- `PartnerSection` 컴포넌트를 적절한 위치에 추가
- 삽입 위치: 기존 섹션 구성 검토 후 하단 영역에 배치
