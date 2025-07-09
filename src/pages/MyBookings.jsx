import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyBookings = () => {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Check if user is logged in using localStorage
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        if (!isLoggedIn) {
            navigate("/auth/login");
            return;
        }

        const fetchBookings = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/bookings/my-bookings`,
                    { withCredentials: true }
                );
                setBookings(response.data);
            } catch (error) {
                setError("Failed to fetch bookings");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [navigate]);

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await axios.put(
                    `${import.meta.env.VITE_API_BASE_URL}/bookings/${bookingId}/cancel`,
                    {},
                    { withCredentials: true }
                );

                // Update booking status locally
                setBookings(
                    bookings.map((booking) =>
                        booking._id === bookingId
                            ? { ...booking, status: "cancelled" }
                            : booking
                    )
                );
            } catch (error) {
                setError("Failed to cancel booking");
            }
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "confirmed":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-yellow-100 text-yellow-800";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {bookings.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-gray-600">You don't have any bookings yet.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Browse Hotels
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings.map((booking) => (
                        <div
                            key={booking._id}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <div className="flex flex-col md:flex-row justify-between">
                                <div className="mb-4 md:mb-0">
                                    <h2 className="text-xl font-semibold mb-2">
                                        Booking #{booking._id.substring(0, 8)}
                                    </h2>

                                    <div className="mb-2">
                                        <span className="font-semibold">Hotel:</span>{" "}
                                        {booking.hotelId}
                                    </div>

                                    <div className="mb-2">
                                        <span className="font-semibold">Check-in:</span>{" "}
                                        {new Date(booking.checkIn).toLocaleDateString()}
                                    </div>

                                    <div className="mb-2">
                                        <span className="font-semibold">Check-out:</span>{" "}
                                        {new Date(booking.checkOut).toLocaleDateString()}
                                    </div>

                                    <div className="mb-2">
                                        <span className="font-semibold">Guests:</span>{" "}
                                        {booking.adultCount} adults, {booking.childCount} children
                                    </div>

                                    <div className="mb-2">
                                        <span className="font-semibold">Total Cost:</span> $
                                        {booking.totalCost}
                                    </div>
                                </div>

                                <div className="flex flex-col items-start md:items-end">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-semibold mb-4 ${getStatusBadgeClass(
                                            booking.status
                                        )}`}
                                    >
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>

                                    {booking.status !== "cancelled" && (
                                        <button
                                            onClick={() => handleCancelBooking(booking._id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                                            disabled={booking.status === "cancelled"}
                                        >
                                            Cancel Booking
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings; 