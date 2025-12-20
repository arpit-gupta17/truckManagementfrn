

import React, { useState, useEffect } from 'react';
import { ChevronDown, User, Mail, Phone, CreditCard, Lock, MapPin, Truck, Clock, Package, Home, Car } from 'lucide-react';
import Navbar from '../../../../modules/Navbar';
import Sidebar from '../../../../modules/Sidebar';
import axios from 'axios';

export default function DriverForm() {

  const [terminals, setTerminalData] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTerminals = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/terminal/getTerminal', {
          withCredentials: true,
        });
        console.log(res.data);
        if (Array.isArray(res.data)) {
          setTerminalData(res.data);
        } else if (Array.isArray(res.data.terminals)) {
          setTerminalData(res.data.terminals);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load terminal data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTerminals();
  }, []);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/vehicle/getVehicles', {
          withCredentials: true,
        });
        console.log(res.data);
        setVehicles(res.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);


  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    country: 'United States',
    state: '',
    licenseNumber: '',
    password: '',
    confirmPassword: '',
    homeTerminal: '',
    assignedVehicles: '',
    exemptDriver: false,
    hosRules: 'USA 70 hour / 8 day',
    cargoType: 'Property',
    restart: '34 Hour Restart',
    shortHaulException: false,
    allowPersonalUse: true,
    allowYardMoves: true,
    unlimitedTrailer: false,
    unlimitedShippingDocs: false,
    allowSplitSleep: false,
    resetBreak: false
  });

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ];

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post('http://localhost:5000/api/driver/addDriver', formData, {
      withCredentials: true
    });

    console.log('Driver added:', res.data);
    alert('Driver added successfully!');
    // Optional: reset form or navigate away
  } catch (err) {
    console.error('Error submitting driver:', err.response?.data || err.message);
    alert('Error submitting driver. Check console for details.');
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white ">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Sidebar />
        {/* Header */}
        <div className="bg-white shadow-lg rounded-t-xl border-t-4 border-blue-600 p-6 mb-6 mt-20">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 ">
            <User className="text-blue-600" size={32} />
            Driver Registration Form
          </h1>
          <p className="text-gray-600 mt-2">Complete the form below to add a new driver to the system</p>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                1
              </div>
              <h2 className="text-xl font-semibold text-gray-800">General Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-2" />
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter Username"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Portal users and drivers must have different login credentials
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter Email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter First Name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter Last Name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter Phone Number"
                />
              </div>
            </div>

            {/* Driver License Section */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-blue-600" />
                Driver License Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline w-4 h-4 mr-2" />
                    Select State *
                  </label>
                  <div className="relative">
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select a state</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                  {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter License Number"
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                <Lock size={20} className="text-blue-600" />
                Security
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Carrier Settings */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Truck size={24} className="text-blue-600" />
              Carrier Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Home size={16} className="inline mr-2" />
                  Home Terminal
                </label>
                <select
                  name="homeTerminal"
                  value={formData.homeTerminal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Choose Terminal</option>
                  {terminals.map((terminal) => (
                    <option key={terminal._id} value={terminal._id}>
                      {terminal.address} - {terminal.city}, {terminal.state}
                    </option>
                  ))}
                </select>

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Car size={16} className="inline mr-2" />
                  Assigned Vehicles
                </label>
                <select
                  name="assignedVehicles"
                  value={formData.assignedVehicles}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Choose Vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.vehicle_unit_number} - {vehicle.vin}
                    </option>
                  ))}
                </select>

              </div>
            </div>
          </div>

          {/* Log Settings */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Clock size={24} className="text-blue-600" />
              Log Settings
            </h2>

            <div className="space-y-6">
              {/* Exempt Driver Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="exemptDriver"
                  name="exemptDriver"
                  checked={formData.exemptDriver}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="exemptDriver" className="ml-3 text-sm font-medium text-gray-700">
                  Exempt Driver
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">HOS Rules</label>
                  <select
                    name="hosRules"
                    value={formData.hosRules}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="USA 70 hour / 8 day">USA 70 hour / 8 day</option>
                    <option value="USA 60 hour / 7 day">USA 60 hour / 7 day</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Package size={16} className="inline mr-2" />
                    Cargo Type
                  </label>
                  <select
                    name="cargoType"
                    value={formData.cargoType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="Property">Property</option>
                    <option value="Passenger">Passenger</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Restart</label>
                  <select
                    name="restart"
                    value={formData.restart}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="34 Hour Restart">34 Hour Restart</option>
                    <option value="24 Hour Restart">24 Hour Restart</option>
                  </select>
                </div>
              </div>

              {/* Checkboxes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {[
                  { key: 'shortHaulException', label: 'Short-Haul Exception' },
                  { key: 'allowPersonalUse', label: 'Allow Personal Use' },
                  { key: 'allowYardMoves', label: 'Allow Yard Moves' },
                  { key: 'unlimitedTrailer', label: 'Unlimited Trailer' },
                  { key: 'unlimitedShippingDocs', label: 'Unlimited Shipping Documents' },
                  { key: 'allowSplitSleep', label: 'Allow Split Sleep' },
                  { key: 'resetBreak', label: 'Reset Break' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={item.key}
                      name={item.key}
                      checked={formData[item.key]}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor={item.key} className="ml-3 text-sm text-gray-700">
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white shadow-lg rounded-b-xl p-6">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
              >
                Submit Driver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../../modules/Navbar';
import Sidebar from '../../../../modules/Sidebar';

const API_URL =  'http://localhost:5000/api';

const LogsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/drivers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setDrivers(data.data);
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() === '') {
      fetchDrivers();
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/drivers/search?q=${value}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setDrivers(data.data);
      }
    } catch (error) {
      console.error('Error searching drivers:', error);
    }
  };

  const handleDriverClick = (driverId, driverName) => {
    navigate(`/dashboard/${id}/LogBook/LogPageSummary/${driverId}`, {
      state: { driverName }
    });
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Company', 'Role', 'Cycle', 'Assigned Unit', 'Status'];
    const rows = drivers.map(d => [
      d.name, 
      d.company, 
      d.role, 
      d.cycle, 
      d.assigned_unit, 
      d.status
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drivers.csv';
    a.click();
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f8f9fa' }}>
      <Sidebar />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar />
        
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {/* Header Section */}
          <div style={{ 
            backgroundColor: '#37474f',
            padding: '16px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                ☰
              </button>
              <button 
                onClick={() => navigate(`/dashboard/${id}`)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                🏠 Home
              </button>
              <button 
                onClick={fetchDrivers}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                🔄 Refresh
              </button>
            </div>
            <div style={{ color: 'white', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              👤 Gurdit@xpertlogs.com ▼
            </div>
          </div>

          {/* Breadcrumb and Title */}
          <div style={{ padding: '24px 32px' }}>
            <div style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
              <span 
                onClick={() => navigate(`/dashboard/${id}`)}
                style={{ color: '#2196f3', cursor: 'pointer' }}
              >
                Home
              </span>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ color: '#333' }}>Drivers</span>
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 400, marginBottom: '24px', color: '#333' }}>
              Drivers
            </h1>

            {/* Action Bar */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '4px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)', 
              padding: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={exportToCSV}
                    style={{ 
                      padding: '8px 16px', 
                      backgroundColor: '#607d8b',
                      color: 'white',
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 500
                    }}
                  >
                    Copy
                  </button>
                  <button 
                    onClick={exportToCSV}
                    style={{ 
                      padding: '8px 16px', 
                      backgroundColor: '#607d8b',
                      color: 'white',
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 500
                    }}
                  >
                    CSV
                  </button>
                  <button style={{ 
                      padding: '8px 16px', 
                      backgroundColor: '#607d8b',
                      color: 'white',
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 500
                    }}>
                    Excel
                  </button>
                  <button style={{ 
                      padding: '8px 16px', 
                      backgroundColor: '#607d8b',
                      color: 'white',
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 500
                    }}>
                    PDF
                  </button>
                  <button style={{ 
                      padding: '8px 16px', 
                      backgroundColor: '#607d8b',
                      color: 'white',
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 500
                    }}>
                    Print
                  </button>
                  <button style={{ 
                      padding: '8px 16px', 
                      backgroundColor: '#607d8b',
                      color: 'white',
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 500
                    }}>
                    Column visibility ▼
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#666' }}>Search:</span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ 
                      padding: '6px 12px', 
                      border: '1px solid #ccc', 
                      borderRadius: '4px',
                      fontSize: '13px',
                      width: '200px'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '4px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              overflow: 'hidden'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #e0e0e0' }}>
                      <th style={{ 
                        padding: '16px 20px', 
                        textAlign: 'left', 
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#333'
                      }}>
                        Name
                      </th>
                      <th style={{ 
                        padding: '16px 20px', 
                        textAlign: 'left', 
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#333'
                      }}>
                        Company
                      </th>
                      <th style={{ 
                        padding: '16px 20px', 
                        textAlign: 'left', 
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#333'
                      }}>
                        Role
                      </th>
                      <th style={{ 
                        padding: '16px 20px', 
                        textAlign: 'left', 
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#333'
                      }}>
                        Cycle
                      </th>
                      <th style={{ 
                        padding: '16px 20px', 
                        textAlign: 'left', 
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#333'
                      }}>
                        Assigned Unit
                      </th>
                      <th style={{ 
                        padding: '16px 20px', 
                        textAlign: 'left', 
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#333'
                      }}>
                        Status
                      </th>
                      <th style={{ 
                        padding: '16px 20px', 
                        textAlign: 'left', 
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#333'
                      }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#666' }}>
                          Loading...
                        </td>
                      </tr>
                    ) : drivers.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#666' }}>
                          No drivers found
                        </td>
                      </tr>
                    ) : (
                      drivers.map((driver, index) => (
                        <tr 
                          key={driver.id} 
                          style={{ 
                            borderBottom: '1px solid #f0f0f0',
                            backgroundColor: index % 2 === 0 ? 'white' : '#fafafa'
                          }}
                        >
                          <td style={{ padding: '16px 20px' }}>
                            <span 
                              onClick={() => handleDriverClick(driver.id, driver.name)}
                              style={{ 
                                color: '#2196f3', 
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 500
                              }}
                              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                            >
                              {driver.name}
                            </span>
                          </td>
                          <td style={{ padding: '16px 20px', fontSize: '14px', color: '#555' }}>
                            {driver.company}
                          </td>
                          <td style={{ padding: '16px 20px', fontSize: '14px', color: '#555' }}>
                            {driver.role}
                          </td>
                          <td style={{ padding: '16px 20px', fontSize: '14px', color: '#555' }}>
                            {driver.cycle}
                          </td>
                          <td style={{ padding: '16px 20px', fontSize: '14px', color: '#555' }}>
                            {driver.assigned_unit}
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <span style={{ 
                              padding: '6px 16px', 
                              fontSize: '12px',
                              fontWeight: 600,
                              borderRadius: '3px',
                              backgroundColor: '#4caf50',
                              color: 'white',
                              display: 'inline-block'
                            }}>
                              {driver.status}
                            </span>
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              <button 
                                style={{ 
                                  padding: '7px 14px', 
                                  backgroundColor: '#00bcd4', 
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '3px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                DVIR
                              </button>
                              <button 
                                style={{ 
                                  padding: '7px 14px', 
                                  backgroundColor: '#ffc107', 
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '3px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                Logs
                              </button>
                              <button 
                                style={{ 
                                  padding: '7px 14px', 
                                  backgroundColor: '#4caf50', 
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '3px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                BackUp Logs
                              </button>
                              <button 
                                style={{ 
                                  padding: '7px 14px', 
                                  backgroundColor: '#00bcd4', 
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '3px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                Dot File
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={{ 
                padding: '16px 20px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                borderTop: '1px solid #e0e0e0',
                backgroundColor: '#fafafa'
              }}>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  Showing 1 to {drivers.length} of {drivers.length} entries
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button style={{ 
                    padding: '8px 16px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: '#666'
                  }}>
                    Previous
                  </button>
                  <button style={{ 
                    padding: '8px 16px', 
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#2196f3',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600
                  }}>
                    1
                  </button>
                  <button style={{ 
                    padding: '8px 16px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: '#666'
                  }}>
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LogsPage;