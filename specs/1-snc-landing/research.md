# Research: S&C 신차 장기 렌트 리스 공개 웹사이트

**Feature Branch**: `1-snc-landing`
**Date**: 2026-02-04

## Overview

Technical Context에서 NEEDS CLARIFICATION으로 표시된 항목이 없음. 기술 스택이 명확하게 정의되어 있고, 스펙 명세와 clarification 세션에서 모든 주요 결정이 완료됨.

이 문서는 구현에 필요한 기술적 베스트 프랙티스와 패턴을 정리함.

---

## Research Topics

### 1. TailwindCSS 색상 시스템 설계

**Decision**: CSS 변수 + Tailwind @theme inline 방식 사용

**Rationale**:
- Tailwind v4 방식으로 `@theme inline` 블록에서 커스텀 색상 정의
- CSS 변수를 통해 런타임에서도 색상 접근 가능
- 일관된 색상 팔레트 관리

**Implementation**:
```css
@theme inline {
  /* Primary - 청남색 (Navy Blue) */
  --color-primary: #1e3a5f;
  --color-primary-light: #2d4a6f;
  --color-primary-dark: #0f2a4f;

  /* Secondary - 메탈릭 그레이 (Slate) */
  --color-secondary: #64748b;
  --color-secondary-light: #94a3b8;
  --color-secondary-dark: #475569;

  /* UI States */
  --color-hover: #2d4a6f;
  --color-active: #0f2a4f;
  --color-disabled: #cbd5e1;

  /* Backgrounds */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f1f5f9;
  --color-bg-card: #ffffff;

  /* Borders */
  --color-border: #e2e8f0;
  --color-border-strong: #cbd5e1;

  /* Text */
  --color-text-primary: #1e293b;
  --color-text-secondary: #64748b;
  --color-text-muted: #94a3b8;

  /* Badges */
  --color-badge-immediate: #dc2626;  /* 즉시출고 - Red */
  --color-badge-promotion: #059669;  /* 프로모션 - Green */
}
```

**Alternatives considered**:
- Tailwind 기본 팔레트만 사용 → 브랜드 일관성 부족으로 기각
- Sass 변수 사용 → TailwindCSS와 통합 복잡성으로 기각

---

### 2. 반응형 그리드 패턴

**Decision**: TailwindCSS Grid + 명시적 브레이크포인트

**Rationale**:
- 판매 차량: 모바일 1열, 태블릿 2열, 데스크톱 4열
- 출고 내역: 모바일 1열, 태블릿 2열, 데스크톱 3열 (2x3 그리드)
- CSS Grid가 레이아웃 정렬에 유리

**Implementation Pattern**:
```tsx
// 판매 차량 그리드
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {cars.map(car => <SaleCarCard key={car.id} car={car} />)}
</div>

// 출고 내역 그리드 (최대 6개)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {releasedCars.slice(0, 6).map(car => <ReleasedCarCard key={car.id} car={car} />)}
</div>
```

**Breakpoints**:
- Mobile: < 768px (md)
- Tablet: 768px - 1023px
- Desktop: >= 1024px (lg)

---

### 3. 데이터 서비스 레이어 패턴

**Decision**: Service 함수 + Mock data 분리

**Rationale**:
- Mock → API 전환 시 service 함수 내부만 수정
- 컴포넌트는 service 인터페이스에만 의존
- 테스트 시 mock service 주입 용이

**Implementation Pattern**:
```typescript
// types/saleCar.ts
export interface SaleCar {
  id: string;
  manufacturerCode: string;
  // ...
}

// data/services/saleCar.service.ts
import { mockSaleCars } from '../mocks/saleCars';
import type { SaleCar } from '@/types/saleCar';

export async function getSaleCars(): Promise<SaleCar[]> {
  // 현재: mock data 반환
  // 추후: API 호출로 교체
  return mockSaleCars.filter(car => car.isVisible);
}

export async function getSaleCarsByManufacturer(
  manufacturerCode: string
): Promise<SaleCar[]> {
  const cars = await getSaleCars();
  return cars.filter(car => car.manufacturerCode === manufacturerCode);
}
```

---

### 4. 필터링 상태 관리

**Decision**: React useState + URL 상태 동기화 없음 (MVP)

**Rationale**:
- 단일 페이지이므로 URL 상태 관리 불필요
- 복잡한 상태 관리 라이브러리(Redux, Zustand) 과잉
- 컴포넌트 로컬 상태로 충분

**Implementation Pattern**:
```typescript
// hooks/useCarFilter.ts
export function useCarFilter(manufacturers: Manufacturer[], cars: SaleCar[]) {
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'DOMESTIC' | 'IMPORT'>('ALL');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string | null>(null);

  const filteredManufacturers = useMemo(() => {
    if (categoryFilter === 'ALL') return manufacturers;
    return manufacturers.filter(m => m.category === categoryFilter);
  }, [manufacturers, categoryFilter]);

  const filteredCars = useMemo(() => {
    let result = cars;

    if (categoryFilter !== 'ALL') {
      const validCodes = filteredManufacturers.map(m => m.code);
      result = result.filter(car => validCodes.includes(car.manufacturerCode));
    }

    if (selectedManufacturer) {
      result = result.filter(car => car.manufacturerCode === selectedManufacturer);
    }

    return result;
  }, [cars, categoryFilter, selectedManufacturer, filteredManufacturers]);

  return {
    categoryFilter,
    setCategoryFilter,
    selectedManufacturer,
    setSelectedManufacturer,
    filteredManufacturers,
    filteredCars,
  };
}
```

---

### 5. 모달 상태 관리

**Decision**: Context + Custom Hook

**Rationale**:
- 모달이 여러 곳(헤더, 차량 카드)에서 호출됨
- 차량 정보를 모달에 전달해야 함
- Prop drilling 방지

**Implementation Pattern**:
```typescript
// hooks/useQuoteModal.ts
interface QuoteModalContext {
  isOpen: boolean;
  selectedCar: { carName: string; manufacturerName: string } | null;
  openModal: (car?: { carName: string; manufacturerName: string }) => void;
  closeModal: () => void;
}

const QuoteModalContext = createContext<QuoteModalContext | null>(null);

export function QuoteModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<{ carName: string; manufacturerName: string } | null>(null);

  const openModal = (car?: { carName: string; manufacturerName: string }) => {
    setSelectedCar(car || null);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedCar(null);
  };

  return (
    <QuoteModalContext.Provider value={{ isOpen, selectedCar, openModal, closeModal }}>
      {children}
    </QuoteModalContext.Provider>
  );
}

export function useQuoteModal() {
  const context = useContext(QuoteModalContext);
  if (!context) throw new Error('useQuoteModal must be used within QuoteModalProvider');
  return context;
}
```

---

### 6. 폼 검증 패턴

**Decision**: Native HTML5 validation + Custom validation 함수

**Rationale**:
- 외부 라이브러리(react-hook-form, formik) 도입 불필요 (폼 1개)
- HTML5 required 속성으로 기본 검증
- 전화번호 정규화 등 커스텀 로직 추가

**Implementation Pattern**:
```typescript
// utils/validators.ts
export function normalizePhoneNumber(value: string): string {
  return value.replace(/[^0-9]/g, '');
}

export function validatePhoneNumber(value: string): boolean {
  const normalized = normalizePhoneNumber(value);
  return /^01[0-9]{8,9}$/.test(normalized);
}

// QuoteForm validation
const handleSubmit = (e: FormEvent) => {
  e.preventDefault();

  if (!validatePhoneNumber(phone)) {
    setErrors({ phone: '올바른 전화번호를 입력하세요' });
    return;
  }

  const payload = {
    ...formData,
    phone: normalizePhoneNumber(phone),
  };

  console.log('Quote submission:', payload);
  setSubmitted(true);
};
```

---

### 7. 스크롤 네비게이션

**Decision**: scrollIntoView API + smooth behavior

**Rationale**:
- 네이티브 브라우저 API 사용
- 외부 라이브러리 불필요
- 접근성 고려 (focus management)

**Implementation Pattern**:
```typescript
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// Header에서 사용
<button onClick={() => scrollToSection('sale-cars')}>판매 차량</button>
<button onClick={() => scrollToSection('released-cars')}>출고 내역</button>
```

---

## Summary

| Topic | Decision | Key Benefit |
|-------|----------|-------------|
| 색상 시스템 | CSS 변수 + @theme inline | 일관된 브랜드 색상, Tailwind 통합 |
| 반응형 그리드 | CSS Grid + TailwindCSS | 명확한 브레이크포인트, 유지보수 용이 |
| 데이터 레이어 | Service 함수 패턴 | Mock → API 전환 용이 |
| 필터 상태 | React useState | 단순성, 오버엔지니어링 방지 |
| 모달 상태 | Context + Hook | Prop drilling 방지 |
| 폼 검증 | HTML5 + 커스텀 함수 | 의존성 최소화 |
| 스크롤 | scrollIntoView API | 네이티브, 성능 |

**Conclusion**: 모든 기술적 불확실성이 해소됨. Phase 1 (Design & Contracts)으로 진행 가능.
