import React from 'react';
import { FaAccessibleIcon, FaMap, FaChevronRight } from "react-icons/fa";
import { TbInfoTriangle } from "react-icons/tb";
import { FaRoute } from "react-icons/fa6";
import { VscDebugBreakpointData } from "react-icons/vsc";




const Instructions = ({ themeId, themes, stories}) => {
    console.log("THEME ID: " + themeId);
    return (

        <div className="space-y-4 max-w-2xl mx-auto p-4">
            {(themeId != -1) &&
                <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-r from-yellow-300 to-yellow-400 p-6 shadow-sm transition-all hover:shadow-md">
                    <div className="absolute -right-4 -top-4 h-16 w-16 opacity-10 rotate-12">
                        <TbInfoTriangle size={64} />
                    </div>
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <div>
                                <TbInfoTriangle className="h-6 w-6 text-black" />
                            </div>
                        </div> 
                        <div> 
                            <h3 className="font-semibold text-gray-900 mb-1">Follow Along</h3>
                            <p className="text-gray-800 leading-relaxed">
                                You&apos;re currently viewing the theme description. To explore individual walks, either type a walk's name into the search bar or click directly on any walk on the map.
                            </p>
                            <div className="mt-4 pt-4 ">
                                <div className='flex flex-shrink-0'>
                                    <FaRoute size={16} className="mr-2 flex-shrink-0" />
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                                        Walks in this theme:
                                    </h4>
                                </div>
                                <div className="">
                                    {themes[themeId]['stories'].map((story, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 p-2 "
                                        >
                                            <VscDebugBreakpointData className="flex-shrink-0 h-4 w-4" />
                                            <span className="text-sm truncate">{stories[story]['name']}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}

            <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-r from-orange-300 to-orange-400 p-6 shadow-sm transition-all hover:shadow-md">
                <div className="absolute -right-4 -top-4 h-16 w-16 opacity-10 rotate-12">
                    <FaMap size={64} />
                </div>
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        <FaMap className="h-6 w-6 text-black" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Map Controls</h3>
                        <p className="text-gray-800 leading-relaxed">
                            Use the map controls at the bottom right to explore more map styles and overlays.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Instructions;