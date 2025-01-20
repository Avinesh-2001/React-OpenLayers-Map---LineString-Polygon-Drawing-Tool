import React, { useState } from "react";
import { Menu } from "lucide-react"; 
import MWMap from "./Components/MWMap/MWMap";
import MWModal from "./Components/MWModal/MWModal";
import MWPolygonModal from "./Components/MWModal/MWPolygonModal";
import "./App.css";

function App() {
  const [waypoints, setWaypoints] = useState([]);
  const [instructionModalVisible, setInstructionModalVisible] = useState(false);
  const [waypointModalVisible, setWaypointModalVisible] = useState(false);
  const [polygonModalVisible, setPolygonModalVisible] = useState(false);
  const [insertPosition, setInsertPosition] = useState(null);
  const [drawingMode, setDrawingMode] = useState("none");
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [newdrawline , setnewdrawline] = useState(false);
  

  const handleDrawClick = () => {
    setInstructionModalVisible(true);
    setnewdrawline(true);
  };

  const handleGenerateData = () => {
    setInstructionModalVisible(false);
    setDrawingMode("line");
    setnewdrawline(false);
  };

  const handleDrawingComplete = (coordinates, type) => {
    if (type === "line") {
      const newWaypoints = coordinates.map((coord, index) => ({
        wp: waypoints.length,
        coordinates: coord,
      }));
      setWaypoints((prevWaypoints) => [...prevWaypoints, ...newWaypoints]);
      setWaypointModalVisible(true);
    } 
    else if (type === "polygon") {
      setPolygonCoordinates(coordinates);
      setPolygonModalVisible(true);
    }
    setDrawingMode("none");
  };

  const insertPolygonToWaypoints = (polygonPoints) => {
    const polygonWaypoint = {
      type: 'polygon',
      coordinates: polygonPoints,
      wp: waypoints.length
    };

    const updatedWaypoints = [
      ...waypoints.slice(0, insertPosition),
      polygonWaypoint,
      ...waypoints.slice(insertPosition)
    ];

    setWaypoints(updatedWaypoints);
    setPolygonModalVisible(false);
    setWaypointModalVisible(true);
    setPolygonCoordinates([]);
    setInsertPosition(null);
  };

  const handleDrawNewPoints = () => {
    setWaypointModalVisible(false); // Hide the waypoint modal
    setDrawingMode("line"); // Enable drawing mode
  };
  const menuButtonStyle = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    zIndex: 1000,
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };
  return (
    <div className="App">
      <h1>Rekise Marine Assignment</h1>
       {!waypointModalVisible && waypoints.length > 0 && (
        <button 
          style={menuButtonStyle}
          onClick={() => setWaypointModalVisible(true)}
          title="Open Waypoints"
        >
          <Menu size={24} />
        </button>
      )}
      <button type="button" className="btn btn-primary" onClick={handleDrawClick}>
        Draw
      </button>

      <MWModal
        visible={instructionModalVisible}
        showInstructions={true}
        onGenerateData={handleGenerateData}
        setModalVisible={setInstructionModalVisible}
        
      />

      <MWModal
        visible={waypointModalVisible}
        showInstructions={false}
        waypoints={waypoints}
        updateWaypoints={setWaypoints}
        setInsertPosition={setInsertPosition}
        openPolygonModal={(position) => {
          setInsertPosition(position);
          setDrawingMode("polygon");
          setWaypointModalVisible(false);
        }}
        setModalVisible={setWaypointModalVisible}
        setDrawingMode={setDrawingMode}
        drawclick = {handleDrawClick}
        onGenerateData={handleDrawNewPoints}
      />

      <MWMap
        isDrawing={drawingMode !== "none"}
        onDrawingComplete={handleDrawingComplete}
        waypoints={waypoints}
        drawingMode={drawingMode}
        polygonCoordinates={polygonCoordinates}
      />

      {polygonModalVisible && (
        <MWPolygonModal
          polygonCoordinates={polygonCoordinates}
          insertPolygon={insertPolygonToWaypoints}
          closeModal={() => {
            setPolygonModalVisible(false);
            setPolygonCoordinates([]);
            setWaypointModalVisible(true);
          }}
        />
      )}
    </div>
  );
}

export default App;