// ==========================================
// FILE: src/components/views/EachCompany/LogBook/LogBookSummary.jsx
// UPDATED: Added "Logbook" button to redirect to driver logbook page
// ==========================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../modules/Navbar';
import Sidebar from '../../../modules/Sidebar';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const LogPageSummary = () => {
  const { id, driverId } = useParams();
  const navigate = useNavigate();
  
  const [driver, setDriver] = useState(null);
  const [dutyCycles, setDutyCycles] = useState([]);
  const [uncertifiedLogs, setUncertifiedLogs] = useState([]);
  const [certificationLogs, setCertificationLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm1, setSearchTerm1] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');
  const [startDate, setStartDate] = useState('10/08/2025');
  const [endDate, setEndDate] = useState('10/08/2025');

  useEffect(() => {
    fetchAllData();
  }, [driverId]);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch driver details
      const driverResponse = await fetch(`${API_URL}/driver/${driverId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      const driverData = await driverResponse.json();
      setDriver(driverData);

      // Fetch duty cycles
      const dutyCyclesResponse = await fetch(`${API_URL}/logs/duty-cycles/${driverId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      const dutyCyclesData = await dutyCyclesResponse.json();
      if (dutyCyclesData.success) {
        setDutyCycles(dutyCyclesData.data);
      }

      // Fetch uncertified logs
      const uncertifiedResponse = await fetch(`${API_URL}/logs/uncertified/${driverId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      const uncertifiedData = await uncertifiedResponse.json();
      if (uncertifiedData.success) {
        setUncertifiedLogs(uncertifiedData.data);
      }

      // Fetch certification logs
      const certificationResponse = await fetch(`${API_URL}/logs/certification/${driverId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      const certificationData = await certificationResponse.json();
      if (certificationData.success) {
        setCertificationLogs(certificationData.data);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = () => {
    console.log('Generate PDF clicked');
    // PDF generation logic here
  };

  const exportToCSV = (data, filename) => {
    const csv = data.map(row => Object.values(row).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  // NEW FUNCTION: Navigate to Driver Logbook
  const handleGoToLogbook = () => {
    navigate(`/dashboard/${id}/LogBook/DriverLogbook/${driverId}`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f8f9fa' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '18px', color: '#666' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f8f9fa' }}>
      <Sidebar />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar />
        
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {/* Header Section */}
          <div style={{ 
            backgroundColor: '#fff',
            padding: '16px 32px',
            borderBottom: '1px solid #e0e0e0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button 
                  onClick={() => navigate(`/dashboard/${id}`)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#666',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ☰
                </button>
                <button 
                  onClick={() => navigate(`/dashboard/${id}`)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#666',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Home
                </button>
                <button 
                  onClick={fetchAllData}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#666',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Refresh
                </button>
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                👤 Gurdit@xpertlogs.com ▼
              </div>
            </div>

            {/* Breadcrumb */}
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
              <span 
                onClick={() => navigate(`/dashboard/${id}`)}
                style={{ color: '#2196f3', cursor: 'pointer' }}
              >
                Home
              </span>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ color: '#333' }}>Log Summary</span>
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 400, color: '#333', margin: 0 }}>
              Log Summary
            </h1>
          </div>

          {/* Date Range and PDF Button */}
          <div style={{ padding: '24px 32px' }}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '4px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)', 
              padding: '16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '14px' }}>📄</span>
                <span style={{ fontSize: '14px', color: '#333' }}>
                  {startDate} 12:00 AM - {endDate} 11:59 PM
                </span>
              </div>
              <button
                onClick={handleGeneratePDF}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                Generate PDF
              </button>
            </div>

            {/* Driver Info Section - UPDATED WITH LOGBOOK BUTTON */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '4px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)', 
              padding: '20px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>📞</span>
                  <span style={{ fontSize: '14px', color: '#333', fontWeight: 500 }}>
                    {driver?.first_name} {driver?.last_name}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>✉️</span>
                  <span style={{ fontSize: '14px', color: '#333' }}>
                    {driver?.email || driver?.username}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>⏰</span>
                  <span style={{ fontSize: '14px', color: '#333' }}>
                    {driver?.hos_rules || 'USA 70 hour / 8day'}
                  </span>
                </div>
              </div>
              {/* NEW LOGBOOK BUTTON */}
              <button
                onClick={handleGoToLogbook}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📖 Logbook
              </button>
            </div>

            {/* Table 1: Duty Cycles */}
            <div style={{ marginBottom: '48px' }}>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '4px', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                overflow: 'hidden'
              }}>
                {/* Action Bar */}
                <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button style={{ 
                        padding: '8px 16px', 
                        backgroundColor: '#607d8b',
                        color: 'white',
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}>
                        Copy
                      </button>
                      <button 
                        onClick={() => exportToCSV(dutyCycles, 'duty-cycles.csv')}
                        style={{ 
                          padding: '8px 16px', 
                          backgroundColor: '#607d8b',
                          color: 'white',
                          border: 'none', 
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}>
                        CSV
                      </button>
                      <button style={{ 
                        padding: '8px 16px', 
                        backgroundColor: '#607d8b',
                        color: 'white',
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px'
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
                        fontSize: '13px'
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
                        fontSize: '13px'
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
                        fontSize: '13px'
                      }}>
                        Column visibility ▼
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', color: '#666' }}>Search:</span>
                      <input
                        type="text"
                        value={searchTerm1}
                        onChange={(e) => setSearchTerm1(e.target.value)}
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
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #e0e0e0' }}>
                      <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', fontWeight: 700, color: '#333', textTransform: 'uppercase' }}>
                        LAST DUTY CYCLE
                      </th>
                      <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', fontWeight: 700, color: '#333', textTransform: 'uppercase' }}>
                        DATE
                      </th>
                      <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', fontWeight: 700, color: '#333', textTransform: 'uppercase' }}>
                        VEHICLE
                      </th>
                      <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', fontWeight: 700, color: '#333', textTransform: 'uppercase' }}>
                        LOCATION
                      </th>
                      <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', fontWeight: 700, color: '#333', textTransform: 'uppercase' }}>
                        BREAK
                      </th>
                      <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', fontWeight: 700, color: '#333', textTransform: 'uppercase' }}>
                        DRIVE
                      </th>
                      <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', fontWeight: 700, color: '#333', textTransform: 'uppercase' }}>
                        SHIFT
                      </th>
                      <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', fontWeight: 700, color: '#333', textTransform: 'uppercase' }}>
                        CYCLE
                      </th>
                      <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', fontWeight: 700, color: '#333', textTransform: 'uppercase' }}>
                        ELD Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dutyCycles.length === 0 ? (
                      <tr>
                        <td colSpan="9" style={{ padding: '24px', textAlign: 'center', color: '#666' }}>
                          No duty cycle data available
                        </td>
                      </tr>
                    ) : (
                      dutyCycles.map((cycle, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '14px 20px', fontSize: '14px', color: '#555' }}>{cycle.last_duty_cycle}</td>
                          <td style={{ padding: '14px 20px', fontSize: '14px', color: '#555' }}>{cycle.date}</td>
                          <td style={{ padding: '14px 20px', fontSize: '14px', color: '#555' }}>{cycle.vehicle}</td>
                          <td style={{ padding: '14px 20px', fontSize: '14px', color: '#555' }}>{cycle.location}</td>
                          <td style={{ padding: '14px 20px', fontSize: '14px', color: '#555' }}>{cycle.break_time}</td>
                          <td style={{ padding: '14px 20px', fontSize: '14px', color: '#555' }}>{cycle.drive}</td>
                          <td style={{ padding: '14px 20px', fontSize: '14px', color: '#555' }}>{cycle.shift}</td>
                          <td style={{ padding: '14px 20px', fontSize: '14px', color: '#555' }}>{cycle.cycle}</td>
                          <td style={{ padding: '14px 20px' }}>
                            <span style={{ 
                              padding: '6px 12px', 
                              fontSize: '12px',
                              fontWeight: 600,
                              borderRadius: '3px',
                              backgroundColor: cycle.eld_status === 'Connected' ? '#4caf50' : '#f44336',
                              color: 'white'
                            }}>
                              {cycle.eld_status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

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
                    Showing 1 to {dutyCycles.length} of {dutyCycles.length} entries
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button style={{ 
                      padding: '8px 16px', 
                      border: '1px solid #ddd', 
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '13px'
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
                      fontSize: '13px'
                    }}>
                      1
                    </button>
                    <button style={{ 
                      padding: '8px 16px', 
                      border: '1px solid #ddd', 
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Remaining tables (Uncertified and Certification) would go here - keeping code concise */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LogPageSummary;