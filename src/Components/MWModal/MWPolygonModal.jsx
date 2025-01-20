import React, { useState } from "react";

function MWPolygonModal({ polygonCoordinates, insertPolygon, closeModal }) {
  const [position, setPosition] = useState({ top: 50, left: 50 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const calculateDistance = (coord1, coord2) => {
    if (!coord1 || !coord2 || !Array.isArray(coord1) || !Array.isArray(coord2)) {
      return 0;
    }

    const toRadians = (deg) => (deg * Math.PI) / 180;
    const R = 6371000; 
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };


  const handleMouseDown = (e) => {
    setDragging(true);
    setDragStart({ x: e.clientX - position.left, y: e.clientY - position.top });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        top: e.clientY - dragStart.y,
        left: e.clientX - dragStart.x,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleImport = () => {
    const points = [...polygonCoordinates];
    if (points.length > 0) {
      points.push(points[0]);
    }
    insertPolygon(points);
  };

  const modalStyle = {
    position: 'fixed',
    top: `${position.top}px`,
    left: `${position.left}px`,
    backgroundColor: 'white',
    padding: '10px',
    width:'40%',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    zIndex: 1000,
    cursor: dragging ? 'grabbing' : 'grab',
    overflow: 'scroll'
  };

  return (
    <div
      style={modalStyle}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        onMouseDown={handleMouseDown}
        style={{
          padding: '10px',
          backgroundColor: '#f5f5f5',
          marginBottom: '10px',
          cursor: 'grab'
        }}
      >
        <h3>Polygon Coordinates</h3>
      </div>
      
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>WP</th>
              <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Coordinates</th>
              <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Distance (m)</th>
            </tr>
          </thead>
          <tbody>
            {polygonCoordinates.map((coord, index) => (
              <tr key={index}>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  {`${String(index).padStart(2, "0")}`}
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  {`(${coord[1].toFixed(6)}, ${coord[0].toFixed(6)})`}
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  {index > 0 
                    ? calculateDistance(
                        polygonCoordinates[index - 1],
                        coord
                      ).toFixed(2)
                    : "0.00"}
                </td>
              </tr>
            ))}
            {polygonCoordinates.length > 1 && (
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  Final
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  Back to start
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  {calculateDistance(
                    polygonCoordinates[polygonCoordinates.length - 1],
                    polygonCoordinates[0]
                  ).toFixed(2)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button 
          onClick={handleImport}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Import Polygon
        </button>
        <button 
          onClick={closeModal}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default MWPolygonModal;