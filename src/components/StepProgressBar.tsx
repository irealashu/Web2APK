import React from 'react';
import { Globe, Palette, Sliders, CheckCircle, Sparkles } from 'lucide-react';

export interface StepItem {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

export const STEPS: StepItem[] = [
  {
    id: 1,
    title: 'Website URL',
    subtitle: 'Extract & Inspect',
    icon: Globe,
  },
  {
    id: 2,
    title: 'Icon Studio',
    subtitle: 'Padding & Shape',
    icon: Palette,
  },
  {
    id: 3,
    title: 'App Settings',
    subtitle: 'Permissions & Identity',
    icon: Sliders,
  },
  {
    id: 4,
    title: 'Review & Build',
    subtitle: 'Compile APK',
    icon: Sparkles,
  },
];

interface StepProgressBarProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  maxStepUnlocked: number;
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  onSelectStep,
  maxStepUnlocked,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6 px-1 sm:px-2">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isUnlocked = step.id <= maxStepUnlocked;
          const IconComp = step.icon;

          return (
            <button
              key={step.id}
              type="button"
              disabled={!isUnlocked}
              onClick={() => isUnlocked && onSelectStep(step.id)}
              className={`flex items-center sm:items-start gap-2.5 sm:gap-2 sm:flex-col p-2.5 sm:p-3.5 rounded-2xl border transition-all text-left relative overflow-hidden ${
                isCurrent
                  ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500/40 text-white'
                  : isCompleted
                  ? 'bg-slate-900/70 border-slate-800 hover:border-emerald-500/50 cursor-pointer text-slate-200'
                  : 'bg-slate-950/50 border-slate-900 opacity-50 cursor-not-allowed text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2 shrink-0">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-transform duration-200 ${
                    isCurrent
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 scale-105'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 hidden sm:inline">
                  0{step.id}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-xs sm:text-sm font-bold truncate block">
                  {step.title}
                </span>
                <span className="text-[11px] text-slate-400 hidden md:block truncate mt-0.5">
                  {step.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
