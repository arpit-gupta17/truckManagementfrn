import { useState, useEffect } from 'react';
import {
  Menu, FileText, HelpCircle, Smartphone, AlertTriangle, Settings, Truck,
  ChevronDown, Plus, Home, RefreshCw, Copy, Printer, Columns, ChevronLeft,
  ChevronRight, Trash2, Pencil
} from 'lucide-react';
import Navbar from '../../../../modules/Navbar';
import Sidebar from '../../../../modules/Sidebar';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DOT = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

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


  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar - fixed at top */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden "> {/* pt-16 to account for navbar height */}
        {/* Sidebar - fixed below navbar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-auto ml-60"> {/* ml-60 to account for sidebar width */}
          {/* Breadcrumb */}
          <div className="px-6 pt-4">
            <div className="flex items-center">
              <a href="#" className="text-blue-600 hover:underline">Home</a>
              <span className="mx-2 text-slate-400">/</span>
              <span className="text-slate-600">Manage Drivers</span>
            </div>
          </div>

          {/* Page Title */}
          <div className="px-6 py-4 mt-10  flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-slate-800">Manage Drivers</h1>
            <div className="flex gap-2">

<Link
              to={`/dashboard/${id}/Manage/VehicleManagement/AddDriver`}
              className="px-3 py-2 rounded bg-green-600 text-white text-sm font-medium hover:bg-green-700"
            >
              Add Driver
            </Link>

            </div>
          </div>

          {/* Main Card */}
          <div className="flex-1 overflow-auto p-6">
            <div className="bg-white rounded-lg shadow border border-slate-200 flex flex-col h-full">
              {/* Toolbar */}
              <div className="px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-700 text-sm font-medium flex items-center hover:bg-slate-50">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </button>
                  <button className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-700 text-sm font-medium flex items-center hover:bg-slate-50">
                    <FileText className="w-4 h-4 mr-2" />
                    CSV
                  </button>
                  <button className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-700 text-sm font-medium flex items-center hover:bg-slate-50">
                    <FileText className="w-4 h-4 mr-2" />
                    Excel
                  </button>
                  <button className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-700 text-sm font-medium flex items-center hover:bg-slate-50">
                    <FileText className="w-4 h-4 mr-2" />
                    PDF
                  </button>
                  <button className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-700 text-sm font-medium flex items-center hover:bg-slate-50">
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </button>
                  <div className="relative">
                    <button className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-700 text-sm font-medium flex items-center hover:bg-slate-50">
                      <Columns className="w-4 h-4 mr-2" />
                      Column visibility
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-3 pr-4 py-2 rounded border border-slate-300 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
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
                        <td className="px-4 py-3">
                          <Link
                            to={`/dashboard/${id}/LogBook/driver/${driver.username}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                          >
                            {driver.first_name} {driver.last_name}
                          </Link>
                        </td>
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
                          <div className="flex gap-2">
                            <button
                              className="p-1 rounded hover:bg-blue-100 text-blue-600 transition"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1 rounded hover:bg-red-100 text-red-600 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>



            {/* Table Footer */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default DOT;