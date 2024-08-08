import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaLayerGroup, FaAdjust } from 'react-icons/fa';

const historicalMaps = [
  ["None", ''],
  ["Durgam Cheruvu", "tejasarora5.c65pooux"]
];

const MapSourceControl = ({ showOptions, setShowOptions, baseMap, setBaseMap, overlaidMap, setOverlaidMap, setOverlaidMapOpacity }) => {
  const [selectedMap, setSelectedMap] = useState('');
  const [opacity, setOpacity] = useState(100);

  useEffect(() => {
    if (overlaidMap === '') {
      setOpacity(100);
      setOverlaidMapOpacity(100);
    }
  }, [overlaidMap, setOverlaidMapOpacity]);

  const handleMapChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedMap(selectedValue);
    const selectedMapData = historicalMaps.find(map => map[0] === selectedValue);
    if (selectedMapData) {
      setOverlaidMap(selectedMapData[1]);
    }
  };

  const handleOpacityChange = (event) => {
    const newOpacity = parseInt(event.target.value);
    setOpacity(newOpacity);
    setOverlaidMapOpacity(newOpacity);
  };

  if (!showOptions) return null;

  return (
    <div className="absolute z-10 bottom-24 right-12 bg-white p-6 rounded-lg shadow-md w-72 backdrop-filter backdrop-blur-lg bg-opacity-90">
      <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">Map Controls</h2>
      
      <div className="mb-6">
        <h3 className="font-semibold mb-2 flex items-center">
          <FaMapMarkerAlt className="mr-2" /> Base Map
        </h3>
        <select
          className="w-full p-2 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setBaseMap(e.target.value)}
          value={baseMap}>
          <option>Street</option>
          <option>Satellite</option>
        </select>
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold mb-2 flex items-center">
          <FaLayerGroup className="mr-2" /> Historical Map Overlay
        </h3>
        <select
          className="w-full p-2 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={selectedMap}
          onChange={handleMapChange}
        >
          {historicalMaps.map((map, index) => (
            <option key={index} value={map[0]}>
              {map[0]}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <h3 className="font-semibold mb-2 flex items-center">
          <FaAdjust className="mr-2" /> Overlay Opacity
        </h3>
        <input
          type="range"
          min="0"
          max="100"
          value={opacity}
          onChange={handleOpacityChange}
          className="w-full accent-blue-500"
          disabled={overlaidMap === ''}
        />
      </div>
    </div>
  );
};

export default MapSourceControl;