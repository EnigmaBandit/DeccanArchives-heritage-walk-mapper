"use client";
import Toolbox from "./ToolBox";
import MapComponenet from "./MapContainer";
import React, { useEffect, useState } from "react";

let clickHandler;
export let toggleMapInteractions = (map, enable) => {
  if (!enable) {
    clickHandler = (e) => {
      e.stopPropagation();
      e.preventDefault();
    };
    document.addEventListener("click", clickHandler, true);
  } else {
    if (clickHandler) {
      document.removeEventListener("click", clickHandler, true);
    }
  }
  // const interactiveHandlers = ['dragPan', 'scrollZoom', 'boxZoom', 'dragRotate', 'keyboard', 'doubleClickZoom', 'touchZoomRotate'];

  // interactiveHandlers.forEach(handler => {
  //   if (enable) {
  //     map[handler].enable();
  //   } else {
  //     map[handler].disable();
  //   }
  // });
};

const PageInternal = ({
  storyNamesList,
  themeStoryList,
  themes,
  stories,
  points,
  referencedMaps,
}) => {
  const [selectedFeature, setSelectedFeature] = useState({});
  const [displayedContent, setDisplayedContent] = useState([]);
  const [focusedFeature, setFocusedFeature] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showOptions, setShowOptions] = useState(false); //exported
  const [showStoryPopup, setShowStoryPopup] = useState(false); //exported
  const [showPointPopup, setShowPointPopup] = useState(false); //exported

  const [isSearchSelected, setIsSearchSelected] = useState(false);

  let closeOtherPopups = (currentOne) => {
    if (currentOne != "mapOptions") {
      setShowOptions(false);
    }

    if (currentOne != "story marker") {
      setShowStoryPopup(false);
    }

    if (currentOne != "Point marker") {
      setShowPointPopup(false);
    }

    if (currentOne != "toolbox search") {
      setIsSearchSelected(false);
      setSearchTerm("");
    }
  };

  return (
    <>
      <Toolbox
        selectedFeature={selectedFeature}
        setSelectedFeature={setSelectedFeature}
        setDisplayedContent={setDisplayedContent}
        focusedFeature={focusedFeature}
        setFocusedFeature={setFocusedFeature}
        storyNamesList={storyNamesList}
        themes={themes}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isSearchSelected={isSearchSelected}
        setIsSearchSelected={setIsSearchSelected}
        closeOtherPopups={closeOtherPopups}
      />
      <MapComponenet
        selectedFeature={selectedFeature}
        setSelectedFeature={setSelectedFeature}
        displayedContent={displayedContent}
        setDisplayedContent={setDisplayedContent}
        focusedFeature={focusedFeature}
        setFocusedFeature={setFocusedFeature}
        stories={stories}
        points={points}
        themes={themes}
        themeStoryList={themeStoryList}
        referencedMaps={referencedMaps}
        setSearchTerm={setSearchTerm}
        showOptions={showOptions}
        setShowOptions={setShowOptions}
        showStoryPopup={showStoryPopup}
        setShowStoryPopup={setShowStoryPopup}
        showPointPopup={showPointPopup}
        setShowPointPopup={setShowPointPopup}
        closeOtherPopups={closeOtherPopups}
      />
    </>
  );
};

export default PageInternal;
