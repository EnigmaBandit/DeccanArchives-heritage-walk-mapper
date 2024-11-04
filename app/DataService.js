async function fetchWords() {
    const ms = Date.now();
    const response = await fetch('https://script.google.com/macros/s/AKfycbxHBuH87RN3j557Hjxh34XRPSxuueCag1k1gBfAxVlb1TwYJggrrgJJ_-qr8bEDcYzojA/exec' +"?dummy="+ms);
    const jsonObject = await response.json();
        //Add stories to themes
    console.log("ABCS")
    for ([key,val] in jsonObject['storeis']) { 
      console.log("TEST + " + key);
    }
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


