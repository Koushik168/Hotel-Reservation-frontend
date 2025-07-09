import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("hotels");
    const [hotels, setHotels] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdminAuth = async () => {
            try {
                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/admin/check`,
                    {},
                    { withCredentials: true }
                );
                fetchData();
            } catch (error) {
                navigate("/admin/login");
            }
        };

        checkAdminAuth();
    }, [navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [hotelsResponse, bookingsResponse] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/hotels`, {
                    withCredentials: true,
                }),
                axios.get(`${import.meta.env.VITE_API_BASE_URL}/bookings/admin/all`, {
                    withCredentials: true,
                }),
            ]);

            const hotelsData = hotelsResponse.data;
            setHotels(hotelsData);

            // Map hotel IDs to hotel names for the bookings table
            const bookingsWithHotelNames = bookingsResponse.data.map(booking => {
                const hotel = hotelsData.find(h => h._id === booking.hotelId);
                return {
                    ...booking,
                    hotelName: hotel ? hotel.name : "Unknown Hotel"
                };
            });

            setBookings(bookingsWithHotelNames);
        } catch (error) {
            setError("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/admin/logout`,
                {},
                { withCredentials: true }
            );
            navigate("/admin/login");
        } catch (error) {
            setError("Failed to logout");
        }
    };

    const handleUpdateBookingStatus = async (bookingId, newStatus) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/bookings/admin/${bookingId}/status`,
                { status: newStatus },
                { withCredentials: true }
            );
            fetchData(); // Refresh data
        } catch (error) {
            setError("Failed to update booking status");
        }
    };

    const handleDeleteHotel = async (hotelId) => {
        if (window.confirm("Are you sure you want to delete this hotel?")) {
            try {
                await axios.delete(
                    `${import.meta.env.VITE_API_BASE_URL}/admin/hotels/${hotelId}`,
                    { withCredentials: true }
                );
                fetchData(); // Refresh data
            } catch (error) {
                setError("Failed to delete hotel");
            }
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        if (window.confirm("Are you sure you want to delete this booking?")) {
            try {
                await axios.delete(
                    `${import.meta.env.VITE_API_BASE_URL}/bookings/admin/${bookingId}`,
                    { withCredentials: true }
                );
                fetchData(); // Refresh data
            } catch (error) {
                setError("Failed to delete booking");
            }
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
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <div className="flex space-x-4">
                    <button
                        onClick={() => navigate("/admin/add-hotel")}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add New Hotel
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex">
                        <button
                            className={`mr-8 py-4 px-1 ${activeTab === "hotels"
                                ? "border-b-2 border-blue-500 text-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                            onClick={() => setActiveTab("hotels")}
                        >
                            Hotels
                        </button>
                        <button
                            className={`py-4 px-1 ${activeTab === "bookings"
                                ? "border-b-2 border-blue-500 text-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                            onClick={() => setActiveTab("bookings")}
                        >
                            Bookings
                        </button>
                    </nav>
                </div>
            </div>

            {activeTab === "hotels" ? (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Hotels Management</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">Name</th>
                                    <th className="py-2 px-4 border-b text-left hidden md:table-cell">Location</th>
                                    <th className="py-2 px-4 border-b text-left hidden md:table-cell">Type</th>
                                    <th className="py-2 px-4 border-b text-left">Price/Night</th>
                                    <th className="py-2 px-4 border-b text-left hidden sm:table-cell">Rating</th>
                                    <th className="py-2 px-4 border-b text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hotels.length > 0 ? (
                                    hotels.map((hotel) => (
                                        <tr key={hotel._id}>
                                            <td className="py-2 px-4 border-b">{hotel.name}</td>
                                            <td className="py-2 px-4 border-b hidden md:table-cell">
                                                {hotel.city}, {hotel.country}
                                            </td>
                                            <td className="py-2 px-4 border-b hidden md:table-cell">{hotel.type}</td>
                                            <td className="py-2 px-4 border-b">
                                                ${hotel.pricePerNight}
                                            </td>
                                            <td className="py-2 px-4 border-b hidden sm:table-cell">{hotel.starRating}/5</td>
                                            <td className="py-2 px-4 border-b">
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        onClick={() => navigate(`/admin/hotels/edit/${hotel._id}`)}
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteHotel(hotel._id)}
                                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-4 text-center">
                                            No hotels found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Bookings Management</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">Hotel</th>
                                    <th className="py-2 px-4 border-b text-left hidden sm:table-cell">Check In</th>
                                    <th className="py-2 px-4 border-b text-left hidden md:table-cell">Check Out</th>
                                    <th className="py-2 px-4 border-b text-left hidden lg:table-cell">Guests</th>
                                    <th className="py-2 px-4 border-b text-left">Total</th>
                                    <th className="py-2 px-4 border-b text-left">Status</th>
                                    <th className="py-2 px-4 border-b text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length > 0 ? (
                                    bookings.map((booking) => (
                                        <tr key={booking._id}>
                                            <td className="py-2 px-4 border-b">{booking.hotelName}</td>
                                            <td className="py-2 px-4 border-b hidden sm:table-cell">
                                                {new Date(booking.checkIn).toLocaleDateString()}
                                            </td>
                                            <td className="py-2 px-4 border-b hidden md:table-cell">
                                                {new Date(booking.checkOut).toLocaleDateString()}
                                            </td>
                                            <td className="py-2 px-4 border-b hidden lg:table-cell">
                                                {booking.adultCount} adults, {booking.childCount} children
                                            </td>
                                            <td className="py-2 px-4 border-b">${booking.totalCost}</td>
                                            <td className="py-2 px-4 border-b">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-semibold ${booking.status === "confirmed"
                                                        ? "bg-green-100 text-green-800"
                                                        : booking.status === "cancelled"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                >
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <select
                                                        value={booking.status}
                                                        onChange={(e) =>
                                                            handleUpdateBookingStatus(booking._id, e.target.value)
                                                        }
                                                        className="border rounded px-2 py-1"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                    <button
                                                        onClick={() => handleDeleteBooking(booking._id)}
                                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-4 text-center">
                                            No bookings found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard; 