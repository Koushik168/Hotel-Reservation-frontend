import { Link } from 'react-router-dom';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Check localStorage for login state
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loginStatus);
    };

    checkLoginStatus();

    // Also check token validity with server
    const checkTokenValidity = async () => {
      try {
        const response = await Axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/check`,
          {},
          {
            withCredentials: true,
          }
        );
        if (response.data.valid) {
          localStorage.setItem('isLoggedIn', 'true');
          setIsLoggedIn(true);
        }
      } catch (error) {
        // If token is invalid, clear localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
      }
    };

    checkTokenValidity();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await Axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      // Clear localStorage on logout
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // New theme colors: dark background, accent gold, modern glassmorphism
  const navLinks = isLoggedIn ? (
    <>
      <Link
        to="/info"
        className="block w-full text-left bg-opacity-70 bg-white text-yellow-600 hover:bg-yellow-50 px-5 py-2 rounded-xl font-semibold tracking-wide shadow-sm transition duration-200"
        onClick={() => setMenuOpen(false)}
      >
        About Us
      </Link>
      {/* <Link
        to="/my-hotels"
        className="block w-full text-left bg-opacity-70 bg-white text-yellow-600 hover:bg-yellow-50 px-5 py-2 rounded-xl font-semibold tracking-wide shadow-sm transition duration-200"
        onClick={() => setMenuOpen(false)}
      >
        My Hotels
      </Link> */}
      <Link
        to="/my-bookings"
        className="block w-full text-left bg-opacity-70 bg-white text-yellow-600 hover:bg-yellow-50 px-5 py-2 rounded-xl font-semibold tracking-wide shadow-sm transition duration-200"
        onClick={() => setMenuOpen(false)}
      >
        My Bookings
      </Link>
      <Link
        to="/"
        className="block w-full text-left bg-opacity-70 bg-white text-yellow-600 hover:bg-yellow-50 px-5 py-2 rounded-xl font-semibold tracking-wide shadow-sm transition duration-200"
        onClick={() => setMenuOpen(false)}
      >
        Home
      </Link>
      <button
        onClick={handleLogout}
        className="block w-full text-left bg-opacity-70 bg-white text-yellow-600 hover:bg-yellow-50 px-5 py-2 rounded-xl font-semibold tracking-wide shadow-sm transition duration-200"
      >
        Log Out
      </button>
    </>
  ) : (
    <Link
      to="/users/register"
      className="block w-full text-left bg-opacity-70 bg-white text-yellow-600 hover:bg-yellow-50 px-5 py-2 rounded-xl font-semibold tracking-wide shadow-sm transition duration-200"
      onClick={() => setMenuOpen(false)}
    >
      Sign In
    </Link>
  );

  return (
    <nav className="backdrop-blur-md bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900/90 shadow-2xl w-full z-50 border-b border-yellow-500/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 sm:px-8 lg:px-12">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="inline-block w-8 h-8 rounded-full bg-yellow-400 shadow-lg border-2 border-yellow-600 flex items-center justify-center text-gray-900 font-extrabold text-xl">🏨</span>
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-yellow-400 text-2xl sm:text-3xl font-extrabold tracking-widest drop-shadow-lg hover:text-yellow-300 transition"
            style={{ letterSpacing: '0.15em' }}
          >
            Hotel Wiki
          </Link>
        </div>
        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-4">
          {isLoggedIn ? (
            <>
              <Link
                to="/info"
                className="bg-white bg-opacity-70 text-yellow-700 hover:bg-yellow-50 px-4 py-2 rounded-xl font-semibold tracking-wide shadow-sm transition duration-200"
              >
                About Us
              </Link>
              {/* <Link
                to="/my-hotels"
                className="bg-white bg-opacity-70 text-yellow-700 hover:bg-yellow-50 px-4 py-2 rounded-xl font-semibold tracking-wide shadow-sm transition duration-200"
              >
                My Hotels
              </Link> */}
              <Link
                to="/my-bookings"
                className="bg-white bg-opacity-70 text-yellow-700 hover:bg-yellow-50 px-4 py-2 rounded-xl font-semibold tracking-wide shadow-sm transition duration-200"
              >
                My Bookings
              </Link>
              <Link
                to="/"
                className="bg-white bg-opacity-70 text-yellow-700 hover:bg-yellow-50 px-4 py-2 rounded-xl font-semibold tracking-wide shadow-sm transition duration-200"
              >
                Home
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white bg-opacity-70 text-yellow-700 hover:bg-yellow-50 px-4 py-2 rounded-xl font-semibold tracking-wide shadow-sm transition duration-200"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link
              to="/users/register"
              className="bg-white bg-opacity-70 text-yellow-700 hover:bg-yellow-50 px-4 py-2 rounded-xl font-semibold tracking-wide shadow-sm transition duration-200"
            >
              Sign In
            </Link>
          )}
        </div>
        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-yellow-400 hover:text-yellow-300 focus:outline-none transition"
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiX size={32} /> : <HiMenu size={32} />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900/90 px-4 pb-4 pt-2 space-y-3 shadow-2xl animate-fade-in-down border-t border-yellow-500/20">
          {navLinks}
        </div>
      )}
    </nav>
  );
};

export default Header;