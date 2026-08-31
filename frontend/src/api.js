// frontend/src/api.js
// Client API interface connecting the React frontend to the Node.js Express backend

const API_BASE = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic API request wrapper with JSON handling and clean error formatting
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || `HTTP error! Status: ${response.status}`);
    }

    return result.data !== undefined ? result.data : result;
  } catch (error) {
    console.error(`API error on [${options.method || 'GET'}] ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // Fetch all registered Mandis / Centres
  async getCentres() {
    return request('/centres');
  },

  // Fetch specific Mandi details
  async getCentreById(centreId) {
    return request(`/centres/${centreId}`);
  },

  // Fetch slot availability for a centre on a given date
  async getCentreSlots(centreId, date) {
    const query = date ? `?date=${encodeURIComponent(date)}` : '';
    return request(`/centres/${centreId}/slots${query}`);
  },

  // Fetch live stats for a centre
  async getCentreStats(centreId, date) {
    const query = date ? `?date=${encodeURIComponent(date)}` : '';
    return request(`/centres/${centreId}/stats${query}`);
  },

  // Fetch all supported crops & MSP rates
  async getCrops() {
    return request('/crops');
  },

  // Create a new slot booking
  async createBooking(bookingData) {
    return request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Fetch bookings list (filterable by centre, date, status, search query)
  async getBookings(filters = {}) {
    const params = new URLSearchParams();
    if (filters.centreId) params.append('centreId', filters.centreId);
    if (filters.date) params.append('date', filters.date);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return request(`/bookings${queryStr}`);
  },

  // Lookup single booking by token or mobile with queue calculation
  async getBookingByToken(token) {
    if (!token) throw new Error('Token is required');
    return request(`/bookings/${encodeURIComponent(token)}`);
  },

  // Advance booking status (Staff action)
  async updateBookingStatus(bookingId, status, meta = {}) {
    return request(`/bookings/${encodeURIComponent(bookingId)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, ...meta }),
    });
  },

  // Simulate IVR call booking
  async simulateIvrBooking(payload) {
    return request('/bookings/ivr-simulate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
};
