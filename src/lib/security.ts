/**
 * Security utilities for NOCTURNA
 * Client-side rate limiting and input sanitization
 */

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Check if a request should be rate limited
 * @param key - Unique identifier for the rate limit (e.g., 'ouija', 'story')
 * @returns true if the request is allowed, false if rate limited
 */
export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // First request or window expired - reset
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  // Increment counter
  entry.count += 1;
  return true;
}

/**
 * Get remaining time until rate limit resets (in seconds)
 */
export function getRateLimitResetTime(key: string): number {
  const entry = rateLimitStore.get(key);
  if (!entry) return 0;
  
  const remaining = entry.resetTime - Date.now();
  return Math.max(0, Math.ceil(remaining / 1000));
}

/**
 * Get remaining requests in current window
 */
export function getRemainingRequests(key: string): number {
  const entry = rateLimitStore.get(key);
  if (!entry || Date.now() > entry.resetTime) return MAX_REQUESTS_PER_WINDOW;
  
  return Math.max(0, MAX_REQUESTS_PER_WINDOW - entry.count);
}

/**
 * Sanitize text input to prevent XSS
 * @param input - Raw user input
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Escape dangerous characters
    .replace(/[<>"'&]/g, (char) => {
      const escapeMap: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;',
      };
      return escapeMap[char] ?? char;
    })
    // Limit length
    .substring(0, 500);
}

/**
 * Sanitize output content for safe display
 * Used for AI-generated stories and ouija responses
 */
export function sanitizeOutput(content: string): string {
  if (typeof content !== 'string') return '';
  
  return content
    // Remove any script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove javascript: URLs
    .replace(/javascript:/gi, '')
    // Remove data: URLs (except for images which are safe)
    .replace(/data:(?!image\/)/gi, '');
}

/**
 * Validate and sanitize seed for story generation
 */
export function validateStorySeed(seed: string): { valid: boolean; sanitized: string; error?: string } {
  if (!seed || typeof seed !== 'string') {
    return { valid: false, sanitized: '', error: 'Seed is required' };
  }

  const sanitized = sanitizeInput(seed);

  if (sanitized.length === 0) {
    return { valid: false, sanitized: '', error: 'Invalid seed content' };
  }

  if (sanitized.length < 2) {
    return { valid: false, sanitized, error: 'Seed must be at least 2 characters' };
  }

  if (sanitized.length > 500) {
    return { valid: false, sanitized, error: 'Seed must be less than 500 characters' };
  }

  return { valid: true, sanitized };
}

/**
 * Validate ouija question
 */
export function validateOuijaQuestion(question: string): { valid: boolean; sanitized: string; error?: string } {
  if (!question || typeof question !== 'string') {
    return { valid: false, sanitized: '', error: 'Question is required' };
  }

  const sanitized = sanitizeInput(question);

  if (sanitized.length === 0) {
    return { valid: false, sanitized: '', error: 'Invalid question' };
  }

  if (sanitized.length > 500) {
    return { valid: false, sanitized, error: 'Question too long' };
  }

  return { valid: true, sanitized };
}

/**
 * Check for potentially malicious patterns
 */
export function hasMaliciousPatterns(input: string): boolean {
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
    /base64/i,
    /eval\s*\(/i,
    /document\./i,
    /window\./i,
  ];

  return maliciousPatterns.some((pattern) => pattern.test(input));
}
