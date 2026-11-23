import { API_CONFIG } from '../config/endpoints';

async function request(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`خطأ في الاتصال بالخادم (${response.status})`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

export const archiveService = {
  searchFiles(params) {
    const query = new URLSearchParams(params).toString();
    return request(`${API_CONFIG.ENDPOINTS.SEARCH}?${query}`);
  },

  getGazetteIssues() {
    // الترتيب من الأقدم للأحدث يُعالج أيضاً في الواجهة لضمان الدقة
    return request(API_CONFIG.ENDPOINTS.GAZETTE_ISSUES);
  },
};