"use client"
import React, { useState, useEffect, useRef } from 'react';
import * as turf from "@turf/turf";

let finished = false;
const animatePath = async ( map, path, layerId, colorProcessed, colorRemaining, direction ) => {
    return new Promise(async (resolve) => {

      let lineStringObj = turf.lineString(path);
      const pathDistance = turf.length(lineStringObj);
      //300 ms min, 1.5 sec max
      let duration =(pathDistance/0.5) * 1000;
      if (duration < 300) {
        duration = 300
      } else if (duration > 1500) {
        duration = 1500
      }
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
        if (animationPhase > 1) {
          finished  = true;
          animationPhase =1;
        }
        if (direction == "previous") {
          animationPhase = 1- animationPhase;
        } 
  
        const alongPath = turf.along(lineStringObj, pathDistance * animationPhase).geometry.coordinates;
  
        const lngLat = {
          lng: alongPath[0],
          lat: alongPath[1],
        };
        
        map.setPaintProperty(layerId, 'line-gradient', [
          'step',
          ['line-progress'],
          colorProcessed,
          animationPhase,
          colorRemaining
        ]);

       // Get screen width
        let isScreenLarge = window.innerWidth > 768; // Adjust this value for "medium" screen
        let bottomPadding = Math.floor(window.innerHeight * 0.7); // 60% of screen height
        // Define padding based on screen size
        let mapPadding = isScreenLarge
          ? { left: 600, top: 150, right: 100, bottom: 100 } // Large screen padding
          : { left: 100, top: 200, right: 100, bottom: bottomPadding }; // Small screen padding

        // Move the camera to the current position on the path
        
        map.easeTo({
          center: lngLat,
          duration: 0,
          animate: false,
          padding: mapPadding,
        });
  
        await window.requestAnimationFrame(frame);
      };
  
      await window.requestAnimationFrame(frame);
    });
  };
  
  export default animatePath;