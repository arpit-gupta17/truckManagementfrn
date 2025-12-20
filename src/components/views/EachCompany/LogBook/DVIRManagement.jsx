import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Copy, FileText, Printer, Columns, ChevronDown, ChevronUp, 
  AlertCircle, CheckCircle, Clock, Filter 
} from 'lucide-react';

// Mock Navbar component
const Navbar = () => (
  <div className="fixed top-0 left-0 right-0 h-16 bg-gray-800 text-white flex items-center px-6 z-50">
    <div className="text-xl font-semibold">DVIR Management System</div>
  </div>
);

// Mock Sidebar component
const Sidebar = () => (
  <div className="fixed left-0 top-16 bottom-0 w-60 bg-gray-900 text-white p-4 z-40">
    <nav className="space-y-2">
      <div className="p-2 hover:bg-gray-800 rounded cursor-pointer">Dashboard</div>
      <div className="p-2 hover:bg-gray-800 rounded cursor-pointer bg-gray-800">DVIR</div>
      <div className="p-2 hover:bg-gray-800 rounded cursor-pointer">Drivers</div>
      <div className="p-2 hover:bg-gray-800 rounded cursor-pointer">Vehicles</div>
    </nav>
  </div>
);

const DVIRManagement = () => {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [dvirRecords, setDvirRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  // Fetch DVIRs on component mount and when filters change
  useEffect(() => {
    fetchDVIRs();
    fetchStats();
  }, []);

  const fetchDVIRs = async (filters = {}) => {
    try {
      setLoading(true);

      const response = await axios.get(
        'http://localhost:5000/api/app/dvir/my-dvirs',
        {
          withCredentials: true,
          params: {
            startDate: filters.startDate ?? startDate,
            endDate: filters.endDate ?? endDate,
            status: filters.status ?? filterStatus
          }
        }
      );

      if (response.data.success) {
        const formattedData = response.data.data.map(dvir => ({
          id: dvir.id,
          time: new Date(dvir.time).toLocaleString(),
          vehicle: dvir.vehicle_number || `Vehicle ${dvir.vehicle_id ?? 'N/A'}`,
          odometer: dvir.odometer ? dvir.odometer.toLocaleString() : 'N/A',
          engineHours: dvir.engine_hours ? dvir.engine_hours.toLocaleString() : 'N/A',
          driver: dvir.driver_name || dvir.driver_username,
          location: dvir.location || 'N/A',
          signature: dvir.signature ? 'Signed' : 'Not Signed',
          status: dvir.status
        }));

        setDvirRecords(formattedData);
      }
    } catch (error) {
      console.error('❌ Error fetching DVIRs:', error);
      alert('Failed to load DVIR records');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/app/dvir/stats',
        {
          withCredentials: true,
          params: { startDate, endDate }
        }
      );

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching DVIR stats:', error.response?.status, error.response?.data);
    }
  };

  const handleDateSubmit = () => {
    fetchDVIRs();
    fetchStats();
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    fetchDVIRs({ status });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...dvirRecords].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setDvirRecords(sortedData);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return (
        <div className="inline-flex flex-col ml-1">
          <ChevronUp size={12} className="text-gray-400 -mb-1" />
          <ChevronDown size={12} className="text-gray-400" />
        </div>
      );
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp size={14} className="inline ml-1 text-blue-600" />
    ) : (
      <ChevronDown size={14} className="inline ml-1 text-blue-600" />
    );
  };

  const filteredRecords = dvirRecords.filter(record => {
    const searchLower = searchTerm.toLowerCase();
    return (
      record.vehicle?.toLowerCase().includes(searchLower) ||
      record.driver?.toLowerCase().includes(searchLower) ||
      record.location?.toLowerCase().includes(searchLower) ||
      record.status?.toLowerCase().includes(searchLower)
    );
  });

  const handleCopy = () => {
    const text = filteredRecords.map(r => 
      `${r.time}\t${r.vehicle}\t${r.odometer}\t${r.engineHours}\t${r.driver}\t${r.location}\t${r.signature}\t${r.status}`
    ).join('\n');
    navigator.clipboard.writeText(text);
    alert('Data copied to clipboard');
  };

  const exportToCSV = () => {
    const headers = ['Time', 'Vehicle', 'Odometer', 'Engine Hours', 'Driver', 'Location', 'Signature', 'Status'];
    const rows = filteredRecords.map(r => [
      r.time, r.vehicle, r.odometer, r.engineHours, 
      r.driver, r.location, r.signature, r.status
    ]);
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dvir-records-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>DVIR Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #1f2937; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f3f4f6; }
        </style>
      </head>
      <body>
        <h1>DVIR Records Report</h1>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Vehicle</th>
              <th>Odometer</th>
              <th>Engine Hours</th>
              <th>Driver</th>
              <th>Location</th>
              <th>Signature</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredRecords.map(r => `
              <tr>
                <td>${r.time}</td>
                <td>${r.vehicle}</td>
                <td>${r.odometer}</td>
                <td>${r.engineHours}</td>
                <td>${r.driver}</td>
                <td>${r.location}</td>
                <td>${r.signature}</td>
                <td>${r.status}</td>
              </tr>
            `).join('')}
          </tbody>
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

  const handleDelete = async (dvirId) => {
    if (!window.confirm('Are you sure you want to delete this DVIR report?')) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5000/api/dvir/${dvirId}`, {
        withCredentials: true
      });

      if (response.data.success) {
        alert('DVIR report deleted successfully');
        fetchDVIRs();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting DVIR:', error);
      alert('Failed to delete DVIR report');
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'COMPLETED': 'bg-green-100 text-green-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'UNDER_REVIEW': 'bg-blue-100 text-blue-800',
      'APPROVED': 'bg-emerald-100 text-emerald-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 ml-60 mt-16 p-6 overflow-auto">
          {/* Page Header - Simple without duplicate navigation */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">DVIR Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              Driver Vehicle Inspection Reports
            </p>
          </div>

          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Reports</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_reports || 0}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{stats.completed || 0}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending || 0}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Defects Found</p>
                    <p className="text-2xl font-bold text-red-600">{stats.defects_found || 0}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Certified</p>
                    <p className="text-2xl font-bold text-emerald-600">{stats.certified_reports || 0}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
              </div>
            </div>
          )}

          {/* Date Range Filter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <button 
                onClick={handleDateSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Apply Filter
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <Filter size={16} className="text-gray-600" />
                <select
                  value={filterStatus}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="APPROVED">Approved</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Table Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <button 
                  onClick={handleCopy}
                  className="px-3 py-2 rounded border border-gray-300 bg-white text-gray-700 text-sm font-medium flex items-center hover:bg-gray-50 transition-colors"
                >
                  <Copy size={14} className="mr-2" />
                  Copy
                </button>
                <button 
                  onClick={exportToCSV}
                  className="px-3 py-2 rounded border border-gray-300 bg-white text-gray-700 text-sm font-medium flex items-center hover:bg-gray-50 transition-colors"
                >
                  <FileText size={14} className="mr-2" />
                  CSV
                </button>
                <button 
                  onClick={exportToCSV}
                  className="px-3 py-2 rounded border border-gray-300 bg-white text-gray-700 text-sm font-medium flex items-center hover:bg-gray-50 transition-colors"
                >
                  <FileText size={14} className="mr-2" />
                  Excel
                </button>
                <button 
                  onClick={handlePrint}
                  className="px-3 py-2 rounded border border-gray-300 bg-white text-gray-700 text-sm font-medium flex items-center hover:bg-gray-50 transition-colors"
                >
                  <Printer size={14} className="mr-2" />
                  Print
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Search:</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 rounded border border-gray-300 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search..."
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      onClick={() => handleSort('time')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    >
                      Time {getSortIcon('time')}
                    </th>
                    <th 
                      onClick={() => handleSort('vehicle')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    >
                      Vehicle {getSortIcon('vehicle')}
                    </th>
                    <th 
                      onClick={() => handleSort('odometer')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    >
                      Odometer {getSortIcon('odometer')}
                    </th>
                    <th 
                      onClick={() => handleSort('engineHours')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    >
                      Engine Hours {getSortIcon('engineHours')}
                    </th>
                    <th 
                      onClick={() => handleSort('driver')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    >
                      Driver {getSortIcon('driver')}
                    </th>
                    <th 
                      onClick={() => handleSort('location')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    >
                      Location {getSortIcon('location')}
                    </th>
                    <th 
                      onClick={() => handleSort('signature')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    >
                      Signature {getSortIcon('signature')}
                    </th>
                    <th 
                      onClick={() => handleSort('status')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    >
                      Status {getSortIcon('status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <div zclassName="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-3"></div>
                          <p className="text-lg font-medium">Loading DVIR records...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <FileText size={48} className="mb-3 text-gray-300" />
                          <p className="text-lg font-medium">No data available</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {record.vehicle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.odometer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.engineHours}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.driver}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.signature}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-800 font-medium">
                              View
                            </button>
                            <button 
                              onClick={() => handleDelete(record.id)}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Delete
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
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="text-sm text-gray-700">
                Showing {filteredRecords.length === 0 ? 0 : 1} to {filteredRecords.length} of {dvirRecords.length} entries
              </div>
              <div className="flex gap-1">
                <button className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-600 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                <button className="px-3 py-1 rounded bg-blue-600 text-white text-sm font-medium">
                  1
                </button>
                <button className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-600 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DVIRManagement;