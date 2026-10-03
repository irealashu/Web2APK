// Client-Side High-Reliability URL & Icon Metadata Extractor

export interface ExtractedSiteData {
  url: string;
  domain: string;
  appName: string;
  packageName: string;
  themeColor: string;
  iconBgColor: string;
  icons: string[];
  primaryIcon: string;
}

// Popular brand overrides for accurate, crisp naming & background blending
const KNOWN_BRANDS: Record<string, { name: string; color: string; bgColor: string; pkg: string }> = {
  'wikipedia.org': { name: 'Wikipedia', color: '#006699', bgColor: '#ffffff', pkg: 'org.wikipedia.app' },
  'en.wikipedia.org': { name: 'Wikipedia', color: '#006699', bgColor: '#ffffff', pkg: 'org.wikipedia.app' },
  'github.com': { name: 'GitHub', color: '#24292e', bgColor: '#ffffff', pkg: 'com.github.android' },
  'youtube.com': { name: 'YouTube', color: '#ff0000', bgColor: '#ffffff', pkg: 'com.google.android.youtube' },
  'google.com': { name: 'Google', color: '#4285f4', bgColor: '#ffffff', pkg: 'com.google.android.googlequicksearchbox' },
  'twitter.com': { name: 'X (Twitter)', color: '#000000', bgColor: '#000000', pkg: 'com.twitter.android' },
  'x.com': { name: 'X', color: '#000000', bgColor: '#000000', pkg: 'com.twitter.android' },
  'reddit.com': { name: 'Reddit', color: '#ff4500', bgColor: '#ffffff', pkg: 'com.reddit.frontpage' },
  'instagram.com': { name: 'Instagram', color: '#e1306c', bgColor: '#ffffff', pkg: 'com.instagram.android' },
  'facebook.com': { name: 'Facebook', color: '#1877f2', bgColor: '#1877f2', pkg: 'com.facebook.katana' },
  'linkedin.com': { name: 'LinkedIn', color: '#0a66c2', bgColor: '#ffffff', pkg: 'com.linkedin.android' },
  'spotify.com': { name: 'Spotify', color: '#1ed760', bgColor: '#121212', pkg: 'com.spotify.music' },
  'netflix.com': { name: 'Netflix', color: '#e50914', bgColor: '#141414', pkg: 'com.netflix.mediaclient' },
  'amazon.com': { name: 'Amazon', color: '#ff9900', bgColor: '#ffffff', pkg: 'com.amazon.mShop.android.shopping' },
  'twitch.tv': { name: 'Twitch', color: '#9146ff', bgColor: '#9146ff', pkg: 'tv.twitch.android.app' },
  'discord.com': { name: 'Discord', color: '#5865f2', bgColor: '#5865f2', pkg: 'com.discord' },
  'slack.com': { name: 'Slack', color: '#4a154b', bgColor: '#ffffff', pkg: 'com.Slack' },
  'notion.so': { name: 'Notion', color: '#000000', bgColor: '#ffffff', pkg: 'notion.id' },
  'figma.com': { name: 'Figma', color: '#f24e1e', bgColor: '#ffffff', pkg: 'com.figma.mirror' },
  'medium.com': { name: 'Medium', color: '#000000', bgColor: '#ffffff', pkg: 'com.medium.reader' },
  'pinterest.com': { name: 'Pinterest', color: '#e60023', bgColor: '#ffffff', pkg: 'com.pinterest' },
  'tiktok.com': { name: 'TikTok', color: '#000000', bgColor: '#000000', pkg: 'com.zhiliaoapp.musically' },
  'openai.com': { name: 'ChatGPT', color: '#10a37f', bgColor: '#ffffff', pkg: 'com.openai.chatgpt' },
  'chatgpt.com': { name: 'ChatGPT', color: '#10a37f', bgColor: '#ffffff', pkg: 'com.openai.chatgpt' },
};

// Generates multiple CORS-friendly high-res favicon sources
export function getFaviconCandidates(url: string, host: string): string[] {
  const cleanHost = host.replace(/^www\./, '');
  const encodedHost = encodeURIComponent(cleanHost);
  const encodedUrl = encodeURIComponent(url);

  return [
    `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodedUrl}&size=256`,
    `https://www.google.com/s2/favicons?domain=${encodedHost}&sz=256`,
    `https://favicone.com/${encodedHost}?s=256`,
    `https://icons.duckduckgo.com/ip3/${encodedHost}.ico`,
    `https://icon.horse/icon/${encodedHost}`,
    `https://unavatar.io/${encodedHost}`,
  ];
}

// Convert a clean domain to a polished App Title
export function domainToAppName(host: string): string {
  const clean = host.replace(/^www\./, '').toLowerCase();

  if (KNOWN_BRANDS[clean]) {
    return KNOWN_BRANDS[clean].name;
  }

  const parts = clean.split('.');
  let mainPart = parts[0];
  if (parts.length > 2 && (parts[0] === 'm' || parts[0] === 'app' || parts[0] === 'web' || parts[0] === 'en' || parts[0] === 'mobile')) {
    mainPart = parts[1];
  } else if (parts.length >= 2) {
    mainPart = parts[0];
  }

  const words = mainPart.split(/[-_]/);
  return words
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
    .filter(Boolean)
    .join(' ') || 'My App';
}

// Convert domain to valid reverse Android package identifier
export function domainToPackageName(host: string): string {
  const clean = host.replace(/^www\./, '').toLowerCase();

  if (KNOWN_BRANDS[clean]) {
    return KNOWN_BRANDS[clean].pkg;
  }

  const parts = clean.split('.').filter(Boolean);
  const sanitizedParts = parts.map((p) => {
    let s = p.replace(/[^a-z0-9_]/g, '');
    if (!s) s = 'app';
    if (/^[0-9]/.test(s)) s = 'pkg_' + s;
    return s;
  });

  if (sanitizedParts.length === 1) {
    return `com.${sanitizedParts[0]}.app`;
  }

  const tld = sanitizedParts[sanitizedParts.length - 1];
  const name = sanitizedParts[sanitizedParts.length - 2] || sanitizedParts[0];

  return `${tld || 'com'}.${name || 'webapp'}.app`;
}

// Helper: Convert RGB components to Hex string
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

// Client-Side Image Edge Color Detector
export async function detectIconBackgroundColor(
  imageUrl: string,
  fallbackColor = '#ffffff'
): Promise<string> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined' || !imageUrl) {
      resolve(fallbackColor);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(fallbackColor);
      }
    }, 1500);

    img.onload = () => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timeout);

      try {
        const canvas = document.createElement('canvas');
        const size = 32;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(fallbackColor);
          return;
        }

        ctx.drawImage(img, 0, 0, size, size);
        const imgData = ctx.getImageData(0, 0, size, size).data;

        // Sample the perimeter edge pixels
        const edgeSamples: { r: number; g: number; b: number; a: number }[] = [];

        for (let x = 0; x < size; x++) {
          // Top row & Bottom row
          for (const y of [0, size - 1]) {
            const idx = (y * size + x) * 4;
            edgeSamples.push({
              r: imgData[idx],
              g: imgData[idx + 1],
              b: imgData[idx + 2],
              a: imgData[idx + 3],
            });
          }
        }

        for (let y = 1; y < size - 1; y++) {
          // Left col & Right col
          for (const x of [0, size - 1]) {
            const idx = (y * size + x) * 4;
            edgeSamples.push({
              r: imgData[idx],
              g: imgData[idx + 1],
              b: imgData[idx + 2],
              a: imgData[idx + 3],
            });
          }
        }

        // Check if edge is predominantly transparent
        const transparentCount = edgeSamples.filter((s) => s.a < 30).length;
        if (transparentCount > edgeSamples.length * 0.4) {
          // If transparent, default to clean white #ffffff for crisp contrast
          resolve('#ffffff');
          return;
        }

        // Average the opaque edge pixels
        const opaqueSamples = edgeSamples.filter((s) => s.a >= 128);
        if (opaqueSamples.length === 0) {
          resolve('#ffffff');
          return;
        }

        let totalR = 0;
        let totalG = 0;
        let totalB = 0;
        for (const s of opaqueSamples) {
          totalR += s.r;
          totalG += s.g;
          totalB += s.b;
        }

        const avgR = Math.round(totalR / opaqueSamples.length);
        const avgG = Math.round(totalG / opaqueSamples.length);
        const avgB = Math.round(totalB / opaqueSamples.length);

        resolve(rgbToHex(avgR, avgG, avgB));
      } catch (err) {
        // Fallback on CORS tainted canvas
        resolve(fallbackColor);
      }
    };

    img.onerror = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolve(fallbackColor);
      }
    };

    img.src = imageUrl;
  });
}

// Master extraction function running 100% in-browser
export async function extractWebsiteData(inputUrl: string): Promise<ExtractedSiteData> {
  let normalized = (inputUrl || '').trim();
  if (!normalized) {
    normalized = 'https://en.wikipedia.org';
  }

  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = 'https://' + normalized;
  }

  let host = 'en.wikipedia.org';
  let origin = 'https://en.wikipedia.org';

  try {
    const parsed = new URL(normalized);
    host = parsed.hostname;
    origin = parsed.origin;
  } catch {
    const match = normalized.match(/^(?:https?:\/\/)?([^\/\?#:]+)/i);
    if (match && match[1]) {
      host = match[1];
      origin = `https://${host}`;
    }
  }

  const cleanHost = host.replace(/^www\./, '').toLowerCase();
  const brandInfo = KNOWN_BRANDS[cleanHost];

  const appName = brandInfo ? brandInfo.name : domainToAppName(host);
  const packageName = brandInfo ? brandInfo.pkg : domainToPackageName(host);
  const themeColor = brandInfo ? brandInfo.color : '#10b981';
  const defaultBg = brandInfo ? brandInfo.bgColor : '#ffffff';

  // Get list of candidate favicons
  const candidates = getFaviconCandidates(normalized, host);

  // Add origin direct favicon
  candidates.push(`${origin}/favicon.ico`);
  candidates.push(`${origin}/apple-touch-icon.png`);

  const primaryIcon = candidates[0];

  // Detect background color dynamically
  let detectedBg = defaultBg;
  try {
    detectedBg = await detectIconBackgroundColor(primaryIcon, defaultBg);
  } catch {
    detectedBg = defaultBg;
  }

  return {
    url: normalized,
    domain: host,
    appName,
    packageName,
    themeColor,
    iconBgColor: detectedBg,
    icons: candidates,
    primaryIcon,
  };
}
