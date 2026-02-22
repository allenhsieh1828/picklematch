import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEP_LABELS = ['基本資訊', '日期時間', '球局設定', '確認送出'];

interface StepIndicatorProps {
  currentStep: number; // 1-based
  totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="px-5 py-4">
      {/* Step dots + line */}
      <div className="relative flex items-center justify-between">
        {/* Background line */}
        <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-gray-800" />
        {/* Progress line */}
        <div
          className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-lime-300 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isDone = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300',
                  isDone && 'border-lime-300 bg-lime-300 text-gray-900',
                  isCurrent && 'border-lime-300 bg-gray-950 text-lime-300 shadow-[0_0_12px_rgba(190,242,100,0.4)]',
                  !isDone && !isCurrent && 'border-gray-700 bg-gray-900 text-gray-500'
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : step}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium whitespace-nowrap',
                  isCurrent ? 'text-lime-300' : isDone ? 'text-gray-400' : 'text-gray-600'
                )}
              >
                {STEP_LABELS[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
