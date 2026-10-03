import React, { useState } from 'react';
import {
  Globe,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Layers,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import { AppConfig } from '../../types/apk';
import { validateUrl } from '../../utils/validators';

interface Step1UrlProps {
  url: string;
  setUrl: (url: string) => void;
  config: AppConfig;
  isLoading: boolean;
  isInspected: boolean;
  onInspect: (targetUrl: string) => Promise<void>;
  onNext: () => void;
  discoveredIcons: string[];
}

export const Step1Url: React.FC<Step1UrlProps> = ({
  url,
  setUrl,
  config,
  isLoading,
  isInspected,
  onInspect,
  onNext,
  discoveredIcons,
}) => {
  const [inputVal, setInputVal] = useState(url || 'https://en.wikipedia.org');
  const [touched, setTouched] = useState(false);
  const validation = validateUrl(inputVal);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);
    setTouched(true);
  };

  const handleInspectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const res = validateUrl(inputVal);
    if (!res.isValid || isLoading) return;
    await onInspect(inputVal.trim());
  };

  const hasError = touched && !validation.isValid && Boolean(validation.error);
  const hasWarning = validation.isValid && Boolean(validation.warning);

  return (
    <div className="space-y-8 animate-fade-in gpu-layer">
      {/* Step Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Globe className="w-3.5 h-3.5" />
          <span>Step 1: Website URL Discovery</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Enter Any Website URL to Convert
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Enter a URL and click <strong>Inspect Site</strong> to extract favicons, assets, metadata, and branding colors.
        </p>
      </div>

      {/* URL Input Form */}
      <div className="max-w-2xl mx-auto space-y-3">
        <form onSubmit={handleInspectSubmit} className="relative group">
          <div
            className={`relative flex flex-col sm:flex-row items-stretch sm:items-center bg-slate-900/95 border-2 rounded-2xl sm:rounded-full p-2 sm:p-2.5 shadow-2xl backdrop-blur-xl transition-all duration-200 ${
              hasError
                ? 'border-rose-500/80 shadow-rose-950/40 focus-within:border-rose-400'
                : 'border-emerald-500/40 hover:border-emerald-500/80 focus-within:border-emerald-400 shadow-emerald-950/50'
            }`}
          >
            <div className="hidden sm:flex items-center justify-center pl-4 pr-2">
              <Globe
                className={`w-5 h-5 ${
                  hasError ? 'text-rose-400' : 'text-emerald-400'
                }`}
              />
            </div>

            <input
              type="text"
              value={inputVal}
              onChange={handleInputChange}
              onBlur={() => setTouched(true)}
              placeholder="Enter website URL (e.g. https://en.wikipedia.org)..."
              className="w-full bg-transparent px-4 sm:px-2 py-3 sm:py-2 text-base text-white placeholder:text-slate-500 focus:outline-none font-medium"
              disabled={isLoading}
              autoFocus
            />

            <button
              type="submit"
              disabled={isLoading || (touched && !validation.isValid) || !inputVal.trim()}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-xl sm:rounded-full shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer text-sm shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Inspecting...</span>
                </>
              ) : (
                <>
                  <span>Inspect Site</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Inline Feedback */}
        {hasError && (
          <div className="flex items-center gap-1.5 text-xs text-rose-400 px-4 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{validation.error}</span>
          </div>
        )}

        {hasWarning && !hasError && (
          <div className="flex items-center gap-1.5 text-xs text-amber-300 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{validation.warning}</span>
          </div>
        )}
      </div>

      {/* Discovered Site Card (ONLY visible after user inspects site) */}
      {isInspected && !isLoading && (
        <div className="max-w-2xl mx-auto p-5 sm:p-6 bg-slate-900/90 border border-emerald-500/30 rounded-3xl shadow-xl space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Website Metadata Successfully Extracted</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              Ready for APK Build
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl p-1.5 border border-slate-700 shadow-xl flex items-center justify-center shrink-0 overflow-hidden"
              style={{ backgroundColor: config.iconBgColor || '#ffffff' }}
            >
              <img
                src={config.iconDataUrl}
                alt={config.appName}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white truncate">{config.appName}</h3>
              <p className="text-xs text-slate-400 font-mono truncate">{config.url}</p>
              <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-slate-300">HTTPS Validated</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-teal-400" />
                  <span>{discoveredIcons.length} Favicons Discovered</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onNext}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-2xl shadow-lg shadow-emerald-500/25 active:scale-95 transition-all text-sm cursor-pointer"
            >
              <span>Next: Customize Launcher Icon</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
