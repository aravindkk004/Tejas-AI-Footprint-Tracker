"use client";
import { useState, useEffect } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import Modal from "./Modal";
import ContestUploadForm from "./ContestUploadForm";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "react-toastify";

const Contestpage = () => {
  const role = "user";
  const { userId } = useAuth();
  const params = useParams();
  const contestId = params?.id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const [targetScore, setTargetScore] = useState(0);
  const [images, setImages] = useState("");

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const response = await axios.get(`/api/contests/get_details/${userId}`);
        if (response.status == 200) {
          setImages(response.data);
          setTargetScore(response.data.length * 5);
        } else {
          toast.error("Error fetching score");
        }
      } catch (error) {
        toast.error("Error while fetching server");
      }
    };
    if (contestId && userId) {
      fetchScore();
    }
  }, [contestId, userId]);

  const [score, setScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = targetScore;
    const duration = 1000;
    const incrementTime = 50;
    const step = Math.ceil((end - start) / (duration / incrementTime));

    const interval = setInterval(() => {
      start += step;
      if (start >= end) {
        clearInterval(interval);
        setScore(end);
      } else {
        setScore(start);
      }
    }, incrementTime);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [targetScore]);

  function updateScore(scores) {
    setScore(scores);
  }

  const handleCloseModel = () => {
    setIsModalOpen(false); // This will close the modal
  };
  

  return (
    <>
      <div className="w-full flex flex-col">
        <div className="flex w-full h-[calc(100vh-80px)]">
          <div className="w-[20%] flex flex-col items-center justify-center bg-white rounded-lg m-[20px]">
            <h2 className="font-bold text-3xl my-[10px]">Your Score</h2>
            <h1 className="font-extrabold text-6xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              {score}
            </h1>
          </div>
          <div className="w-[80%] bg-white rounded-lg shadow-xl m-[20px] p-[20px] flex flex-col justify-between">
            <div className="overflow-y-scroll h-[calc(100vh-200px)]">
              <div className="space-y-4">
                {targetScore > 0 ? (
                  <div>
                    <p className="font-bold text-center text-3xl mb-[20px]">
                      Uploaded Images
                    </p>
                    {images.map((image, index) => (
                      <div className="my-[20px]" key={index}>
                        <img
                          key={index}
                          src={image}
                          alt={`Uploaded ${index + 1}`}
                          className="w-full h-auto rounded-md my-2"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Nothing to Show. Upload images</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <button
                className="flex items-center w-full p-3 justify-center rounded-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #6A11CB, #2575FC, #FF9A8B)",
                  color: "white",
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                }}
                onClick={handleOpenModal}
              >
                <IoCloudUploadOutline className="text-white mr-4" size={30} />
                <p className="text-2xl text-white">Upload</p>
              </button>
            </div>
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <ContestUploadForm
            contestId={contestId}
            userId={userId}
            updateScore={updateScore}
            handleCloseModel={handleCloseModel}
          />
        </Modal>
      </div>
    </>
  );
};

export default Contestpage;
