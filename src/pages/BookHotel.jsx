import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BookHotel = () => {
    const { hotelId } = useParams();
    const navigate = useNavigate();

    const [hotel, setHotel] = useState(null);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [adultCount, setAdultCount] = useState(1);
    const [childCount, setChildCount] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        // Check if user is logged in using localStorage
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        if (!isLoggedIn) {
            navigate("/auth/login");
            return;
        }

        const fetchHotel = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/hotels/${hotelId}`
                );
                setHotel(response.data);
            } catch (error) {
                setError("Failed to fetch hotel details");
            } finally {
                setLoading(false);
            }
        };

        fetchHotel();
    }, [hotelId, navigate]);

    useEffect(() => {
        if (hotel && checkIn && checkOut) {
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);

            // Calculate number of nights
            const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
            const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

            // Calculate total cost
            if (nights > 0) {
                setTotalCost(nights * hotel.pricePerNight);
            } else {
                setTotalCost(0);
            }
        }
    }, [hotel, checkIn, checkOut]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!checkIn || !checkOut) {
            setError("Please select check-in and check-out dates");
            return;
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (checkInDate >= checkOutDate) {
            setError("Check-out date must be after check-in date");
            return;
        }

        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/bookings`,
                {
                    hotelId,
                    checkIn,
                    checkOut,
                    adultCount,
                    childCount,
                    totalCost
                },
                { withCredentials: true }
            );

            setBookingSuccess(true);
            setTimeout(() => {
                navigate("/my-bookings");
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to create booking");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (bookingSuccess) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    Booking successful! Redirecting to your bookings...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Book Hotel</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {hotel && (
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                            {hotel.imageUrls && hotel.imageUrls.length > 0 && (
                                <img
                                    src={hotel.imageUrls[0]}
                                    alt={hotel.name}
                                    className="w-full h-64 object-cover rounded"
                                />
                            )}
                        </div>

                        <div className="md:w-2/3">
                            <h2 className="text-xl font-semibold">{hotel.name}</h2>
                            <p className="text-gray-600 mb-2">
                                {hotel.city}, {hotel.country}
                            </p>
                            <p className="text-gray-600 mb-2">{hotel.type}</p>
                            <p className="mb-4">{hotel.description}</p>
                            <div className="flex items-center mb-2">
                                <span className="font-semibold mr-2">Price:</span>
                                <span>${hotel.pricePerNight} per night</span>
                            </div>
                            <div className="flex items-center mb-2">
                                <span className="font-semibold mr-2">Rating:</span>
                                <span>{hotel.starRating}/5</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Booking Details</h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Check-in Date
                            </label>
                            <input
                                type="date"
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Check-out Date
                            </label>
                            <input
                                type="date"
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                min={checkIn || new Date().toISOString().split("T")[0]}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Adults
                            </label>
                            <select
                                value={adultCount}
                                onChange={(e) => setAdultCount(Number(e.target.value))}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                {[1, 2, 3, 4, 5, 6].map((num) => (
                                    <option key={num} value={num}>
                                        {num} {num === 1 ? "adult" : "adults"}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Children
                            </label>
                            <select
                                value={childCount}
                                onChange={(e) => setChildCount(Number(e.target.value))}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                                    <option key={num} value={num}>
                                        {num} {num === 1 ? "child" : "children"}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-6">
                        <div className="flex justify-between items-center text-lg font-semibold">
                            <span>Total Cost:</span>
                            <span>${totalCost}</span>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Book Now
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookHotel; 