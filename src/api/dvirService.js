// mobile/src/api/dvirService.js



import client from './client';

/**
 * Submit DVIR report from mobile app
 * @param {Object} dvirData - DVIR form data
 * @returns {Promise} Response with submitted DVIR
 */
export async function submitDVIR(dvirData) {
  try {
    const response = await client.post('/dvir/submit', dvirData);
    return response.data;
  } catch (error) {
    console.error('❌ Error submitting DVIR:', error);
    throw error;
  }
}

/**
 * Get DVIR reports for driver
 * @param {string} driverId - Driver ID
 * @param {Object} filters - Optional filters (startDate, endDate, status)
 * @returns {Promise} List of DVIR reports
 */
export async function getDriverDVIRs(driverId, filters = {}) {
  try {
    const params = new URLSearchParams();
    params.append('driverId', driverId);
    
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.status) params.append('status', filters.status);

    const response = await client.get(`/dvir?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching DVIRs:', error);
    throw error;
  }
}

/**
 * Get single DVIR by ID
 * @param {number} dvirId - DVIR report ID
 * @returns {Promise} DVIR report details
 */
export async function getDVIRById(dvirId) {
  try {
    const response = await client.get(`/dvir/${dvirId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching DVIR details:', error);
    throw error;
  }
}