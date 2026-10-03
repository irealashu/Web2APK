import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { StepProgressBar } from './components/StepProgressBar';
import { Step1Url } from './components/steps/Step1Url';
import { Step2Icon } from './components/steps/Step2Icon';
import { Step3Settings } from './components/steps/Step3Settings';
import { Step4ReviewBuild } from './components/steps/Step4ReviewBuild';
import { BuildModal } from './components/BuildModal';
import { AppConfig, BuildResult } from './types/apk';
import { generateFullAndroidPackage } from './utils/apkGenerator';
import { extractWebsiteData } from './utils/urlInspector';
import {
  validateUrl,
  validateAppName,
  validatePackageName,
  validateVersionName,
  validateVersionCode,
} from './utils/validators';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxStepUnlocked, setMaxStepUnlocked] = useState<number>(1);
  const [url, setUrl] = useState<string>('https://en.wikipedia.org');
  const [isInspected, setIsInspected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [discoveredIcons, setDiscoveredIcons] = useState<string[]>([]);
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [buildProgress, setBuildProgress] = useState<{ percent: number; status: string }>({
    percent: 0,
    status: '',
  });
  const [buildResult, setBuildResult] = useState<BuildResult | null>(null);
  const [isBuildModalOpen, setIsBuildModalOpen] = useState<boolean>(false);

  // App Configuration state
  const [config, setConfig] = useState<AppConfig>({
    url: '',
    appName: '',
    packageName: 'com.mywebapp.app',
    versionName: '1.0.0',
    versionCode: 1,
    iconShape: 'circle',
    iconBgColor: '#ffffff',
    iconPadding: 14,
    themeColor: '#10b981',
    statusBarColor: '#0f172a',
    navBarColor: '#0f172a',
    progressBarColor: '#10b981',
    isFullScreen: false,
    splashTitle: '',
    splashBgColor: '#0f172a',
    splashDuration: 1.5,
    enablePullToRefresh: true,
    enableProgressBar: true,
    offlineFallback: true,
    enableJavaScript: true,
    enableDomStorage: true,
    enableExternalLinks: true,
    enableCamera: false,
    enableMicrophone: false,
    enableGeolocation: false,
    enableDownloads: true,
    enableNotifications: false,
    enableVibration: false,
    enableBiometrics: false,
    enableBluetooth: false,
    enableNfc: false,
    enableWakeLock: false,
    enableBackgroundAudio: false,
    enableNetworkState: true,
    orientation: 'unspecified',
    userAgent: '',
    iconDataUrl: '',
  });

  const inspectWebsite = async (targetUrl: string) => {
    if (!targetUrl || !targetUrl.trim()) return;
    setIsLoading(true);

    try {
      const data = await extractWebsiteData(targetUrl);

      setUrl(data.url);
      setDiscoveredIcons(data.icons);
      setIsInspected(true);

      setConfig((prev) => ({
        ...prev,
        url: data.url,
        appName: data.appName || prev.appName || 'My Web App',
        splashTitle: data.appName || prev.splashTitle || 'My Web App',
        packageName: data.packageName || prev.packageName || 'com.mywebapp.app',
        themeColor: data.themeColor || prev.themeColor || '#10b981',
        statusBarColor: '#0f172a',
        progressBarColor: data.themeColor || prev.progressBarColor || '#10b981',
        iconDataUrl: data.primaryIcon || prev.iconDataUrl,
        iconShape: prev.iconShape || 'circle',
        iconBgColor: data.iconBgColor || '#ffffff',
        iconPadding: 14,
      }));

      // Unlock all steps once URL is inspected
      setMaxStepUnlocked(4);
    } catch (err) {
      console.warn('URL extraction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = (updated: Partial<AppConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleBuildApk = async () => {
    // Strict Data Validation before compilation
    const urlValidation = validateUrl(config.url);
    if (!urlValidation.isValid) return;

    const appNameValidation = validateAppName(config.appName);
    if (!appNameValidation.isValid) return;

    const pkgValidation = validatePackageName(config.packageName);
    if (!pkgValidation.isValid) return;

    const verNameValidation = validateVersionName(config.versionName);
    if (!verNameValidation.isValid) return;

    const verCodeValidation = validateVersionCode(config.versionCode);
    if (!verCodeValidation.isValid) return;

    setIsBuilding(true);
    setBuildProgress({ percent: 10, status: 'Compiling APK package in browser...' });

    try {
      // Complete client-side frontend compilation and packaging
      const result = await generateFullAndroidPackage(config, (percent, status) => {
        setBuildProgress({ percent, status });
      });

      setBuildResult(result);
      setIsBuildModalOpen(true);
    } catch (err: any) {
      console.error('Build error:', err);
    } finally {
      setIsBuilding(false);
    }
  };

  const goToStep = (step: number) => {
    if (step <= maxStepUnlocked) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Clean Header */}
      <Navbar />

      {/* Main Studio Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Dynamic Multi-Step Stepper Progress Bar */}
        <StepProgressBar
          currentStep={currentStep}
          onSelectStep={goToStep}
          maxStepUnlocked={maxStepUnlocked}
        />

        {/* Dynamic Step Views */}
        <div className="w-full transition-all duration-300">
          {/* STEP 1: Website URL Discovery */}
          {currentStep === 1 && (
            <Step1Url
              url={url}
              setUrl={setUrl}
              config={config}
              isLoading={isLoading}
              isInspected={isInspected}
              onInspect={inspectWebsite}
              onNext={() => goToStep(2)}
              discoveredIcons={discoveredIcons}
            />
          )}

          {/* STEP 2: Icon Studio */}
          {currentStep === 2 && (
            <Step2Icon
              config={config}
              onChange={updateConfig}
              discoveredIcons={discoveredIcons}
              onBack={() => goToStep(1)}
              onNext={() => goToStep(3)}
            />
          )}

          {/* STEP 3: Android App Settings */}
          {currentStep === 3 && (
            <Step3Settings
              config={config}
              onChange={updateConfig}
              onBack={() => goToStep(2)}
              onNext={() => goToStep(4)}
            />
          )}

          {/* STEP 4: Review & Live APK Compiler */}
          {currentStep === 4 && (
            <Step4ReviewBuild
              config={config}
              onBack={() => goToStep(3)}
              isBuilding={isBuilding}
              buildProgress={buildProgress}
              buildResult={buildResult}
              onBuild={handleBuildApk}
              onOpenModal={() => setIsBuildModalOpen(true)}
            />
          )}
        </div>
      </main>

      {/* Build Success Modal */}
      <BuildModal
        isOpen={isBuildModalOpen}
        onClose={() => setIsBuildModalOpen(false)}
        buildResult={buildResult}
        config={config}
      />

      {/* Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold inline-flex items-center">
              <span className="text-white">Web</span>
              <span className="text-blue-500">2</span>
              <span className="text-emerald-400">APK</span>
            </span>
            <span>•</span>
            <span>Website to Android APK Converter</span>
          </div>

          <div className="text-slate-400 font-medium text-xs flex items-center gap-1.5">
            <span>©2026</span>
            <a
              href="https://github.com/irealashu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-emerald-400 transition-colors font-semibold hover:underline"
            >
              Ashutosh Singh (@irealashu)
            </a>
            <span>• All Rights Reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
