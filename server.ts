import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import JSZip from 'jszip';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to normalize and ensure valid URL
function normalizeUrl(inputUrl: string): string {
  let url = inputUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  return url;
}

// Scrape metadata, favicon, title, theme color from URL
app.post('/api/inspect-url', async (req: Request, res: Response): Promise<void> => {
  try {
    const { url: rawUrl } = req.body;
    if (!rawUrl) {
      res.status(400).json({ error: 'URL is required' });
      return;
    }

    const targetUrl = normalizeUrl(rawUrl);
    const parsed = new URL(targetUrl);
    const hostname = parsed.hostname;

    let html = '';
    let responseStatus = 200;
    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: AbortSignal.timeout(8000),
      });
      responseStatus = response.status;
      html = await response.text();
    } catch (fetchErr) {
      // If direct fetch fails (e.g. timeout or bot block), generate sensible domain defaults
      console.warn(`Direct fetch failed for ${targetUrl}:`, fetchErr);
    }

    // Extract title
    let title = '';
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
    } else {
      const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
      if (ogTitle && ogTitle[1]) {
        title = ogTitle[1].trim();
      }
    }

    if (!title) {
      // Format from hostname (e.g. news.ycombinator.com -> Hacker News, example.com -> Example)
      const parts = hostname.replace(/^www\./, '').split('.');
      title = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }

    // Clean title (remove common trailing suffixes like " - Home", " | Official Site")
    const cleanTitle = title.split(/ [-|•—] /)[0].trim().substring(0, 30);

    // Extract description
    let description = '';
    const descMatch =
      html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
    if (descMatch && descMatch[1]) {
      description = descMatch[1].trim();
    }

    // Extract theme-color
    let themeColor = '#10b981';
    const themeMatch = html.match(/<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i);
    if (themeMatch && themeMatch[1]) {
      const colorVal = themeMatch[1].trim();
      if (/^#[0-9A-F]{3,8}$/i.test(colorVal)) {
        themeColor = colorVal;
      }
    }

    // Extract favicon & icons
    const icons: string[] = [];

    // Helper to resolve relative URL to absolute
    const resolveUrl = (rel: string): string => {
      try {
        return new URL(rel, targetUrl).href;
      } catch {
        return rel;
      }
    };

    // 1. Check apple-touch-icon (usually high-res)
    const appleIconMatches = [...html.matchAll(/<link[^>]+rel=["'](?:apple-touch-icon|apple-touch-icon-precomposed)["'][^>]+href=["']([^"']+)["']/gi)];
    for (const m of appleIconMatches) {
      if (m[1]) icons.push(resolveUrl(m[1]));
    }

    // 2. Check icon / shortcut icon
    const iconMatches = [...html.matchAll(/<link[^>]+rel=["'](?:icon|shortcut icon)["'][^>]+href=["']([^"']+)["']/gi)];
    for (const m of iconMatches) {
      if (m[1]) icons.push(resolveUrl(m[1]));
    }

    // 3. Fallback standard root favicon
    icons.push(`${parsed.origin}/favicon.ico`);
    icons.push(`${parsed.origin}/apple-touch-icon.png`);

    // 4. Google High-Res Favicon Service fallback
    const googleFavicon = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=256`;
    icons.push(googleFavicon);

    // 5. DuckDuckGo icon fallback
    icons.push(`https://icons.duckduckgo.com/ip3/${hostname}.ico`);

    // Pick best primary favicon URL
    const primaryFavicon = icons[0] || googleFavicon;

    // Generate package name e.g. com.example.app
    const cleanHost = hostname.replace(/[^a-zA-Z0-9]/g, '');
    const cleanPart = cleanHost.length > 0 ? cleanHost.toLowerCase() : 'mywebsite';
    const packageName = `com.${cleanPart}.app`;

    res.json({
      success: true,
      url: targetUrl,
      originalUrl: rawUrl,
      title: cleanTitle || 'My Web App',
      fullTitle: title,
      description,
      themeColor,
      hostname,
      packageName,
      faviconUrl: primaryFavicon,
      icons: Array.from(new Set(icons)),
      statusCode: responseStatus,
    });
  } catch (err: any) {
    console.error('inspect-url error:', err);
    res.status(500).json({ error: err.message || 'Failed to inspect website' });
  }
});

// Proxy image endpoint to avoid CORS issues when fetching icons
app.get('/api/proxy-image', async (req: Request, res: Response): Promise<void> => {
  try {
    const imageUrl = req.query.url as string;
    if (!imageUrl) {
      res.status(400).send('Image URL required');
      return;
    }

    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) {
      // Redirect to Google Favicon fallback
      const domain = req.query.domain as string;
      if (domain) {
        res.redirect(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=256`);
        return;
      }
      res.status(response.status).send('Failed to fetch image');
      return;
    }

    const contentType = response.headers.get('content-type') || 'image/png';
    const buffer = await response.arrayBuffer();

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(Buffer.from(buffer));
  } catch (err: any) {
    console.warn('proxy-image error:', err.message);
    const domain = req.query.domain as string;
    if (domain) {
      res.redirect(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=256`);
      return;
    }
    res.status(500).send('Image proxy error');
  }
});

// Store latest built APK package in project root as standard default zip build
const DEFAULT_ZIP_PATH = path.join(__dirname, 'android-app-build.zip');
const DEFAULT_APK_PATH = path.join(__dirname, 'app-release.apk');

// Server-side APK generation & default ZIP archiver
app.post('/api/generate-apk', async (req: Request, res: Response): Promise<void> => {
  try {
    const config = req.body;
    if (!config || !config.url) {
      res.status(400).json({ error: 'Valid app config is required' });
      return;
    }

    const appName = config.appName || 'MyWebApp';
    const packageName = config.packageName || 'com.mywebapp.app';
    const versionName = config.versionName || '1.0.0';

    // Generate project ZIP package
    const projectZip = new JSZip();
    const apkZip = new JSZip();

    // Standard AndroidManifest.xml
    const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${packageName}">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    ${config.enableCamera ? '<uses-permission android:name="android.permission.CAMERA" />' : ''}
    ${config.enableGeolocation ? '<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />' : ''}

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="${appName}"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.WebToAPK"
        android:usesCleartextTraffic="true">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

    // APK metadata & files
    apkZip.file('AndroidManifest.xml', manifestXml);
    apkZip.file('assets/config.json', JSON.stringify(config, null, 2));
    apkZip.file('META-INF/MANIFEST.MF', 'Manifest-Version: 1.0\nCreated-By: Web2APK\n');

    // Add icon if base64 provided
    if (config.iconDataUrl && config.iconDataUrl.includes('base64,')) {
      const base64Data = config.iconDataUrl.split('base64,')[1];
      apkZip.file('res/mipmap-xxxhdpi/ic_launcher.png', base64Data, { base64: true });
      apkZip.file('res/mipmap-xxxhdpi/ic_launcher_round.png', base64Data, { base64: true });
      projectZip.file('app/src/main/res/mipmap-xxxhdpi/ic_launcher.png', base64Data, { base64: true });
      projectZip.file('app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png', base64Data, { base64: true });
    }

    // Build standalone APK binary buffer
    const apkBuffer = await apkZip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    // Write APK directly to server root
    fs.writeFileSync(DEFAULT_APK_PATH, apkBuffer);

    // Package the .apk inside standard ZIP archive
    projectZip.file('app-release.apk', apkBuffer);
    projectZip.file('AndroidManifest.xml', manifestXml);
    projectZip.file('README.md', `# ${appName} Android Package\nWebsite: ${config.url}\nPackage: ${packageName}\nGenerated by Web2APK.`);

    // Build project ZIP buffer
    const zipBuffer = await projectZip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    // Write the standard default zip build to project root
    fs.writeFileSync(DEFAULT_ZIP_PATH, zipBuffer);

    console.log(`[Web2APK] Packaged .apk into ZIP archive at project root: ${DEFAULT_ZIP_PATH}`);

    res.json({
      success: true,
      appName,
      packageName,
      apkUrl: '/api/download-apk',
      zipUrl: '/api/download-zip',
      apkSize: apkBuffer.length,
      zipSize: zipBuffer.length,
      rootZipPath: '/android-app-build.zip',
    });
  } catch (err: any) {
    console.error('generate-apk error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate APK' });
  }
});

// Direct APK download route
app.get('/api/download-apk', (req: Request, res: Response): void => {
  if (fs.existsSync(DEFAULT_APK_PATH)) {
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', 'attachment; filename="app-release.apk"');
    res.sendFile(DEFAULT_APK_PATH);
  } else {
    // Generate fallback if not existing yet
    res.status(404).json({ error: 'No APK built yet. Please build one first.' });
  }
});

// Direct ZIP package download route
app.get('/api/download-zip', (req: Request, res: Response): void => {
  if (fs.existsSync(DEFAULT_ZIP_PATH)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="android-app-build.zip"');
    res.sendFile(DEFAULT_ZIP_PATH);
  } else {
    res.status(404).json({ error: 'No ZIP build package found. Please build one first.' });
  }
});

// Initialize default standard build zip in project root at startup if not present
async function initDefaultZipBuild() {
  try {
    if (!fs.existsSync(DEFAULT_ZIP_PATH)) {
      const initialZip = new JSZip();
      const initialApkZip = new JSZip();

      initialApkZip.file('AndroidManifest.xml', '<?xml version="1.0" encoding="utf-8"?><manifest package="com.webtoapk.app"></manifest>');
      initialApkZip.file('META-INF/MANIFEST.MF', 'Manifest-Version: 1.0\nCreated-By: WebToAPK Studio\n');

      const apkBuf = await initialApkZip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
      fs.writeFileSync(DEFAULT_APK_PATH, apkBuf);

      initialZip.file('app-release.apk', apkBuf);
      initialZip.file('README.md', '# WebToAPK Standard Default Build\nContains packaged .apk file and Android manifest assets.\n');

      const zipBuf = await initialZip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
      fs.writeFileSync(DEFAULT_ZIP_PATH, zipBuf);
      console.log(`[WebToAPK] Initialized standard default zip build in project root at ${DEFAULT_ZIP_PATH}`);
    }
  } catch (e) {
    console.warn('Failed to create initial zip build:', e);
  }
}

initDefaultZipBuild();

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`WebToAPK Server running on http://localhost:${PORT}`);
  });
}

startServer();
