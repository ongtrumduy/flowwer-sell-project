const SERVER_API_ENDPOINT = import.meta.env.VITE_SERVER_BACKEND_ENDPOINT || 'l';
const API_KEY = import.meta.env.VITE_API_KEY || '';
const REQUEST_TIMEOUT = Number(import.meta.env.VITE_REQUEST_TIMEOUT || 15 * 10000);

export { SERVER_API_ENDPOINT, API_KEY, REQUEST_TIMEOUT };
