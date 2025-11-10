import React, { useEffect, useRef } from 'react';

/**
 * GraphCanvas
 * props:
 *  - hourlySamples: [{hour, start_time, end_time, status}] OR fallback events
 *  - date: 'YYYY-MM-DD'
 *  - width, height (optional)
 */
const statusOrder = ['OFF_DUTY','SLEEPER','ON_DUTY','DRIVING']; // bottom to top mapping
const statusColors = {
  'OFF_DUTY': '#2D9CDB',
  'SLEEPER': '#9B51E0',
  'ON_DUTY': '#EB5757',
  'DRIVING': '#27AE60',
  'UNKNOWN': '#C0C0C0'
};

export default function GraphCanvas({ hourlySamples = [], events = [], date, width = 1200, height = 200 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // clear
    ctx.clearRect(0,0,canvas.width, canvas.height);

    // drawing layout
    const leftPad = 60;
    const rightPad = 40;
    const topPad = 20;
    const bottomPad = 20;
    const gridW = canvas.width - leftPad - rightPad;
    const gridH = canvas.height - topPad - bottomPad;

    // Draw horizontal rows labels (OFF, S, D, ON) bottom-to-top
    const rowCount = 4;
    const rowH = gridH / rowCount;
    const labels = ['OFF', 'S', 'D', 'ON']; // visual labels left
    ctx.font = '12px system-ui';
    ctx.fillStyle = '#222';
    for (let i=0;i<rowCount;i++) {
      const y = topPad + gridH - (i*rowH) - rowH/2;
      ctx.fillText(labels[i], 8, y+4);
      // horizontal line
      ctx.strokeStyle = '#e6e6e6';
      ctx.beginPath(); ctx.moveTo(leftPad, topPad + gridH - i*rowH); ctx.lineTo(canvas.width - rightPad, topPad + gridH - i*rowH); ctx.stroke();
    }

    // Draw vertical hour ticks
    for (let h=0; h<24; h++){
      const x = leftPad + (gridW * (h/24));
      ctx.strokeStyle = '#eee';
      ctx.beginPath(); ctx.moveTo(x, topPad); ctx.lineTo(x, topPad + gridH); ctx.stroke();
      // hour label every 2 or 3
      if (h % 2 === 0) {
        ctx.fillStyle = '#333';
        ctx.fillText((h%12===0?12:h%12) + (h<12? 'a':'p'), x - 10, topPad + gridH + 14);
      }
    }

    // draw segments from hourlySamples if present, else try to derive from events
    const drawSegments = hourlySamples && hourlySamples.length>0 ? hourlySamples : deriveHourlyFromEvents(events, date);

    drawSegments.forEach(s => {
      const hour = Number(s.hour);
      const x1 = leftPad + (gridW * (hour/24));
      const x2 = leftPad + (gridW * ((hour+1)/24));
      const status = s.status || 'UNKNOWN';
      // map status to row index (OFF->0, SLEEPER->1, DRIVING->2, ON_DUTY->3) adjust mapping to labels above
      let rowIdx;
      if (status === 'OFF_DUTY') rowIdx = 0;
      else if (status === 'SLEEPER') rowIdx = 1;
      else if (status === 'DRIVING') rowIdx = 2;
      else if (status === 'ON_DUTY') rowIdx = 3;
      else rowIdx = 0;

      // compute vertical bar
      const y = topPad + gridH - (rowIdx * rowH) - rowH + 4;
      const barHeight = rowH - 8;
      ctx.fillStyle = statusColors[status] || statusColors['UNKNOWN'];
      ctx.fillRect(x1+1, y, (x2 - x1)-2, barHeight);
    });

    // draw border
    ctx.strokeStyle = '#ccc';
    ctx.strokeRect(leftPad, topPad, gridW, gridH);

  }, [hourlySamples, events, date, width, height]);

  return (
    <div className="w-full overflow-x-auto">
      <canvas ref={canvasRef} style={{ width: '100%', maxWidth: width }} />
    </div>
  );
}

function deriveHourlyFromEvents(events = [], dateStr) {
  // Simple fallback: create a sample per hour based on last event before that hour
  if (!events || events.length===0) return [];
  // build a list of 24 slots; for each slot find most recent event <= slot end
  const evSorted = [...events].sort((a,b)=>new Date(a.time)-new Date(b.time));
  const result = [];
  for (let h=0; h<24; h++) {
    const slotEnd = new Date(dateStr + 'T' + String(h).padStart(2,'0') + ':59:59.999Z');
    let representative = null;
    for (let i = evSorted.length-1; i>=0; i--) {
      const ev = evSorted[i];
      if (new Date(ev.time) <= slotEnd) {
        representative = ev;
        break;
      }
    }
    if (representative) {
      result.push({
        hour: h,
        status: representative.status,
        start_time: representative.time,
        end_time: representative.time,
        odometer: representative.odometer,
        engine_hours: representative.engine_hours,
        location: representative.location
      });
    }
  }
  return result;
}