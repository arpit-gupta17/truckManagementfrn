import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Copy,
  File,
  FileText as FileTextIcon,
  Printer,
  Columns,
  ChevronDown
} from 'lucide-react';
import Navbar from '../../modules/Navbar';
import Sidebar from '../../modules/Sidebar';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/driver/getDrivers', {
          withCredentials: true,
        });
        setDrivers(res.data);
      } catch (error) {
        console.error("Error fetching drivers:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  // ✅ DVIR Navigation Handler - This redirects to DVIR Management
  const handleDVIRClick = () => {
    navigate(`/dashboard/${id}/LogBook/DVIR`);
  };

  // ✅ Logs Navigation Handler - Redirects to driver's logbook
  const handleLogsClick = (driverId) => {
    navigate(`/dashboard/${id}/LogBook/DriverLogBook/${driverId}`);
  };

  // ✅ Backup Logs Handler - Redirects to driver summary/backup
  const handleBackupLogsClick = (driverId) => {
    navigate(`/dashboard/${id}/LogBook/Summary/${driverId}`);
  };

  // ✅ DOT File Handler - Redirects to DOT management
  const handleDotFileClick = () => {
    navigate(`/dashboard/${id}/DOT`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 ml-60 mt-15 p-5 overflow-auto">
          {/* Breadcrumb */}
          <div className="flex items-center px-5 py-4 text-sm">
            <a href="#" className="text-blue-600 font-medium hover:underline">Home</a>
            <span className="mx-2 text-gray-500">/</span>
            <span>Manage Company</span>
          </div>

          <h1 className="text-2xl mb-4 font-medium text-gray-800">Drivers</h1>

          <div className="bg-white rounded shadow-sm border border-gray-200 mb-5 overflow-hidden">
            {/* Toolbar */}
            <div className="p-3.5 border-b border-gray-200 flex items-center flex-wrap gap-2">
              {[
                { icon: Copy, label: "Copy" },
                { icon: FileTextIcon, label: "CSV" },
                { icon: FileTextIcon, label: "Excel" },
                { icon: File, label: "PDF" },
                { icon: Printer, label: "Print" }
              ].map(({ icon: Icon, label }) => (
                <button key={label} className="px-3 py-1.5 rounded border border-gray-300 bg-white text-gray-800 text-sm font-medium flex items-center hover:bg-gray-50">
                  <Icon size={14} className="mr-1" />
                  {label}
                </button>
              ))}

              <div className="relative">
                <button className="px-3 py-1.5 rounded border border-gray-300 bg-white text-gray-800 text-sm font-medium flex items-center hover:bg-gray-50">
                  <Columns size={14} className="mr-1" />
                  Column visibility
                  <ChevronDown size={12} className="ml-1" />
                </button>
              </div>

              <input
                type="text"
                className="px-3 py-1.5 rounded border border-gray-300 text-sm ml-auto w-52 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                placeholder="Search..."
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border border-slate-300">
                <thead className="bg-slate-100 text-xs text-slate-600 uppercase border-b border-slate-300">
                  <tr className="divide-x divide-slate-300">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Assigned Unit</th>
                    <th className="px-4 py-3">License</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-300 text-slate-700">
                  {drivers.map((driver) => (
                    <tr
                      key={driver.id}
                      className="divide-x divide-slate-300 hover:bg-slate-50 transition"
                    >
                      <td className="px-4 py-3">{driver.first_name} {driver.last_name}</td>
                      <td className="px-4 py-3">{driver.added_by_company_name}</td>
                      <td className="px-4 py-3">{driver.assigned_vehicles}</td>
                      <td className="px-4 py-3">{driver.license_number}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${driver.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                            }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-current" />
                          {driver.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {/* ✅ DVIR Button - Clicking this redirects to DVIR Management */}
                          <button 
                            onClick={handleDVIRClick}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-xs rounded transition-colors font-medium"
                          >
                            DVIR
                          </button>
                          
                          {/* ✅ Logs Button - Redirects to driver's logbook */}
                          <button 
                            onClick={() => handleLogsClick(driver.id)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 text-xs rounded transition-colors font-medium"
                          >
                            Logs
                          </button>
                          
                          {/* ✅ Backup Logs Button - Redirects to driver summary */}
                          <button 
                            onClick={() => handleBackupLogsClick(driver.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs rounded transition-colors font-medium"
                          >
                            Backup Logs
                          </button>
                          
                          {/* ✅ DOT File Button - Redirects to DOT management */}
                          <button 
                            onClick={handleDotFileClick}
                            className="bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 text-xs rounded transition-colors font-medium"
                          >
                            Dot File
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;