# API Contract: Inquiry (견적 상담)

**Feature Branch**: `1-snc-landing`
**Date**: 2026-02-04
**Status**: Future Implementation (현재는 mock)

## Overview

견적 상담 요청을 처리하는 API 계약. 초기 구현에서는 클라이언트 측 console.log로 대체하며, 향후 서버 API로 전환 시 이 계약을 따른다.

---

## POST /api/inquiry

### Description
고객의 견적 상담 요청을 접수한다.

### Request

**Method**: `POST`
**Path**: `/api/inquiry`
**Content-Type**: `application/json`

#### Request Body

```typescript
interface InquiryRequest {
  name: string;                    // 고객 이름 (1자 이상)
  phone: string;                   // 전화번호 (숫자만, 10~11자리)
  region: string;                  // 지역 (1자 이상)
  customerType: "개인" | "개인사업자" | "법인";
  initialFundType: "보증금" | "선수금";
  initialFundRate: 0 | 10 | 20 | 30;
  contractPeriod: 36 | 48 | 60;
  privacyAgreed: boolean;          // true여야 함
  selectedCarName?: string | null;  // 선택된 차량명 (optional)
  selectedManufacturerName?: string | null;  // 선택된 제조사명 (optional)
}
```

#### Example Request

```json
{
  "name": "홍길동",
  "phone": "01012345678",
  "region": "서울",
  "customerType": "개인",
  "initialFundType": "보증금",
  "initialFundRate": 10,
  "contractPeriod": 48,
  "privacyAgreed": true,
  "selectedCarName": "그랜저",
  "selectedManufacturerName": "현대"
}
```

### Response

#### Success (201 Created)

```typescript
interface InquiryResponse {
  success: true;
  message: string;
  inquiryId: string;
  createdAt: string;  // ISO 8601
}
```

#### Example Success Response

```json
{
  "success": true,
  "message": "상담 신청이 접수되었습니다.",
  "inquiryId": "inq_20260204_001",
  "createdAt": "2026-02-04T12:00:00Z"
}
```

#### Validation Error (400 Bad Request)

```typescript
interface ValidationErrorResponse {
  success: false;
  error: {
    code: "VALIDATION_ERROR";
    message: string;
    fields: {
      [fieldName: string]: string;  // 필드별 에러 메시지
    };
  };
}
```

#### Example Validation Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값을 확인해주세요.",
    "fields": {
      "phone": "유효한 전화번호를 입력해주세요.",
      "privacyAgreed": "개인정보 수집에 동의해주세요."
    }
  }
}
```

#### Server Error (500 Internal Server Error)

```typescript
interface ServerErrorResponse {
  success: false;
  error: {
    code: "SERVER_ERROR";
    message: string;
  };
}
```

---

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| name | 1자 이상 | "이름을 입력해주세요." |
| phone | 숫자만, 10~11자리 | "유효한 전화번호를 입력해주세요." |
| region | 1자 이상 | "지역을 입력해주세요." |
| customerType | enum 값 중 하나 | "고객 유형을 선택해주세요." |
| initialFundType | enum 값 중 하나 | "초기자금 유형을 선택해주세요." |
| initialFundRate | 0, 10, 20, 30 중 하나 | "초기자금 비율을 선택해주세요." |
| contractPeriod | 36, 48, 60 중 하나 | "계약기간을 선택해주세요." |
| privacyAgreed | true | "개인정보 수집에 동의해주세요." |

---

## Initial Implementation (Mock)

초기 구현에서는 API 호출 대신 클라이언트에서 다음과 같이 처리:

```typescript
// services/inquiryService.ts
export async function submitInquiry(data: InquiryRequest): Promise<InquiryResponse> {
  // Validation
  const errors = validateInquiry(data);
  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors);
  }

  // Mock: console.log로 출력
  console.log("📋 견적 상담 요청:", data);

  // Mock response
  return {
    success: true,
    message: "상담 신청이 접수되었습니다.",
    inquiryId: `inq_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
}
```

---

## Future Implementation

향후 Supabase 연동 시:

```typescript
// app/api/inquiry/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const data = await request.json();

  // Validate
  const errors = validateInquiry(data);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "입력값을 확인해주세요.", fields: errors }
    }, { status: 400 });
  }

  // Save to Supabase
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
  const { data: inquiry, error } = await supabase
    .from('inquiries')
    .insert(data)
    .select()
    .single();

  if (error) {
    return NextResponse.json({
      success: false,
      error: { code: "SERVER_ERROR", message: "서버 오류가 발생했습니다." }
    }, { status: 500 });
  }

  // Optional: Send notification email

  return NextResponse.json({
    success: true,
    message: "상담 신청이 접수되었습니다.",
    inquiryId: inquiry.id,
    createdAt: inquiry.created_at,
  }, { status: 201 });
}
```
