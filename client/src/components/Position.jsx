import React, { useState, useEffect, useCallback } from 'react';

const Position = ({ map }) => {
  const [position, setPosition] = useState(map.getCenter());

  const onMove = useCallback(() => {
    setPosition(map.getCenter());
  }, [map]);

  useEffect(() => {
    map.on('move', onMove);
    return () => {
      map.off('move', onMove);
    };
  }, [map, onMove]);

  const sideBar = {
    backgroundColor: 'rgba(35, 55, 75, 0.9)',
    color: '#fff',
    padding: '6px 12px',
    fontFamily: 'monospace',
    zIndex: 1,
    // position: 'absolute',
    top: 10,
    right: 0,
    margin: '12px',
    borderRadius: '4px',
  };

  return (
    <div style={sideBar}>
      Longitude: {position.lng.toFixed(4)} | Latitude: {position.lat.toFixed(4)}
    </div>
  );
};

export default Position;
