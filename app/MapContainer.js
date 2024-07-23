"use client";
import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import ContentBar from "./ContentBar";
import MapSourceControl from "./MapSourceControl";
import { FaMap } from "react-icons/fa";
const apiKey = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

if (apiKey) {
   console.log ("key is present : " + apiKey);
} else {
  console.log("no key");
}
mapboxgl.accessToken = apiKey;

let layersAdded = new Set();
let pointsAdded = new Set();
let mapMarkers = [];

const baseMaps = {
  "Street" : "mapbox://styles/tejasarora5/clyrlvr9b000101ph8q1hgmsa",
  "Satellite" : "mapbox://styles/mapbox/satellite-streets-v12"
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
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(78.476);
  const [lat, setLat] = useState(17.366);
  const [zoom, setZoom] = useState(10);
  const [showOptions, setShowOptions] = useState(false);
  const [baseMap, setBaseMap] = useState("Street");
  const [overlaidMap, setOverlaidMap] = useState('');
  const [isoverloadDisplayed, setIsoverloadDisplayed] = useState(false);

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

  function createCustomMarkerElement(pointId) {
    const el = document.createElement("div");
    el.className = "custom-marker";
    el.style.width = "15px";
    el.style.height = "15px";
    el.style.borderRadius = "50%";
    el.style.backgroundColor = "#FF8C00";
    el.style.zIndex = "10"; // Set a high z-index
    el.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent the click from reaching the map
      console.log("clicked on marker", pointId);
      // Add your popup logic here
    });
    return el;
  }

  function displayStory(id) {
    if (layersAdded.has(id)) {
      return;
    }
    layersAdded.add(id);
    var story = stories[id];
    var coordString = story["coord"];
    var storyObj = JSON.parse(coordString);

    map.current.addSource(id, {
      type: "geojson",
      data: storyObj,
    });

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
        "line-color": "#FFD700",
        "line-width": 6,
        "line-opacity": 1,
      },
    });

    // Add click event handler
    console.log("Seected walk " + selectedFeature[0]);

    // Change the cursor to a pointer when hovering over the polyline layer
    map.current.on("mouseenter", id, () => {
      map.current.getCanvas().style.cursor = "pointer";
    });

    // Change it back when it leaves
    map.current.on("mouseleave", id, () => {
      map.current.getCanvas().style.cursor = "";
    });

    for (var i in story["pointsIncluded"]) {
      var pointId = story["pointsIncluded"][i].toString();
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
    const features = Array.from(layersAdded).flatMap((id) =>
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
                <button onclick="window.handleStorySelect('${id}')">
                  ${stories[id].name}
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
    for (let val of layersAdded) {
      map.current.removeLayer(val);
      map.current.removeSource(val);
      layersAdded.delete(val);
    }

    pointsAdded.clear();
    mapMarkers.forEach((marker) => marker.remove());
  }

  useEffect(() => {
    window.handleStorySelect = (id) => {
      setSelectedFeature(["story", id]);
      setDisplayedContent(["story", id, -1]);
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
    if(overlaidMap ==='') {
      setIsoverloadDisplayed(false);
      return;
    }
    let tileSetUrl = "mapbox://" + overlaidMap;
      setIsoverloadDisplayed(true);
      map.current.addSource('overlaidMap', {
        type: 'raster',
        url: tileSetUrl
      });

      map.current.addLayer({
        id: 'overlaidMap',
        slot: 'top',
        beforeId :'referenceMap',
        source: 'overlaidMap',
        type: 'raster'
      });

      for (let val of layersAdded) {
        map.current.removeLayer(val);
        map.current.addLayer({
          id: val,
          slot: 'top',
          type: "line",
          source: val,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#FFD700",
            "line-width": 6,
            "line-opacity": 1,
          },
        });
      }
  },[overlaidMap])

  useEffect(() => {
    let featureType = focusedFeature[0];
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
      let point = points[id];
      let coord = JSON.parse(point["coord"]);
      map.current.easeTo({
        center: coord,
        padding: { left: 600, top: 100, right: 100, bottom: 100 },
      });
    }
  }, [focusedFeature]);

  useEffect(()=> {
    console.log("Setting base map " + baseMap)
    let mapTile = baseMaps[baseMap];
    map.current.setStyle(mapTile);

    map.current.on("style.load", () => {
      for (let val of layersAdded) {
        map.current.removeLayer(val);
        map.current.addLayer({
          id: val,
          type: "line",
          source: val,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#FFD700",
            "line-width": 6,
            "line-opacity": 1,
          },
        });
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

  let overallBbox;

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
      <MapSourceControl
        showOptions={showOptions}
        setShowOptions={setShowOptions}
        baseMap = {baseMap}
        setBaseMap={setBaseMap}
        setOverlaidMap={setOverlaidMap}
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
      />
    </div>
  );
};

export default MapComponenet;
