"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image src="/logo.svg" alt="AuraFlow Logo" width={32} height={32} className="mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">Reel It Back</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`${
                isActive('/') 
                ? 'text-purple-500 font-medium' 
                : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/philosophy" 
              className={`${
                isActive('/philosophy') 
                ? 'text-purple-500 font-medium' 
                : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300'
              }`}
            >
              Philosophy
            </Link>
            <Link 
              href="/synergy" 
              className={`${
                isActive('/synergy') 
                ? 'text-purple-500 font-medium' 
                : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300'
              }`}
            >
              Vibe & Identity
            </Link>
            <Link 
              href="/mission" 
              className={`${
                isActive('/mission') 
                ? 'text-purple-500 font-medium' 
                : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300'
              }`}
            >
              Our Mission
            </Link>
            <Link 
              href="/contact" 
              className={`${
                isActive('/contact') 
                ? 'text-purple-500 font-medium' 
                : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300'
              }`}
            >
              Contact
            </Link>
          </nav>
          
          {/* Action Button */}
          <div>
            <Link href="/match" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Get Started
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300"
              onClick={() => setIsOpen(!isOpen)}
            >
              {!isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className={`${
                  isActive('/') 
                  ? 'text-purple-500 font-medium' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/philosophy" 
                className={`${
                  isActive('/philosophy') 
                  ? 'text-purple-500 font-medium' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Philosophy
              </Link>
              <Link 
                href="/synergy" 
                className={`${
                  isActive('/synergy') 
                  ? 'text-purple-500 font-medium' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Vibe & Identity
              </Link>
              <Link 
                href="/mission" 
                className={`${
                  isActive('/mission') 
                  ? 'text-purple-500 font-medium' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Our Mission
              </Link>
              <Link 
                href="/contact" 
                className={`${
                  isActive('/contact') 
                  ? 'text-purple-500 font-medium' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
