import './globals.css'
import { Inter } from 'next/font/google'
import Link from "next/link";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className='fixed z-[9999] top-0 left-0 w-full'>
        <nav className=" flex justify-between items-center p-4 bg-white shadow-md  z-10 rounded-lg mx-4 mt-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-gray-800 text-2xl font-semibold">
            Explore With Me
          </Link>
          {/* <span className="text-gray-500">By Deccan Archives</span> */}
        </div>
        <div className="flex items-center space-x-4">
          {/* <Link
            href="#"
            className="text-gray-800 hover:text-gray-600 px-3 py-1 rounded-md"
          >
            Heritage Walks
          </Link>
          <Link
            href="#"
            className="text-gray-800 hover:text-gray-600 px-3 py-1 rounded-md"
          >
            Stories
          </Link>
          <Link
            href="#"
            className="text-gray-800 hover:text-gray-600 px-3 py-1 rounded-md"
          >
            Sources
          </Link> */}
          <Link
            href="/about"
            className="text-gray-800 hover:text-gray-600 px-3 py-1 rounded-md"
          >
            About
          </Link>
        </div>
      </nav>
        </div>

        {children}
      </body>
    </html>
  )
}
