import React from 'react';
import { ArrowLeft, ArrowRight, Palette } from 'lucide-react';
import { AppConfig } from '../../types/apk';
import { IconCustomizer } from '../IconCustomizer';

interface Step2IconProps {
  config: AppConfig;
  onChange: (updated: Partial<AppConfig>) => void;
  discoveredIcons: string[];
  onBack: () => void;
  onNext: () => void;
}

export const Step2Icon: React.FC<Step2IconProps> = ({
  config,
  onChange,
  discoveredIcons,
  onBack,
  onNext,
}) => {
  return (
    <div className="space-y-6 animate-fade-in gpu-layer">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Palette className="w-3.5 h-3.5" />
          <span>Step 2: Launcher Icon & Styling</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Adaptive Icon Studio
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Auto-sample perimeter colors so your icon blends seamlessly without cut-off borders.
        </p>
      </div>

      {/* Main Icon Customizer Studio */}
      <div className="max-w-4xl mx-auto">
        <IconCustomizer
          config={config}
          onChange={onChange}
          discoveredIcons={discoveredIcons}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="max-w-4xl mx-auto flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to URL</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-2xl shadow-lg shadow-emerald-500/25 active:scale-95 transition-all text-sm cursor-pointer"
        >
          <span>Next: App Settings</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
