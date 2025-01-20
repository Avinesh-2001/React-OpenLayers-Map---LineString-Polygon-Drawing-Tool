import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import { Map as OLMap, View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { Draw, Modify } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Feature } from "ol";
import { LineString, Polygon } from "ol/geom";
import { Style, Stroke } from "ol/style";

function MWMap({
  isDrawing,
  onDrawingComplete,
  waypoints,
  drawingMode,
  polygonCoordinates
}) {
  const mapRef = useRef(null);
  const vectorSourceRef = useRef(new VectorSource());
  const drawRef = useRef(null);
  const mapInstance = useRef(null);


  useEffect(() => {
    // Initialize the map
    mapInstance.current = new OLMap({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: vectorSourceRef.current,
          style: new Style({
            stroke: new Stroke({
              color: '#0066ff',
              width: 2
            })
          })
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });
  
    // Handle Enter key press to finish drawing
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && drawRef.current) {
        drawRef.current.finishDrawing();
      }
    };
  
    document.addEventListener('keypress', handleKeyPress);
  
    // Cleanup function to remove event listener and dispose map
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
      if (mapInstance.current) {
        mapInstance.current.dispose();
      }
    };
  }, []); 
  useEffect(() => {
    if (isDrawing) {
      const drawType = drawingMode === "polygon" ? "Polygon" : "LineString";
      const draw = new Draw({
        source: vectorSourceRef.current,
        type: drawType,
        style: new Style({
          stroke: new Stroke({
            color: '#0066ff',
            width: 2
          })
        })
      });

      draw.on("drawend", (event) => {
        const geometry = event.feature.getGeometry();
        let coordinates;
        
        if (drawingMode === "polygon") {
          coordinates = geometry.getCoordinates()[0].slice(0, -1);
        } else {
          coordinates = geometry.getCoordinates();
        }
        
        onDrawingComplete(coordinates, drawingMode);
      });

      mapInstance.current.addInteraction(draw);
      drawRef.current = draw;
    } else if (drawRef.current) {
      mapInstance.current.removeInteraction(drawRef.current);
    }
  }, [isDrawing, drawingMode, onDrawingComplete]);

  useEffect(() => {
    vectorSourceRef.current.clear();

    if (waypoints.length > 0) {
      waypoints.forEach((waypoint, index) => {
        if (waypoint.type === 'polygon') {
          const polygonFeature = new Feature({
            geometry: new Polygon([
              [...waypoint.coordinates, waypoint.coordinates[0]]
            ])
          });
          vectorSourceRef.current.addFeature(polygonFeature);
        } else if (index < waypoints.length - 1 && !waypoints[index + 1].type) {
          const lineFeature = new Feature({
            geometry: new LineString([
              waypoint.coordinates,
              waypoints[index + 1].coordinates
            ])
          });
          vectorSourceRef.current.addFeature(lineFeature);
        }
      });
    }

    if (polygonCoordinates.length > 2) {
      const polygonFeature = new Feature({
        geometry: new Polygon([[...polygonCoordinates, polygonCoordinates[0]]])
      });
      vectorSourceRef.current.addFeature(polygonFeature);
    }
  }, [waypoints, polygonCoordinates]);

  return <div ref={mapRef} style={{ width: "100%", height: "500px" }} />;
}

export default MWMap;