import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../modules/Navbar';
import Sidebar from '../../modules/Sidebar';

const UnidentifiedEvents = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  
  // ✅ Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    checkbox: true,
    time: true,
    vehicle: true,
    event: true,
    status: true,
    odometer: true,
    engineHours: true,
    location: true,
    notes: true,
    action: true
  });

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Refresh button handler
  const handleRefresh = () => {
    setLoading(true);
    fetchEvents();
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/unidentified/getEvents', {
        withCredentials: true
      });
      setEvents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching unidentified events:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout handler
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        // Clear cookies by making logout request
        await axios.post('http://localhost:5000/api/user/logout', {}, {
          withCredentials: true
        });
        
        // Clear local storage if any
        localStorage.clear();
        
        // Redirect to login
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
        // Even if API fails, redirect to login
        navigate('/');
      }
    }
  };

  // ✅ Toggle column visibility
  const toggleColumn = (columnKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedEvents(filteredEvents.map(event => event.id));
    } else {
      setSelectedEvents([]);
    }
  };

  const handleSelectEvent = (eventId) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents(selectedEvents.filter(id => id !== eventId));
    } else {
      setSelectedEvents([...selectedEvents, eventId]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEvents.length === 0) {
      alert('Please select events to delete');
      return;
    }
    
    if (!window.confirm(`Delete ${selectedEvents.length} selected event(s)?`)) return;
    
    try {
      await Promise.all(
        selectedEvents.map(eventId =>
          axios.delete(`http://localhost:5000/api/unidentified/delete/${eventId}`, {
            withCredentials: true
          })
        )
      );
      setEvents(events.filter(e => !selectedEvents.includes(e.id)));
      setSelectedEvents([]);
      setShowBulkMenu(false);
      alert('Events deleted successfully');
    } catch (error) {
      console.error('Error deleting events:', error);
      alert('Failed to delete some events');
    }
  };

  const handleBulkCopy = () => {
    if (selectedEvents.length === 0) {
      alert('Please select events to copy');
      return;
    }

    const selectedData = events.filter(e => selectedEvents.includes(e.id));
    const text = selectedData.map(e => 
      `${formatDateTime(e.event_time)} | ${e.vehicle_unit_number || 'N/A'} | ${e.event_type} | ${e.location || 'N/A'}`
    ).join('\n');
    
    navigator.clipboard.writeText(text);
    alert(`${selectedEvents.length} event(s) copied to clipboard`);
    setShowBulkMenu(false);
  };

  const handleResolve = async (eventId) => {
    if (!window.confirm('Mark this event as resolved?')) return;
    
    try {
      await axios.patch(
        `http://localhost:5000/api/unidentified/resolve/${eventId}`,
        { notes: 'Resolved by user' },
        { withCredentials: true }
      );
      setEvents(events.filter(e => e.id !== eventId));
      alert('Event resolved successfully');
    } catch (error) {
      console.error('Error resolving event:', error);
      alert('Failed to resolve event');
    }
  };

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (severity) => {
    const colors = {
      CRITICAL: 'bg-red-100 text-red-800 border-red-300',
      WARNING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      INFO: 'bg-blue-100 text-blue-800 border-blue-300'
    };
    return colors[severity] || colors.INFO;
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      CRITICAL: '🔴',
      WARNING: '🟡',
      INFO: '🔵'
    };
    return icons[severity] || '⚪';
  };

  const filteredEvents = events.filter(event => {
    const searchLower = searchTerm.toLowerCase();
    return (
      event.vehicle_unit_number?.toLowerCase().includes(searchLower) ||
      event.event_type?.toLowerCase().includes(searchLower) ||
      event.description?.toLowerCase().includes(searchLower) ||
      event.location?.toLowerCase().includes(searchLower)
    );
  });

  // ✅ Copy to clipboard
  const handleCopy = () => {
    const headers = Object.keys(visibleColumns).filter(key => visibleColumns[key] && key !== 'checkbox');
    const headerText = headers.map(h => h.toUpperCase()).join('\t');
    const rows = filteredEvents.map(e => {
      const row = [];
      if (visibleColumns.id) row.push(e.id);
      if (visibleColumns.time) row.push(formatDateTime(e.event_time));
      if (visibleColumns.vehicle) row.push(e.vehicle_unit_number || 'N/A');
      if (visibleColumns.event) row.push(e.event_type.replace(/_/g, ' '));
      if (visibleColumns.status) row.push(e.severity);
      if (visibleColumns.odometer) row.push(e.odometer || 'N/A');
      if (visibleColumns.engineHours) row.push(e.engine_hours || 'N/A');
      if (visibleColumns.location) row.push(e.location || 'N/A');
      if (visibleColumns.notes) row.push(e.description || '');
      return row.join('\t');
    });
    const text = [headerText, ...rows].join('\n');
    navigator.clipboard.writeText(text);
    alert('Table data copied to clipboard');
  };

  // ✅ Export to CSV
  const exportToCSV = () => {
    const headers = [];
    if (visibleColumns.id) headers.push('ID');
    if (visibleColumns.time) headers.push('Time');
    if (visibleColumns.vehicle) headers.push('Vehicle');
    if (visibleColumns.event) headers.push('Event');
    if (visibleColumns.status) headers.push('Status');
    if (visibleColumns.odometer) headers.push('Odometer');
    if (visibleColumns.engineHours) headers.push('Engine Hours');
    if (visibleColumns.location) headers.push('Location');
    if (visibleColumns.notes) headers.push('Notes');

    const rows = filteredEvents.map(e => {
      const row = [];
      if (visibleColumns.id) row.push(e.id);
      if (visibleColumns.time) row.push(formatDateTime(e.event_time));
      if (visibleColumns.vehicle) row.push(e.vehicle_unit_number || 'N/A');
      if (visibleColumns.event) row.push(e.event_type.replace(/_/g, ' '));
      if (visibleColumns.status) row.push(e.severity);
      if (visibleColumns.odometer) row.push(e.odometer || 'N/A');
      if (visibleColumns.engineHours) row.push(e.engine_hours || 'N/A');
      if (visibleColumns.location) row.push(e.location || 'N/A');
      if (visibleColumns.notes) row.push(e.description || '');
      return row;
    });

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unidentified-events-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // ✅ Export to Excel (as CSV)
  const exportToExcel = () => {
    exportToCSV(); // Same as CSV but with .xls extension
  };

  // ✅ Export to PDF
  const exportToPDF = () => {
    const headerCells = [];
    if (visibleColumns.id) headerCells.push('<th>ID</th>');
    if (visibleColumns.time) headerCells.push('<th>Time</th>');
    if (visibleColumns.vehicle) headerCells.push('<th>Vehicle</th>');
    if (visibleColumns.event) headerCells.push('<th>Event Type</th>');
    if (visibleColumns.status) headerCells.push('<th>Status</th>');
    if (visibleColumns.odometer) headerCells.push('<th>Odometer (MI)</th>');
    if (visibleColumns.engineHours) headerCells.push('<th>Engine Hours</th>');
    if (visibleColumns.location) headerCells.push('<th>Location</th>');
    if (visibleColumns.notes) headerCells.push('<th>Notes</th>');

    const bodyRows = filteredEvents.map(e => {
      const cells = [];
      if (visibleColumns.id) cells.push(`<td>${e.id}</td>`);
      if (visibleColumns.time) cells.push(`<td>${formatDateTime(e.event_time)}</td>`);
      if (visibleColumns.vehicle) cells.push(`<td>${e.vehicle_unit_number || 'N/A'}</td>`);
      if (visibleColumns.event) cells.push(`<td>${e.event_type?.replace(/_/g, ' ') || 'N/A'}</td>`);
      if (visibleColumns.status) cells.push(`<td>${e.severity || 'N/A'}</td>`);
      if (visibleColumns.odometer) cells.push(`<td>${e.odometer || 'N/A'}</td>`);
      if (visibleColumns.engineHours) cells.push(`<td>${e.engine_hours || 'N/A'}</td>`);
      if (visibleColumns.location) cells.push(`<td>${e.location || 'N/A'}</td>`);
      if (visibleColumns.notes) cells.push(`<td>${e.description || ''}</td>`);
      return `<tr>${cells.join('')}</tr>`;
    }).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Unidentified Events Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #1f2937; margin-bottom: 10px; }
          .meta { color: #6b7280; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px 8px; text-align: left; font-size: 13px; }
          th { background-color: #f3f4f6; font-weight: bold; color: #374151; }
          tr:nth-child(even) { background-color: #f9fafb; }
          tr:hover { background-color: #f3f4f6; }
          @media print {
            body { margin: 0; }
            @page { margin: 1cm; }
          }
        </style>
      </head>
      <body>
        <h1>🚛 Unidentified Events Report</h1>
        <div class="meta">
          <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Total Events:</strong> ${filteredEvents.length}</p>
        </div>
        <table>
          <thead>
            <tr>${headerCells.join('')}</tr>
          </thead>
          <tbody>
            ${bodyRows}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unidentified-events-report-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // ✅ Print function
  const handlePrint = () => {
    const headerCells = [];
    if (visibleColumns.id) headerCells.push('<th>ID</th>');
    if (visibleColumns.time) headerCells.push('<th>Time</th>');
    if (visibleColumns.vehicle) headerCells.push('<th>Vehicle</th>');
    if (visibleColumns.event) headerCells.push('<th>Event Type</th>');
    if (visibleColumns.status) headerCells.push('<th>Status</th>');
    if (visibleColumns.odometer) headerCells.push('<th>Odometer (MI)</th>');
    if (visibleColumns.engineHours) headerCells.push('<th>Engine Hours</th>');
    if (visibleColumns.location) headerCells.push('<th>Location</th>');
    if (visibleColumns.notes) headerCells.push('<th>Notes</th>');

    const bodyRows = filteredEvents.map(e => {
      const cells = [];
      if (visibleColumns.id) cells.push(`<td>${e.id}</td>`);
      if (visibleColumns.time) cells.push(`<td>${formatDateTime(e.event_time)}</td>`);
      if (visibleColumns.vehicle) cells.push(`<td>${e.vehicle_unit_number || 'N/A'}</td>`);
      if (visibleColumns.event) cells.push(`<td>${e.event_type?.replace(/_/g, ' ') || 'N/A'}</td>`);
      if (visibleColumns.status) cells.push(`<td>${e.severity || 'N/A'}</td>`);
      if (visibleColumns.odometer) cells.push(`<td>${e.odometer || 'N/A'}</td>`);
      if (visibleColumns.engineHours) cells.push(`<td>${e.engine_hours || 'N/A'}</td>`);
      if (visibleColumns.location) cells.push(`<td>${e.location || 'N/A'}</td>`);
      if (visibleColumns.notes) cells.push(`<td>${e.description || ''}</td>`);
      return `<tr>${cells.join('')}</tr>`;
    }).join('');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print - Unidentified Events</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #1f2937; margin-bottom: 10px; }
          .meta { color: #6b7280; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
          th { background-color: #f3f4f6; font-weight: bold; }
          @media print {
            body { margin: 0; }
            @page { margin: 1cm; }
          }
        </style>
      </head>
      <body>
        <h1>🚛 Unidentified Events Report</h1>
        <div class="meta">
          <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Total Events:</strong> ${filteredEvents.length}</p>
        </div>
        <table>
          <thead><tr>${headerCells.join('')}</tr></thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const allSelected = filteredEvents.length > 0 && selectedEvents.length === filteredEvents.length;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-4">
          <button className="text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          
          {/* ✅ Home button */}
          <button
            onClick={() => navigate('/ManageCompany')}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Home
          </button>
          
          {/* ✅ Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center gap-2 disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
        </div>

        {/* ✅ User menu with logout */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700">Gurdit@xpertlogs.com</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Logout
          </button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden pt-16">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden ml-60">
          {/* Breadcrumb */}
          <div className="flex items-center px-5 py-4 text-sm bg-white border-b">
            <a href="/ManageCompany" className="text-blue-600 font-medium hover:underline">Home</a>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-700">Unidentified Events</span>
          </div>

          {/* Page Title */}
          <div className="px-5 py-4 bg-white border-b">
            <h1 className="text-2xl font-semibold text-gray-800">Unidentified Events</h1>
            <p className="text-sm text-gray-600 mt-1">
              {filteredEvents.length} unresolved events requiring attention
            </p>
          </div>

          {/* Main Card */}
          <div className="flex-1 overflow-auto p-5">
            <div className="bg-white rounded-lg shadow border border-gray-200">
              {/* Card Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Unidentified Events</h2>
              </div>

              {/* Toolbar */}
              <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
                <div className="flex gap-2 flex-wrap items-center">
                  {/* Bulk Actions Dropdown */}
                  {selectedEvents.length > 0 && (
                    <div className="relative">
                      <button
                        onClick={() => setShowBulkMenu(!showBulkMenu)}
                        className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
                      >
                        <span>Actions ({selectedEvents.length})</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>
                      
                      {showBulkMenu && (
                        <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[150px]">
                          <button
                            onClick={handleBulkDelete}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            Delete
                          </button>
                          <button
                            onClick={handleBulkCopy}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            Copy
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ✅ Copy button */}
                  <button 
                    onClick={handleCopy}
                    className="px-3 py-2 rounded border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy
                  </button>
                  
                  {/* ✅ CSV Export */}
                  <button 
                    onClick={exportToCSV}
                    className="px-3 py-2 rounded border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    CSV
                  </button>
                  
                  {/* ✅ Excel Export */}
                  <button 
                    onClick={exportToExcel}
                    className="px-3 py-2 rounded border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    Excel
                  </button>
                  
                  {/* ✅ PDF Export */}
                  <button 
                    onClick={exportToPDF}
                    className="px-3 py-2 rounded border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    PDF
                  </button>
                  
                  {/* ✅ Print Button */}
                  <button 
                    onClick={handlePrint}
                    className="px-3 py-2 rounded border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <polyline points="6 9 6 2 18 2 18 9"></polyline>
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                      <rect x="6" y="14" width="12" height="8"></rect>
                    </svg>
                    Print
                  </button>
                  
                  {/* ✅ Column Visibility Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowColumnMenu(!showColumnMenu)}
                      className="px-3 py-2 rounded border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                      </svg>
                      Column visibility
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                    
                    {showColumnMenu && (
                      <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[200px] max-h-[400px] overflow-y-auto">
                        <div className="p-2">
                          <div className="text-xs font-semibold text-gray-500 px-2 py-1">Toggle Columns</div>
                          {[
                            { key: 'id', label: 'ID' },
                            { key: 'checkbox', label: 'Select' },
                            { key: 'time', label: 'Time' },
                            { key: 'vehicle', label: 'Vehicle' },
                            { key: 'event', label: 'Event' },
                            { key: 'status', label: 'Status' },
                            { key: 'odometer', label: 'Odometer (MI)' },
                            { key: 'engineHours', label: 'Engine Hours' },
                            { key: 'location', label: 'Location' },
                            { key: 'notes', label: 'Notes' },
                            { key: 'action', label: 'Action' }
                          ].map(col => (
                            <label 
                              key={col.key}
                              className={`flex items-center px-2 py-2 cursor-pointer hover:bg-gray-50 rounded ${
                                visibleColumns[col.key] ? 'bg-blue-50' : ''
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={visibleColumns[col.key]}
                                onChange={() => toggleColumn(col.key)}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                              />
                              <span className={`ml-2 text-sm ${
                                visibleColumns[col.key] ? 'font-medium text-blue-700' : 'text-gray-700'
                              }`}>
                                {col.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="pl-3 pr-4 py-2 rounded border border-gray-300 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b-2 border-gray-200">
                        {visibleColumns.id && (
                          <th className="px-4 py-3.5 text-left font-medium text-gray-500 border-b text-sm whitespace-nowrap">ID</th>
                        )}
                        {visibleColumns.checkbox && (
                          <th className="px-4 py-3.5 text-left font-medium text-gray-500 border-b text-sm whitespace-nowrap">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                              checked={allSelected}
                              onChange={handleSelectAll}
                            />
                          </th>
                        )}
                        {visibleColumns.time && (
                          <th className="px-4 py-3.5 text-left font-medium text-gray-500 border-b text-sm whitespace-nowrap">Time</th>
                        )}
                        {visibleColumns.vehicle && (
                          <th className="px-4 py-3.5 text-left font-medium text-gray-500 border-b text-sm whitespace-nowrap">Vehicle</th>
                        )}
                        {visibleColumns.event && (
                          <th className="px-4 py-3.5 text-left font-medium text-gray-500 border-b text-sm whitespace-nowrap">Event</th>
                        )}
                        {visibleColumns.status && (
                          <th className="px-4 py-3.5 text-left font-medium text-gray-500 border-b text-sm whitespace-nowrap">Status</th>
                        )}
                        {visibleColumns.odometer && (
                          <th className="px-4 py-3.5 text-left font-medium text-gray-500 border-b text-sm whitespace-nowrap">Odometer (MI)</th>
                        )}
                        {visibleColumns.engineHours && (
                          <th className="px-4 py-3.5 text-left font-medium text-gray-500 border-b text-sm whitespace-nowrap">Engine Hours</th>
                        )}
                        {visibleColumns.location && (
                          <th className="px-4 py-3.5 text-left font-medium text-gray-500 border-b text-sm whitespace-nowrap">Location</th>
                        )}
                        {visibleColumns.notes && (
                          <th className="px-4 py-3.5 text-left font-medium text-gray-500 border-b text-sm whitespace-nowrap">Notes</th>
                        )}
                        {visibleColumns.action && (
                          <th className="px-4 py-3.5 text-left font-medium text-gray-500 border-b text-sm whitespace-nowrap">Action</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvents.length === 0 ? (
                        <tr>
                          <td colSpan="11" className="px-4 py-8 text-center text-gray-500">
                            No data available in table
                          </td>
                        </tr>
                      ) : (
                        filteredEvents.map((event, index) => (
                          <tr key={event.id} className="hover:bg-gray-50 border-b border-gray-200">
                            {visibleColumns.id && (
                              <td className="px-4 py-3.5 border-b text-sm">{index + 1}</td>
                            )}
                            {visibleColumns.checkbox && (
                              <td className="px-4 py-3.5 border-b">
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                                  checked={selectedEvents.includes(event.id)}
                                  onChange={() => handleSelectEvent(event.id)}
                                />
                              </td>
                            )}
                            {visibleColumns.time && (
                              <td className="px-4 py-3.5 border-b text-sm whitespace-nowrap">
                                {formatDateTime(event.event_time)}
                              </td>
                            )}
                            {visibleColumns.vehicle && (
                              <td className="px-4 py-3.5 border-b text-sm">
                                <div>
                                  <div className="font-medium">{event.vehicle_unit_number || 'N/A'}</div>
                                  {event.device_serial && (
                                    <div className="text-xs text-gray-500">Device: {event.device_serial}</div>
                                  )}
                                </div>
                              </td>
                            )}
                            {visibleColumns.event && (
                              <td className="px-4 py-3.5 border-b text-sm">
                                <div className="flex items-center gap-2">
                                  <span>{getSeverityIcon(event.severity)}</span>
                                  <span>{event.event_type.replace(/_/g, ' ')}</span>
                                </div>
                              </td>
                            )}
                            {visibleColumns.status && (
                              <td className="px-4 py-3.5 border-b text-sm">
                                <span className={`px-2 py-1 text-xs font-semibold rounded border ${getSeverityColor(event.severity)}`}>
                                  {event.severity}
                                </span>
                              </td>
                            )}
                            {visibleColumns.odometer && (
                              <td className="px-4 py-3.5 border-b text-sm">
                                {event.odometer || 'N/A'}
                              </td>
                            )}
                            {visibleColumns.engineHours && (
                              <td className="px-4 py-3.5 border-b text-sm">
                                {event.engine_hours || 'N/A'}
                              </td>
                            )}
                            {visibleColumns.location && (
                              <td className="px-4 py-3.5 border-b text-sm max-w-xs truncate" title={event.location}>
                                {event.location || 'N/A'}
                              </td>
                            )}
                            {visibleColumns.notes && (
                              <td className="px-4 py-3.5 border-b text-sm max-w-xs truncate" title={event.description}>
                                {event.description || ''}
                              </td>
                            )}
                            {visibleColumns.action && (
                              <td className="px-4 py-3.5 border-b text-sm">
                                <button
                                  onClick={() => handleResolve(event.id)}
                                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 font-medium"
                                >
                                  Resolve
                                </button>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination Footer */}
              <div className="p-3.5 border-t border-gray-200 flex justify-between items-center text-sm">
                <div className="text-gray-500">
                  Showing {filteredEvents.length === 0 ? 0 : 1} to {filteredEvents.length} of {events.length} entries
                </div>
                <div className="flex gap-1.5">
                  <button className="px-2.5 py-1.5 rounded border border-gray-200 text-blue-600 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-2.5 py-1.5 rounded border border-blue-600 bg-blue-600 text-white">
                    1
                  </button>
                  <button className="px-2.5 py-1.5 rounded border border-gray-200 text-blue-600 hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnidentifiedEvents;