import React, { useState, useRef, useEffect } from 'react';
import { AppConfig } from '../types/apk';
import {
  Sliders,
  Palette,
  Globe,
  ShieldCheck,
  Camera,
  Mic,
  MapPin,
  Download,
  Bell,
  Vibrate,
  Fingerprint,
  Bluetooth,
  Radio,
  SunMedium,
  Music,
  Wifi,
  AlertCircle,
  CheckSquare,
  Square,
  Search,
  X,
  Maximize2,
  Minimize2,
  ChevronDown,
} from 'lucide-react';
import {
  validateAppName,
  validatePackageName,
  validateVersionName,
  validateVersionCode,
  validateHexColor,
} from '../utils/validators';

interface SettingsTabsProps {
  config: AppConfig;
  onChange: (updated: Partial<AppConfig>) => void;
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({ config, onChange }) => {
  const [activeTab, setActiveTab] = useState<'identity' | 'display' | 'webview' | 'permissions'>(
    'identity'
  );
  const [permSearch, setPermSearch] = useState<string>('');
  const [permCategory, setPermCategory] = useState<
    'all' | 'media' | 'sensors' | 'connectivity' | 'storage' | 'selected'
  >('all');
  const [isPermExpanded, setIsPermExpanded] = useState<boolean>(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const checkScrollPosition = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 25;
    setIsScrolledToBottom(isAtBottom);
  };

  useEffect(() => {
    checkScrollPosition();
  }, [activeTab, permSearch, permCategory, isPermExpanded]);

  // Field validations
  const appNameValidation = validateAppName(config.appName);
  const pkgValidation = validatePackageName(config.packageName);
  const versionNameValidation = validateVersionName(config.versionName);
  const versionCodeValidation = validateVersionCode(config.versionCode);
  const statusBarValidation = validateHexColor(config.statusBarColor);
  const navBarValidation = validateHexColor(config.navBarColor);
  const splashBgValidation = validateHexColor(config.splashBgColor);

  const hasIdentityErrors =
    !appNameValidation.isValid ||
    !pkgValidation.isValid ||
    !versionNameValidation.isValid ||
    !versionCodeValidation.isValid;

  const hasDisplayErrors =
    !statusBarValidation.isValid ||
    !navBarValidation.isValid ||
    !splashBgValidation.isValid;

  const allWebPermissions = [
    {
      id: 'enableCamera' as const,
      label: 'Camera & Video Capture',
      category: 'media' as const,
      api: 'navigator.mediaDevices.getUserMedia, <input type="file" capture>',
      manifest: 'android.permission.CAMERA',
      val: config.enableCamera,
      icon: Camera,
    },
    {
      id: 'enableMicrophone' as const,
      label: 'Microphone & Audio Input',
      category: 'media' as const,
      api: 'Web Audio API, SpeechRecognition, WebRTC',
      manifest: 'android.permission.RECORD_AUDIO',
      val: config.enableMicrophone,
      icon: Mic,
    },
    {
      id: 'enableGeolocation' as const,
      label: 'GPS & Geolocation',
      category: 'sensors' as const,
      api: 'navigator.geolocation.getCurrentPosition()',
      manifest: 'android.permission.ACCESS_FINE_LOCATION',
      val: config.enableGeolocation,
      icon: MapPin,
    },
    {
      id: 'enableDownloads' as const,
      label: 'File Downloads & Blob Storage',
      category: 'storage' as const,
      api: '<a download>, fetch() Blob downloads, PDF exports',
      manifest: 'android.permission.WRITE_EXTERNAL_STORAGE',
      val: config.enableDownloads,
      icon: Download,
    },
    {
      id: 'enableNotifications' as const,
      label: 'Push Notifications',
      category: 'storage' as const,
      api: 'Notification API, Web Push, Service Worker alerts',
      manifest: 'android.permission.POST_NOTIFICATIONS',
      val: config.enableNotifications,
      icon: Bell,
    },
    {
      id: 'enableVibration' as const,
      label: 'Haptic Feedback & Vibration',
      category: 'sensors' as const,
      api: 'navigator.vibrate([100, 50, 100])',
      manifest: 'android.permission.VIBRATE',
      val: config.enableVibration,
      icon: Vibrate,
    },
    {
      id: 'enableBiometrics' as const,
      label: 'Biometric & Passkeys Auth',
      category: 'sensors' as const,
      api: 'WebAuthn API, PublicKeyCredential, Fingerprint',
      manifest: 'android.permission.USE_BIOMETRIC',
      val: config.enableBiometrics,
      icon: Fingerprint,
    },
    {
      id: 'enableBluetooth' as const,
      label: 'Web Bluetooth (BLE)',
      category: 'connectivity' as const,
      api: 'navigator.bluetooth.requestDevice()',
      manifest: 'android.permission.BLUETOOTH_CONNECT',
      val: config.enableBluetooth,
      icon: Bluetooth,
    },
    {
      id: 'enableNfc' as const,
      label: 'Web NFC (Contactless)',
      category: 'connectivity' as const,
      api: 'NDEFReader, Web NFC scan/write',
      manifest: 'android.permission.NFC',
      val: config.enableNfc,
      icon: Radio,
    },
    {
      id: 'enableWakeLock' as const,
      label: 'Screen Wake Lock',
      category: 'sensors' as const,
      api: 'navigator.wakeLock.request("screen")',
      manifest: 'android.permission.WAKE_LOCK',
      val: config.enableWakeLock,
      icon: SunMedium,
    },
    {
      id: 'enableBackgroundAudio' as const,
      label: 'Background Audio Playback',
      category: 'media' as const,
      api: 'MediaSession API, HTML5 <audio> streaming in background',
      manifest: 'android.permission.FOREGROUND_SERVICE',
      val: config.enableBackgroundAudio,
      icon: Music,
    },
    {
      id: 'enableNetworkState' as const,
      label: 'Network & Wi-Fi State Info',
      category: 'connectivity' as const,
      api: 'navigator.connection, window.ononline/onoffline',
      manifest: 'android.permission.ACCESS_NETWORK_STATE',
      val: config.enableNetworkState,
      icon: Wifi,
    },
  ];

  const handleSelectAllPermissions = (enable: boolean) => {
    const updates: Partial<AppConfig> = {};
    allWebPermissions.forEach((p) => {
      updates[p.id] = enable;
    });
    onChange(updates);
  };

  const selectedCount = allWebPermissions.filter((p) => p.val).length;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
      {/* Tab Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-800 bg-slate-950/40 p-1.5 gap-1.5">
        {[
          { id: 'identity', label: 'App Identity', icon: Sliders, hasError: hasIdentityErrors },
          { id: 'display', label: 'Display & Splash', icon: Palette, hasError: hasDisplayErrors },
          { id: 'webview', label: 'WebView & Offline', icon: Globe, hasError: false },
          {
            id: 'permissions',
            label: `Permissions (${selectedCount})`,
            icon: ShieldCheck,
            hasError: false,
          },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer relative truncate ${
                isSelected
                  ? 'bg-slate-800 text-emerald-400 shadow-md border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <IconComp className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{tab.label}</span>
              {tab.hasError && (
                <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-950 ml-0.5 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      <div className="p-5">
        {/* Tab 1: App Identity */}
        {activeTab === 'identity' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Application Name */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Application Name</span>
                  <span className="text-[10px] text-slate-400">{config.appName.length}/50</span>
                </label>
                <input
                  type="text"
                  value={config.appName}
                  maxLength={50}
                  onChange={(e) => onChange({ appName: e.target.value })}
                  placeholder="e.g. My Website App"
                  className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none transition-colors ${
                    !appNameValidation.isValid
                      ? 'border-rose-500/80 focus:border-rose-400'
                      : 'border-slate-800 focus:border-emerald-500'
                  }`}
                />
                {!appNameValidation.isValid ? (
                  <span className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {appNameValidation.error}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Name shown on Android launcher & homescreen
                  </span>
                )}
              </div>

              {/* Package Name */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Package Name (Application ID)
                </label>
                <input
                  type="text"
                  value={config.packageName}
                  onChange={(e) => onChange({ packageName: e.target.value.toLowerCase().replace(/\s/g, '') })}
                  placeholder="com.mycompany.app"
                  className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none transition-colors ${
                    !pkgValidation.isValid
                      ? 'border-rose-500/80 focus:border-rose-400'
                      : 'border-slate-800 focus:border-emerald-500'
                  }`}
                />
                {!pkgValidation.isValid ? (
                  <span className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {pkgValidation.error}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Reverse-domain format: e.g. com.example.app
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Version Name */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Version Name
                </label>
                <input
                  type="text"
                  value={config.versionName}
                  maxLength={20}
                  onChange={(e) => onChange({ versionName: e.target.value })}
                  placeholder="1.0.0"
                  className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none transition-colors ${
                    !versionNameValidation.isValid
                      ? 'border-rose-500/80 focus:border-rose-400'
                      : 'border-slate-800 focus:border-emerald-500'
                  }`}
                />
                {!versionNameValidation.isValid && (
                  <span className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {versionNameValidation.error}
                  </span>
                )}
              </div>

              {/* Version Code */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Version Code
                </label>
                <input
                  type="number"
                  min="1"
                  max="2100000000"
                  value={config.versionCode}
                  onChange={(e) => {
                    const parsed = parseInt(e.target.value, 10);
                    onChange({ versionCode: isNaN(parsed) ? 1 : parsed });
                  }}
                  className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none transition-colors ${
                    !versionCodeValidation.isValid
                      ? 'border-rose-500/80 focus:border-rose-400'
                      : 'border-slate-800 focus:border-emerald-500'
                  }`}
                />
                {!versionCodeValidation.isValid && (
                  <span className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {versionCodeValidation.error}
                  </span>
                )}
              </div>

              {/* Orientation */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Orientation Lock
                </label>
                <select
                  value={config.orientation}
                  onChange={(e) => onChange({ orientation: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="unspecified">Auto-Rotate (Sensor)</option>
                  <option value="portrait">Portrait Only</option>
                  <option value="landscape">Landscape Only</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Display & Splash */}
        {activeTab === 'display' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Status Bar */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Status Bar Tint Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.statusBarColor.startsWith('#') && config.statusBarColor.length === 7 ? config.statusBarColor : '#0f172a'}
                    onChange={(e) => onChange({ statusBarColor: e.target.value })}
                    className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-700 cursor-pointer p-0.5 shrink-0"
                  />
                  <input
                    type="text"
                    value={config.statusBarColor}
                    onChange={(e) => onChange({ statusBarColor: e.target.value })}
                    className={`flex-1 bg-slate-950 border rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none ${
                      !statusBarValidation.isValid ? 'border-rose-500' : 'border-slate-800 focus:border-emerald-500'
                    }`}
                  />
                </div>
                {!statusBarValidation.isValid && (
                  <span className="text-[11px] text-rose-400 mt-1 block">{statusBarValidation.error}</span>
                )}
              </div>

              {/* Navigation Bar */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Navigation Bar Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.navBarColor.startsWith('#') && config.navBarColor.length === 7 ? config.navBarColor : '#0f172a'}
                    onChange={(e) => onChange({ navBarColor: e.target.value })}
                    className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-700 cursor-pointer p-0.5 shrink-0"
                  />
                  <input
                    type="text"
                    value={config.navBarColor}
                    onChange={(e) => onChange({ navBarColor: e.target.value })}
                    className={`flex-1 bg-slate-950 border rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none ${
                      !navBarValidation.isValid ? 'border-rose-500' : 'border-slate-800 focus:border-emerald-500'
                    }`}
                  />
                </div>
                {!navBarValidation.isValid && (
                  <span className="text-[11px] text-rose-400 mt-1 block">{navBarValidation.error}</span>
                )}
              </div>
            </div>

            {/* Splash Screen Settings */}
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-3">
              <h4 className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>Splash Screen Branding</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                    <span>Splash Duration</span>
                    <span className="text-emerald-400 font-mono">{config.splashDuration}s</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={config.splashDuration}
                    onChange={(e) => onChange({ splashDuration: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-900 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 mb-1.5 block">
                    Splash Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.splashBgColor.startsWith('#') && config.splashBgColor.length === 7 ? config.splashBgColor : '#0f172a'}
                      onChange={(e) => onChange({ splashBgColor: e.target.value })}
                      className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-700 cursor-pointer p-0.5 shrink-0"
                    />
                    <input
                      type="text"
                      value={config.splashBgColor}
                      onChange={(e) => onChange({ splashBgColor: e.target.value })}
                      className={`flex-1 bg-slate-950 border rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none ${
                        !splashBgValidation.isValid ? 'border-rose-500' : 'border-slate-800 focus:border-emerald-500'
                      }`}
                    />
                  </div>
                  {!splashBgValidation.isValid && (
                    <span className="text-[11px] text-rose-400 mt-1 block">{splashBgValidation.error}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: WebView & Offline */}
        {activeTab === 'webview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'enablePullToRefresh',
                  label: 'Pull to Refresh',
                  desc: 'Allow swiping down on WebView to reload page',
                  val: config.enablePullToRefresh,
                },
                {
                  id: 'enableProgressBar',
                  label: 'Loading Progress Bar',
                  desc: 'Show colored top progress bar during navigation',
                  val: config.enableProgressBar,
                },
                {
                  id: 'enableJavaScript',
                  label: 'JavaScript Execution',
                  desc: 'Required for modern dynamic web apps & SPAs',
                  val: config.enableJavaScript,
                },
                {
                  id: 'enableDomStorage',
                  label: 'DOM & Local Storage',
                  desc: 'Persist logins, cookies & localStorage state',
                  val: config.enableDomStorage,
                },
                {
                  id: 'offlineFallback',
                  label: 'Offline Fallback Screen',
                  desc: 'Show customized offline retry screen when no internet',
                  val: config.offlineFallback,
                },
                {
                  id: 'enableExternalLinks',
                  label: 'External Links Handling',
                  desc: 'Open third-party URLs (tel, mailto, maps) in external apps',
                  val: config.enableExternalLinks,
                },
              ].map((toggle) => (
                <label
                  key={toggle.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={toggle.val}
                    onChange={(e) => onChange({ [toggle.id]: e.target.checked } as any)}
                    className="mt-1 w-4 h-4 rounded accent-emerald-500 bg-slate-900 border-slate-700 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      {toggle.label}
                    </span>
                    <span className="text-[11px] text-slate-400 block leading-snug mt-0.5">
                      {toggle.desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            {/* Custom User Agent */}
            <div className="pt-1">
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Custom User-Agent String (Optional)
              </label>
              <input
                type="text"
                value={config.userAgent}
                onChange={(e) => onChange({ userAgent: e.target.value })}
                placeholder="Leave blank to use default Android Chrome WebView User-Agent"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none transition-colors"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Web-Accessible Permissions */}
        {activeTab === 'permissions' && (
          <div className="space-y-4">
            {/* Header and Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white block">
                    Web-Accessible Device Permissions
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                    {selectedCount} Active
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Select which browser capabilities to enable in <span className="font-mono text-emerald-400">AndroidManifest.xml</span>
                </span>
              </div>

              {/* Action Buttons & View Mode Toggle */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <button
                  type="button"
                  onClick={() => setIsPermExpanded(!isPermExpanded)}
                  title={isPermExpanded ? 'Switch to Compact Scroll View' : 'Expand All (No Scroll)'}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 bg-slate-800 hover:bg-slate-750 hover:text-white border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isPermExpanded ? (
                    <>
                      <Minimize2 className="w-3 h-3 text-emerald-400" />
                      <span>Scroll View</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3 h-3 text-emerald-400" />
                      <span>Expand All</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectAllPermissions(true)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <CheckSquare className="w-3 h-3" />
                  <span>Select All</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectAllPermissions(false)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Square className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {/* Search Bar & Category Filters */}
            <div className="space-y-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={permSearch}
                  onChange={(e) => setPermSearch(e.target.value)}
                  placeholder="Filter permissions (e.g. camera, audio, bluetooth, gps)..."
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
                {permSearch && (
                  <button
                    type="button"
                    onClick={() => setPermSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                {[
                  { id: 'all', label: `All (${allWebPermissions.length})` },
                  { id: 'selected', label: `Selected (${selectedCount})` },
                  { id: 'media', label: 'Media (3)' },
                  { id: 'sensors', label: 'Sensors (4)' },
                  { id: 'connectivity', label: 'Connectivity (3)' },
                  { id: 'storage', label: 'Storage (2)' },
                ].map((cat) => {
                  const isActive = permCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setPermCategory(cat.id as any)}
                      className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                          : 'bg-slate-950/50 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Permission Scroll / Expanded Container */}
            <div className="relative">
              {(() => {
                const filteredPermissions = allWebPermissions.filter((perm) => {
                  if (permCategory === 'selected' && !perm.val) return false;
                  if (
                    permCategory !== 'all' &&
                    permCategory !== 'selected' &&
                    perm.category !== permCategory
                  )
                    return false;
                  if (permSearch.trim()) {
                    const q = permSearch.toLowerCase().trim();
                    return (
                      perm.label.toLowerCase().includes(q) ||
                      perm.manifest.toLowerCase().includes(q) ||
                      perm.api.toLowerCase().includes(q)
                    );
                  }
                  return true;
                });

                if (filteredPermissions.length === 0) {
                  return (
                    <div className="py-12 px-4 text-center bg-slate-950/40 rounded-2xl border border-slate-800/80 space-y-2">
                      <p className="text-xs text-slate-400">
                        No permissions found matching &quot;{permSearch}&quot; in category &quot;{permCategory}&quot;
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setPermSearch('');
                          setPermCategory('all');
                        }}
                        className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer"
                      >
                        Reset search filters
                      </button>
                    </div>
                  );
                }

                return (
                  <>
                    <div
                      ref={scrollContainerRef}
                      onScroll={checkScrollPosition}
                      className={`grid grid-cols-1 sm:grid-cols-2 gap-3 transition-all duration-200 scroll-smooth ${
                        isPermExpanded
                          ? 'max-h-none overflow-visible'
                          : 'max-h-[440px] sm:max-h-[480px] overflow-y-auto permission-scroll-container pr-2.5 sm:pr-3.5 pb-4 pt-1'
                      }`}
                    >
                      {filteredPermissions.map((perm) => {
                        const IconComp = perm.icon;
                        return (
                          <label
                            key={perm.id}
                            className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer hover:border-slate-700 select-none ${
                              perm.val
                                ? 'bg-slate-950/90 border-emerald-500/50 shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-500/20'
                                : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-950/60'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={perm.val}
                              onChange={(e) => onChange({ [perm.id]: e.target.checked } as any)}
                              className="mt-1 w-4 h-4 rounded accent-emerald-500 bg-slate-900 border-slate-700 cursor-pointer shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                    perm.val
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : 'bg-slate-900 text-slate-400'
                                  }`}
                                >
                                  <IconComp className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs font-semibold text-white truncate">
                                  {perm.label}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400 block leading-snug mt-1.5">
                                {perm.api}
                              </span>
                              <span className="text-[10px] font-mono text-emerald-400/90 block mt-1.5 truncate">
                                {perm.manifest}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    {/* Scroll Down Indicator (visible when scrollable and not at bottom) */}
                    {!isPermExpanded && !isScrolledToBottom && filteredPermissions.length > 4 && (
                      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent rounded-b-2xl flex items-end justify-center pb-1">
                        <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 bg-slate-950/90 px-3 py-0.5 rounded-full border border-emerald-500/20 backdrop-blur-md shadow-md animate-pulse">
                          <ChevronDown className="w-3 h-3" />
                          <span>Scroll down to see more permissions</span>
                        </span>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
