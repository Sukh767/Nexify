import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useDeleteBannerMutation,
  useGetAllBannersQuery,
} from "../features/banner/bannerApiSlice";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  LoaderCircle,
  PlusCircle,
  Trash,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="relative w-full h-64 overflow-hidden rounded-lg">
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex].url}
          alt={`Banner image ${currentIndex + 1}`}
          className="absolute w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>
    </div>
  );
};

const BannerCard = ({ banner, deleteBanner, refetchBanners, deleting }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const deleteHandler = async (id) => {
    try {
      const response = await deleteBanner(id);
      console.log("Delete response:", response);
      if (response.data.success || response.status === "successful") {
        toast.success(response.message || "Banner deleted successfully");
        refetchBanners();
      }
    } catch (error) {
      toast.error("Failed to delete banner");
      console.error("Failed to delete banner:", error);
    }
  };

  return (
    <motion.div
      className="bg-gray-800 overflow-hidden mb-6 w-full"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-2xl font-bold text-white">{banner.bannerName}</h3>
          <div className="flex space-x-2">
            {/* Edit Button */}
            <Link
              to={`/banner/${banner._id}`}
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
              aria-label="Edit Banner"
            >
              <Edit size={20} />
            </Link>

            {/* Delete Button */}
            <button
              className="text-red-400 hover:text-red-300 transition-colors duration-200"
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete this banner?")
                ) {
                  deleteHandler(banner._id);
                }
              }}
              aria-label="Delete Banner"
            >
              {deleting ? <LoaderCircle size={20} /> : <Trash size={20} />}
            </button>
          </div>
        </div>

        <ImageSlider images={banner.bannerImages} />
        <div className="mt-4">
          <button
            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="mr-1" size={20} />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="mr-1" size={20} />
                Show Details
              </>
            )}
          </button>
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 text-gray-300"
            >
              <p>
                <strong>Type:</strong> {banner.bannerType}
              </p>
              <p>
                <strong>Alt Text:</strong> {banner.bannerAlt}
              </p>
              <p>
                <strong>Description:</strong> {banner.description}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded-full font-semibold ${
                    banner.status
                      ? "bg-green-300 text-teal-700"
                      : "bg-red-300 text-red-700"
                  }`}
                >
                  {banner.status ? "Active" : "Inactive"}
                </span>
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(banner.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Last Updated:</strong>{" "}
                {new Date(banner.updatedAt).toLocaleDateString()}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const BannerPage = () => {
  const {
    data: banners,
    isLoading,
    error,
    refetch: refetchBanners,
  } = useGetAllBannersQuery();

  const [deleteBanner, { isLoading: deleting }] = useDeleteBannerMutation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center text-2xl mt-10">
        Error: {error.message || "Failed to fetch banners"}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-900 min-h-screen">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            className="text-4xl font-bold text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Banner Management
          </motion.h1>
          <Link
            to="/banner/create-banner"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 inline-flex items-center transition-colors duration-200"
          >
            <PlusCircle size={20} className="mr-2" />
            Create Banner
          </Link>
        </div>
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {banners && banners.data.length === 0 && (
            <div className="text-2xl text-center text-amber-400 font-bold font-mono">
              NO DATA FOUND
            </div>
          )}
          {banners &&
            banners.data &&
            banners.data.map((banner) => (
              <BannerCard
                key={banner._id}
                banner={banner}
                deleteBanner={deleteBanner}
                refetchBanners={refetchBanners}
                deleting={deleting}
              />
            ))}
        </motion.div>
      </main>
    </div>
  );
};

export default BannerPage;
