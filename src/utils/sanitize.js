/**
 * تنظيف وتقييد مدخلات البحث لمنع المحارف الضارة أو النصوص الطويلة جداً
 */
export function sanitizeSearchInput(value, maxLength = 150) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[<>]/g, '') // إزالة أقواس الوسوم لتقليل مخاطر XSS
    .trim()
    .slice(0, maxLength);
}