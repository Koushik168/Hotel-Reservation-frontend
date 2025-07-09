import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiArrowFromRight } from "react-icons/bi";
import { FaPhoneAlt, FaLocationArrow } from "react-icons/fa";
import { useSelector } from 'react-redux';
import Loading from './Loading';
import { useStateForViews } from '../hooks/Hooks';

const Details = () => {
  const {
    showTooltip, setShowTooltip,
    showTooltip_2, setShowTooltip_2,
    showTooltip_3, setShowTooltip_3,
    openedDetail, isOpenedDetails
  } = useStateForViews();

  const hotel = useSelector(state => state.hotel.hotels[0]);
  const navigate = useNavigate();

  const handleBookNow = () => {
    // Check if user is logged in using localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
      navigate("/auth/login");
    } else {
      navigate(`/book/${hotel._id}`);
    }
  };

  if (!hotel) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6 px-2 sm:px-4">
      {/* Popup */}
      {openedDetail && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white border p-6 rounded-lg shadow-lg max-w-xs w-full text-center">
            <h2 className="text-xl font-bold mb-2">Hey!</h2>
            <p className="text-base mb-4">You can access the details by hovering the mouse cursor over the texts.</p>
            <button
              onClick={() => isOpenedDetails(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-4 sm:p-8 mt-4">
        {/* Images */}
        {hotel.imageUrls && hotel.imageUrls.length > 0 && (
          <div className="w-full mb-6">
            <div className="flex gap-3 overflow-x-auto">
              {hotel.imageUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Hotel ${idx + 1}`}
                  className="h-48 w-72 object-cover rounded-lg shadow min-w-[18rem]"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900 text-center sm:text-left">
            {hotel?.name ? hotel.name : 'Hotel Details'}
          </h1>
          <Link to="/" className="self-end">
            <button className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition">
              <BiArrowFromRight className="w-6 h-6" />
            </button>
          </Link>
        </div>

        {/* Description */}
        <div className="border-b border-gray-200 py-4 mt-4">
          <p className="text-base sm:text-lg text-gray-700">{hotel.description}</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          {/* Adult/Child */}
          <div
            className="relative"
            onMouseEnter={() => setShowTooltip_2(true)}
            onMouseLeave={() => setShowTooltip_2(false)}
          >
            <span className="font-medium text-gray-700">
              Adults: {hotel.adultCount} | Children: {hotel.childCount}
            </span>
            {showTooltip_2 && (
              <div className="absolute left-0 mt-2 p-2 bg-gray-800 text-white rounded shadow text-sm z-10">
                Adult: {hotel.adultCount} <br /> Child: {hotel.childCount}
              </div>
            )}
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2 text-gray-700">
            <FaPhoneAlt className="text-blue-500" />
            <a href="tel:+1234567890" className="underline hover:text-blue-600">123-456-7890</a>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-700">
            <FaLocationArrow className="text-blue-500" />
            <span>
              {hotel.country},{" "}
              <a
                href={`https://www.google.com/maps?q=${hotel.city}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-600"
              >
                {hotel.city}
              </a>
            </span>
          </div>

          {/* Price Per Night */}
          <div
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <span className="font-medium text-gray-700">
              Price/Night: {hotel.pricePerNight} €
            </span>
            {showTooltip && (
              <div className="absolute left-0 mt-2 p-2 bg-gray-800 text-white rounded shadow text-sm z-10">
                Currency: Euro<br />
                Price Per Night: {hotel.pricePerNight} €
              </div>
            )}
          </div>

          {/* Facilities */}
          <div
            className="relative"
            onMouseEnter={() => setShowTooltip_3(true)}
            onMouseLeave={() => setShowTooltip_3(false)}
          >
            <span className="font-medium text-gray-700">Facilities</span>
            {showTooltip_3 && (
              <div className="absolute left-0 mt-2 p-2 bg-gray-800 text-white rounded shadow text-sm z-10 min-w-[120px]">
                <ul className="list-disc pl-4">
                  {hotel.facilities?.map((facility, idx) => (
                    <li key={idx}>{facility}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Star Rating */}
          <div className="font-medium text-gray-700">
            Star Rating: {hotel.starRating}
          </div>
          {/* Type */}
          <div className="font-medium text-gray-700">
            Type: {hotel.type}
          </div>
        </div>

        {/* Book Now Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleBookNow}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Details;
