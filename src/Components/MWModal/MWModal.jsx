import React, { useState } from "react";
import "../../App.css";

function MWModal({
  visible,
  showInstructions,
  onGenerateData,
  waypoints = [],
  updateWaypoints,
  setInsertPosition,
  openPolygonModal,
  setModalVisible,
  setDrawingMode,
  setWaypoints,
  drawclick,
}) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  console.log("new", onGenerateData);
  const handleInsert = (index, direction) => {
    setInsertPosition(direction === "before" ? index : index + 1);
    openPolygonModal(direction === "before" ? index : index + 1);
    setModalVisible(false);
    setActiveDropdown(null);
  };

  const calculateDistance = (coord1, coord2) => {
    if (
      !coord1 ||
      !coord2 ||
      !Array.isArray(coord1) ||
      !Array.isArray(coord2)
    ) {
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

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest(".dropdown")) {
      setActiveDropdown(null);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const renderWaypointRow = (wp, index, waypoints) => {
    if (wp.type === "polygon") {
      return (
        <tr key={index}>
          <td>{`${String(index).padStart(2, "0")}`}</td>
          <td>
            {wp.type === "polygon" ? (
              "Polygon"
            ) : (
              <div>
                {wp.coordinates.map((coord, coordIndex) => (
                  <div key={coordIndex}>
                    {`(${coord[1].toFixed(6)}, ${coord[0].toFixed(6)})`}
                  </div>
                ))}
              </div>
            )}
          </td>

          <td>- - </td>
          <td>
            <div className="dropdown">
              <button
                className="three-dots-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown(index);
                }}
              >
                ⋮
              </button>
              {activeDropdown === index && (
                <div className="dropdown-content">
                  <button onClick={() => handleInsert(index, "before")}>
                    Insert Polygon Before
                  </button>
                  <button onClick={() => handleInsert(index, "after")}>
                    Insert Polygon After
                  </button>
                </div>
              )}
            </div>
          </td>
        </tr>
      );
    }

    const distance =
      index > 0 && !waypoints[index - 1].type
        ? calculateDistance(
            waypoints[index - 1].coordinates,
            wp.coordinates
          ).toFixed(2)
        : "0.00";

    return (
      <tr key={index}>
        <td>{`${String(index).padStart(2, "0")}`}</td>
        <td>{`(${wp.coordinates[1].toFixed(6)}, ${wp.coordinates[0].toFixed(
          6
        )})`}</td>
        <td>{distance}</td>
        <td>
          <div className="dropdown">
            <button
              className="three-dots-btn"
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown(index);
              }}
            >
              ⋮
            </button>
            {activeDropdown === index && (
              <div className="dropdown-content">
                <button onClick={() => handleInsert(index, "before")}>
                  Insert Polygon Before
                </button>
                <button onClick={() => handleInsert(index, "after")}>
                  Insert Polygon After
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>
    );
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-popup">
        <div className="modal-header">
          <h3 classname="modal-title">Mission Creation</h3>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={() => setModalVisible(false)}
          ></button>
        </div>
        <hr />
        <div className="modal-content">
          {showInstructions ? (
            <>
              <h4 style={{textAlign:"left", marginTop:"-15px"}}>Waypoint Navigation</h4>
              <p style={{textAlign:"left", marginTop:"5px"}}>
                Click on the map to mark points of the route and press Enter to
                complete
              </p>
            </>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>WP</th>
                  <th>Coordinates</th>
                  <th>Distance (meters)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...waypoints]
                  .sort((a, b) => (a.type === "polygon" ? -1 : 1)) // Ensure polygon appears first
                  .map((wp, index) => renderWaypointRow(wp, index, waypoints))}
              </tbody>
            </table>
          )}
          <button
            className="generate-btn"
            onClick={
              showInstructions
                ? onGenerateData
                : () => {
                    onGenerateData(); // This will now call handleDrawNewPoints
                    setModalVisible(false); // Close the modal
                  }
            }
            style={{ marginTop: "15px", width:"200px", marginLeft:"230px" }}
          >
            {showInstructions ? "Generate Data" : "Generate New Data"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MWModal;
