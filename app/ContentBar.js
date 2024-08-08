"use client"
import React, { useState, useEffect, useRef } from 'react';
import { IoCloseOutline, IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';


const ContentBar = ({displayedContent, setDisplayedContent, focusedFeature, setFocusedFeature, stories, points, themes, selectedFeature, setSelectedFeature, setSearchTerm}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [titleFontSize, setTitleFontSize] = useState(30);
  const titleRef = useRef(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [themeList, setThemeList] = useState([]);
  const [objType, setObjType] = useState('');
  const [totalPages, settotalPages] = useState(1);



  function clearContent() {
    setTitle('');
    setDescription('');
    setImage('');
    setThemeList([]);
    settotalPages(1);

  }

  useEffect ( ()=> {
    clearContent();
    console.log("displaing content");
    console.log(displayedContent);

    if (displayedContent.length === 0) {
      return;
    }
    let selectedObj = null;

    setIsOpen(true);
    let id = displayedContent[1];
    console.log("id : "+ id);
    if (displayedContent[0]=='story') {
      console.log("GOING INSIDE STORY");
      let page = displayedContent[2] + 2;
      setCurrentPage(page);
      settotalPages( stories[id]['pointsIncluded'].length + 1);
      if (page == 1) {
        console.log("plain story");
        setObjType('story');
        selectedObj = stories[id];
      } else {
        setObjType('point');
        let pointId = stories[id]['pointsIncluded'][displayedContent[2]];
        selectedObj = points[pointId];
        console.log("story point");
      }
      console.log("Setting story");
      
      
    } else if (displayedContent[0]==='theme') {
      console.log("Setting theme");
      setObjType('theme');
      selectedObj = themes[id];
    } else if (displayedContent[0]==='point') {
      console.log("Setting point");
      setObjType('point');
      selectedObj = points[id];
    } else {
      console.log("not allowed");
    }
    setTitle(selectedObj['name']);
    setImage(selectedObj['image']);
    setDescription(selectedObj['desc']); 
    if (displayedContent[0]=='point') {
      setThemeList(selectedObj['themes'])
    }

    if (displayedContent[0]=='story') {
      setThemeList(selectedObj['themes'])
    }

    
  }, [displayedContent])



  // useEffect(()=>{
  //   console.log("obj change");
  //   if (obj == null) {
  //     return;
  //   }
  //  setTitle(obj['name']);
  //   setImage(obj['image']);
  //   setDescription(obj['desc']); 

  //   if (displayedContent[0]=='point') {
  //     setThemeList(obj['themes'])
  //   }

  //   if (displayedContent[0]=='story') {
  //     setThemeList(obj['themes'])
  //   }
  // }, [obj])

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fitText = () => {
      const titleElement = titleRef.current;
      if (titleElement) {
        let fontSize = 24;
        titleElement.style.fontSize = `${fontSize}px`;
        
        while (titleElement.scrollHeight > titleElement.clientHeight && fontSize > 16) {
          fontSize--;
          titleElement.style.fontSize = `${fontSize}px`;
        }
        
        setTitleFontSize(fontSize);
      }
    };

    fitText();
    window.addEventListener('resize', fitText);
    return () => window.removeEventListener('resize', fitText);
  }, [title]);

  const handleClose = () => {
    setSearchTerm('');
    setDisplayedContent([]);
    setSelectedFeature([]);
    setIsOpen(false);
    // You can add any additional close logic here
  };

  const handlePrevious = () => {
    setCurrentPage(currentPage - 1);
    console.log("current page is : " + currentPage);
    let storyId = selectedFeature[1];
    setDisplayedContent(['story', storyId, displayedContent[2] - 1]);
    let pointIndex =  displayedContent[2] - 1;
    if (pointIndex == -1) {
      setFocusedFeature(["story", storyId]);
    } else {
      setFocusedFeature(["pathWithinStory", "previous", storyId, pointIndex ])
    }
    
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
    let pointIndex =  displayedContent[2] + 1;
    let storyId = selectedFeature[1];
    setDisplayedContent(['story', selectedFeature[1], pointIndex]);
    if (pointIndex === 0) {
      let pointId = stories[selectedFeature[1]]['pointsIncluded'][displayedContent[2] + 1];
      setFocusedFeature(["point", pointId]);
    } else {
      setFocusedFeature(["pathWithinStory", "next", storyId, pointIndex -1])
    }
  };

  if (!isOpen) return null;

  return (
    <div className="h-[82%] w-[450px] ml-5 bg-white shadow-md z-[2] absolute top-[130px] left-0 rounded-xl overflow-hidden flex flex-col">
      <div className="p-4 bg-gray-50">
        <div className="flex justify-between items-start">
          <div className="flex justify-center items-center w-[400px]" >
            <h2 
              ref={titleRef}
              className="font-bold leading-tight mb-2 mt-2 overflow-hidden"
              style={{ 
                fontSize: `${titleFontSize}px`,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {title}
            </h2>
          </div>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700  mt-1">
            <IoCloseOutline size={24} />
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="w-full flex justify-center mt-4">
          <img src={image} alt={title} className="w-[90%]"></img>
        </div>
        
        
        <div className="p-4">
          <p className="text-gray-700 mb-4">{description}</p>
          { (objType != 'theme') &&
            <div className="flex flex-wrap gap-2 mb-4">
              {themeList.map((id, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {themes[id]['name']}
                </span>
              ))}
            </div>
          }
          
        </div>
      </div>

      <div className="p-4 bg-gray-50 flex justify-between items-center">
        <button 
          onClick={handlePrevious} 
          className={`text-gray-500 hover:text-gray-700 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentPage === 1}
        >
          <IoChevronBackOutline size={24} />
        </button>
        
        <div className="flex space-x-1">
          {[...Array(totalPages)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i + 1 === currentPage ? 'bg-blue-600' : 'bg-blue-400'}`}
            />
          ))}
        </div>
        
        <button 
          onClick={handleNext} 
          className={`text-gray-500 hover:text-gray-700 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentPage === totalPages}
        >
          <IoChevronForwardOutline size={24} />
        </button>
      </div>
    </div>
  );
};

export default ContentBar;