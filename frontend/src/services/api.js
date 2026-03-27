import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export async function verifyCertificate(id) {
  const certificateId = String(id ?? '').trim();
  const { data } = await api.get(`/verify/${encodeURIComponent(certificateId)}`);
  return data;
}
