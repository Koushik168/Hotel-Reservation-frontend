import React, { useEffect } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import { addHotel } from '../redux/features/counter/viewData';
import { useStatesForMainPage } from '../hooks/Hooks';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const MainPage = () => {
  const dispatch = useDispatch();
  const { posts, setPosts, loading, setLoading, filters, setFilters } = useStatesForMainPage();
  const navigate = useNavigate();

  // Search Form
  const handleSearch = (searchFilters) => setFilters(searchFilters);

  // Fetching Data Using Axios
  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/hotels/search`, { params: filters });
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [filters]);

  axios.defaults.withCredentials = true;

  // View Hotel and Redux app
  const viewHotelDetails = async (hotelId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/views/${hotelId}`);
      dispatch(addHotel(response.data));
      navigate("/view/");
    } catch (error) {
      // Optionally handle error
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="backdrop-blur-md bg-white/30 rounded-xl px-8 py-6 shadow-xl text-lg text-gray-700 font-medium">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900/90 py-6 px-2 sm:px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="flex flex-col gap-6">
          {posts
            .filter(post => {
              if (!Object.keys(filters).length) return true;
              return (
                post.name === filters.name ||
                post.city === filters.city ||
                post.country === filters.country ||
                post.starRating == filters.starRating
              );
            })
            .map(post => (
              <div
                key={post._id}
                className="relative flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-8 rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6"
                style={{
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.10) 100%)',
                }}
              >
                {/* Image Section */}
                <div className="flex-shrink-0 w-full md:w-56 h-44 md:h-40 rounded-xl overflow-hidden shadow-md bg-gray-200">
                  <img
                    src={post.imageUrls[0]}
                    alt={post.name}
                    className="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-105"
                  />
                </div>
                {/* Content Section */}
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  {/* Title and Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-100 truncate">{post.name}</h2>
                    <button
                      onClick={() => viewHotelDetails(post._id)}
                      className="mt-2 sm:mt-0 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 via-pink-400 to-indigo-500 text-white font-semibold shadow-md hover:from-yellow-500 hover:to-indigo-600 transition-all duration-200 text-sm"
                    >
                      View Details
                    </button>
                  </div>
                  {/* Info Row */}
                  <div className="flex flex-wrap gap-3 mt-3 text-gray-200 text-xs md:text-sm font-medium">
                    <span className="bg-white/20 px-3 py-1 rounded-full">
                      <b>Adults:</b> {post.adultCount} <b>Kids:</b> {post.childCount}
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full">
                      <i>{post.city}</i>, {post.country}
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full">
                      <b>Price:</b> ${post.pricePerNight}/night
                    </span>
                  </div>
                  {/* Description */}
                  <p className="mt-3 text-gray-100 text-sm font-light line-clamp-2 md:line-clamp-3">
                    {post.description}
                  </p>
                </div>
              </div>
            ))}
        </div>
        {posts.length === 0 && (
          <div className="mt-16 flex justify-center">
            <div className="backdrop-blur-md bg-white/20 rounded-xl px-8 py-6 shadow-xl text-lg text-gray-200 font-medium">
              No hotels found.
            </div>
          </div>
        )}
      </div>
      {/* Admin Link */}
      <div className="mt-12 text-center">
        <Link
          to="/admin/login"
          className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
        >
          Admin Access
        </Link>
      </div>
    </div>
  );
};

export default MainPage;
