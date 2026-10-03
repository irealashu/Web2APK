import React, { useState } from 'react';
import { Award, Github } from 'lucide-react';
import { CreditsModal } from './CreditsModal';
import { Android3DIcon } from './Android3DIcon';

export const Navbar: React.FC = () => {
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Clean Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 p-1 shadow-lg shadow-emerald-500/20 flex items-center justify-center hover-lift group">
            <Android3DIcon className="w-8 h-8 group-hover:scale-105 transition-transform duration-200" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight inline-flex items-center">
                <span className="text-white">Web</span>
                <span className="text-blue-500">2</span>
                <span className="text-emerald-400">APK</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Website to Android APK Converter
            </p>
          </div>
        </div>

        {/* Top Right: Improved Credits Button with Live Status Indicator */}
        <div className="flex items-center gap-2.5">
          <a
            href="https://github.com/irealashu"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub: @irealashu"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <Github className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-[11px]">irealashu</span>
          </a>

          <button
            type="button"
            onClick={() => setIsCreditsOpen(true)}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-750 hover:border-emerald-500/50 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm cursor-pointer"
          >
            <div className="w-5 h-5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 group-hover:bg-emerald-500/20 transition-transform">
              <Award className="w-3.5 h-3.5" />
            </div>
            <span>Credits</span>
          </button>
        </div>
      </div>

      {/* Credits Modal */}
      <CreditsModal isOpen={isCreditsOpen} onClose={() => setIsCreditsOpen(false)} />
    </header>
  );
};
