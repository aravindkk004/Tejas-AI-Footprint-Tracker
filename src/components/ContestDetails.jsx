"use client";
import React, { useState, useEffect, Suspense } from "react";
import Modal from "./Modal";
import ContestRegisterForm from "./ContestRegisterForm";
import contest from "@/contest-details";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import axios from "axios";

const ContestDetails = () => {
  const { userId } = useAuth();

  const params = useParams();
  const [selectedContest, setSelectedContest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const contestId = params?.id;

  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `/api/contests/userCheck/${contestId}`
        );
        if (response.status == 200) {
          console.log(response.data);
          setRegistered(response.data);
        } else {
          console.log("error while getting");
        }
      } catch (error) {
        console.log("error");
      }
    };
    fetchUserDetails();
  }, [contestId]);

  useEffect(() => {
    const matchingContest = contest.find((c) => c.id == parseInt(contestId));
    setSelectedContest(matchingContest || null);
  }, [params]);

  const [contestTime, setContestTime] = useState("");
  useEffect(() => {
    if (selectedContest?.timing) {
      setContestTime(selectedContest.timing);
    }
  }, [selectedContest]);

  const [remainingTime, setRemainingTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!contestTime) return;

    const contestDate = new Date(contestTime);

    const interval = setInterval(() => {
      const now = new Date();
      const timeDifference = contestDate - now;

      if (timeDifference <= 0) {
        clearInterval(interval);
        setRemainingTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        setRemainingTime({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [contestTime]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const contestStartDate = new Date(contestTime);
  const hasStarted = new Date() >= contestStartDate;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-full h-[84vh]">
        <div className="w-full fixed flex py-4">
          {/* date and time  */}
          <div className="w-[20%] x flex flex-col items-center justify-center bg-gray-100 rounded-lg m-[20px] h-[200px]">
            <p className="text-center font-semibold my-[10px]">
              Contest Starts in
            </p>
            <div className="flex items-center bg-gray-300 p-[10px] rounded-lg">
              <div className="flex flex-col items-center">
                <p>{remainingTime.days}</p>
                <p>Days</p>
              </div>
              <p className="mx-3">:</p>
              <div className="flex flex-col items-center">
                <p>{remainingTime.hours}</p>
                <p>Hours</p>
              </div>
              <p className="mx-3">:</p>
              <div className="flex flex-col items-center">
                <p>{remainingTime.minutes}</p>
                <p>Mins</p>
              </div>
              <p className="mx-3">:</p>
              <div className="flex flex-col items-center">
                <p>{remainingTime.seconds}</p>
                <p>Secs</p>
              </div>
            </div>
            <div className="flex gap-[20px]">
              {/* Conditionally render the "Go to Live" button */}

              <button
                className={`bg-orange-500 ${
                  !hasStarted || !registered
                    ? "cursor-not-allowed bg-gray-400"
                    : "cursor-pointer"
                } py-[10px] px-[20px] rounded-lg my-[20px] text-white`}
                disabled={!hasStarted || !registered}
              >
                <Link
                  href={
                    hasStarted && registered
                      ? `/contest-page/${contestId}/`
                      : "#"
                  }
                  passHref
                  className={`${
                    !hasStarted || !registered
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  Go to Live!
                </Link>
              </button>
              <button
                className={`text-white px-[20px] py-[10px] rounded-lg my-[20px] ${
                  registered
                    ? "bg-green-500 cursor-not-allowed"
                    : "bg-green-500"
                }`}
                onClick={handleOpenModal}
                disabled={registered}
              >
                {registered ? "Already Registered" : "Register Here!"}
              </button>
            </div>
          </div>

          {/* right side component  */}
          <div className="overflow-y-scroll h-[89vh] w-[80%] p-[10px] border-l-2 border-black">
            <h2 className="text-3xl font-semibold text-center">
              Tejas Weekly Contest
            </h2>
            <div className="flex items-center text-lg">
              <p className="mr-[10px]">Title:</p>
              <p className="text-2xl text-green-600 font-bold">
                {selectedContest?.title}
              </p>
            </div>
            <p className="font-semibold text-2xl my-[10px]">Description</p>
            <p className="text-lg">{selectedContest?.obj}</p>
            <div className=" p-[10px] my-[10px] mb-[50px]">
              <p className="font-semibold text-2xl">Instructions</p>

              {selectedContest?.sub_process?.length > 0 && (
                <div className="my-4">
                  <p className="font-semibold text-2xl">Steps to Participate</p>
                  <ul className="list-disc list-inside">
                    {selectedContest.sub_process.map((step, index) => (
                      <li key={index} className="text-lg">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedContest?.scoring?.length > 0 && (
                <div className="my-4">
                  <p className="font-semibold text-2xl">Scoring</p>
                  <ul className="list-disc list-inside">
                    {selectedContest.scoring.map((rule, index) => (
                      <li key={index} className="text-lg">
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedContest?.verification_rules?.length > 0 && (
                <div className="my-4">
                  <p className="font-semibold text-2xl">Verification Rules</p>
                  <ul className="list-disc list-inside">
                    {selectedContest.verification_rules.map((rule, index) => (
                      <li key={index} className="text-lg">
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedContest?.completion_reward?.length > 0 && (
                <div className="my-4">
                  <p className="font-semibold text-2xl">Completion Rewards</p>
                  <ul className="list-disc list-inside">
                    {selectedContest.completion_reward.map((reward, index) => (
                      <li key={index} className="text-lg">
                        {reward}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <ContestRegisterForm contestId={contestId} />
        </Modal>
      </div>
    </Suspense>
  );
};

export default ContestDetails;
