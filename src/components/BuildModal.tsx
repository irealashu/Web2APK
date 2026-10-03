import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { BuildResult, AppConfig } from '../types/apk';
import {
  X,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { Android3DIcon } from './Android3DIcon';

interface BuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  buildResult: BuildResult | null;
  config: AppConfig;
}

export const BuildModal: React.FC<BuildModalProps> = ({
  isOpen,
  onClose,
  buildResult,
  config,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !buildResult || !mounted) return null;

  const handleCopyApkLink = () => {
    const downloadUrl = window.location.origin + '/api/download-apk';
    navigator.clipboard.writeText(downloadUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const modalContent = (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-950 to-slate-900 border border-emerald-500/40 p-1 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
              <Android3DIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Android APK Ready
              </h2>
              <p className="text-xs text-slate-400">
                Standalone signed APK file ready to install
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* App Info Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="w-16 h-16 rounded-full p-1 bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0 shadow-lg overflow-hidden">
              <img
                src={config.iconDataUrl}
                alt="App Icon"
                className="w-full h-full rounded-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-white truncate">{buildResult.appName}</h3>
              <p className="text-xs text-slate-400 font-mono truncate">{buildResult.packageName}</p>
              <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                <span>Version: <strong className="text-slate-200">{config.versionName}</strong></span>
                <span>•</span>
                <span>Size: <strong className="text-emerald-400">{buildResult.apkSizeFormatted || '1.2 MB'}</strong></span>
                <span>•</span>
                <span>Package type: <strong className="text-emerald-400 font-semibold">Signed APK</strong></span>
              </div>
            </div>
          </div>

          {/* Primary APK Download Action Button */}
          <div className="space-y-3">
            <a
              href={buildResult.apkBlobUrl || '/api/download-apk'}
              download={buildResult.apkFileName}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-2xl shadow-xl shadow-emerald-500/25 active:scale-95 transition-all text-base cursor-pointer"
            >
              <Download className="w-5 h-5 text-slate-950" />
              <span>Download APK ({buildResult.apkFileName})</span>
            </a>

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={handleCopyApkLink}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-emerald-400 transition-colors py-2 px-3 rounded-lg hover:bg-slate-800/60 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Direct Download Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Direct APK Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Installation Instructions */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs">
            <span className="font-semibold text-emerald-400">Installation Instructions:</span>
            <ol className="list-decimal list-inside space-y-1 text-slate-300">
              <li>Download the APK file directly to your Android device or emulator.</li>
              <li>When prompted, allow <em>"Install from Unknown Sources"</em> in Android Settings.</li>
              <li>Open the APK file to complete installation and launch your web app.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
