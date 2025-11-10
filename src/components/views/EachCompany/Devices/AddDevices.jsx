


import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../../modules/Navbar';
import Sidebar from '../../../modules/Sidebar';

const AddDevice = () => {
  const { id } = useParams();
  const formRef = useRef();

  const [deviceData, setDeviceData] = useState({
    serialNumber: '',
    type: '',
    mac: '',
    version: '',
    model: '',
    status: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeviceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 Sending data to backend:", deviceData);

    try {
      const response = await fetch('http://localhost:5000/api/device/addDevice', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceData),
      });

      const result = await response.json();
      console.log("📥 Response from backend:", result);

      if (!response.ok) throw new Error(result.message || "Failed to add device");

      alert("✅ Device added successfully!");

      formRef.current.reset();
      setDeviceData({
        serialNumber: '',
        type: '',
        mac: '',
        version: '',
        model: '',
        status: '',
      });

    } catch (err) {
      console.error("❌ Add device error:", err.message);
      alert(`❌ ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-medium text-gray-900">Add Device</h1>
          <nav className="text-sm">
            <span className="text-blue-600 hover:text-blue-800 cursor-pointer">Home</span>
            <span className="text-gray-500 mx-2">/</span>
            <span className="text-gray-700">Add Device</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Form Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                1
              </div>
              <h2 className="text-lg font-medium text-gray-700">Add Device</h2>
            </div>
          </div>

          {/* Form Content */}
          <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Serial Number */}
            <div>
              <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Serial Number
              </label>
              <input
                type="text"
                id="serialNumber"
                name="serialNumber"
                value={deviceData.serialNumber}
                onChange={handleInputChange}
                placeholder="Device Serial Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Device Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Device Type
              </label>
              <input
                type="text"
                id="type"
                name="type"
                value={deviceData.type}
                onChange={handleInputChange}
                placeholder="Device Type"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Device Mac */}
            <div>
              <label htmlFor="mac" className="block text-sm font-medium text-gray-700 mb-2">
                Device MAC
              </label>
              <input
                type="text"
                id="mac"
                name="mac"
                value={deviceData.mac}
                onChange={handleInputChange}
                placeholder="Device MAC Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Device Version */}
            <div>
              <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-2">
                Device Version
              </label>
              <input
                type="text"
                id="version"
                name="version"
                value={deviceData.version}
                onChange={handleInputChange}
                placeholder="Device Version"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Device Model */}
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                Device Model
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={deviceData.model}
                onChange={handleInputChange}
                placeholder="Device Model"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={deviceData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              >
                <option value="">Select</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDevice;
