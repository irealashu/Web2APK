export interface ExtractedMetadata {
  url: string;
  originalUrl: string;
  title: string;
  description: string;
  themeColor: string;
  hostname: string;
  packageName?: string;
  faviconUrl: string;
  icons: string[];
  manifestUrl?: string;
  isPWA?: boolean;
}

export interface AppConfig {
  url: string;
  appName: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  iconDataUrl: string;
  iconShape: 'circle' | 'square';
  iconBgColor: string;
  iconPadding: number;
  themeColor: string;
  statusBarColor: string;
  navBarColor: string;
  isFullScreen: boolean;
  enablePullToRefresh: boolean;
  enableProgressBar: boolean;
  progressBarColor: string;
  enableJavaScript: boolean;
  enableDomStorage: boolean;
  enableExternalLinks: boolean;
  // Web-accessible Android permissions
  enableCamera: boolean;
  enableMicrophone: boolean;
  enableGeolocation: boolean;
  enableDownloads: boolean;
  enableNotifications: boolean;
  enableVibration: boolean;
  enableBiometrics: boolean;
  enableBluetooth: boolean;
  enableNfc: boolean;
  enableWakeLock: boolean;
  enableBackgroundAudio: boolean;
  enableNetworkState: boolean;
  // Configuration
  userAgent: string;
  splashDuration: number;
  splashBgColor: string;
  splashTitle: string;
  offlineFallback: boolean;
  orientation: 'portrait' | 'landscape' | 'unspecified';
}

export interface BuildResult {
  appName: string;
  packageName: string;
  apkFileName: string;
  zipFileName: string;
  apkBlobUrl?: string;
  zipBlobUrl?: string;
  apkSizeFormatted?: string;
  zipSizeFormatted?: string;
  timestamp: number;
  files: {
    path: string;
    content: string;
  }[];
}
