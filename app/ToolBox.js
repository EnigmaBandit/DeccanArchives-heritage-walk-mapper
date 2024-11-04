"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

const Toolbox = ({
  selectedFeature,
  setSelectedFeature,
  setDisplayedContent,
  focusedFeature,
  setFocusedFeature,
  storyNamesList,
  themes,
  searchTerm,
  setSearchTerm,
  closeOtherPopups,
  isSearchSelected,
  setIsSearchSelected,
}) => {
  const [filteredWords, setFilteredWords] = useState();
  const searchInputRef = useRef(false);
  // const [isSearchSelected, setIsSearchSelected] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setSearchTerm("");
        if (selectedFeature.length == 0) {
          searchInputRef.current = false;
        }

        setFilteredWords(storyNamesList);
        setIsSearchSelected(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
  }, [isSearchSelected]);

  let handleSearch = (event) => {
    let term = event.target.value.toLowerCase();
    setSearchTerm(event.target.value);
    let filtered = storyNamesList.filter((word) =>
      word[1].toLowerCase().includes(term)
    );
    setFilteredWords(filtered);
    setIsSearchSelected(true);
  };
  let handleSelect = (event) => {
    setFilteredWords(storyNamesList);
    setSearchTerm("");
    setIsSearchSelected(true);
    closeOtherPopups("toolbox search");
  };

  let selectStory = (singleDict) => {
    setSearchTerm(singleDict[1]);
    setFilteredWords([]);
    setSelectedFeature(["story", singleDict[0]]);
    setDisplayedContent(["story", singleDict[0], -1]);
    setFocusedFeature(["story", singleDict[0]]);
  };

  let selectTheme = (themeID) => {
    setSearchTerm("");
    setSelectedFeature(["theme", themeID]);
    setDisplayedContent(["theme", themeID]);
    setFocusedFeature(["theme", themeID]);
  };

  return (
    <div className="toolboxOuter flex-col">
      <div>
        <div className="flex  mt-[85px]   flex-col md:flex-row">
          <form
            className="mr-4 ml-4 md:mr-0 md:w-[450px] bg-white shadow-md rounded-full"
            ref={searchInputRef}
          >
            <input
              type="search"
              placeholder="Search"
              className=" bg-transparent rounded-full h-8 w-[95%] pl-4"
              value={searchTerm}
              onChange={handleSearch}
              onClick={handleSelect}
            />
          </form>
          <div
            className="flex-grow my-auto overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div
              className="flex flex-nowrap ml-4  mt-2 md:mt-0 shadow-md cursor-grab active:cursor-grabbing"
              style={{
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {Object.entries(themes).map(([key, value]) => (
                <button
                  key={key}
                  className="bg-white h-7  text-gray-500 shadow-md hover:bg-gray-200 pl-[15px] pr-[15px] mr-[10px] rounded-full "
                  onClick={() => selectTheme(key)}
                >
                  {value["name"]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isSearchSelected && (
          <div className="absolute left-0 w-[calc(100vw-32px)] mx-4 md:w-[450px] md:relative  bg-white rounded-xl mt-1 flex flex-col z-[5] top-[120px] md:top-0">
            {filteredWords.map((singleDict, index) => (
              <span
                key={index}
                onClick={() => selectStory(singleDict)}
                className="cursor-pointer  rounded-xl pl-5 pr-3 hover:bg-gray-200 z-[3] ab"
              >
                {singleDict[1]}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Toolbox;
