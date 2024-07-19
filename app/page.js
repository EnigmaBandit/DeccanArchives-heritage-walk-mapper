import React from 'react';
import { getData } from './DataService';
import PageInternal from './PageInternal';

let stories ;
let points;
let themes ;



export default async  function Home() {

  const dataJson = await getData();
    stories = dataJson['stories'];
    points = dataJson['points'];
    themes = dataJson['themes'];
    console.log(stories);

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
    <PageInternal storyNamesList={storyNamesList} themeStoryList={themeStoryList} themes={themes} stories={stories} points={points}/>
    </>
  )



}

export {stories, points, themes};