'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import {
  HostFormData,
  INITIAL_FORM_DATA,
  TOTAL_STEPS,
  validateStep,
} from '@/lib/hostFormSchema';
import { cn } from '@/lib/utils';
import StepIndicator from '@/components/host/StepIndicator';
import Step1BasicInfo from '@/components/host/steps/Step1BasicInfo';
import Step2DateTime from '@/components/host/steps/Step2DateTime';
import Step3Settings from '@/components/host/steps/Step3Settings';
import Step4Preview from '@/components/host/steps/Step4Preview';

type SubmitState = 'idle' | 'loading' | 'success';

export default function HostForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<HostFormData>(INITIAL_FORM_DATA);
  const [error, setError] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  function handleChange(field: keyof HostFormData, value: string | number) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  function handleNext() {
    const validationError = validateStep(step, formData);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function handleBack() {
    setError(null);
    if (step === 1) {
      router.push('/');
    } else {
      setStep((s) => Math.max(s - 1, 1));
    }
  }

  async function handleSubmit() {
    setSubmitState('loading');
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title:        formData.title,
          location:     formData.location,
          locationUrl:  formData.locationUrl,
          date:         formData.date,
          timeStart:    formData.timeStart,
          timeEnd:      formData.timeEnd,
          levelMin:     formData.levelMin,
          levelMax:     formData.levelMax,
          maxPlayers:   formData.maxPlayers,
          fee:          formData.fee,
          lineGroupUrl: formData.lineGroupUrl,
        }),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? '發布失敗，請再試一次');
        setSubmitState('idle');
        return;
      }
    } catch {
      setError('網路錯誤，請確認連線後再試');
      setSubmitState('idle');
      return;
    }
    setSubmitState('success');
    setTimeout(() => router.push('/'), 2000);
  }

  const isLastStep = step === TOTAL_STEPS;

  // 成功畫面
  if (submitState === 'success') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-5 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-lime-300 animate-scale-in">
          <CheckCircle2 className="h-10 w-10 text-gray-900" />
        </div>
        <h2 className="text-2xl font-black text-white">球局發布成功！</h2>
        <p className="text-sm text-gray-400">等待球友報名，開打吧 🏓</p>
        <p className="text-xs text-gray-600">即將返回首頁…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)]">
      {/* Step Indicator */}
      <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />

      {/* Form Body */}
      <div className="flex-1 px-5 pb-4">
        <div className="animate-fade-in">
          {step === 1 && <Step1BasicInfo data={formData} onChange={handleChange} />}
          {step === 2 && <Step2DateTime data={formData} onChange={handleChange} />}
          {step === 3 && <Step3Settings data={formData} onChange={handleChange} />}
          {step === 4 && <Step4Preview data={formData} />}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="sticky bottom-0 border-t border-gray-800 bg-gray-950/90 px-5 py-4 backdrop-blur-md">
        <div className="flex gap-3">
          {/* Back */}
          <button
            onClick={handleBack}
            className="flex h-12 items-center gap-1.5 rounded-xl border border-gray-700 bg-gray-800 px-4 text-sm font-semibold text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {step === 1 ? '取消' : '上一步'}
          </button>

          {/* Next / Submit */}
          {isLastStep ? (
            <button
              onClick={handleSubmit}
              disabled={submitState === 'loading'}
              className={cn(
                'flex flex-1 h-12 items-center justify-center gap-2 rounded-xl font-black text-sm transition-all',
                submitState === 'loading'
                  ? 'bg-lime-300/60 text-gray-900/60 cursor-not-allowed'
                  : 'bg-lime-300 text-gray-900 hover:bg-lime-200 shadow-[0_0_20px_rgba(190,242,100,0.3)] active:scale-95'
              )}
            >
              {submitState === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  發布中…
                </>
              ) : (
                <>🏓 立即發布球局</>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex flex-1 h-12 items-center justify-center gap-1.5 rounded-xl bg-lime-300 font-bold text-sm text-gray-900 transition-all hover:bg-lime-200 active:scale-95"
            >
              下一步
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
