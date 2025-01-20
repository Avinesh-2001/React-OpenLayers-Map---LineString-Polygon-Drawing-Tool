import React, { useState } from 'react';

function MWInstructionModal({ onClose, visible }) {
  const [showInstructions, setShowInstructions] = useState(true);
  const [position, setPosition] = useState({ top: 50, left: 50 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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

  const handleGenerateData = () => {
    setShowInstructions(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <div
      className="modal instruction-modal"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
    >
      <div className="modal-header">
        <h2>Mission Creation</h2>
      </div>
      {showInstructions && (
        <div className="modal-content">
          <h3>Waypoint Navigation</h3>
          <p>
            Click on the map to mark points of the route and then by double click
            complete the route
          </p>
          <button onClick={handleGenerateData}>Generate Data</button>
        </div>
      )}
    </div>
  );
}

export default MWInstructionModal;