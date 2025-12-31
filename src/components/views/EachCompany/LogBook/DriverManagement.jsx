// ==========================================
// FILE: src/components/views/EachCompany/LogBook/LogsPage.jsx
// PATH: client/src/components/views/EachCompany/LogBook/LogsPage.jsx
// ==========================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../modules/Navbar';
import Sidebar from '../../../modules/Sidebar';

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


  const handleDVIRClick = (e, driverId) => {
  e.stopPropagation();
  navigate(`/dashboard/${id}/LogBook/DVIR/${driverId}`);
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
              👤 Gurdit@xpertlo.com ▼
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
                                    <button
                                  onClick={(e) => handleDVIRClick(e, driver.id)}
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
                                >DVIR  </button>

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