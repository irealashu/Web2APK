import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Sliders, AlertCircle } from 'lucide-react';
import { AppConfig } from '../../types/apk';
import { SettingsTabs } from '../SettingsTabs';
import {
  validateAppName,
  validatePackageName,
  validateVersionName,
  validateVersionCode,
  validateHexColor,
} from '../../utils/validators';

interface Step3SettingsProps {
  config: AppConfig;
  onChange: (updated: Partial<AppConfig>) => void;
  onBack: () => void;
  onNext: () => void;
}

export const Step3Settings: React.FC<Step3SettingsProps> = ({
  config,
  onChange,
  onBack,
  onNext,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleProceed = () => {
    const appNameValidation = validateAppName(config.appName);
    if (!appNameValidation.isValid) {
      setErrorMsg(appNameValidation.error || 'Please enter a valid Application Name');
      return;
    }

    const pkgValidation = validatePackageName(config.packageName);
    if (!pkgValidation.isValid) {
      setErrorMsg(pkgValidation.error || 'Please enter a valid Package Name');
      return;
    }

    const verNameValidation = validateVersionName(config.versionName);
    if (!verNameValidation.isValid) {
      setErrorMsg(verNameValidation.error || 'Please enter a valid Version Name');
      return;
    }

    const verCodeValidation = validateVersionCode(config.versionCode);
    if (!verCodeValidation.isValid) {
      setErrorMsg(verCodeValidation.error || 'Please enter a valid Version Code');
      return;
    }

    const statusBarValidation = validateHexColor(config.statusBarColor);
    if (!statusBarValidation.isValid) {
      setErrorMsg(statusBarValidation.error || 'Please enter a valid Status Bar Hex Color');
      return;
    }

    setErrorMsg(null);
    onNext();
  };

  return (
    <div className="space-y-6 animate-fade-in gpu-layer">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Sliders className="w-3.5 h-3.5" />
          <span>Step 3: Android Configuration</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Application Identity & Features
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Customize package ID, splash branding, WebView caching, and hardware permissions.
        </p>
      </div>

      {/* Main Settings Tabs */}
      <div className="max-w-4xl mx-auto">
        <SettingsTabs config={config} onChange={onChange} />
      </div>

      {/* Inline Validation Error Banner */}
      {errorMsg && (
        <div className="max-w-4xl mx-auto p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-400 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="max-w-4xl mx-auto flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Icon Studio</span>
        </button>

        <button
          type="button"
          onClick={handleProceed}
          className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-2xl shadow-lg shadow-emerald-500/25 active:scale-95 transition-all text-sm cursor-pointer"
        >
          <span>Next: Review & Build</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
