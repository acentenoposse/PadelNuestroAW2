
const BACKEND_URL = 'http://localhost:5555';

function resolverApiBase() {

  if (typeof window !== 'undefined' && window.location.port === '5555') {
    return '';
  }

  return BACKEND_URL;
}
export const API_BASE_URL = resolverApiBase();

export const ASSETS_BASE = '/assets';
