// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import contest from "@/contest-details";
// import { toast } from "react-toastify";

// const ContestUploadForm = ({
//   contestId,
//   userId,
//   updateScore,
//   handleCloseModel,
// }) => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [category, setCategory] = useState("");
//   const [message, setMessage] = useState("");
//   const [imgFile, setImgFile] = useState(null);
//   const [imagePreviewUrl, setImagePreviewUrl] = useState("");
//   const [status, setStatus] = useState("");
//   const [fileName, setFileName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedOption, setSelectedOption] = useState(""); // Create state to hold the selected value

//   const handleChange = (e) => {
//     setSelectedOption(e.target.value); // Update state with the selected value
//   };
//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setCategory("");
//   };

//   const handleFileChange = (event) => {
//     var reader = new FileReader();
//     reader.readAsDataURL(event.target.files[0]);
//     const file = event.target.files[0];
//     if (file) {
//       setImgFile(file);
//       setFileName(file.name);
//     }
//     reader.onload = () => {
//       setImagePreviewUrl(reader.result);
//     };
//     reader.onerror = (error) => {
//       console.log("Error: ", error);
//     };
//   };
//   const showToast = (type, message) => {
//     if (type === "success") {
//       toast.success(message);
//     } else if (type === "error") {
//       toast.error(message);
//     }
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(!loading);
//     if (!imagePreviewUrl) {
//       setMessage("Please select an image.");
//       setStatus("error");
//       return;
//     }

//     try {
//       const payload = {
//         imagePreviewUrl,
//         category,
//         fileName,
//       };

//       const response = await axios.post(
//         "/api/photoProof", // API endpoint in Next.js
//         payload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.status === 200) {
//         console.log("after the form success");
//         const updPayload = {
//           category,
//           imagePreviewUrl,
//           fileName,
//           contestId,
//           userId,
//         };
//         const updResponse = await axios.post(
//           "/api/contests/updateScore",
//           updPayload,
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         console.log("after api call", updResponse.status);
//         if (updResponse.status == 200) {
//           updateScore(updResponse.data.images.length * 5);
//           toast.success("Points rewarded");
//         }
//         // Log response
//         console.log("Server response:", updResponse.data);
//         if (updResponse.status == 200) {
//           handleCloseModel();
//           console.log("success from console");
//           setMessage(updResponse.data.message || "File uploaded successfully!");
//           setStatus("success");
//           toast.success("Successfully Uploaded");
//         } else {
//           toast.error("Error updating Score");
//         }
//       } else if (response.status === 400) {
//         showToast("error", "Oops! Try other categories");
//       }

//       setTimeout(() => {
//         handleCloseModal();
//         setMessage("");
//         window.location.reload();
//         // Router.push("/contests/")
//       }, 3000);
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message || "Error connecting to the server.";
//       // showToast("error", errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div>
//         <p className="text-xl text-center font-bold">Upload Your Image here.</p>
//         <form className="p-4" onSubmit={handleFormSubmit}>
//           <div className="mb-4">
//             <label
//               htmlFor="image"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Upload Image
//             </label>
//             <input
//               type="file"
//               name="image"
//               id="image"
//               className="block w-full border border-gray-300 rounded-md mt-2 p-2"
//               required
//               onChange={handleFileChange}
//             />
//             {imagePreviewUrl && (
//               <div className="mt-4">
//                 <img
//                   src={imagePreviewUrl}
//                   alt="Image Preview"
//                   className="w-full h-auto rounded-md"
//                 />
//               </div>
//             )}
//           </div>
//           <input type="hidden" name="category" value={category} />
//           <label
//             htmlFor="category"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Choose category
//           </label>
//           <select
//             name="category"
//             className="form-select my-2 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//             required
//             value={category} // Bind state to the select element
//             onChange={(e) => {
//               setCategory(e.target.value);
//             }}
//           >
//             <option value="" disabled>
//               Select an option
//             </option>
//             {contest.map((contests) => (
//               <option key={contests.id} value={contests.title}>
//                 {contests.title}
//               </option>
//             ))}
//           </select>
//           <button
//             type="submit"
//             className="text-white py-2 px-6 rounded-md w-full mt-2"
//             style={{
//               background: "linear-gradient(135deg, #6A11CB, #2575FC, #FF9A8B)",
//             }}
//             disabled={loading}
//           >
//             {loading ? "Submitting..." : "Submit"}
//           </button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default ContestUploadForm;

"use client";
import { useState } from "react";
import axios from "axios";
import contest from "@/contest-details";
import { toast } from "react-toastify";

const ContestUploadForm = ({
  contestId,
  userId,
  updateScore,
  handleCloseModel,
}) => {
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImgFile(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => setImagePreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
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
    if (!imagePreviewUrl) {
      setMessage("Please select an image.");
      return;
    }

    setLoading(true);
    try {
      // Upload image
      const payload = {
        imagePreviewUrl,
        category,
        fileName,
      };

      const response = await axios.post("/api/photoProof", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        // Update score
        const updPayload = {
          category,
          imagePreviewUrl,
          fileName,
          contestId,
          userId,
        };
        const updResponse = await axios.post(
          "/api/contests/updateScore",
          updPayload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (updResponse.status === 200) {
          updateScore(updResponse.data.images.length * 5);
          toast.success("Points rewarded");
          handleCloseModel();
          setMessage("File uploaded successfully!");
          showToast("success", "Successfully Uploaded");
        } else {
          toast.error("Error updating Score");
        }
      } else if (response.status == 400) {
        toast.error("Error uploading image");
      } else {
        toast.error("Error uploading image");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error connecting to the server.";
      // toast.error(errorMessage);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage("");
        window.location.reload(); // Or redirect as needed
      }, 3000);
    }
  };

  return (
    <div>
      <p className="text-xl text-center font-bold">Upload Your Image here.</p>
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
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Choose category
        </label>
        <select
          name="category"
          className="form-select my-2 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="" disabled>
            Select an option
          </option>
          {contest.map((contests) => (
            <option key={contests.id} value={contests.title}>
              {contests.title}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="text-white py-2 px-6 rounded-md w-full mt-2"
          style={{
            background: "linear-gradient(135deg, #6A11CB, #2575FC, #FF9A8B)",
          }}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ContestUploadForm;
