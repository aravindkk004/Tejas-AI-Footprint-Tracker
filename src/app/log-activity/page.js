"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [status, setStatus] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const categoryCards = [
    {
      title: "Used Bicycle as Transport",
      imgSrc: "https://i.ibb.co/80MtHpm/cycle.jpg",
      description: "Earn points by using a bicycle for transport.",
    },
    {
      title: "Recycled Plastic",
      imgSrc: "https://i.ibb.co/LC3yssm/plastic.jpg",
      description: "Upload proof of recycling plastic to earn points.",
    },
    {
      title: "Ate Veg Full Day",
      imgSrc: "https://i.ibb.co/qYMcPsL/veg.jpg",
      description: "Earn points for eating only vegetables for an entire day!",
    },
    {
      title: "Carpooling",
      imgSrc: "https://i.ibb.co/6JKjtpy/pool.png",
      description: "Earn points by carpooling instead of driving alone.",
    },
    {
      title: "Zero Waste Shopping",
      imgSrc: "https://i.ibb.co/Zxpq60d/zerowaste.jpg",
      description: "Earn points for practicing zero-waste shopping.",
    },
    {
      title: "Planted a Tree",
      imgSrc: "https://i.ibb.co/qjjL51B/tree.jpg",
      description: "Earn points by planting a tree.",
    },
    {
      title: "Switch to LED Bulbs",
      imgSrc: "https://i.ibb.co/QvTChD4/bulb.jpg",
      description: "Earn points for switching to energy-efficient LED bulbs.",
    },
    {
      title: "Plastic-Free Packaging",
      imgSrc: "https://i.ibb.co/xJRhgKb/plasticf.jpg",
      description: "Earn points by using plastic-free packaging.",
    },
  ];

  const handleCategoryClick = (title) => {
    setCategory(title);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCategory("");
  };

  const handleFileChange = (event) => {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    const file = event.target.files[0];
    if (file) {
      setImgFile(file);
      setFileName(file.name);
    }
    reader.onload = () => {
      setImagePreviewUrl(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  };

  const showToast = (type, message) => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(!loading);
    if (!imagePreviewUrl) {
      setMessage("Please select an image.");
      setStatus("error");
      return;
    }

    try {
      const payload = {
        imagePreviewUrl,
        category,
        fileName,
      };

      const response = await axios.post(
        "/api/photoProof", // API endpoint in Next.js
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setMessage(response.data.message || "File uploaded successfully!");
        setStatus("success");
        showToast("success", "Points awarded!");
      } else if (response.status === 400) {
        showToast("error", "Oops! Try other categories");
      }

      setTimeout(() => {
        handleCloseModal();
        setMessage("");
      }, 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error connecting to the server.";
      showToast("error", errorMessage);
    }  finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-center text-3xl font-bold mb-8 text-green-700">
        Earn Points by Uploading Proof
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-9">
        {categoryCards.map((card, index) => (
          <div
            key={index}
            className="card bg-white rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() => handleCategoryClick(card.title)}
          >
            <img
              src={card.imgSrc}
              alt={card.title}
              className="w-full h-64 object-cover rounded-t-lg  border-b-4 border-green-700"
            />
            <div className="p-4">
              <h5 className="text-xl font-semibold text-green-700 text-center">
                {card.title}
              </h5>
              <p className="text-sm text-gray-600 text-center">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback Message */}
      {message && (
        <div
          className={`mt-6 text-center py-3 px-4 rounded-lg ${
            status === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center p-4 bg-green-700">
              <h3 className="text-xl font-semibold text-white">
                Upload Proof for: {category}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-white text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            <form className="p-4" onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Image
                </label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  className="block w-full border border-gray-300 rounded-md mt-2 p-2"
                  required
                  onChange={handleFileChange}
                />
                {imagePreviewUrl && (
                  <div className="mt-4">
                    <img
                      src={imagePreviewUrl}
                      alt="Image Preview"
                      className="w-full h-auto rounded-md"
                    />
                  </div>
                )}
              </div>
              <input type="hidden" name="category" value={category} />
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-6 rounded-md w-full"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
