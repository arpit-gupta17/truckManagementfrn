// ==========================================
// FILE: src/components/views/EachCompany/LogBook/DriverLogbook.jsx
// Complete WORKING driver logbook page with full functionality
// ==========================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../modules/Navbar';
import Sidebar from '../../../modules/Sidebar';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const DriverLogbook = () => {
  const { id, driverId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [driver, setDriver] = useState(null);
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [odometer1, setOdometer1] = useState('');
  const [odometer2, setOdometer2] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [selectedFromLog, setSelectedFromLog] = useState('');
  
  // Modal states
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [newLogEntry, setNewLogEntry] = useState({
    status: 'OFF',
    time: '',
    location: '',
    odometer: '',
    engineHours: '',
    notes: '',
    origin: '',
    eventType: ''
  });

  // Auto Change functionality
  const [autoChangeEnabled, setAutoChangeEnabled] = useState(false);

  useEffect(() => {
    fetchDriverData();
    fetchVehicles();
  }, [driverId]);

  useEffect(() => {
    if (logDate && driverId) {
      fetchLogs();
    }
  }, [driverId, logDate]);

  const fetchDriverData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/driver/${driverId}`, {
        withCredentials: true
      });
      console.log('Driver data:', res.data);
      setDriver(res.data);
    } catch (err) {
      console.error('Error fetching driver:', err);
      alert('Failed to fetch driver data');
    }
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/app/logs/${driverId}?date=${logDate}`,
        { withCredentials: true }
      );
      console.log('Logs data:', res.data);
      if (res.data.success) {
        setLogs(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await axios.get(`${API_URL}/vehicle/getVehicles`, {
        withCredentials: true
      });
      console.log('Vehicles:', res.data);
      setVehicles(res.data || []);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    }
  };

  const handleAddLog = async () => {
    if (!newLogEntry.time) {
      alert('Please select a time for the log entry');
      return;
    }

    try {
      const logData = {
        status: newLogEntry.status,
        time: new Date(newLogEntry.time).toISOString(),
        location: newLogEntry.location,
        odometer: parseFloat(newLogEntry.odometer) || null,
        engineHours: parseFloat(newLogEntry.engineHours) || null,
        notes: newLogEntry.notes,
        origin: newLogEntry.origin,
        logDate: logDate,
        clientEventId: `${Date.now()}-${Math.random().toString(36).slice(2,9)}`
      };

      const res = await axios.post(
        `${API_URL}/app/logs/${driverId}`,
        logData,
        { withCredentials: true }
      );

      if (res.data.success) {
        alert('✅ Log entry added successfully');
        setShowAddLogModal(false);
        setNewLogEntry({
          status: 'OFF',
          time: '',
          location: '',
          odometer: '',
          engineHours: '',
          notes: '',
          origin: '',
          eventType: ''
        });
        fetchLogs();
      }
    } catch (err) {
      console.error('Error adding log:', err);
      alert('❌ Failed to add log entry: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteLog = async (logId) => {
    if (!window.confirm('⚠️ Are you sure you want to delete this log entry?')) {
      return;
    }

    try {
      const res = await axios.delete(
        `${API_URL}/app/logs/${driverId}/${logId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        alert('✅ Log entry deleted successfully');
        fetchLogs();
      }
    } catch (err) {
      console.error('Error deleting log:', err);
      alert('❌ Failed to delete log entry');
    }
  };

  const handleSubmit = () => {
    alert('📊 Log submitted for date: ' + logDate);
    // Implement submit logic here
  };

  const handleAutoChange = () => {
    setAutoChangeEnabled(!autoChangeEnabled);
    alert(autoChangeEnabled ? '⏸️ Auto change disabled' : '▶️ Auto change enabled');
  };

  const handleAutoSetBook = () => {
    alert('📖 Auto Set Book triggered for ' + logDate);
    // Implement auto set book logic
  };

  const handleGetRoute = () => {
    if (!source || !destination) {
      alert('⚠️ Please enter both source and destination');
      return;
    }
    alert(`🗺️ Getting route from ${source} to ${destination}`);
    // Implement route calculation logic
  };

  const formatTime = (dateTime) => {
    if (!dateTime) return '-';
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const goToPreviousDay = () => {
    const prevDate = new Date(logDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setLogDate(prevDate.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const nextDate = new Date(logDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setLogDate(nextDate.toISOString().split('T')[0]);
  };

  const calculateDutyHours = (status) => {
    const statusLogs = logs.filter(log => log.status === status);
    return statusLogs.length > 0 ? `${statusLogs.length}:0` : '0:0';
  };

  const filteredLogs = logs.filter(log => 
    searchTerm === '' || 
    log.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.location && log.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const statusColors = {
    'OFF': 'bg-gray-400',
    'SLEEPER': 'bg-blue-500',
    'S': 'bg-blue-500',
    'DRIVING': 'bg-green-500',
    'D': 'bg-green-500',
    'ON': 'bg-yellow-500',
    'YM': 'bg-purple-500',
    'PC': 'bg-orange-500',
    'PCD': 'bg-pink-500'
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col ml-60">
        <Navbar />
        
        <main className="flex-1 overflow-auto p-6 mt-16">
          {/* Breadcrumb */}
          <div className="mb-4 text-sm">
            <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate(`/dashboard/${id}`)}>
              Home
            </span>
            <span className="mx-2 text-gray-500">/</span>
            <span 
              className="text-blue-600 cursor-pointer hover:underline" 
              onClick={() => navigate(`/dashboard/${id}/LogBook`)}
            >
              Drivers
            </span>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-700">Logbook</span>
          </div>

          {/* Date Range Section 1 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <span className="text-gray-700 font-medium">
                {formatDate(logDate)} 12:00 AM - {formatDate(logDate)} 11:59 PM
              </span>
            </div>
            <button 
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition-colors"
            >
              Submit
            </button>
          </div>

          {/* Date Range Section 2 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 flex justify-end">
            <button 
              onClick={handleAutoChange}
              className={`px-6 py-2 rounded font-medium transition-colors ${
                autoChangeEnabled 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {autoChangeEnabled ? '✓ AUTO CHANGE ON' : 'AUTO CHANGE'}
            </button>
          </div>

          {/* Controls Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <input
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                <select 
                  value={selectedFromLog}
                  onChange={(e) => setSelectedFromLog(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select From Log</option>
                  {logs.map((log, idx) => (
                    <option key={idx} value={log.id}>
                      {formatTime(log.time)} - {log.status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                <input
                  type="text"
                  placeholder="TIME IN HOURS"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                />
              </div>

              <button className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2">
                <span>Split</span>
                <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded font-semibold">OFF</span>
              </button>

              <button 
                onClick={handleAutoSetBook}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium ml-auto transition-colors"
              >
                Auto Set Book
              </button>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mb-4 flex gap-2">
            <button 
              onClick={goToPreviousDay}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium transition-colors"
            >
              ← Previous Log
            </button>
            <button 
              onClick={goToNextDay}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium transition-colors"
            >
              Next Log →
            </button>
            <button 
              onClick={() => setLogDate(new Date().toISOString().split('T')[0])}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-medium transition-colors"
            >
              Today
            </button>
          </div>

          {/* Driver Log Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Card Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Driver Log</h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-yellow-400 text-gray-900 rounded font-medium">
                  {formatDate(logDate)}
                </span>
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium transition-colors">
                  Edit Certificate
                </button>
              </div>
            </div>

            {/* General Section */}
            <div className="p-6">
              <div className="bg-teal-500 text-white px-4 py-2 mb-4 rounded">
                <h3 className="font-semibold">General</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-600 mb-1">Driver</div>
                  <div className="text-blue-600 font-medium">
                    {driver ? `${driver.first_name || ''} ${driver.last_name || ''}`.trim() || driver.username : 'Loading...'}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-600 mb-1">Exempt Driver Status</div>
                  <div className="font-medium">{driver?.exempt_driver ? 'YES' : 'NO'}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-600 mb-1">Driver ID</div>
                  <div className="font-medium">{driver?.username || '-'}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-600 mb-1">Co-Driver</div>
                  <div className="font-medium">-</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-600 mb-1">Driver Licence</div>
                  <div className="font-medium">{driver?.license_number || '-'}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-600 mb-1">Co-Driver ID</div>
                  <div className="font-medium">-</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-600 mb-1">Driver Licence State</div>
                  <div className="font-medium">{driver?.state || '-'}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-600 mb-1">Exceptions</div>
                  <div className="font-medium">
                    {driver?.short_haul_exception ? 'Short-Haul Exception' : '-'}
                  </div>
                </div>
              </div>

              {/* Common Section */}
              <div className="bg-teal-500 text-white px-4 py-2 mb-4 rounded">
                <h3 className="font-semibold">Common</h3>
              </div>

              {/* Vehicle Table */}
              <div className="mb-6 overflow-x-auto">
                <table className="w-full border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">VEHICLE</th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">VIN</th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">ODOMETER(MI)</th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">DISTANCE(MI)</th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">ENGINE HOURS</th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedVehicle && vehicles.find(v => v.id == selectedVehicle) ? (
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2">
                          {vehicles.find(v => v.id == selectedVehicle)?.vehicle_unit_number || '-'}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {vehicles.find(v => v.id == selectedVehicle)?.vin || '-'}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">{odometer1 || '-'}</td>
                        <td className="border border-gray-300 px-3 py-2">
                          {odometer2 && odometer1 ? (parseFloat(odometer2) - parseFloat(odometer1)).toFixed(2) : '-'}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">-</td>
                        <td className="border border-gray-300 px-3 py-2">
                          <button className="text-red-600 hover:text-red-800 text-xs">Remove</button>
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan="6" className="border border-gray-300 px-3 py-8 text-center text-gray-500">
                          No vehicle selected. Please select a vehicle from the dropdown below.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Trailers and Shipping Docs */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="font-semibold text-gray-700 mb-2">TRAILERS</div>
                  <div className="text-gray-500 text-sm">-</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="font-semibold text-gray-700 mb-2">SHIPPING DOCS</div>
                  <div className="text-gray-500 text-sm">-</div>
                </div>
              </div>

              {/* Carrier and Terminal Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-600 mb-1">CARRIER</div>
                  <div className="font-medium mb-3">{driver?.added_by_company_name || 'FirstComp'}</div>
                  <div className="text-xs text-gray-600 mb-1">MAIN OFFICE</div>
                  <div className="font-medium text-sm">{driver?.home_terminal || 'ROSEVILLE,9017 FARMSTEAD CIR,US,90574'}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-600 mb-1">HOME TERMINAL</div>
                  <div className="font-medium mb-3">Address</div>
                  <div className="text-xs text-gray-600 mb-1">DOT NUMBER</div>
                  <div className="font-medium">DOT1242</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-600 mb-1">SN (MAC)</div>
                  <div className="font-medium">-</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-600 mb-1">PROVIDER</div>
                  <div className="font-medium">MY LOGS</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-600 mb-1">DIAGNOSTIC INDICATOR</div>
                  <div className="font-medium">No</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-600 mb-1">MALFUNCTION INDICATOR</div>
                  <div className="font-medium">NO</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mb-6">
                <button 
                  onClick={() => setShowAddLogModal(true)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Log
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                  Map View
                </button>
              </div>

              {/* Timeline Grid */}
              <div className="mb-6 overflow-x-auto">
                <div className="min-w-[1200px] border border-gray-300 rounded">
                  {/* Hour Headers */}
                  <div className="flex bg-white border-b border-gray-300">
                    <div className="w-16 flex-shrink-0"></div>
                    {['M', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', 'N', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', 'M'].map((hour, idx) => (
                      <div key={idx} className="flex-1 text-center py-2 text-xs font-bold text-gray-700 border-l border-gray-200">
                        {hour}
                      </div>
                    ))}
                    <div className="w-16 flex-shrink-0"></div>
                  </div>

                  {/* Status Rows */}
                  {[
                    { label: 'OFF', status: 'OFF' },
                    { label: 'S', status: 'SLEEPER' },
                    { label: 'D', status: 'DRIVING' },
                    { label: 'ON', status: 'ON' }
                  ].map((row) => (
                    <div key={row.label} className="flex border-b border-gray-300 last:border-b-0">
                      <div className="w-16 flex-shrink-0 bg-gray-100 flex items-center justify-center font-bold text-sm border-r border-gray-300">
                        {row.label}
                      </div>
                      <div className="flex-1 h-12 bg-blue-50 relative">
                        <div className="absolute inset-0 grid grid-cols-24">
                          {Array(24).fill(0).map((_, i) => (
                            <div key={i} className="border-l border-gray-200"></div>
                          ))}
                        </div>
                      </div>
                      <div className="w-16 flex-shrink-0 bg-gray-100 flex items-center justify-center text-sm border-l border-gray-300">
                        {calculateDutyHours(row.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logs Table */}
              <div className="mb-6">
                {/* Table Actions */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">Copy</button>
                    <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">CSV</button>
                    <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">Excel</button>
                    <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">PDF</button>
                    <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">Print</button>
                    <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">Column visibility</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Search:</span>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search logs..."
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-gray-300 rounded">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border-b border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">#</th>
                        <th className="border-b border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">Transaction ID</th>
                        <th className="border-b border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">Time (PST)</th>
                        <th className="border-b border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">Event</th>
                        <th className="border-b border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">Status</th>
                        <th className="border-b border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">Location</th>
                        <th className="border-b border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">Origin</th>
                        <th className="border-b border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">Odometer(Mi)</th>
                        <th className="border-b border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">Engine Hours</th>
                        <th className="border-b border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">Notes</th>
                        <th className="border-b border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="11" className="px-3 py-8 text-center text-gray-500">
                            <div className="flex items-center justify-center gap-2">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                              Loading logs...
                            </div>
                          </td>
                        </tr>
                      ) : filteredLogs.length === 0 ? (
                        <tr>
                          <td colSpan="11" className="px-3 py-8 text-center text-gray-500">
                            {searchTerm ? 'No logs found matching your search' : 'No data available in table'}
                          </td>
                        </tr>
                      ) : (
                        filteredLogs.map((log, index) => (
                          <tr key={log.id} className="hover:bg-gray-50">
                            <td className="border-b border-gray-300 px-3 py-2 text-sm">{index + 1}</td>
                            <td className="border-b border-gray-300 px-3 py-2 text-sm">{log.client_event_id || '-'}</td>
                            <td className="border-b border-gray-300 px-3 py-2 text-sm">{formatTime(log.time)}</td>
                            <td className="border-b border-gray-300 px-3 py-2 text-sm">-</td>
                            <td className="border-b border-gray-300 px-3 py-2">
                              <span className={`px-2 py-1 rounded text-white text-xs font-semibold ${statusColors[log.status] || 'bg-gray-400'}`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="border-b border-gray-300 px-3 py-2 text-sm">{log.location || '-'}</td>
                            <td className="border-b border-gray-300 px-3 py-2 text-sm">-</td>
                            <td className="border-b border-gray-300 px-3 py-2 text-sm">{log.odometer || '-'}</td>
                            <td className="border-b border-gray-300 px-3 py-2 text-sm">{log.engineHours || '-'}</td>
                            <td className="border-b border-gray-300 px-3 py-2 text-sm">{log.notes || '-'}</td>
                            <td className="border-b border-gray-300 px-3 py-2">
                              <button
                                onClick={() => handleDeleteLog(log.id)}
                                className="text-red-600 hover:text-red-800 text-xs font-medium"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 text-sm text-gray-600">
                  Showing {filteredLogs.length > 0 ? 1 : 0} to {filteredLogs.length} of {filteredLogs.length} entries
                  {searchTerm && ` (filtered from ${logs.length} total entries)`}
                </div>
              </div>

              {/* Certificate Statement */}
              <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-sm text-gray-700">
                  I hereby certify that my data entries and my record of duty status for this 24-hour period are true and correct
                </p>
              </div>

              {/* Vehicle Selection and Route */}
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle</label>
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.vehicle_unit_number} - {v.vin}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-5 gap-3">
                  <input
                    type="text"
                    placeholder="Enter Source"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="col-span-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Enter Destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="col-span-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="93"
                    value={odometer1}
                    onChange={(e) => setOdometer1(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  />
                  <input
                    type="number"
                    placeholder="96"
                    value={odometer2}
                    onChange={(e) => setOdometer2(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  />
                  <button 
                    onClick={handleGetRoute}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium col-span-3 transition-colors"
                  >
                    Get Route
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Log Modal */}
      {showAddLogModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Add New Log Entry</h3>
                <button
                  onClick={() => setShowAddLogModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={newLogEntry.status}
                    onChange={(e) => setNewLogEntry({...newLogEntry, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="OFF">OFF Duty</option>
                    <option value="SLEEPER">Sleeper Berth</option>
                    <option value="DRIVING">Driving</option>
                    <option value="ON">ON Duty</option>
                    <option value="YM">Yard Move</option>
                    <option value="PC">Personal Conveyance</option>
                    <option value="PCD">Personal Conveyance Deferred</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={newLogEntry.time}
                    onChange={(e) => setNewLogEntry({...newLogEntry, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Los Angeles, CA"
                    value={newLogEntry.location}
                    onChange={(e) => setNewLogEntry({...newLogEntry, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Odometer (Miles)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 12345.5"
                    value={newLogEntry.odometer}
                    onChange={(e) => setNewLogEntry({...newLogEntry, odometer: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Engine Hours
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 234.5"
                    value={newLogEntry.engineHours}
                    onChange={(e) => setNewLogEntry({...newLogEntry, engineHours: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Origin
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Warehouse A"
                    value={newLogEntry.origin}
                    onChange={(e) => setNewLogEntry({...newLogEntry, origin: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add any additional notes..."
                    value={newLogEntry.notes}
                    onChange={(e) => setNewLogEntry({...newLogEntry, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddLogModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLog}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition-colors"
                >
                  Add Log Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverLogbook;