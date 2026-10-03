import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ExternalLink,
  Sparkles,
  Github,
  Award,
  Code2,
  CheckCircle2,
  ShieldCheck,
  Layers,
  Cpu,
  Heart,
} from 'lucide-react';
import { Android3DIcon } from './Android3DIcon';

interface ConversionTechCredit {
  name: string;
  author: string;
  role: string;
  license: string;
  url: string;
  badge: string;
}

export const CONVERSION_TECH_CREDITS: ConversionTechCredit[] = [
  {
    name: 'Android Open Source Project (AOSP) & AndroidX WebKit',
    author: 'Google LLC & Open Source Contributors',
    role: 'Chromium WebView container, hardware accelerated graphics pipeline, DOM storage, and JavaScript bridge integration.',
    license: 'Apache 2.0',
    url: 'https://source.android.com',
    badge: 'Core Runtime',
  },
  {
    name: 'Kotlin & Android Lifecycle Runtime',
    author: 'JetBrains & Google LLC',
    role: 'Native Android MainActivity architecture, back-button handling, and runtime permission verification.',
    license: 'Apache 2.0',
    url: 'https://kotlinlang.org',
    badge: 'Native Code',
  },
  {
    name: 'JSZip Client-Side Archive Deflation Engine',
    author: 'Stuart Knightley & JSZip Open Source Community',
    role: 'In-browser binary zip packaging, file hierarchy structuring, DEFLATE compression, and instantaneous client download generation.',
    license: 'MIT',
    url: 'https://stuk.github.io/jszip',
    badge: 'Packager',
  },
  {
    name: 'HTML5 Canvas 2D Multi-Density Mipmap Engine',
    author: 'W3C / WHATWG Web Standards',
    role: 'Multi-resolution launcher icon generation (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi) with automated perimeter edge color sampling.',
    license: 'Open Standard',
    url: 'https://html.spec.whatwg.org',
    badge: 'Icon Engine',
  },
  {
    name: 'W3C Web App Manifest & Favicon Discovery',
    author: 'W3C & Chromium Authors',
    role: 'Endpoint HTML parsing, Web App Manifest discovery, theme-color extraction, and responsive icon detection.',
    license: 'BSD / W3C',
    url: 'https://www.w3.org/TR/appmanifest',
    badge: 'Discovery',
  },
  {
    name: 'Tailwind CSS & Vite Next-Gen Toolchain',
    author: 'Tailwind Labs & Vite Community',
    role: 'High-performance reactive frontend interface, dark theme styling system, and ultra-fast asset compilation.',
    license: 'MIT',
    url: 'https://vite.dev',
    badge: 'Frontend',
  },
];

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'author' | 'technologies' | 'architecture'>('author');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle ESC key and prevent body scroll when open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md transition-all duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 p-1 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
              <Android3DIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                Web2APK Credits & Architecture
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Author contributions, open source engines & standalone runtime specifications
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/60 border border-slate-800/80 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('author')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'author'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>Author & Contributions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('technologies')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'technologies'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Core Engines ({CONVERSION_TECH_CREDITS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture & Privacy</span>
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-4 permission-scroll-container">
          {/* TAB 1: AUTHOR & CONTRIBUTIONS */}
          {activeTab === 'author' && (
            <div className="space-y-4 animate-fade-in">
              {/* Creator Spotlight Hero Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 border border-emerald-500/30 shadow-xl space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src="https://github.com/irealashu.png"
                        alt="irealashu"
                        onError={(e) => {
                          // Fallback if image fails
                          (e.target as HTMLImageElement).src =
                            'https://avatars.githubusercontent.com/u/9919?s=200&v=4';
                        }}
                        className="w-14 h-14 rounded-2xl border-2 border-emerald-400/60 object-cover shadow-lg shadow-emerald-950/50"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-slate-950" />
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base sm:text-lg font-black text-white tracking-tight">
                          Ashutosh Singh
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                          Creator
                        </span>
                      </div>
                      <a
                        href="https://github.com/irealashu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-mono mt-0.5 hover:underline"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>@irealashu</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* GitHub Profile Action Link */}
                  <a
                    href="https://github.com/irealashu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all cursor-pointer active:scale-95 shrink-0"
                  >
                    <Github className="w-4 h-4" />
                    <span>View GitHub Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Bio & Role */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed relative z-10">
                  Lead Software Architect and Developer of <strong>Web2APK</strong>. Designed and built the entire client-side APK compilation pipeline, multi-density adaptive icon synthesizer, and responsive developer studio.
                </p>

                {/* Highlights Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 relative z-10 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Architecture</span>
                    <span className="font-bold text-white text-xs">100% Client-Side</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Package Type</span>
                    <span className="font-bold text-emerald-400 text-xs">Signed APK</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">License</span>
                    <span className="font-bold text-white text-xs">Open Source MIT</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">GitHub ID</span>
                    <span className="font-mono text-emerald-400 text-xs">irealashu</span>
                  </div>
                </div>
              </div>

              {/* Detailed Technical Contributions Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Author Contributions & Innovations
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      title: 'Zero-Server In-Browser APK Compilation Engine',
                      desc: 'Engineered complete browser-based APK packaging using JSZip, generating standard Android project folder trees, DEX bytecode structures, META-INF signatures, and deflated ZIP containers without transmitting source code to external servers.',
                      icon: Cpu,
                    },
                    {
                      title: 'Adaptive Launcher Icon & Mipmap Generator',
                      desc: 'Authored HTML5 Canvas 2D multi-density asset pipeline producing 5 discrete mipmap resolutions (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi) with automated perimeter border sampling to eliminate launcher icon clipping.',
                      icon: Sparkles,
                    },
                    {
                      title: 'Dynamic AndroidManifest.xml & Permission Synthesizer',
                      desc: 'Created runtime declarative XML generator for hardware and browser permissions (Camera, Microphone, WebRTC, GPS, Notifications, Biometrics, Bluetooth, NFC, WakeLock) and WebView intent filters.',
                      icon: ShieldCheck,
                    },
                    {
                      title: 'Responsive 4-Step Studio & Live APK Inspection',
                      desc: 'Designed intuitive workflow for website discovery, automated favicon extraction, color palette sampling, and single-click download with QR code mobile installation support.',
                      icon: Layers,
                    },
                  ].map((item, idx) => {
                    const IconC = item.icon;
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                            <IconC className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold text-white">{item.title}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed pl-8">
                          {item.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TECHNOLOGIES & ENGINES */}
          {activeTab === 'technologies' && (
            <div className="space-y-3 animate-fade-in">
              {CONVERSION_TECH_CREDITS.map((tech) => (
                <div
                  key={tech.name}
                  className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                        {tech.name}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 font-semibold">
                        {tech.badge}
                      </span>
                    </div>

                    <a
                      href={tech.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors shrink-0 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20"
                    >
                      <span>Docs</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    <span className="text-slate-500">By:</span> {tech.author} •{' '}
                    <span className="text-slate-500">License:</span>{' '}
                    <span className="font-mono text-slate-300">{tech.license}</span>
                  </div>

                  <p className="text-xs text-slate-300 pt-0.5 leading-relaxed">
                    {tech.role}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: ARCHITECTURE & PRIVACY */}
          {activeTab === 'architecture' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Privacy-First Architecture</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Web2APK is architected with a strict client-side guarantee. When you convert a website, all APK deflation, manifest synthesis, asset mipmap resizing, and package compilation happen entirely inside your local browser runtime memory.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-300">Zero backend data tracking</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-300">Offline-ready compilation</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-300">Standard Android SDK output</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-300">Instant signed APK download</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wider">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Open Source Commitment</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Web2APK is built for the global developer and webmaster community. The generated APK package is compatible with Android 8.0 (API 26) through Android 15 (API 35).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>
              Crafted by{' '}
              <a
                href="https://github.com/irealashu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-emerald-400 font-bold underline decoration-emerald-500/40"
              >
                Ashutosh Singh (@irealashu)
              </a>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-300 transition-all cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
