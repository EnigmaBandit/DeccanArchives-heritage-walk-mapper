"use client"; 
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';

const Toolbox = ({selectedFeature, setSelectedFeature, setDisplayedContent, focusedFeature, setFocusedFeature, storyNamesList, themes, searchTerm, setSearchTerm}) => {

    const [filteredWords, setFilteredWords] = useState();
    const searchInputRef = useRef(false);
    const [isSearchSelected, setIsSearchSelected] = useState(false);


      const handleClickOutside = (event) => {
        if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
          if (selectedFeature.length == 0) {
            console.log("refreshing search term to none")
            setSearchTerm('');
            searchInputRef.current = false;
          }
          
          setFilteredWords(storyNamesList);
          setIsSearchSelected(false);
        }
      };
  
      document.addEventListener('click', handleClickOutside);



    let handleSearch = (event) => {
        let term = event.target.value.toLowerCase();
        setSearchTerm(event.target.value);
        let filtered = storyNamesList.filter(word => word[1].toLowerCase().includes(term));
        setFilteredWords(filtered);
        
    };
    let handleSelect = (event) => {
      setFilteredWords(storyNamesList);
      setSearchTerm('');
      setIsSearchSelected(true);
    } ;

    let selectStory = (singleDict) => {
      console.log("story searching is : " +singleDict[1] );
        setSearchTerm(singleDict[1]);
        setFilteredWords([]);
        setSelectedFeature(['story' , singleDict[0]]);
        setDisplayedContent(['story' , singleDict[0], -1])
        setFocusedFeature(['story' , singleDict[0]]);
    }

    let selectTheme = (themeID) => {
      console.log("Theme is NOT same");
        setSearchTerm('');
        setSelectedFeature(['theme' , themeID]);
        setDisplayedContent(['theme' , themeID]);
        setFocusedFeature(['theme' , themeID]);
    }

  return (
    <div className="toolboxOuter flex-col">
      <nav className=" flex justify-between items-center p-4 bg-white shadow-md  z-10 rounded-lg mx-4 mt-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-gray-800 text-2xl font-semibold">
            Stories of Hyderabad
          </Link>
          <span className="text-gray-500">By Deccan Archives</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="#" className="text-gray-800 hover:text-gray-600 px-3 py-1 rounded-md">
            Heritage Walks
          </Link>
          <Link href="#" className="text-gray-800 hover:text-gray-600 px-3 py-1 rounded-md">
            Stories
          </Link>
          <Link href="#" className="text-gray-800 hover:text-gray-600 px-3 py-1 rounded-md">
            Sources
          </Link>
          <Link href="#" className="text-gray-800 hover:text-gray-600 px-3 py-1 rounded-md">
            About
          </Link>
        </div>
      </nav>
      <div>
        <div className="flex items-center mt-2">
            <form className="  w-[450px] ml-5  bg-white shadow-md rounded-full" ref={searchInputRef}>
                  <input type="search" placeholder="Search Heritage Walks" className=" bg-transparent rounded-full pl-5 h-8 w-[95%] "
                    value={searchTerm}
                    onChange={handleSearch} 
                    onClick ={handleSelect}/>
            </form>
            <div className=" flex-grow my-auto">
                {Object.entries(themes).map(([key, value]) => (
                  <button 
                    key={key} 
                    className="bg-white h-7 text-gray-500 shadow-md hover:bg-gray-200 pl-[15px] pr-[15px] ml-[10px] rounded-full"
                    onClick={() => selectTheme(key)} 
                  >
                    {value['name']}
                  </button>
                ))}
            </div>
        </div>
        
        {
            isSearchSelected  && (
                <div className=" bg-white rounded-xl w-[450px] ml-5 mt-1 flex flex-col z-[3]  ">
                        {
                        filteredWords.map((singleDict, index) => (
                          <span 
                            key={index}
                            onClick={() => selectStory(singleDict)}  
                            className="cursor-pointer  rounded-xl pl-5 pr-3 hover:bg-gray-200 z-[3] ab">{singleDict[1]}</span>
                        ))}
                </div>
              )
        }
        
      </div>
      
    </div>
  );
};

export default Toolbox;
