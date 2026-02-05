'use client';

import { useState, type FormEvent } from 'react';
import { useQuoteModal } from '@/hooks/useQuoteModal';
import { submitQuoteRequest } from '@/data/services/quote.service';
import { normalizePhoneNumber, validatePhoneNumber, validateName } from '@/utils/validators';
import type {
  CustomerType,
  InitialFundType,
  InitialFundRate,
  ContractPeriod,
  QuoteRequest,
} from '@/types/quote';

const CUSTOMER_TYPES: CustomerType[] = ['개인', '개인사업자', '법인'];
const INITIAL_FUND_TYPES: InitialFundType[] = ['보증금', '선수금'];
const INITIAL_FUND_RATES: InitialFundRate[] = [0, 10, 20, 30];
const CONTRACT_PERIODS: ContractPeriod[] = [36, 48, 60];

const REGIONS = [
  '서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종',
  '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
];

export default function QuoteModal() {
  const { isOpen, selectedCar, closeModal } = useQuoteModal();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    region: '',
    customerType: '개인' as CustomerType,
    initialFundType: '보증금' as InitialFundType,
    initialFundRate: 0 as InitialFundRate,
    contractPeriod: 48 as ContractPeriod,
    privacyAgreed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // 에러 초기화
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateName(formData.name)) {
      newErrors.name = '이름을 2자 이상 입력해주세요.';
    }

    if (!validatePhoneNumber(formData.phone)) {
      newErrors.phone = '올바른 전화번호를 입력해주세요.';
    }

    if (!formData.region) {
      newErrors.region = '지역을 선택해주세요.';
    }

    if (!formData.privacyAgreed) {
      newErrors.privacyAgreed = '개인정보 수집 및 이용에 동의해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const request: QuoteRequest = {
        ...formData,
        phone: normalizePhoneNumber(formData.phone),
        selectedCarName: selectedCar?.name,
        selectedManufacturerName: selectedCar?.manufacturerName,
      };

      const result = await submitQuoteRequest(request);

      if (result.success) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setErrors({ submit: '제출 중 오류가 발생했습니다. 다시 시도해주세요.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    closeModal();
    // 폼 초기화
    setTimeout(() => {
      setFormData({
        name: '',
        phone: '',
        region: '',
        customerType: '개인',
        initialFundType: '보증금',
        initialFundRate: 0,
        contractPeriod: 48,
        privacyAgreed: false,
      });
      setErrors({});
      setIsSubmitted(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold text-text-primary">빠른 견적 문의</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-bg-secondary rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-text-secondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isSubmitted ? (
          /* 제출 완료 화면 */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-badge-promotion/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-badge-promotion"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">접수 완료</h3>
            <p className="text-text-secondary mb-6">
              견적 상담 신청이 완료되었습니다.<br />
              빠른 시일 내에 연락드리겠습니다.
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              확인
            </button>
          </div>
        ) : (
          /* 폼 */
          <form onSubmit={handleSubmit} className="p-4">
            {/* 선택된 차량 정보 */}
            {selectedCar && (
              <div className="mb-4 p-3 bg-bg-secondary rounded-lg">
                <p className="text-sm text-text-secondary">선택 차량</p>
                <p className="font-medium text-text-primary">
                  {selectedCar.manufacturerName} {selectedCar.name}
                </p>
              </div>
            )}

            {/* 이름 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-1">
                이름 <span className="text-badge-immediate">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="이름을 입력해주세요"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.name ? 'border-badge-immediate' : 'border-border'
                }`}
              />
              {errors.name && (
                <p className="text-sm text-badge-immediate mt-1">{errors.name}</p>
              )}
            </div>

            {/* 전화번호 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-1">
                연락처 <span className="text-badge-immediate">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="010-1234-5678"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.phone ? 'border-badge-immediate' : 'border-border'
                }`}
              />
              {errors.phone && (
                <p className="text-sm text-badge-immediate mt-1">{errors.phone}</p>
              )}
            </div>

            {/* 지역 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-1">
                지역 <span className="text-badge-immediate">*</span>
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.region ? 'border-badge-immediate' : 'border-border'
                }`}
              >
                <option value="">지역을 선택해주세요</option>
                {REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              {errors.region && (
                <p className="text-sm text-badge-immediate mt-1">{errors.region}</p>
              )}
            </div>

            {/* 유형 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-1">
                유형 <span className="text-badge-immediate">*</span>
              </label>
              <div className="flex gap-2">
                {CUSTOMER_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, customerType: type }))}
                    className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-colors ${
                      formData.customerType === type
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-text-secondary border-border hover:border-secondary'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 초기자금 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-1">
                초기자금 <span className="text-badge-immediate">*</span>
              </label>
              <div className="flex gap-2 mb-2">
                {INITIAL_FUND_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, initialFundType: type }))}
                    className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-colors ${
                      formData.initialFundType === type
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-text-secondary border-border hover:border-secondary'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                {INITIAL_FUND_RATES.map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, initialFundRate: rate }))}
                    className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-colors ${
                      formData.initialFundRate === rate
                        ? 'bg-secondary text-white border-secondary'
                        : 'bg-white text-text-secondary border-border hover:border-secondary'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            {/* 계약기간 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-1">
                계약기간 <span className="text-badge-immediate">*</span>
              </label>
              <div className="flex gap-2">
                {CONTRACT_PERIODS.map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, contractPeriod: period }))}
                    className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-colors ${
                      formData.contractPeriod === period
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-text-secondary border-border hover:border-secondary'
                    }`}
                  >
                    {period}개월
                  </button>
                ))}
              </div>
            </div>

            {/* 개인정보 동의 */}
            <div className="mb-6">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="privacyAgreed"
                  checked={formData.privacyAgreed}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <span className="text-sm text-text-secondary">
                  개인정보 수집 및 이용에 동의합니다.{' '}
                  <a href="#" className="text-primary underline">[보기]</a>
                </span>
              </label>
              {errors.privacyAgreed && (
                <p className="text-sm text-badge-immediate mt-1">{errors.privacyAgreed}</p>
              )}
            </div>

            {/* 에러 메시지 */}
            {errors.submit && (
              <p className="text-sm text-badge-immediate mb-4 text-center">{errors.submit}</p>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                isSubmitting
                  ? 'bg-disabled text-text-muted cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              {isSubmitting ? '처리 중...' : '무료 견적 서비스 받기'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
