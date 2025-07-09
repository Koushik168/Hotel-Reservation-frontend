import React from 'react';

// ICONS
import { MdAirlineSeatReclineExtra, MdAirlineStops, MdGppGood, MdTravelExplore, MdSearch, MdClear } from 'react-icons/md';

// src/toasts/SearchBarToast
import { toast_info_search_b } from '../toast/Toast.js';

// useToast - Chakra UI
import { useToast } from '@chakra-ui/react';

// Custom Hooks
import { useStatesForSearchBar } from '../hooks/Hooks.jsx';

const SearchBar = ({ onSearch }) => {
  const { name, setName, city, setCity, country, setCountry, starRating, setStarRating } = useStatesForSearchBar();
  const toast = useToast();

  const handleSearch = () => {
    onSearch({ name, city, country, starRating });
    toast_info_search_b(toast);
  };

  return (
    <div className="flex justify-center items-center w-full bg-gray-100 py-4 px-2 sm:px-4">
      <form
        className="p-4 sm:p-6 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-xl shadow-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-5 gap-4 sm:gap-6 w-full max-w-6xl"
      >
        {/* Name Input */}
        <div className="flex items-center bg-white p-2 sm:p-3 rounded-lg shadow-md w-full min-w-0">
          <MdTravelExplore size={22} className="mr-2 text-blue-600 flex-shrink-0" />
          <input
            placeholder="Where are you going?"
            className="text-md w-full focus:outline-none bg-transparent"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* City Input */}
        <div className="flex items-center bg-white p-2 sm:p-3 rounded-lg shadow-md w-full min-w-0">
          <MdAirlineSeatReclineExtra size={22} className="mr-2 text-blue-600 flex-shrink-0" />
          <input
            placeholder="Which City?"
            className="text-md w-full focus:outline-none bg-transparent"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        {/* Country Input */}
        <div className="flex items-center bg-white p-2 sm:p-3 rounded-lg shadow-md w-full min-w-0">
          <MdAirlineStops size={22} className="mr-2 text-blue-600 flex-shrink-0" />
          <input
            placeholder="Which Country?"
            className="text-md w-full focus:outline-none bg-transparent"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 sm:gap-4 justify-center col-span-1 sm:col-span-2 md:col-span-3 2xl:col-span-1 w-full">
          <button
            type="button"
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 w-1/2 sm:w-auto bg-green-700 text-white rounded-lg px-3 sm:px-4 py-2 font-bold text-base sm:text-lg shadow-md hover:from-green-500 hover:to-green-700 transform hover:scale-105 transition-transform"
          >
            <MdSearch size={20} />
            <span className="hidden sm:inline">Search</span>
          </button>

          <button
            type="reset"
            className="flex items-center justify-center gap-2 w-1/2 sm:w-auto bg-red-700 text-white rounded-lg px-3 sm:px-4 py-2 font-bold text-base sm:text-lg shadow-md hover:from-red-500 hover:to-red-700 transform hover:scale-105 transition-transform"
          >
            <MdClear size={20} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
