"use client";
import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import ContentBar from "./ContentBar";
import MapSourceControl from "./MapSourceControl";
import { FaAccessibleIcon, FaMap } from "react-icons/fa";
import animatePath from "./animate-path";
import { toggleMapInteractions } from "./PageInternal";
const apiKey = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

mapboxgl.accessToken = apiKey;
// Get screen width

let layersAdded = new Map();
let pointsAdded = new Set();
let storiesAdded = new Set();
let layersCrossedWithColor = new Set();
let mapMarkers = [];
let notSelectedColor = "#808080";
let selectedColor = "yellow";
const baseMaps = {
  Street: "mapbox://styles/tejasarora5/cm2u3dpyf00gc01pi64d38er0",
  Satellite: "mapbox://styles/mapbox/satellite-streets-v12",
};

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
  showOptions,
  setShowOptions,
  showStoryPopup,
  setShowStoryPopup,
  showPointPopup,
  setShowPointPopup,
  closeOtherPopups,
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(78.9629); // Longitude for India
  const [lat, setLat] = useState(22.5937); // Latitude for India
  const [zoom, setZoom] = useState(3.5); // Zoom level for a country-wide view
  const [baseMap, setBaseMap] = useState("Street");
  const [overlaidMap, setOverlaidMap] = useState("None");
  const [overlaidMapOpacity, setOverlaidMapOpacity] = useState();
  const [isoverloadDisplayed, setIsoverloadDisplayed] = useState(false);
  const isOverlayDisplayedRef = useRef(false);
  const overlaidMapRef = useRef("");
  let overlaidMapOpacityRef = useRef("");

  const popup = useRef(
    new mapboxgl.Popup({ closeButton: false, closeOnClick: true })
  );
  let pointPopupRef = useRef(null);
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

      marker.getElement().style.zIndex = 1;

    mapMarkers.push(marker);
    //marker.getElement().addEventListener('click', ()=> displayPointDescription(pointId));

    // Add click event listener to the marker
    marker.getElement().addEventListener("click", () => {
      if (pointPopupRef.current != null) {
        pointPopupRef.current.remove();
      }

      closeOtherPopups("Point marker");
      marker.togglePopup(); // This will show the popup when the marker is clicked
      pointPopupRef.current = markerPopup;
      setShowPointPopup(true);
    });
  }

  useEffect(() => {
    if (!showPointPopup && pointPopupRef.current != null) {
      pointPopupRef.current.remove();
      pointPopupRef.current = null;
    }
  }, [showPointPopup]);

  useEffect(() => {
    isOverlayDisplayedRef.current = isoverloadDisplayed;
    overlaidMapRef.current = overlaidMap;
  }, [isoverloadDisplayed]);

  function addStoryObj(id, storyObj) {
    map.current.addSource(id, {
      tolerance: 0,
      type: "geojson",
      data: storyObj,
      lineMetrics: true,
    });
    addLayerFromSourceId(id);
  }

  function addLayerFromSourceId(id) {
    let colorChosen = notSelectedColor;
    if (layersCrossedWithColor.has(id)) {
      colorChosen = selectedColor;
    }
    map.current.addLayer({
      id: id,
      slot: "top",
      type: "line",
      source: id,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": colorChosen,
        "line-width": 6,
      },
    });

    map.current.setPaintProperty(id, 'line-width', [
      'interpolate',
      // Set the exponential rate of change to 0.5
      ['exponential', 0.5],
      ['zoom'],
      7,10,
      10,6
    ]);

  }



  function displayStory(storyId, showPoints) {
    if (storiesAdded.has(storyId)) {
      return;
    }
    storiesAdded.add(storyId);
    var story = stories[storyId];
    var coordString = story["coord"];
    var storyObj = JSON.parse(coordString);
    let separatedGeoJSONs = [];

    for (let i = 0; i < storyObj.features.length; i++) {
      let newGeoJSON = {
        crs: storyObj.crs,
        type: "FeatureCollection",
        features: [storyObj.features[i]],
      };
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

    if (!showPoints) {
      return
    }

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
      div.addEventListener("click", () => {
        setShowOptions(!showOptions);
        closeOtherPopups("mapOptions");
      });
      const root = ReactDOM.createRoot(div);
      root.render(<FaMap className="w-[29px] h-[29px] p-[7px]" />);
      return div;
    }
    onRemove() {
      setShowOptions(false);
    }
  }

  function handleMapClick(e) {
    closeOtherPopups("all");
    setShowOptions(false);
    const features = Array.from(layersAdded.keys()).flatMap((id) =>
      map.current
        .queryRenderedFeatures(e.point, { layers: [id] })
        .map((feature) => ({ ...feature, sourceId: id }))
    );

    if (features.length > 0) {
      const storyId =  features[0].sourceId;
      closeOtherPopups("story marker");
      const popupContent = `
        <div className="z-10">
          <button onclick="window.handleStorySelect('${storyId.split(":")[0]}') " className="z-100 absolute">
              ${stories[storyId.split(":")[0]].name}
            </button>
        </div>
      `;

      popup.current
        .setLngLat(e.lngLat)
        .setHTML(popupContent)
        .addTo(map.current);

      setShowStoryPopup(true);
    } else {
      popup.current.remove();
    }
  }

  useEffect(() => {
    if (!showStoryPopup) {
      popup.current.remove();
    }
  }, [showStoryPopup]);

  useEffect(() => {
    if (showStoryPopup == false) {
      popup.current.remove();
    }
  }, [showStoryPopup]);
  function clearMap() {
    for (let [key, val] of layersAdded) {
      map.current.removeLayer(key);
      map.current.removeSource(key);
      layersAdded.delete(key);
    }

    for (let val of storiesAdded) {
      storiesAdded.delete(val);
    }

    pointsAdded.clear();
    mapMarkers.forEach((marker) => marker.remove());
    layersCrossedWithColor.clear();
  }

  useEffect(() => {
    overlaidMapOpacityRef.current = overlaidMapOpacity;
    if (!isOverlayDisplayedRef.current) {
      return;
    }
    map.current.setPaintProperty(
      "overlaidMap",
      "raster-opacity",
      overlaidMapOpacityRef.current / 100
    );
  }, [overlaidMapOpacity]);

  useEffect(() => {
    window.handleStorySelect = (id) => {
      if (
        displayedContent[0] == "story" &&
        displayedContent[1] == id &&
        displayedContent[2] == -1
      ) {
        return;
      }
      setSelectedFeature(["story", id]);
      setDisplayedContent(["story", id, -1]);
      setFocusedFeature(["story", id]);
      popup.current.remove();
      closeOtherPopups("all");
    };

    window.handlePointSelect = (id) => {
      setDisplayedContent(["point", id]);
      setFocusedFeature(["point", id]);
      if (pointPopupRef.current != null) {
        pointPopupRef.current.remove();
      }

      closeOtherPopups("all");
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
      style: "mapbox://styles/tejasarora5/cm2u3dpyf00gc01pi64d38er0",
      center: [lng, lat],
      zoom: zoom,
    });

    const mapSourceButton = new MapSourceButton(showOptions, setShowOptions);

    map.current.addControl(new mapboxgl.ScaleControl(), "bottom-right");
    map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    map.current.addControl(mapSourceButton, "bottom-right");

    map.current.on("click", handleMapClick);

    map.current.on('zoom', () => {
      const currentZoom = map.current.getZoom();
  });
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
      map.current.removeLayer("overlaidMap");
      map.current.removeSource("overlaidMap");
    }
    if (overlaidMap === "None") {
      setIsoverloadDisplayed(false);
      return;
    }
    let tileSetUrl = "mapbox://" + overlaidMap;
    setIsoverloadDisplayed(true);
    map.current.addSource("overlaidMap", {
      type: "raster",
      url: tileSetUrl,
    });

    map.current.addLayer({
      id: "overlaidMap",
      slot: "top",
      source: "overlaidMap",
      type: "raster",
      paint: {
        "raster-opacity": overlaidMapOpacity / 100, // Set the opacity to 0.5
      },
    });

    for (let [key, val] of layersAdded) {
      map.current.removeLayer(key);
      addLayerFromSourceId(key);
    }
  }, [overlaidMap]);

  useEffect(() => {
    let startAnimation = async (storyId, pathCoord, direction) => {
      await animateAcrossStoryPath(storyId, pathCoord, direction);
    };
    let featureType = focusedFeature[0];
    let id = focusedFeature[1];
    map.current.setPadding({ top: 0, bottom: 0, left: 0, right: 0 });
    if (featureType === "story") {
      let story = stories[id];
      let jsonObj = JSON.parse(story["coord"]);
      let overallBbox = turf.bbox(jsonObj);
      // Get screen width
let isScreenLarge = window.innerWidth > 768; // Adjust this value for "medium" screen
let bottomPadding = Math.floor(window.innerHeight * 0.6); // 60% of screen height
// Define padding based on screen size
let mapPadding = isScreenLarge
  ? { left: 600, top: 150, right: 100, bottom: 100 } // Large screen padding
  : { left: 100, top: 200, right: 100, bottom: bottomPadding }; // Small screen paddin
      map.current.fitBounds(overallBbox, {
        padding: mapPadding,
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
      // Get screen width
let isScreenLarge = window.innerWidth > 768; // Adjust this value for "medium" screen
let bottomPadding = Math.floor(window.innerHeight * 0.6); // 60% of screen height
// Define padding based on screen size
let mapPadding = isScreenLarge
  ? { left: 600, top: 150, right: 100, bottom: 100 } // Large screen padding
  : { left: 100, top: 200, right: 100, bottom: bottomPadding }; // Small screen paddin
      map.current.fitBounds(overallBbox, {
        padding: mapPadding,
      });
    } else if (featureType === "point") {
      updateMarkerStyles();
      let point = points[id];
      let coord = JSON.parse(point["coord"]);
      // Get screen width
let isScreenLarge = window.innerWidth > 768; // Adjust this value for "medium" screen
let bottomPadding = Math.floor(window.innerHeight * 0.6); // 60% of screen height
// Define padding based on screen size
let mapPadding = isScreenLarge
  ? { left: 600, top: 150, right: 100, bottom: 100 } // Large screen padding
  : { left: 100, top: 200, right: 100, bottom: bottomPadding }; // Small screen paddin
      map.current.easeTo({
        center: coord,
        padding: mapPadding,
      });
    } else if (featureType === "pathWithinStory") {
      let direction = focusedFeature[1];
      let storyId = focusedFeature[2];
      let pathindex = focusedFeature[3];
      let layerId = storyId + ":" + pathindex;
      let geoObj = layersAdded.get(layerId);
      let pathCoord =
        layersAdded.get(layerId)["features"][0]["geometry"]["coordinates"][0];
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
        const isSelected =
          focusedFeature[0] === "point" && focusedFeature[1] === pointId;

        // Apply the appropriate styles using Tailwind classes
        markerElement.className = `custom-marker w-4 h-4 rounded-full z-10 ${
          isSelected ? "bg-blue-500" : "bg-orange-500"
        }`;
      }
    });
  }

  useEffect(() => {
    for (let [key, val] of layersAdded) {
      map.current.removeLayer(key);
      map.current.removeSource(key);
    }
    if (isOverlayDisplayedRef.current) {
      map.current.removeLayer("overlaidMap");
      map.current.removeSource("overlaidMap");
    }
    let mapTile = baseMaps[baseMap];
    map.current.setStyle(mapTile);
    map.current.on("style.load", () => {
      if (isOverlayDisplayedRef.current) {
        let tileSetUrl = "mapbox://" + overlaidMapRef.current;
        map.current.addSource("overlaidMap", {
          type: "raster",
          url: tileSetUrl,
        });
        map.current.addLayer({
          id: "overlaidMap",
          slot: "top",
          source: "overlaidMap",
          type: "raster",
          paint: {
            "raster-opacity": overlaidMapOpacityRef.current / 100,
          },
        });
      }

      for (let [key, val] of layersAdded) {
        addStoryObj(key, val);
      }
    });
  }, [baseMap]);

  function processSelectedTheme(id) {
    for (let index = 0; index < themeStoryList[id].length; index++) {
      let storyId = themeStoryList[id][index];
      displayStory(storyId, false);
    }
  }

  function processSelectedStory(id) {
    displayStory(id, true);
  }

  async function animateAcrossStoryPath(id, path, direction) {
    toggleMapInteractions(map, false);
    await animatePath(
      map.current,
      path,
      id,
      selectedColor,
      notSelectedColor,
      direction
    );
    if (direction == "next") {
      layersCrossedWithColor.add(id);
    } else {
      layersCrossedWithColor.delete(id);
    }
    toggleMapInteractions(map, true);
  }

  let overallBbox;
    useEffect(() => {   
      return () => {
        // This runs when component unmounts
        clearMap();
      };
    }, []);

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
      <MapSourceControl
        showOptions={showOptions}
        setShowOptions={setShowOptions}
        baseMap={baseMap}
        setBaseMap={setBaseMap}
        overlaidMap={overlaidMap}
        setOverlaidMap={setOverlaidMap}
        setOverlaidMapOpacity={setOverlaidMapOpacity}
        referencedMaps={referencedMaps}
        closeOtherPopups={closeOtherPopups}
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
