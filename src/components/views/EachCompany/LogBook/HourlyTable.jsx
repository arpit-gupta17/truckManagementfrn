import React from 'react';

/**
 * hourlySamples: [{ hour, start_time, end_time, status, odometer, engine_hours, location }]
 */
export default function HourlyTable({ hourlySamples = [], events = [] }) {
  // fallback: build hourly rows from events if samples empty
  const rows = hourlySamples && hourlySamples.length > 0 ? 
    hourlySamples :
    buildHourlyFallbackFromEvents(events);

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-8 overflow-x-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Hourly Status</h3>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="px-3 py-2 text-left font-semibold">Hour</th>
            <th className="px-3 py-2 text-left font-semibold">Status</th>
            <th className="px-3 py-2 text-left font-semibold">From</th>
            <th className="px-3 py-2 text-left font-semibold">To</th>
            <th className="px-3 py-2 text-left font-semibold">Odometer</th>
            <th className="px-3 py-2 text-left font-semibold">Engine Hours</th>
            <th className="px-3 py-2 text-left font-semibold">Location</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan="7" className="text-center py-4 text-gray-500">No hourly samples</td></tr>
          ) : rows.map((r, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="px-3 py-2">{String(r.hour).padStart(2,'0')}:00 - {String((r.hour+1)%24).padStart(2,'0')}:00</td>
              <td className="px-3 py-2">{r.status || '-'}</td>
              <td className="px-3 py-2">{r.start_time ? new Date(r.start_time).toLocaleTimeString() : '-'}</td>
              <td className="px-3 py-2">{r.end_time ? new Date(r.end_time).toLocaleTimeString() : '-'}</td>
              <td className="px-3 py-2">{r.odometer ?? '-'}</td>
              <td className="px-3 py-2">{r.engine_hours ?? r.engineHours ?? '-'}</td>
              <td className="px-3 py-2">{r.location ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function buildHourlyFallbackFromEvents(events = []) {
  if (!events || events.length === 0) return [];
  const evSorted = [...events].sort((a,b)=> new Date(a.time) - new Date(b.time));
  const rows = [];
  for (let h=0; h<24; h++) {
    const slotEnd = new Date(evSorted[0].time);
    // better implementation: pick the latest event <= slot end as representative
    const slotRepresentative = evSorted.slice().reverse().find(e => new Date(e.time).getUTCHours() <= h);
    if (slotRepresentative) {
      rows.push({
        hour: h,
        status: slotRepresentative.status,
        start_time: slotRepresentative.time,
        end_time: slotRepresentative.time,
        odometer: slotRepresentative.odometer,
        engine_hours: slotRepresentative.engine_hours,
        location: slotRepresentative.location
      });
    }
  }
  return rows;

}

