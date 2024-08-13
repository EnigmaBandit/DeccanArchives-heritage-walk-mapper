import * as turf from "@turf/turf";

let finished = false;
const animatePath = async ( map, path, layerId, colorProcessed, colorRemaining, direction ) => {
    return new Promise(async (resolve) => {

      let lineStringObj = turf.lineString(path);
      const pathDistance = turf.length(lineStringObj);
      //1 seconds for 300 meters in milli seconds
      let duration =(pathDistance/0.5) * 1000;
      if (duration < 300) {
        duration = 300
      } else if (duration > 1000) {
        duration = 1000
      }
      console.log("DURATION : " + duration);
      let startTime;

  
      const frame = async (currentTime) => {
        
        if (finished == true) {
          finished = false;
          resolve();
          return;
        }
        if (!startTime) startTime = currentTime;
        let timeDiff = currentTime - startTime;
        let animationPhase = timeDiff/ duration;
        //console.log("animation point is : "  +animationPhase );
        if (animationPhase > 1) {
          finished  = true;
          animationPhase =1;
        }
        if (direction == "previous") {
          animationPhase = 1- animationPhase;
          console.log(animatePath);
        } 
  
        const alongPath = turf.along(lineStringObj, pathDistance * animationPhase).geometry.coordinates;
  
        const lngLat = {
          lng: alongPath[0],
          lat: alongPath[1],
        };
        console.log(animationPhase)
        
        map.setPaintProperty(layerId, 'line-gradient', [
          'step',
          ['line-progress'],
          colorProcessed,
          animationPhase,
          colorRemaining
        ]);

       
        // Move the camera to the current position on the path
        map.easeTo({
          center: lngLat,
          duration: 0,
          animate: false
        });
  
        await window.requestAnimationFrame(frame);
      };
  
      await window.requestAnimationFrame(frame);
    });
  };
  
  export default animatePath;