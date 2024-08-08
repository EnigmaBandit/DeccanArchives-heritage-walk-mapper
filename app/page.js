import React from 'react';
import { getData } from './DataService';
import PageInternal from './PageInternal';

let stories ;
let points;
let themes ;
let referencedMaps;
let referencedMapsInput;



export default async  function Home() {

  const dataJson = await getData();
    stories = dataJson['stories'];
    points = dataJson['points'];
    themes = dataJson['themes'];
    referencedMapsInput = dataJson['ReferencedMaps'];
    referencedMaps=[];
    for (let key of Object.keys(referencedMapsInput)) {
      referencedMaps.push([referencedMapsInput[key]['name'] , referencedMapsInput[key]['tile']])
    }
    let storyNamesList =[];
    let themeStoryList = {};

    for (let key of Object.keys(themes)) {
      themeStoryList[key] = [];
    }
    for (var key of Object.keys(stories)) {
      storyNamesList.push([key, stories[key]['name']]);
      for (var themeId of stories[key]['themes']) {
        themeStoryList[themeId].push(key);
      }
    }

    console.log(themeStoryList);


  return (
    <>
    <PageInternal storyNamesList={storyNamesList} themeStoryList={themeStoryList} themes={themes} stories={stories} points={points} referencedMaps={referencedMaps}/>
    </>
  )



}

export {stories, points, themes};