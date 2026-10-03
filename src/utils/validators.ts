// Strict Android App & Web Configuration Validators

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
}

const JAVA_KEYWORDS = new Set([
  'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const',
  'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally', 'float',
  'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'native',
  'new', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp',
  'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'void',
  'volatile', 'while', 'true', 'false', 'null', 'val', 'var', 'fun', 'in', 'is', 'when'
]);

export function validateUrl(url: string): ValidationResult {
  const trimmed = (url || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Website URL cannot be empty' };
  }

  if (/\s/.test(trimmed)) {
    return { isValid: false, error: 'URL must not contain spaces' };
  }

  let formatted = trimmed;
  if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
    formatted = 'https://' + formatted;
  }

  try {
    const parsed = new URL(formatted);
    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      return { isValid: false, error: 'URL must have a valid domain and extension (e.g. example.com)' };
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, error: 'URL must use http:// or https:// protocol' };
    }

    const tld = parsed.hostname.split('.').pop() || '';
    if (tld.length < 2 || !/^[a-zA-Z0-9-]+$/.test(tld)) {
      return { isValid: false, error: 'Invalid top-level domain extension' };
    }

    if (parsed.protocol === 'http:') {
      return { isValid: true, warning: 'HTTP detected: Android prefers HTTPS for secure traffic' };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid URL format (e.g. https://yourdomain.com)' };
  }
}

export function validateAppName(name: string): ValidationResult {
  const trimmed = (name || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'App name cannot be empty' };
  }

  if (trimmed.length > 50) {
    return { isValid: false, error: 'App name should not exceed 50 characters' };
  }

  if (/[<>"\\&]/.test(trimmed)) {
    return { isValid: false, error: 'App name cannot contain <, >, ", \\, or & characters' };
  }

  return { isValid: true };
}

export function validatePackageName(pkg: string): ValidationResult {
  const trimmed = (pkg || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Package name cannot be empty' };
  }

  if (/\s/.test(trimmed)) {
    return { isValid: false, error: 'Package name must not contain spaces' };
  }

  if (trimmed.length > 120) {
    return { isValid: false, error: 'Package name cannot exceed 120 characters' };
  }

  const parts = trimmed.split('.');
  if (parts.length < 2) {
    return { isValid: false, error: 'Package name must contain at least 2 segments (e.g. com.example.app)' };
  }

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part) {
      return { isValid: false, error: 'Package name segments cannot be empty or have consecutive dots' };
    }

    if (/^[0-9]/.test(part)) {
      return { isValid: false, error: `Segment "${part}" cannot start with a number` };
    }

    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(part)) {
      return { isValid: false, error: `Segment "${part}" contains invalid characters (use only letters, numbers, underscores)` };
    }

    if (JAVA_KEYWORDS.has(part.toLowerCase())) {
      return { isValid: false, error: `"${part}" is a reserved language keyword and cannot be used in a package segment` };
    }
  }

  return { isValid: true };
}

export function validateVersionName(version: string): ValidationResult {
  const trimmed = (version || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Version name cannot be empty' };
  }

  if (trimmed.length > 20) {
    return { isValid: false, error: 'Version name must not exceed 20 characters' };
  }

  if (!/^[a-zA-Z0-9._-]+$/.test(trimmed)) {
    return { isValid: false, error: 'Version name contains invalid characters (use e.g. 1.0.0)' };
  }

  return { isValid: true };
}

export function validateVersionCode(code: number): ValidationResult {
  if (isNaN(code) || !Number.isInteger(code)) {
    return { isValid: false, error: 'Version code must be an integer' };
  }

  if (code < 1) {
    return { isValid: false, error: 'Version code must be at least 1' };
  }

  if (code > 2100000000) {
    return { isValid: false, error: 'Version code exceeds Google Play maximum limit (2,100,000,000)' };
  }

  return { isValid: true };
}

export function validateHexColor(color: string): ValidationResult {
  const trimmed = (color || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Color cannot be empty' };
  }

  if (trimmed === 'transparent') {
    return { isValid: true };
  }

  const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
  if (!hexRegex.test(trimmed)) {
    return { isValid: false, error: 'Must be a valid hex color code (e.g. #10b981 or #ffffff)' };
  }

  return { isValid: true };
}
