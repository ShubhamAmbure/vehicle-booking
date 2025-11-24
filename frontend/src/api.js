import axios from 'axios';
// In production the frontend is often served from the same origin as the API
// (or a VITE_API_URL environment variable is set). Default to a relative
// path so the site doesn't try to call localhost when deployed to Vercel.
const API = axios.create({
	baseURL: import.meta.env.VITE_API_URL || '/api',
});
export default API;