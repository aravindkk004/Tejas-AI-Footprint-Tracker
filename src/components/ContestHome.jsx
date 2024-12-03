"use client";
import React, { useEffect, useState } from "react";
import ContestCard from "./ContestCard";
import axios from "axios";
import { toast } from "react-toastify";

const ContestHome = () => {
  const [selectedCategory, setSelectedCategory] = useState("Upcoming");
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        const response = await axios.get("/api/contests/get-contests/");
        if (response.status === 200 && Array.isArray(response.data)) {
          setContests(response.data);
        } else {
          toast.error("Error while fetching contests");
        }
      } catch (error) {
        toast.error("Error connecting to server");
      }
    };

    fetchContestDetails();
  }, []);

  useEffect(() => {
    const filterContests = async () => {
      if (selectedCategory === "Registered") {
        try {
          const registeredContests = [];
          for (const contest of contests) {
            const isRegistered = await checkStatus(contest.id);
            if (isRegistered) {
              registeredContests.push(contest);
            }
          }
          console.log(registeredContests);
          setFilteredContests(registeredContests);
        } catch (error) {
          console.error("Error while filtering registered contests:", error);
        }
      } else {
        const today = new Date().toDateString();
        const filtered = contests.filter((contest) => {
          const contestDate = new Date(contest.timing).toDateString();

          if (selectedCategory === "Live") {
            return contestDate === today;
          } else if (selectedCategory === "Upcoming") {
            return new Date(contest.timing) > new Date();
          }
          return false;
        });
        setFilteredContests(filtered);
      }
    };

    filterContests();
  }, [selectedCategory, contests]);

  const checkStatus = async (contestId) => {
    try {
      const response = await axios.get(`/api/contests/userCheck/${contestId}`);
      return response.status === 200 && response.data;
    } catch (error) {
      console.error("Error checking user registration:", error);
      return false;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mb-[60px] mt-[30px]">
      <div className="flex flex-wrap items-center justify-center md:gap-16 gap-4 my-10 mt-8">
        <p
          onClick={() => setSelectedCategory("Upcoming")}
          className={`text-center text-base sm:text-xl md:text-2xl font-bold cursor-pointer ${
            selectedCategory === "Upcoming" ? "text-green-700" : "text-black"
          }`}
        >
          Upcoming Events
        </p>
        <p
          onClick={() => setSelectedCategory("Registered")}
          className={`text-center text-base sm:text-xl md:text-2xl font-bold cursor-pointer ${
            selectedCategory === "Registered" ? "text-green-700" : "text-black"
          }`}
        >
          Registered Events
        </p>
        <p
          onClick={() => setSelectedCategory("Live")}
          className={`text-center text-base sm:text-xl md:text-2xl font-bold cursor-pointer ${
            selectedCategory === "Live" ? "text-green-700" : "text-black"
          }`}
        >
          Live Events
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:gap-[40px] gap-[20px] md:px-[80px] px-[20px] w-full">
        {filteredContests.length > 0 ? (
          filteredContests.map((contest, index) => (
            <ContestCard
              key={index}
              id={contest.id}
              img={contest.img}
              name={contest.title}
              description={contest.obj}
              short={contest.what_to_do}
              time={contest.timing}
            />
          ))
        ) : (
          <p>No contests available</p> // Show message if no contests match the filter
        )}
      </div>
    </div>
  );
};

export default ContestHome;
