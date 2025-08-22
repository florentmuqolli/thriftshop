import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-purple-600">
            ThriftShop
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-purple-600 transition duration-300">
              Browse
            </Link>
            <Link href="/sell" className="text-gray-700 hover:text-purple-600 transition duration-300">
              Sell
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-purple-600 transition duration-300">
              About
            </Link>
            <Link href="/help" className="text-gray-700 hover:text-purple-600 transition duration-300">
              Help
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-6">
            <button className="text-gray-700 hover:text-purple-600 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link href="/dashboard" className="text-gray-700 hover:text-purple-600 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-purple-600 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </Link>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/products" className="text-gray-700 hover:text-purple-600 transition duration-300 py-2">
                Browse
              </Link>
              <Link href="/sell" className="text-gray-700 hover:text-purple-600 transition duration-300 py-2">
                Sell
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-purple-600 transition duration-300 py-2">
                About
              </Link>
              <Link href="/help" className="text-gray-700 hover:text-purple-600 transition duration-300 py-2">
                Help
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-purple-600 transition duration-300 py-2">
                My Account
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}