import React from 'react';

export default function CalendarWidget() {
  // Placeholder calendar, can be replaced with a real calendar component
  const today = new Date();
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title text-primary">Calendar</h5>
        <div className="text-center">
          <div style={{ fontSize: 48, fontWeight: 'bold' }}>{today.getDate()}</div>
          <div style={{ fontSize: 18 }}>{today.toLocaleString('default', { month: 'long' })} {today.getFullYear()}</div>
        </div>
        <div className="text-muted mt-2" style={{ fontSize: 14 }}>
          (Calendar widget coming soon)
        </div>
      </div>
    </div>
  );
}
