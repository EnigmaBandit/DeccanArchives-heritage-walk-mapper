async function fetchWords() {
    const ms = Date.now();
    const response = await fetch('https://script.google.com/macros/s/AKfycbyhDzpwcMK0toEJNTX-hUA_JoxWnYgg2tD1WbtzmsAEnPB9W791Kq6zos3l8OPi1CnW/exec' +"?dummy="+ms);
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


