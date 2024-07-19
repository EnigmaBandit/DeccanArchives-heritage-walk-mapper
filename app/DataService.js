async function fetchWords() {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxmY_-m_8PP4OhuAZnPfHzitXkpTym8yD4u3RDbZ_a94YWOAdvaunTfiiOehjypdkGs/exec');
    const jsonObject = await response.json();
    return jsonObject;
  }
  
  export async function getData() {
    const jsonObject = await fetchWords();
    return jsonObject;
  }


// let storyNamesList = [];



// let stories = dataJson['stories'];
// let points = dataJson['points'];
// let themes = dataJson['themes'];


// for (var key of Object.keys(stories)) {
//     storyNamesList.push([key, stories[key]['name']]);
// }

// export {stories, points, themes, storyNamesList}


