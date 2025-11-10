// src/components/views/EachCompany/LogBook/DriverLogbook.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../../modules/Navbar";
import Sidebar from "../../../modules/Sidebar";
import GraphCanvas from "./GraphCanvas";
import HourlyTable from "./HourlyTable";
import axios from "axios";
import { User, Truck, Calendar, MapPin, ArrowLeft } from "lucide-react";

const API_URL = "http://localhost:5000/api";

const DriverLogbook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { driver, company, logs } = location.state || {};
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  const [events, setEvents] = useState([]);
  const [hourlySamples, setHourlySamples] = useState([]);
  const [selectedLogDate, setSelectedLogDate] = useState('');

  useEffect(() => {
    const fetchSelectedLog = async () => {
      if (!driver || !logs?.length) return;

      const rawIso = logs[0]?.date;
      if (!rawIso) return;

      const logDateLocal = new Date(rawIso).toLocaleDateString('en-CA');
      try {
        const res = await axios.get(
          `${API_URL}/driver/logs/${driver.id}/${logDateLocal}`
        );
        const log = res.data;
        console.log("Fetched Full Log:", log);

        setEvents(log.events || []);
        setSelectedLogDate(logDateLocal);

        setHourlySamples(
          (log.hourlySamples && log.hourlySamples.length)
            ? log.hourlySamples
            : deriveHourlyFromEventsClient(log.events || [], logDateLocal)
        );
      } catch (err) {
        console.error("Error fetching full log:", err);
        setEvents([]);
        setHourlySamples([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSelectedLog();
  }, [driver, logs]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar collapsed={collapsed} />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Loading driver logbook...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar collapsed={collapsed} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "ml-16" : "ml-60"}`}>
        <Navbar toggleSidebar={() => setCollapsed(!collapsed)} />

        <main className="flex-1 overflow-y-auto mt-16">
          {/* Page Header */}
          <div className="bg-white border-b border-gray-200 sticky top-16 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Driver Logbook</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {driver?.first_name} {driver?.last_name} • {selectedLogDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
            {/* Driver Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <User size={20} className="text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Driver Information</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <InfoCard label="Driver Name" value={`${driver?.first_name} ${driver?.last_name}`} />
                  <InfoCard label="Driver ID" value={driver?.username} />
                  <InfoCard label="License Number" value={driver?.license_number} />
                  <InfoCard label="State" value={driver?.state} />
                  <InfoCard 
                    label="Exempt Driver" 
                    value={driver?.exempt_driver ? "YES" : "NO"}
                    highlight={driver?.exempt_driver}
                  />
                </div>
              </div>
            </div>

            {/* Company Information Card */}
            {company && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-white px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Truck size={20} className="text-green-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Carrier Information</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InfoCard label="Carrier Name" value={company.companyname} />
                    <InfoCard 
                      label="Main Office" 
                      value={`${company.city}, ${company.address}, ${company.country}`} 
                    />
                    <InfoCard label="Home Terminal" value={company.terminalAddress || "-"} />
                    <InfoCard label="DOT Number" value={company.dot_number || "-"} />
                  </div>
                </div>
              </div>
            )}

            {/* Daily Timeline Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Daily Timeline</h2>
                  </div>
                  <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {selectedLogDate}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <GraphCanvas hourlySamples={hourlySamples} events={events} date={selectedLogDate} />
              </div>
            </div>

            {/* Hourly Breakdown Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <MapPin size={20} className="text-orange-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Hourly Breakdown</h2>
                </div>
              </div>
              <div className="p-6">
                <HourlyTable hourlySamples={hourlySamples} events={events} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

/* InfoCard Component */
const InfoCard = ({ label, value, highlight }) => (
  <div className="space-y-1.5">
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
    <p className={`text-sm font-semibold ${highlight ? 'text-green-600' : 'text-gray-900'}`}>
      {value || "-"}
    </p>
  </div>
);

function deriveHourlyFromEventsClient(events = [], dateStr) {
  if (!events || events.length === 0 || !dateStr) return [];
  const evSorted = [...events].sort((a, b) => new Date(a.event_time) - new Date(b.event_time));
  const samples = [];

  for (let h = 0; h < 24; h++) {
    const hourEndLocal = new Date(`${dateStr}T${String(h).padStart(2, '0')}:59:59.999`);
    const rep = evSorted.slice().reverse().find(e => new Date(e.event_time) <= hourEndLocal);
    if (rep) {
      samples.push({
        hour: h,
        status: rep.status,
        start_time: rep.event_time,
        end_time: rep.event_time,
        odometer: rep.odometer,
        engine_hours: rep.engineHours ?? rep.engine_hours,
        location: rep.location
      });
    }
  }

  return samples;
}

export default DriverLogbook;