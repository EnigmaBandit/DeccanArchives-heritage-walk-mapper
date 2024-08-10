"use client";
import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import ContentBar from "./ContentBar";
import MapSourceControl from "./MapSourceControl";
import { FaMap } from "react-icons/fa";
import animatePath from  "./animate-path"
const apiKey = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

if (apiKey) {
   console.log ("key is present : " + apiKey);
} else {
  console.log("no key");
}
mapboxgl.accessToken = apiKey;

let layersAdded = new Map();
let pointsAdded = new Set();
let storiesAdded = new Set();
let mapMarkers = [];

const baseMaps = {
  "Street" : "mapbox://styles/tejasarora5/clyrlvr9b000101ph8q1hgmsa",
  "Satellite" : "mapbox://styles/mapbox/satellite-streets-v12"
}

function createCustomMarkerElement(pointId) {
  const el = document.createElement("div");
  el.className = "custom-marker";
  el.style.width = "15px";
  el.style.height = "15px";
  el.style.borderRadius = "50%";
  el.style.backgroundColor = "#FF8C00";
  el.style.zIndex = "2"; // Set a high z-index
  el.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent the click from reaching the map
    console.log("clicked on marker", pointId);
    // Add your popup logic here
  });
  return el;
}


const MapComponenet = ({
  selectedFeature,
  setSelectedFeature,
  displayedContent,
  setDisplayedContent,
  focusedFeature,
  setFocusedFeature,
  stories,
  points,
  themes,
  themeStoryList,
  referencedMaps,
  setSearchTerm,
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(78.476);
  const [lat, setLat] = useState(17.366);
  const [zoom, setZoom] = useState(10);
  const [showOptions, setShowOptions] = useState(false);
  const [baseMap, setBaseMap] = useState("Street");
  const [overlaidMap, setOverlaidMap] = useState('None');
  const [overlaidMapOpacity, setOverlaidMapOpacity] = useState();
  const [isoverloadDisplayed, setIsoverloadDisplayed] = useState(false);
  const isOverlayDisplayedRef = useRef(false);
  const overlaidMapRef = useRef('');
  let overlaidMapOpacityRef = useRef('');

  const popup = useRef(
    new mapboxgl.Popup({ closeButton: true, closeOnClick: false })
  );
  function displayMarker(pointId) {
    if (pointsAdded.has(pointId)) {
      return;
    }
    pointsAdded.add(pointId);

    var point = points[pointId];

    const markerPopup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
         <button onclick="window.handlePointSelect('${pointId}')">
            ${points[pointId].name}
         </button>
    `);
    const marker = new mapboxgl.Marker({
      className: "pointMarker",
      element: createCustomMarkerElement(pointId), // We'll create this function
    })
      .setPopup(markerPopup)
      .setLngLat(JSON.parse(point["coord"]))
      .addTo(map.current);

    mapMarkers.push(marker);
    //marker.getElement().addEventListener('click', ()=> displayPointDescription(pointId));

    // Add click event listener to the marker
    marker.getElement().addEventListener("click", () => {
      marker.togglePopup(); // This will show the popup when the marker is clicked
    });
  }

  function handleMarkerClick(pointId) {
    // Set the selected feature to this point
    setDisplayedContent(["point", pointId]);
  }
  


  useEffect(()=>{
    console.log("isoverloadDisplayed is changed: " + isoverloadDisplayed);
    isOverlayDisplayedRef.current = isoverloadDisplayed;
    overlaidMapRef.current = overlaidMap;
  },[isoverloadDisplayed])

  function addStoryObj (id, storyObj) {
    map.current.addSource(id, {
      type: "geojson",
      data: storyObj,
      lineMetrics: true,
    });
    addLayerFromSourceId(id);
  }

  function addLayerFromSourceId(id) {
    map.current.addLayer({
      id: id,
      slot: 'top',
      type: "line",
      source: id,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": [
          "case",
          ["==", ["get", "id"], 1], // Replace 1 with the id of the feature you want to style
          "#808080", // Initial color for the selected feature
          "#808080"  // Color for other features
        ],
        "line-width": 6,
        "line-opacity": 1,
      },
    });
  }

  function displayStory(storyId) {
    console.log("in displaystory");
    if (storiesAdded.has(storyId)) {
      return;
    }
    storiesAdded.add(storyId);
    var story = stories[storyId];
    var coordString = story["coord"];
    var storyObj = JSON.parse(coordString);
    console.log("PARENT GEOJSON");
    console.log(storyObj);
  let separatedGeoJSONs = [];

  for (let i = 0 ; i < storyObj.features.length ; i++) {
    let newGeoJSON = {
      crs: storyObj.crs,
      type: 'FeatureCollection',
      features: [  storyObj.features[i]]
    };
    console.log("ADDing geojson : " )
    console.log(newGeoJSON);
    let layerId = storyId + ":" + i;
    layersAdded.set(layerId, newGeoJSON);
    addStoryObj(layerId, newGeoJSON);

    // Change the cursor to a pointer when hovering over the polyline layer
    map.current.on("mouseenter", layerId, () => {
      map.current.getCanvas().style.cursor = "pointer";
    });

    // Change it back when it leaves
    map.current.on("mouseleave", layerId, () => {
      map.current.getCanvas().style.cursor = "";
    });
    
  }

  console.log("adding points included");;
  console.log(story["pointsIncluded"])
    for (let i in story["pointsIncluded"]) {
      let pointId = story["pointsIncluded"][i].toString();
      displayMarker(pointId);
    }
  }

  class MapSourceButton {
    onAdd(map) {
      const div = document.createElement("div");
      div.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
      div.style.cursor = "pointer";
      div.addEventListener("contextmenu", (e) => e.preventDefault());
      div.addEventListener("click", () => setShowOptions(!showOptions));
      const root = ReactDOM.createRoot(div);
      root.render(<FaMap className="w-[29px] h-[29px] p-[7px]" />);
      return div;
    }
    onRemove() {
      setShowOptions(false);
    }
  }

  function handleMapClick(e) {
    setShowOptions(false);
    const features = Array.from(layersAdded.keys()).flatMap((id) =>
      map.current
        .queryRenderedFeatures(e.point, { layers: [id] })
        .map((feature) => ({ ...feature, sourceId: id }))
    );
  
    if (features.length > 0) {
      const storyIds = features.map((feature) => feature.sourceId);
  
      const popupContent = `
        <div>
          ${storyIds
            .map(
              (id) => `
            <button onclick="window.handleStorySelect('${id.split(':')[0]}')">
              ${stories[id.split(':')[0]].name}
            </button>
          `
            )
            .join("")}
        </div>
      `;
  
      popup.current
        .setLngLat(e.lngLat)
        .setHTML(popupContent)
        .addTo(map.current);
    } else {
      popup.current.remove();
    }
  }

  function clearMap() {
    for (let [key,val] of layersAdded) {
      map.current.removeLayer(key);
      map.current.removeSource(key);
      layersAdded.delete(key);
    }

    for (let val of storiesAdded) {
      storiesAdded.delete(val);
    }

    pointsAdded.clear();
    mapMarkers.forEach((marker) => marker.remove());
  }

  useEffect(()=>{
    overlaidMapOpacityRef.current = overlaidMapOpacity;
    if (!isOverlayDisplayedRef.current) {
      return;
    }
    map.current.setPaintProperty(
      'overlaidMap',
      'raster-opacity',
      overlaidMapOpacityRef.current/100
    );
  }, [overlaidMapOpacity])

  
  useEffect(() => {
    window.handleStorySelect = (id) => {
      console.log("ClickEd on feature ID" + id);
      if (displayedContent[0] == 'story' && displayedContent[1] == id && displayedContent[2] == -1) {
        return;
      }
      setSelectedFeature(["story", id]);
      setDisplayedContent(["story", id, -1]);
      setFocusedFeature(["story", id]);
      popup.current.remove();
    };

    window.handlePointSelect = (id) => {
      console.log("within point select");
      setDisplayedContent(["point", id]);
      setFocusedFeature(["point", id]);
      console.log(points[id]);
      popup.current.remove();
    };

    return () => {
      delete window.handleStorySelect;
      delete window.handlePointSelect;
    };
  }, []);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/tejasarora5/clyrlvr9b000101ph8q1hgmsa",
      center: [lng, lat],
      zoom: zoom,
    });



    const mapSourceButton = new MapSourceButton(showOptions, setShowOptions);

    map.current.addControl(new mapboxgl.ScaleControl(), "bottom-right");
    map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    map.current.addControl(mapSourceButton, "bottom-right");

    map.current.on("click", handleMapClick);

    map.current.on("load", () => {
      map.current.setFilter("admin-0-boundary-disputed", [
        "all",
        ["==", ["get", "disputed"], "true"],
        ["==", ["get", "admin_level"], 0],
        ["==", ["get", "maritime"], "false"],
        ["match", ["get", "worldview"], ["all", "IN"], true, false],
      ]);
      map.current.setFilter("admin-0-boundary", [
        "all",
        ["==", ["get", "admin_level"], 0],
        ["==", ["get", "disputed"], "false"],
        ["==", ["get", "maritime"], "false"],
        ["match", ["get", "worldview"], ["all", "IN"], true, false],
      ]);
      map.current.setFilter("admin-0-boundary-bg", [
        "all",
        ["==", ["get", "admin_level"], 0],
        ["==", ["get", "maritime"], "false"],
        ["match", ["get", "worldview"], ["all", "IN"], true, false],
      ]);
  }
  );
  });

  useEffect(() => {
    clearMap();
    let typeSelected = selectedFeature[0];
    let id = selectedFeature[1];
    if ("theme" == typeSelected) {
      processSelectedTheme(id);
    } else if ("story" == typeSelected) {
      processSelectedStory(id);
    }
  }, [selectedFeature]);


  useEffect(() => {
    if (isoverloadDisplayed == true) {
    map.current.removeLayer('overlaidMap');
    map.current.removeSource('overlaidMap');
    }
    if(overlaidMap ==='None') {
      setIsoverloadDisplayed(false);
      return;
    }
    let tileSetUrl = "mapbox://" + overlaidMap;
      setIsoverloadDisplayed(true);
      map.current.addSource('overlaidMap', {
        type: 'raster',
        url: tileSetUrl
      });

      console.log("Adding with opacity: " + overlaidMapOpacity)

      map.current.addLayer({
        id: 'overlaidMap',
        slot: 'top',
        source: 'overlaidMap',
        type: 'raster',
        'paint': {
          'raster-opacity': overlaidMapOpacity/100 // Set the opacity to 0.5
        }
      });

      for (let [key,val] of layersAdded) {
        map.current.removeLayer(key);
        addLayerFromSourceId(key);
      }
  },[overlaidMap])

  useEffect(() => {

    let startAnimation = async(storyId, pathCoord, direction) =>{
      await animateAcrossStoryPath(storyId, pathCoord, direction)
    }
    let featureType = focusedFeature[0];
    console.log("Selected FEature type " + featureType);
    console.log(focusedFeature);
    let id = focusedFeature[1];
    map.current.setPadding({ top: 0, bottom: 0, left: 0, right: 0 });
    if (featureType === "story") {
      let story = stories[id];
      let jsonObj = JSON.parse(story["coord"]);
      let overallBbox = turf.bbox(jsonObj);
      map.current.fitBounds(overallBbox, {
        padding: { top: 100, bottom: 100, left: 600, right: 100 },
      });
    } else if (featureType === "theme") {
      let overallBbox;
      for (let index = 0; index < themeStoryList[id].length; index++) {
        let storyId = themeStoryList[id][index];
        let story = stories[storyId];
        let jsonObj = JSON.parse(story["coord"]);
        if (index === 0) {
          overallBbox = turf.bbox(jsonObj);
        } else {
          const currentBbox = turf.bbox(jsonObj);
          overallBbox = [
            Math.min(overallBbox[0], currentBbox[0]), // min X
            Math.min(overallBbox[1], currentBbox[1]), // min Y
            Math.max(overallBbox[2], currentBbox[2]), // max X
            Math.max(overallBbox[3], currentBbox[3]), // max Y
          ];
        }
      }
      map.current.setPadding({ top: 0, bottom: 0, left: 0, right: 0 });
      map.current.fitBounds(overallBbox, {
        padding: { top: 100, bottom: 100, left: 600, right: 100 },
      });
    } else if (featureType === "point") {
      updateMarkerStyles();
      let point = points[id];
      let coord = JSON.parse(point["coord"]);
      map.current.easeTo({
        center: coord,
        padding: { left: 600, top: 100, right: 100, bottom: 100 },
      });
    } else if (featureType === "pathWithinStory") {
      let direction = focusedFeature[1];
      console.log("DIRECTIO HERE IS : " + direction);
      let storyId = focusedFeature[2];
      let pathindex = focusedFeature[3];
      let layerId = storyId + ':' + pathindex;
      console.log("LAYER ID : " + layerId);
      let geoObj = layersAdded.get(layerId);
      console.log(geoObj);
      let pathCoord = layersAdded.get(layerId)['features'][0]['geometry']['coordinates'][0];
      // if (direction === 'previous') {
      //   console.log("THIS IS PREVIOS");
      //   console.log("BEFORE REVERSE");
      //   console.log(pathCoord);
      //   pathCoord = [...pathCoord].reverse()
      //   console.log("AFTER REVERSE");
      //   console.log(pathCoord);
      // } else {
      //   console.log("NEXT");
      // }
      
      startAnimation(layerId, pathCoord, direction);
    }
  }, [focusedFeature]);


  function updateMarkerStyles() {
    // Loop through all points and update their styles
    pointsAdded.forEach((pointId) => {
      const markerElement = document.getElementById(`point:${pointId}`);
  
      if (markerElement) {
        const isSelected = focusedFeature[0] === 'point' && focusedFeature[1] === pointId;
  
        // Apply the appropriate styles using Tailwind classes
        markerElement.className = `custom-marker w-4 h-4 rounded-full z-10 ${isSelected ? "bg-blue-500" : "bg-orange-500"}`;
      }
    });
  }

  useEffect(()=> {
    for (let [key,val] of layersAdded) {
      map.current.removeLayer(key);
      map.current.removeSource(key);
    }
    if (isOverlayDisplayedRef.current) {
      console.log("removing source of overloid");
      map.current.removeLayer('overlaidMap');
      map.current.removeSource("overlaidMap");
    } else {
      console.log("NOT REMOVING source of overloid");
    }

    let mapTile = baseMaps[baseMap];
    map.current.setStyle(mapTile);      
       map.current.on("style.load",()=>{
      if (isOverlayDisplayedRef.current) {
        console.log("is overload within that method");
        let tileSetUrl = "mapbox://" + overlaidMapRef.current;
        console.log("titleseturl: "  + tileSetUrl)
          map.current.addSource('overlaidMap', {
            type: 'raster',
            url: tileSetUrl
          });
        console.log("overlaidMapOpacityRef.current: " + overlaidMapOpacityRef.current)
        map.current.addLayer({
          id: 'overlaidMap',
          slot: 'top',
          source: 'overlaidMap',
          type: 'raster',
          'paint': {
            'raster-opacity': overlaidMapOpacityRef.current/100 
          }
        });

      }

      for (let [key,val] of layersAdded) {
        addStoryObj(key, val);
      }
      })

    
  }, [baseMap])

  function processSelectedTheme(id) {
    console.log(themeStoryList);
    for (let index = 0; index < themeStoryList[id].length; index++) {
      let storyId = themeStoryList[id][index];
      displayStory(storyId);
    }
  }

  function processSelectedStory(id) {
    displayStory(id);
  }

  async function animateAcrossStoryPath(id, path, direction) {
    console.log("Before caling path is:")
    console.log(path);
    await animatePath(map.current,
                path,
                id,
                "yellow",
                "#808080",
                direction
              );
  }

  let overallBbox;

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
      <MapSourceControl
        showOptions={showOptions}
        setShowOptions={setShowOptions}
        baseMap = {baseMap}
        setBaseMap={setBaseMap}
        overlaidMap={overlaidMap}
        setOverlaidMap={setOverlaidMap}
        setOverlaidMapOpacity={setOverlaidMapOpacity}
        referencedMaps={referencedMaps}
      />
      <ContentBar
        displayedContent={displayedContent}
        setDisplayedContent={setDisplayedContent}
        focusedFeature={focusedFeature}
        setFocusedFeature={setFocusedFeature}
        stories={stories}
        points={points}
        themes={themes}
        selectedFeature={selectedFeature}
        setSelectedFeature={setSelectedFeature}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
};

export default MapComponenet;
