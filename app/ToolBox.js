"use client"; 
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';

const Toolbox = ({selectedFeature, setSelectedFeature, setDisplayedContent, focusedFeature, setFocusedFeature, storyNamesList, themes}) => {

     
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredWords, setfilteredWords] = useState([]);

    let handleSearch = (event) => {
        console.log(themes )
        let term = event.target.value.toLowerCase();
        console.log("CHANGEd " + term);
        setSearchTerm(event.target.value);
        let filtered = storyNamesList.filter(word => word[1].toLowerCase().includes(term));
        console.log('filtered list');
        console.log(filtered)
        setfilteredWords(filtered);
        
    };

    let selectStory = (singleDict) => {
        setSearchTerm(singleDict[1]);
        setfilteredWords([]);
        setSelectedFeature(['story' , singleDict[0]]);
        setDisplayedContent(['story' , singleDict[0], -1])
        setFocusedFeature(['story' , singleDict[0]]);
    }

    let selectTheme = (themeID) => {
        setSearchTerm('');
        setSelectedFeature(['theme' , themeID]);
        setDisplayedContent(['theme' , themeID]);
        setFocusedFeature(['theme' , themeID]);
    }

  return (
    <div className="toolboxOuter flex-col">
      <nav className=" flex justify-between items-center p-4 bg-gray-200 shadow-md  z-10 rounded-lg mx-4 mt-4">
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
            <form className="  w-[450px] ml-5  bg-gray-200 rounded-full">
                  <input type="search" placeholder="Type Here" className=" bg-transparent rounded-full pl-5 h-8 w-[95%] "
                    value={searchTerm}
                    onChange={handleSearch} />
            </form>
            <div className=" flex-grow my-auto">
                {Object.entries(themes).map(([key, value]) => (
                  <button 
                    key={key} 
                    className="bg-gray-200 h-7 text-gray-500 hover:bg-gray-200 pl-[15px] pr-[15px] ml-[10px] rounded-full"
                    onClick={() => selectTheme(key)} 
                  >
                    {value['name']}
                  </button>
                ))}
            </div>
        </div>
        
        {
            searchTerm.length > 0 && (
                <div className=" bg-gray-200 rounded-xl w-[450px] ml-5 mt-1 flex flex-col z-[3]  ">
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
