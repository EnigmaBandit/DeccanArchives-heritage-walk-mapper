import React from 'react';
import { MdOutlineMailOutline } from "react-icons/md";
import { FaPhoneFlip } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { PiReadCvLogo } from "react-icons/pi";

export const metadata = {
    title: 'About',
}

export default function About() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F7F5F5' }}>
            {/* Hero Section */}
            <div className="pt-40 pb-32 px-6 md:px-12">
                <h1 className="text-5xl md:text-7xl font-extralight text-gray-800 max-w-4xl mx-auto mb-6">
                    About the Project
                </h1>
                <p className="text-xl md:text-2xl text-gray-500 max-w-4xl mx-auto font-light">
                    An interactive mapping project documenting curated walking routes and their associated narratives.
                </p>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-6 md:px-12 pb-32">
                <div className="space-y-16 text-gray-700">

                    {/* Interactive Features */}
                    <div className="space-y-6">
                        <h2 className="text-lg uppercase tracking-wider mb-6 text-gray-400">Interactive Features</h2>
                        <p className="font-light leading-loose">
                            The project maps walking routes using a three-levleed system: Themes, Individual Walks, and Points of Interest. Navigate through these layers using the interactive features integrated throughout the website.
                        </p>
                        <p className="font-light leading-loose">
                        Use the map controls at the bottom right to explore more map styles and overlays.
                        </p>
                    </div>


                    {/* Tech Stack */}
                    <div className="space-y-6">
                        <h2 className="text-lg uppercase tracking-wider mb-6 text-gray-400">Tech stack</h2>
                        <p className="font-light leading-loose">
                            This Next.js-based application integrates Mapbox GL JS for advanced map rendering capabilities. The geospatial data was collected using GPSLogger mobile application and processed through QGIS, with Google Sheets serving as the primary data repository.
                        </p>
                    </div>



                    {/* About me */}
                    <div>
                        <h2 className="text-lg uppercase tracking-wider mb-6 text-gray-400">About me</h2>
                        <p className="font-light leading-loose">
                            I&apos;m Tejas Arora, a software developer with an interest in mapping and geospatial annalysis. Feel free to connect with me through any of the channels below.
                        </p>
                        <div className="flex justify-between">
                            <a
                                href="mailto:tejas.arora619@gmail.com"
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <MdOutlineMailOutline size={20} />
                                <span>Email</span>
                            </a>

                            <a
                                href="https://www.linkedin.com/in/tejas-arora-551781188/"
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <FaLinkedin size={20} />
                                <span>LinkedIn</span>
                            </a>

                            <a
                                href="tel:+91-9877786926"
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <FaPhoneFlip size={20} />
                                <span>Phone</span>
                            </a>

                            <a
                                href="/tejas-arora-cv.pdf"
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <PiReadCvLogo size={20} />
                                <span>CV</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}