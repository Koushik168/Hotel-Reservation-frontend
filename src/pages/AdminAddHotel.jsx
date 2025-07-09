import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { hotelTypes, hotelFacilities } from "../config/hotel-options-congif";

const AdminAddHotel = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [images, setImages] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [hotelData, setHotelData] = useState({
        name: "",
        city: "",
        country: "",
        description: "",
        type: "",
        pricePerNight: 0,
        starRating: 1,
        adultCount: 1,
        childCount: 0,
        facilities: [],
        imageUrls: [],
    });

    useEffect(() => {
        const checkAdminAuth = async () => {
            try {
                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/admin/check`,
                    {},
                    { withCredentials: true }
                );
            } catch (error) {
                navigate("/admin/login");
            }
        };

        checkAdminAuth();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHotelData({
            ...hotelData,
            [name]: value,
        });
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setHotelData({
            ...hotelData,
            [name]: parseInt(value),
        });
    };

    const handleFacilityChange = (facility) => {
        const updatedFacilities = [...hotelData.facilities];

        if (updatedFacilities.includes(facility)) {
            const index = updatedFacilities.indexOf(facility);
            updatedFacilities.splice(index, 1);
        } else {
            updatedFacilities.push(facility);
        }

        setHotelData({
            ...hotelData,
            facilities: updatedFacilities,
        });
    };

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setImages([...images, ...selectedFiles]);

        // Create preview URLs
        const newImageUrls = selectedFiles.map(file => URL.createObjectURL(file));
        setImageUrls([...imageUrls, ...newImageUrls]);
    };

    const removeImage = (index) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);

        const updatedImageUrls = [...imageUrls];
        URL.revokeObjectURL(updatedImageUrls[index]); // Clean up URL object
        updatedImageUrls.splice(index, 1);
        setImageUrls(updatedImageUrls);
    };

    const uploadImagesToCloudinary = async () => {
        const uploadPromises = images.map(async (image) => {
            const formData = new FormData();
            formData.append("file", image);
            formData.append("upload_preset", "hotel_booking");

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();
            return data.secure_url;
        });

        return Promise.all(uploadPromises);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Upload images to Cloudinary
            const uploadedImageUrls = images.length > 0 ? await uploadImagesToCloudinary() : [];

            // Prepare hotel data with image URLs
            const hotelDataToSubmit = {
                ...hotelData,
                imageUrls: uploadedImageUrls,
            };

            // Submit to API
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/admin/hotels`,
                hotelDataToSubmit,
                { withCredentials: true }
            );

            // Redirect to admin dashboard
            navigate("/admin/dashboard");
        } catch (error) {
            console.error("Error adding hotel:", error);
            setError(error.response?.data?.message || "Failed to add hotel");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Add New Hotel</h1>
                <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                    Back to Dashboard
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Basic Information</h2>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Hotel Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={hotelData.name}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Hotel Type
                        </label>
                        <select
                            name="type"
                            value={hotelData.type}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="">Select Type</option>
                            {hotelTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            City
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={hotelData.city}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Country
                        </label>
                        <input
                            type="text"
                            name="country"
                            value={hotelData.country}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={hotelData.description}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            rows="4"
                            required
                        />
                    </div>

                    {/* Pricing and Rating */}
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2 mt-4">Pricing and Rating</h2>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Price Per Night ($)
                        </label>
                        <input
                            type="number"
                            name="pricePerNight"
                            value={hotelData.pricePerNight}
                            onChange={handleNumberChange}
                            min="0"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Star Rating
                        </label>
                        <select
                            name="starRating"
                            value={hotelData.starRating}
                            onChange={handleNumberChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <option key={rating} value={rating}>
                                    {rating} Stars
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Guest Capacity */}
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2 mt-4">Guest Capacity</h2>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Adult Count
                        </label>
                        <input
                            type="number"
                            name="adultCount"
                            value={hotelData.adultCount}
                            onChange={handleNumberChange}
                            min="1"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Child Count
                        </label>
                        <input
                            type="number"
                            name="childCount"
                            value={hotelData.childCount}
                            onChange={handleNumberChange}
                            min="0"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    {/* Facilities */}
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2 mt-4">Facilities</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {hotelFacilities.map((facility) => (
                                <div key={facility} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={facility}
                                        checked={hotelData.facilities.includes(facility)}
                                        onChange={() => handleFacilityChange(facility)}
                                        className="mr-2"
                                    />
                                    <label htmlFor={facility}>{facility}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Images */}
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2 mt-4">Images</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Upload Images
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                            {imageUrls.map((url, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={url}
                                        alt={`Preview ${index}`}
                                        className="w-full h-32 object-cover rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {isLoading ? "Adding Hotel..." : "Add Hotel"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminAddHotel; 