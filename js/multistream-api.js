/**
 * Multi-platform streaming API (studio backend :5050).
 */
window.ResearchiumMultistreamApi = (function () {
  const auth = window.ResearchiumStudio;

  function studioBase() {
    if (window.RESEARCHIUM_STUDIO_URL) return window.RESEARCHIUM_STUDIO_URL;
    if (location.hostname === '127.0.0.1' || location.hostname === 'localhost') {
      return 'http://127.0.0.1:5050';
    }
    return auth.API_BASE || '';
  }

  async function request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const token = auth.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${studioBase()}${path}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || 'request_failed');
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  return {
    getConnections() {
      return request('/api/multistream/connections');
    },
    startOAuth(platform) {
      return request(`/api/multistream/oauth/${platform}/start`);
    },
    disconnect(platform) {
      return request(`/api/multistream/connections/${platform}`, { method: 'DELETE' });
    },
    goLiveAll(payload) {
      return request('/api/multistream/go-live', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    endBroadcast(broadcastId) {
      return request('/api/multistream/end', {
        method: 'POST',
        body: JSON.stringify({ broadcastId }),
      });
    },
  };
})();
