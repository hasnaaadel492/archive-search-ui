export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://iarchive.nl.gov.jo/api',
  TIMEOUT: 15000,
  ENDPOINTS: {
    SEARCH: '/search',
    GAZETTE_ISSUES: '/issues',
    CATEGORIES: '/categories',
  },
};