import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaLayerGroup, FaAdjust } from 'react-icons/fa';

const historicalMaps = [
   [ "None",  "none"],
   [ "Durgam Cheruvu", "two"]
];


const MapSourceControl = ({ showOptions, setShowOptions, baseMap, setBaseMap, setOverlaidMap }) => {
  const [searchTerm, setSearchTerm] = useState('');

  console.log("selecting + " );
  console.log()
  if (!showOptions) return null;

  const filteredMaps = historicalMaps.filter(map => 
    map[0].toLowerCase().includes(searchTerm.toLowerCase())
  );

  function changeBaseMap (selectedOption)   {
    console.log("Changing base map for : ");
    console.log
  }

  return (
    <div className="absolute z-10 bottom-24 right-10 bg-gray-800 text-white p-6 rounded-lg shadow-lg w-72 backdrop-filter backdrop-blur-lg bg-opacity-90">
      <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">Map Controls</h2>
      
      <div className="mb-6">
        <h3 className="font-semibold mb-2 flex items-center">
          <FaMapMarkerAlt className="mr-2" /> Base Map
        </h3>
        <select className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" 
           onChange = {(e) => setBaseMap(e.target.value)}
           value = {baseMap}>
            <option>Street</option>
            <option>Satellite</option>
        </select>
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold mb-2 flex items-center">
          <FaLayerGroup className="mr-2" /> Historical Map Overlay
        </h3>
        <div className="relative">
          <input 
            type="text"
            placeholder="Search historical maps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pr-8 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
        {searchTerm && (
          <ul className="mt-2 bg-gray-700 rounded max-h-32 overflow-y-auto">
            {filteredMaps.map((map, index) => (
              <li key={index} className="p-2 hover:bg-gray-600 cursor-pointer">{map}</li>
            ))}
          </ul>
        )}
      </div>
      
      <div>
        <h3 className="font-semibold mb-2 flex items-center">
          <FaAdjust className="mr-2" /> Overlay Opacity
        </h3>
        <input 
          type="range" 
          min="0" 
          max="100" 
          className="w-full accent-blue-500"
        />
      </div>
    </div>
  );
};

export default MapSourceControl;