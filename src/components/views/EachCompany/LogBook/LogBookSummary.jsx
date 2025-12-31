// src/components/views/EachCompany/LogBook/LogBookSummary.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../../modules/Navbar";
import Sidebar from "../../../modules/Sidebar";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function formatDuration(ms) {
  if (!ms || ms < 0) return "0h : 0min";
  const totalMin = Math.round(ms / 60000);
  const hours = Math.floor(totalMin / 60);
  const minutes = totalMin % 60;
  return `${hours}h : ${minutes}min`;
}

const LogBookSummary = () => {
  const { id, driverId } = useParams();
  const navigate = useNavigate();

  const [driver, setDriver] = useState(null);
  const [company, setCompany] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const res = await axios.get(`${API_URL}/driver/details/${driverId}`, {
          withCredentials: true,
        });
        setDriver(res.data.driver);
        setCompany(res.data.company);
        setLogs(res.data.logs || []);
        console.log("Driver Details:", res.data);
      } catch (err) {
        console.error("Error fetching driver details:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    if (driverId) fetchDriverDetails();
  }, [driverId]);

  // Filter current date log
  const selectedLog = logs.find(
    (log) =>
      new Date(log.date).toLocaleDateString("en-CA") === selectedDate
  );

  // Filter past 7 days logs
  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.date);
    const selected = new Date(selectedDate);
    const sevenDaysAgo = new Date(selected);
    sevenDaysAgo.setDate(selected.getDate() - 7);
    return logDate >= sevenDaysAgo && logDate <= selected;
  });

  const handleGoToLogbook = () =>
    navigate(`/dashboard/${id}/LogBook/DriverLogbook/${driverId}`, {
      state: { driver, company, logs },
    });

  if (loading)
    return (
      <div className="flex h-screen">
        <Sidebar collapsed={collapsed} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-700 text-lg">Loading Log Summary...</p>
        </div>
      </div>
    );

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} />
      <div
        className={`flex flex-col w-full transition-all duration-300 ${
          collapsed ? "ml-16" : "ml-60"
        }`}
      >
        <Navbar toggleSidebar={() => setCollapsed(!collapsed)} />
        <main className="mt-16 p-6 bg-gray-100 min-h-screen overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              📘 Logbook Summary
            </h2>
            <p className="text-gray-600 mt-1">
              {driver?.email || driver?.username} —{" "}
              {company?.hos_rules || driver?.hos_rules || "USA 70 hour / 8day"}
            </p>
            {company && (
              <p className="text-gray-500 mt-1 text-sm">
                Company: {company.companyname} — DOT: {company.dot_number} —{" "}
                {company.address}, {company.city}, {company.state}
              </p>
            )}
          </div>

          {/* Date Picker */}
          <div className="bg-white rounded-lg shadow-md p-5 mb-8 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">
                Select Date:
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleGoToLogbook}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow text-sm transition"
              disabled={!selectedLog}
            >
              📖 View Logbook
            </button>
          </div>

          {/* Selected Date Summary */}
          <div className="bg-white rounded-lg shadow-md p-5 mb-8">
            <h3 className="text-lg font-medium mb-4 text-gray-700">
              Selected Date Summary ({selectedDate})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="border p-2">LAST DUTY CYCLE</th>
                    <th className="border p-2">DATE</th>
                    <th className="border p-2">VEHICLE</th>
                    <th className="border p-2">LOCATION</th>
                    <th className="border p-2">BREAK</th>
                    <th className="border p-2">DRIVE</th>
                    <th className="border p-2">SHIFT</th>
                    <th className="border p-2">CYCLE</th>
                    <th className="border p-2">ELD STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLog ? (
                    <tr className="text-center hover:bg-gray-50">
                      <td className="border p-2">
                        {selectedLog?.last_duty_cycle || "Off Duty"}
                      </td>
                      <td className="border p-2">
                        {new Date(selectedLog?.date).toLocaleDateString()}
                      </td>
                      <td className="border p-2">
                        {selectedLog?.metadata?.vehicle || "—"}
                      </td>
                      <td className="border p-2">
                        {selectedLog?.events?.[0]?.location || "—"}
                      </td>
                      <td className="border p-2">{formatDuration(8 * 60 * 60 * 1000)}</td>
                      <td className="border p-2">{formatDuration(11 * 60 * 60 * 1000)}</td>
                      <td className="border p-2">{formatDuration(14 * 60 * 60 * 1000)}</td>
                      <td className="border p-2">
                        {company?.hos_rules || driver?.hos_rules || "USA 70 hour / 8day"}
                      </td>
                      <td className="border p-2">
                        {selectedLog?.certified ? (
                          <span className="text-green-600 font-semibold">✅ Certified</span>
                        ) : (
                          <span className="text-red-500 font-semibold">❌ Not Certified</span>
                        )}
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center text-gray-500 p-3 italic"
                      >
                        No log found for the selected date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Past 7 Days Summary */}
<div className="bg-white rounded-lg shadow-md p-5">
  <h3 className="text-lg font-medium mb-4 text-gray-700">
    Previous 7 Days Summary
  </h3>
  <div className="overflow-x-auto">
    <table className="w-full border border-gray-300 text-sm">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="border p-2">DATE</th>
          <th className="border p-2">CERTIFIED</th>
        </tr>
      </thead>
      <tbody>
        {filteredLogs.length > 0 ? (
          // Group logs by date so each date appears once
          Array.from(
            new Map(
              filteredLogs.map((log) => [
                new Date(log.date).toLocaleDateString(),
                log.certified,
              ])
            )
          ).map(([date, certified], index) => (
            <tr key={index} className="text-center hover:bg-gray-50">
              <td className="border p-2">{date}</td>
              <td className="border p-2">
                {certified ? (
                  <span className="text-green-600 font-semibold">✅</span>
                ) : (
                  <span className="text-red-500 font-semibold">❌</span>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="2"
              className="text-center text-gray-500 p-3 italic"
            >
              No logs found for the past 7 days.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

        </main>
      </div>
    </div>
  );
};

export default LogBookSummary;

