import React from 'react';
import {
  ArrowLeft,
  Sparkles,
  Download,
  CheckCircle2,
  FileCode,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Globe,
  Sliders,
  Layers,
} from 'lucide-react';
import { AppConfig, BuildResult } from '../../types/apk';

interface Step4ReviewBuildProps {
  config: AppConfig;
  onBack: () => void;
  isBuilding: boolean;
  buildProgress: { percent: number; status: string };
  buildResult: BuildResult | null;
  onBuild: () => Promise<void>;
  onOpenModal: () => void;
}

export const Step4ReviewBuild: React.FC<Step4ReviewBuildProps> = ({
  config,
  onBack,
  isBuilding,
  buildProgress,
  buildResult,
  onBuild,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    const downloadUrl = window.location.origin + '/api/download-apk';
    navigator.clipboard.writeText(downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCircle = config.iconShape === 'circle';

  // Extract list of enabled permissions for review
  const enabledPermissionsList: string[] = [];
  if (config.enableCamera) enabledPermissionsList.push('Camera & QR Scanner');
  if (config.enableMicrophone) enabledPermissionsList.push('Microphone / WebRTC');
  if (config.enableGeolocation) enabledPermissionsList.push('GPS Geolocation');
  if (config.enableDownloads) enabledPermissionsList.push('File Storage & Downloads');
  if (config.enableNotifications) enabledPermissionsList.push('Push Notifications');
  if (config.enableVibration) enabledPermissionsList.push('Haptics & Vibration');
  if (config.enableBiometrics) enabledPermissionsList.push('Biometrics & Passkeys');
  if (config.enableBluetooth) enabledPermissionsList.push('Web Bluetooth');
  if (config.enableNfc) enabledPermissionsList.push('Web NFC');
  if (config.enableWakeLock) enabledPermissionsList.push('Screen Wake Lock');
  if (config.enableBackgroundAudio) enabledPermissionsList.push('Background Audio Playback');
  if (config.enableNetworkState) enabledPermissionsList.push('Network State Detection');

  return (
    <div className="space-y-8 animate-fade-in gpu-layer max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 4: Review Specifications & Compile APK</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Review Specifications & Compile APK
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Verify configuration settings and compile your standalone signed Android APK in-browser.
        </p>
      </div>

      <div className="space-y-6">
        {/* App Specification Sheet */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center justify-between pb-3.5 border-b border-slate-800">
            <span className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>Build Configuration Summary</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-500/30">
              Ready to Compile
            </span>
          </h3>

          {/* App Identity Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
            <div
              className={`w-16 h-16 aspect-square shadow-xl flex items-center justify-center overflow-hidden shrink-0 ${
                isCircle ? 'rounded-full' : 'rounded-2xl'
              }`}
              style={{
                backgroundColor: config.iconBgColor || '#ffffff',
                padding: `${Math.max(2, (config.iconPadding / 100) * 28)}px`,
              }}
            >
              <img
                src={config.iconDataUrl}
                alt={config.appName}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-bold text-white truncate">{config.appName}</h4>
              <p className="text-xs text-slate-400 font-mono truncate">{config.packageName}</p>
              <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                <span>Version: <strong className="text-slate-200 font-mono">{config.versionName}</strong> (Code: {config.versionCode})</span>
                <span>•</span>
                <span className="capitalize">{config.iconShape} Launcher Icon</span>
                <span>•</span>
                <span>Package type: <strong className="text-emerald-400 font-semibold">Signed APK</strong></span>
              </div>
            </div>
          </div>

          {/* Spec Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
            <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/60">
              <span className="text-slate-400 block text-[11px]">Website Endpoint</span>
              <span className="text-white font-mono truncate block font-medium mt-1">
                {config.url}
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/60">
              <span className="text-slate-400 block text-[11px]">Package Type</span>
              <span className="text-emerald-400 font-semibold block mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Signed APK</span>
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/60">
              <span className="text-slate-400 block text-[11px]">Orientation Lock</span>
              <span className="text-white capitalize block font-medium mt-1">
                {config.orientation}
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/60 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[11px]">Status Bar Tint</span>
                <span className="text-white font-mono block font-medium mt-1">
                  {config.statusBarColor}
                </span>
              </div>
              <div
                className="w-6 h-6 rounded-lg border border-slate-700 shadow-sm"
                style={{ backgroundColor: config.statusBarColor }}
              />
            </div>
          </div>

          {/* Enabled Web Permissions Summary */}
          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Enabled Web Permissions ({enabledPermissionsList.length}):</span>
              </span>
            </div>

            {enabledPermissionsList.length > 0 ? (
              <div className="flex items-center gap-2 flex-wrap text-xs">
                {enabledPermissionsList.map((p) => (
                  <span
                    key={p}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium"
                  >
                    {p}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-slate-500 italic block">
                No optional permissions enabled (Standard network connectivity only)
              </span>
            )}
          </div>
        </div>

        {/* Primary Action Button Box */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-2 border-emerald-500/40 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Compile Android APK</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Client-side browser packaging into standalone signed Android APK
              </p>
            </div>

            {buildResult && (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5 self-start sm:self-auto">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Build Ready</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onBuild}
            disabled={isBuilding}
            className="w-full flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-2xl shadow-xl shadow-emerald-500/25 active:scale-95 disabled:opacity-50 transition-all text-base cursor-pointer"
          >
            {isBuilding ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
                <span>Building APK ({buildProgress.percent}%)...</span>
              </>
            ) : buildResult ? (
              <>
                <Download className="w-5 h-5 text-slate-950" />
                <span>Download APK ({buildResult.apkFileName})</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>Build & Compile APK Now</span>
              </>
            )}
          </button>

          {/* Real-time Progress Bar */}
          {isBuilding && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                <span className="truncate max-w-[320px]">{buildProgress.status}</span>
                <span className="text-emerald-400 font-bold">{buildProgress.percent}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${buildProgress.percent}%` }}
                />
              </div>
            </div>
          )}

          {/* Download Link Copier */}
          {buildResult && (
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <span className="text-xs text-slate-400 font-mono">
                Size: {buildResult.apkSizeFormatted || '1.2 MB'}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Copy Download Link'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to App Settings</span>
        </button>
      </div>
    </div>
  );
};
