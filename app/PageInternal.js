"use client"; 
import Toolbox from './ToolBox'
import MapComponenet from './MapContainer'
import React, { useEffect, useState } from 'react';

const PageInternal = ({storyNamesList, themeStoryList,  themes, stories, points}) => {
  const [selectedFeature, setSelectedFeature] = useState({});
  const [displayedContent, setDisplayedContent] = useState([]);
  const [focusedFeature, setFocusedFeature] = useState([]);

  console.log("TEJAS");
  console.log(stories);
  return (
    <>
    <Toolbox selectedFeature={selectedFeature} setSelectedFeature={setSelectedFeature} setDisplayedContent={setDisplayedContent} focusedFeature={focusedFeature} setFocusedFeature={setFocusedFeature} storyNamesList={storyNamesList} themes={themes}/>
    <MapComponenet  selectedFeature={selectedFeature} setSelectedFeature={setSelectedFeature} displayedContent={displayedContent} setDisplayedContent={setDisplayedContent} focusedFeature={focusedFeature} setFocusedFeature={setFocusedFeature} stories={stories} points={points} themes={themes} themeStoryList={themeStoryList}/>
    </>
  )

}

export default PageInternal;
