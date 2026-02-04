# S&C 신차 장기 렌트 리스

운영자가 판매 차량 정보와 출고 내역을 직접 관리할 수 있는 관리자 페이지(CMS) + 공개 웹사이트를 구축하는 것을 목표로 합니다. 고객은 웹사이트에서 최신 판매 차량과 출고 사례를 확인하고 문의할 수 있으며, 운영자는 별도의 관리자 페이지에서 사진, 가격, 설명 등을 수시로 수정할 수 있습니다.

## 프로젝트명: S&C 신차장기렌트리스 공개 웹사이트 (Landing 1 Page)

### 목표:

- 판매 차량(SaleCar)과 출고 차량(ReleasedCar)을 보여주는 단일 랜딩 페이지 구축
- 견적 상담 모달을 통해 고객 정보를 수집
- 초기 구현은 DB 없이 mock data만 사용
- 추후 Supabase 연동을 고려한 구조로 컴포넌트 및 데이터 모델 설계 (데이터 소스 교체 가능)

### 기술 스택

- Framework: Next.js (App Router)
- UI: React + TailwindCSS
- 상태: React state
- 데이터: mock data (/src/mocks/*.ts)
- 서버 통신: 초기에는 없음 (문의 제출 시 alert 처리)
- 이후 확장: /app/api/로 문의 저장/메일 전송 가능하도록 구조 준비

### 디자인/컬러 가이드

- 메인 컬러: 메탈릭 그레이(고급/신뢰) → 배경, 라인, 카드 테두리, 헤더
- 서브 컬러: 청남색(신뢰/CTA) → 모든 버튼(CTA), hover 시 살짝 밝게
- UI 톤: 차분하고 고급스러운 렌트/금융 느낌. 과도한 색 사용 금지.

### 데이터 모델 (TypeScript interface + enum)

1. SaleCarBadge

- 판매 차량 카드에서 보여주는 스티커(뱃지) 타입을 제한한다.
- 값은 한국어 라벨로 고정한다.
  enum SaleCarBadge {
  IMMEDIATE = "즉시출고",
  PROMOTION = "프로모션"
  }
1. Manufacturer (제조사)
    - id: string
    - code: string
    - name: string
    - logoUrl: string
    - category: "DOMESTIC" | "IMPORT" // 1차 필터(국산/수입)의 기준은 Manufacturer.category이다.
    - sortOrder: number
    - isVisible: boolean
2. SaleCar (판매 차량)
    - id: string
    - manufacturerCode: string
    - manufacturerName: string
    - carName: string
    - thumbnailUrl: string
    - rentPrice: number | null // null이면 "비용 문의"로 표기 가능
    - leasePrice: number | null // null이면 "비용 문의"로 표기 가능
    - badges: SaleCarBadge[] // enum 기반 (복수 가능)
    - isVisible: boolean
    - sortOrder: number
    - createdAt: string (ISO)

※ SaleCar에는 category가 없다. (국산/수입 구분은 manufacturer로부터 유도)
※ priceDisplayType도 없다. (가격 표시 여부는 rentPrice/leasePrice null로 처리)

1. ReleasedCar (출고 차량)
    - id: string
    - carName: string
    - thumbnailUrl: string
    - releasedAt: string (ISO)
    - isVisible: boolean
    - sortOrder: number
    - createdAt: string (ISO)

### 라우팅

- "/" 단일 페이지 랜딩
- "/admin" (이번 구현 범위 아님, 향후 추가 예정)

### 페이지 레이아웃 (Single Page)

[Header: Sticky]

- 좌: 로고 이미지 (클릭 시 최상단 scroll)
- 우:
    - 판매 차량 버튼 → 판매 차량 섹션으로 이동
    - 출고 내역 버튼 → 출고 내역 섹션으로 이동
    - "빠른 상담" 버튼 (청남색 CTA) → 견적 상담 모달 오픈
    - "전화번호" 버튼 (청남색 CTA 또는 Outline) → tel: 링크 실행

## 섹션 구성 및 기능

### Section 1) Hero Banner

- 배경 이미지(정적)
- 타이틀 / 설명 / CTA 버튼(청남색)
- CTA 클릭 시 견적 상담 모달 오픈

### Section 2) 판매 차량 목록 (SaleCar)

[필터 1차: 전체/국산차/수입차]

- 국산/수입의 기준은 Manufacturer.category로 판단한다.
- "전체": 제한 없음
- "국산차": Manufacturer.category === "DOMESTIC" 인 제조사의 차량만
- "수입차": Manufacturer.category === "IMPORT" 인 제조사의 차량만

[필터 2차: 제조사 선택]

- Manufacturer 리스트를 로고 카드 형태로 표시(가로 스크롤 or 좌우 버튼)
- isVisible === true 제조사만 보여준다.
- 선택된 제조사는 강조(메탈릭 테두리/배경)

[차량 카드 Grid]

- 카드 구성:
    - thumbnail
    - manufacturer logo(또는 manufacturerName)
    - carName
    - 가격영역:
        - rentPrice: 값 있으면 "렌트 1,234,000원" / 없으면 "렌트 비용문의"
        - leasePrice: 값 있으면 "리스 987,000원" / 없으면 "리스 비용문의"
    - badges: SaleCarBadge 값들을 스티커 형태로 노출
    - CTA: "간편 상담 신청" 버튼(청남색) → 모달 오픈

[정렬/노출 규칙]

- isVisible === true 인 SaleCar만 노출
- 정렬:
    1. sortOrder asc
    2. createdAt desc

[상담 모달로 컨텍스트 전달]

- 차량 카드의 CTA 클릭 시 모달 오픈
- 모달에 selectedCarName, selectedManufacturerName을 자동 세팅(hidden context로 유지)

### Section 3) 핵심 강점 안내

- 타이틀: "왜 S&C 신차장기렌트리스일까?"
- 이미지 + 제목 + 설명 카드 N개
- 초기 구현은 정적 데이터(추후 CMS로 이동 가능한 구조)

### Section 4) 최근 출고내역 (ReleasedCar)

- 2 x 3 카드 grid로 최대 6개 표시
- 카드: 이미지 + 차량명 + 출고일(releasedAt)
- isVisible === true 만 표시
- 정렬:
    1. sortOrder asc
    2. releasedAt desc
    3. createdAt desc
- 데이터는 mock ReleasedCar에서 가져온다.

### Section 5) FAQ

- 아코디언 UI
- 한 번에 하나만 펼쳐지는 accordion 방식
- 초기 구현은 정적 데이터

### Section 6) Footer

- 사업자 정보(텍스트)
- 개인정보처리방침/이용약관 링크(placeholder)

## 견적 상담 모달 (Quote Modal)

[입력폼]

- 이름 (필수)
- 전화번호 (필수) : 숫자/하이픈 입력 허용, 전송 시 숫자만 normalize
- 지역 (필수)
- 유형 (필수) : 개인 / 개인사업자 / 법인
- 초기자금 (필수) :
    - 보증금: 0/10/20/30
    - 선수금: 0/10/20/30
      (UX 권장: 보증금/선수금 라디오 선택 후 비율 선택)
- 계약기간 (필수) : 36/48/60개월
- 개인정보 수집 및 이용 동의 체크(필수)

[제출]

- 버튼: "실시간 견적받기" (청남색)
- 초기 구현:
    - validation 수행
    - payload를 console.log로 출력
    - 성공 상태 UI 표시(“접수 완료”)
- 중복 제출 방지(로딩 상태)
- 향후 확장:
    - /app/api/inquiry/route.ts 로 POST 전송하도록 교체 가능하게 설계

## 컴포넌트 분리 가이드

- Header
- HeroSection
- CategoryTabs (전체/국산/수입)
- ManufacturerFilter
- SaleCarGrid
- SaleCarCard
- StrengthSection
- ReleasedCarGrid
- ReleasedCarCard
- FAQAccordion
- Footer
- QuoteModal
- QuoteForm

## 구현 원칙

- mock data → Supabase/API 연동으로 교체하기 쉽도록 "data source layer" 분리
  예: getSaleCars(), getManufacturers(), getReleasedCars() 를 만든 후 현재는 mock 반환
- 필터/정렬은 client-side로 구현
- 모든 타입은 TS로 엄격하게 정의하고, badges는 SaleCarBadge enum만 허용