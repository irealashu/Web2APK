import React, { useRef, useState } from 'react';
import { AppConfig } from '../types/apk';
import {
  Upload,
  Circle,
  Square,
  Layers,
  Eye,
  Smartphone,
  LayoutGrid,
  Image as ImageIcon,
  Palette,
  Wand2,
} from 'lucide-react';
import { detectIconBackgroundColor } from '../utils/urlInspector';

interface IconCustomizerProps {
  config: AppConfig;
  onChange: (updated: Partial<AppConfig>) => void;
  discoveredIcons: string[];
}

export const IconCustomizer: React.FC<IconCustomizerProps> = ({
  config,
  onChange,
  discoveredIcons,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewStyleMode, setPreviewStyleMode] = useState<
    'launcher' | 'homescreen' | 'dock' | 'layers'
  >('launcher');
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isSampling, setIsSampling] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setImageLoadError(false);
          setIsSampling(true);
          try {
            const detectedBg = await detectIconBackgroundColor(dataUrl, '#ffffff');
            onChange({
              iconDataUrl: dataUrl,
              iconBgColor: detectedBg,
              iconPadding: config.iconPadding || 14,
            });
          } catch {
            onChange({ iconDataUrl: dataUrl });
          } finally {
            setIsSampling(false);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectDiscoveredIcon = async (iconUrl: string) => {
    setImageLoadError(false);
    setIsSampling(true);
    try {
      const detectedBg = await detectIconBackgroundColor(iconUrl, '#ffffff');
      onChange({
        iconDataUrl: iconUrl,
        iconBgColor: detectedBg,
        iconPadding: config.iconPadding || 14,
      });
    } catch {
      onChange({ iconDataUrl: iconUrl });
    } finally {
      setIsSampling(false);
    }
  };

  const handleAutoMatchColor = async () => {
    if (!config.iconDataUrl) return;
    setIsSampling(true);
    try {
      const detectedBg = await detectIconBackgroundColor(config.iconDataUrl, '#ffffff');
      onChange({
        iconBgColor: detectedBg,
        iconPadding: Math.max(12, config.iconPadding),
      });
    } finally {
      setIsSampling(false);
    }
  };

  // Helper for True Geometric Circle and Square
  const isCircle = config.iconShape === 'circle';

  // Resolved background color for padding fill
  const resolvedBgColor =
    config.iconBgColor && config.iconBgColor !== 'transparent'
      ? config.iconBgColor
      : '#ffffff';

  // Fallback initial letter if icon fails to load
  const appInitial = (config.appName || 'A').charAt(0).toUpperCase();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Circle className="w-5 h-5 fill-emerald-500/20 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Launcher Icon Customizer
            </h3>
            <p className="text-xs text-slate-400">
              Auto-matched background padding ensures icons are never cut off
            </p>
          </div>
        </div>

        {/* Live Preview Style Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {[
            { id: 'launcher', label: 'Launcher', icon: Eye },
            { id: 'homescreen', label: 'Home Grid', icon: LayoutGrid },
            { id: 'dock', label: 'Dock', icon: Smartphone },
            { id: 'layers', label: 'Layers', icon: Layers },
          ].map((mode) => {
            const isSel = previewStyleMode === mode.id;
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setPreviewStyleMode(mode.id as any)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                  isSel
                    ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/80'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden sm:inline">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Dynamic Live Icon Preview Showcase */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-950/90 border border-slate-800/80 rounded-2xl p-6 relative min-h-[280px]">
          {/* Ambient Glow */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none blur-2xl transition-colors duration-500"
            style={{
              background: `radial-gradient(circle at 50% 40%, ${config.themeColor || '#10b981'} 0%, transparent 70%)`,
            }}
          />

          {/* MODE 1: Standalone Android Launcher Icon (Seamless Auto-Colored Padding) */}
          {previewStyleMode === 'launcher' && (
            <div className="relative flex flex-col items-center animate-fade-in gpu-layer py-2">
              <div className="relative mb-3 flex items-center justify-center p-2">
                {/* Main Icon Frame with Seamless Padding Fill */}
                <div
                  className={`w-28 h-28 sm:w-32 sm:h-32 aspect-square shadow-2xl flex items-center justify-center relative transition-all duration-300 overflow-hidden ring-1 ring-white/10 ${
                    isCircle ? 'rounded-full' : 'rounded-2xl'
                  }`}
                  style={{
                    backgroundColor: resolvedBgColor,
                    padding: `${Math.max(6, (config.iconPadding / 100) * 52)}px`,
                    boxShadow: '0 20px 35px -10px rgba(0,0,0,0.8), 0 0 25px -5px rgba(16, 185, 129, 0.25)',
                  }}
                >
                  {!imageLoadError && config.iconDataUrl ? (
                    <img
                      src={config.iconDataUrl}
                      alt={config.appName}
                      onError={() => setImageLoadError(true)}
                      className="w-full h-full object-contain max-w-full max-h-full transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-900 font-bold text-3xl">
                      {appInitial}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center mt-2">
                <span className="text-sm font-bold text-white block truncate max-w-[180px]">
                  {config.appName || 'Web Application'}
                </span>
                <span className="text-[11px] text-emerald-400 font-mono capitalize">
                  {config.iconShape} • BG: {resolvedBgColor}
                </span>
              </div>
            </div>
          )}

          {/* MODE 2: Android Home Screen Mockup */}
          {previewStyleMode === 'homescreen' && (
            <div className="w-full max-w-[260px] p-3.5 rounded-2xl bg-gradient-to-b from-indigo-950/80 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl animate-fade-in gpu-layer">
              <div className="text-[10px] text-slate-400 text-center mb-3 font-mono">
                Android Home Screen Preview
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { name: 'Chrome', icon: '🌐', bg: '#ffffff' },
                  { name: 'Photos', icon: '🌸', bg: '#ffffff' },
                  { name: 'Camera', icon: '📷', bg: '#1e293b' },
                ].map((app) => (
                  <div key={app.name} className="flex flex-col items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-base shadow"
                      style={{ backgroundColor: app.bg }}
                    >
                      {app.icon}
                    </div>
                    <span className="text-[9px] text-slate-300 mt-1 truncate max-w-[48px]">
                      {app.name}
                    </span>
                  </div>
                ))}

                {/* Converted App with Auto Padding Fill */}
                <div className="flex flex-col items-center relative">
                  <div
                    className={`w-10 h-10 aspect-square shadow-lg flex items-center justify-center ring-2 ring-emerald-400/80 overflow-hidden ${
                      isCircle ? 'rounded-full' : 'rounded-xl'
                    }`}
                    style={{
                      backgroundColor: resolvedBgColor,
                      padding: `${Math.max(2, config.iconPadding * 0.3)}px`,
                    }}
                  >
                    {!imageLoadError && config.iconDataUrl ? (
                      <img
                        src={config.iconDataUrl}
                        alt="App"
                        onError={() => setImageLoadError(true)}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-slate-900 font-bold text-xs">{appInitial}</span>
                    )}
                  </div>
                  <span className="text-[9px] text-emerald-300 font-bold mt-1 truncate max-w-[52px]">
                    {config.appName}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* MODE 3: Android Bottom Dock Mockup */}
          {previewStyleMode === 'dock' && (
            <div className="w-full max-w-[260px] p-3 rounded-2xl bg-slate-900/90 border border-slate-700/60 shadow-2xl animate-fade-in gpu-layer">
              <div className="text-[10px] text-slate-400 text-center mb-2 font-mono">
                Android System Dock
              </div>
              <div className="flex items-center justify-around bg-white/5 backdrop-blur-md p-2 rounded-2xl border border-white/10">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs">
                  📞
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                  💬
                </div>
                {/* Converted App */}
                <div
                  className={`w-11 h-11 aspect-square ring-2 ring-emerald-400 shadow-xl flex items-center justify-center overflow-hidden ${
                    isCircle ? 'rounded-full' : 'rounded-xl'
                  }`}
                  style={{
                    backgroundColor: resolvedBgColor,
                    padding: `${Math.max(2, config.iconPadding * 0.3)}px`,
                  }}
                >
                  {!imageLoadError && config.iconDataUrl ? (
                    <img
                      src={config.iconDataUrl}
                      alt="Dock Icon"
                      onError={() => setImageLoadError(true)}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-slate-900 font-bold text-xs">{appInitial}</span>
                  )}
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white text-xs">
                  ⚙️
                </div>
              </div>
            </div>
          )}

          {/* MODE 4: Adaptive Multi-Layer Inspector */}
          {previewStyleMode === 'layers' && (
            <div className="flex items-center gap-3 animate-fade-in gpu-layer">
              {/* Foreground Favicon */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 p-2 shadow flex items-center justify-center">
                  <img src={config.iconDataUrl} alt="Foreground" className="w-full h-full object-contain" />
                </div>
                <span className="text-[9px] text-slate-400 mt-1">Website Favicon</span>
              </div>
              <span className="text-slate-600 font-bold">+</span>
              {/* Background Color Layer */}
              <div className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-2xl border border-slate-700 shadow flex items-center justify-center text-[10px] font-mono text-slate-800 font-bold"
                  style={{ backgroundColor: resolvedBgColor }}
                >
                  {resolvedBgColor}
                </div>
                <span className="text-[9px] text-slate-400 mt-1">Auto Padding Color</span>
              </div>
              <span className="text-slate-600 font-bold">=</span>
              {/* Final Adaptive Icon */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 aspect-square border-2 border-emerald-400 shadow-lg flex items-center justify-center overflow-hidden ${
                    isCircle ? 'rounded-full' : 'rounded-2xl'
                  }`}
                  style={{
                    backgroundColor: resolvedBgColor,
                    padding: `${Math.max(2, config.iconPadding * 0.4)}px`,
                  }}
                >
                  <img src={config.iconDataUrl} alt="Output" className="w-full h-full object-contain" />
                </div>
                <span className="text-[9px] text-emerald-400 font-semibold mt-1">Adaptive Launcher</span>
              </div>
            </div>
          )}

          {/* Densities indicator */}
          <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>mdpi • hdpi • xhdpi • xxhdpi • xxxhdpi</span>
          </div>
        </div>

        {/* Right: Customization Controls */}
        <div className="lg:col-span-7 space-y-4">
          {/* Icon Shape: Two Styles */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Icon Shape</span>
              <span className="text-[11px] font-semibold text-emerald-400 capitalize">
                {config.iconShape}
              </span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'circle', label: 'Circle (Round)', icon: Circle, desc: 'Android round adaptive icon' },
                { id: 'square', label: 'Square (Rounded)', icon: Square, desc: 'Classic rectangular rounded icon' },
              ].map((shape) => {
                const isSelected = config.iconShape === shape.id;
                const IconComp = shape.icon;
                return (
                  <button
                    key={shape.id}
                    type="button"
                    onClick={() => onChange({ iconShape: shape.id as 'circle' | 'square' })}
                    className={`py-2.5 px-3.5 rounded-2xl text-xs font-semibold flex flex-col items-start gap-0.5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <IconComp className={`w-3.5 h-3.5 ${shape.id === 'circle' ? 'rounded-full' : ''}`} />
                      <span className="text-xs font-bold">{shape.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {shape.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Auto Background Padding Color Fill */}
          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-emerald-400" />
                <span>Padding Fill Color (Anti-Cutoff)</span>
              </label>

              <button
                type="button"
                onClick={handleAutoMatchColor}
                disabled={isSampling}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
                title="Auto sample image edge color"
              >
                <Wand2 className="w-3 h-3" />
                <span>{isSampling ? 'Sampling...' : 'Auto Match Edge Color'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {[
                { label: 'Auto/Detected', color: resolvedBgColor },
                { label: 'White', color: '#ffffff' },
                { label: 'Dark', color: '#0f172a' },
                { label: 'Black', color: '#000000' },
                { label: 'Theme', color: config.themeColor || '#10b981' },
              ].map((swatch, idx) => {
                const isCurrent = (config.iconBgColor || '#ffffff').toLowerCase() === swatch.color.toLowerCase();
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onChange({ iconBgColor: swatch.color })}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-all cursor-pointer ${
                      isCurrent
                        ? 'border-emerald-400 ring-2 ring-emerald-400/30 bg-slate-800 text-white font-semibold'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/20"
                      style={{ backgroundColor: swatch.color }}
                    />
                    <span>{swatch.label}</span>
                  </button>
                );
              })}

              {/* Custom Hex input */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2 py-0.5 text-xs text-slate-300 ml-auto">
                <span className="text-slate-500">#</span>
                <input
                  type="text"
                  value={(config.iconBgColor || 'ffffff').replace(/^#/, '')}
                  onChange={(e) => onChange({ iconBgColor: '#' + e.target.value })}
                  placeholder="ffffff"
                  maxLength={6}
                  className="w-14 bg-transparent text-xs text-emerald-400 font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Favicon Safe-Zone Padding Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>Adaptive Safe-Zone Padding</span>
              <span className="text-emerald-400 font-mono">{config.iconPadding}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={config.iconPadding}
              onChange={(e) => onChange({ iconPadding: parseInt(e.target.value, 10) })}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-950 rounded-lg appearance-none"
            />
          </div>

          {/* Discovered Favicons & Custom Upload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Discovered Favicon Sources</span>
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Custom Image</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {discoveredIcons && discoveredIcons.length > 0 ? (
                discoveredIcons.map((iconUrl, idx) => {
                  const isSelected = config.iconDataUrl === iconUrl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectDiscoveredIcon(iconUrl)}
                      className={`w-11 h-11 rounded-xl bg-slate-950 p-1.5 flex items-center justify-center shrink-0 transition-all hover:scale-105 relative group cursor-pointer border ${
                        isSelected
                          ? 'border-emerald-400 ring-2 ring-emerald-400/40 bg-emerald-950/30'
                          : 'border-slate-800 hover:border-emerald-500/60'
                      }`}
                      title={iconUrl}
                    >
                      <img
                        src={iconUrl}
                        alt={`Favicon ${idx + 1}`}
                        className="w-full h-full object-contain rounded-md"
                        onError={(e) => {
                          (e.target as HTMLElement).parentElement?.classList.add('hidden');
                        }}
                      />
                    </button>
                  );
                })
              ) : (
                <div className="text-xs text-slate-500 py-1">Auto-detected favicon in use</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
