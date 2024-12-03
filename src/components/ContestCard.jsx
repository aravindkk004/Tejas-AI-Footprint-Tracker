import Link from "next/link";
import React from "react";

const ContestCard = ({ id, name, img, description, time }) => {
  // Format the contest date
  const contestDate = new Date(time);
  const formattedDate = contestDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short", // Short month name (e.g., "Dec")
    year: "numeric",
  });

  // Format the contest time (in IST)
  const formattedTime = contestDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Use 12-hour format
  });

  return (
    <Link href={{ pathname: `/contest_details/${id}/` }}>
      <div className="p-[14px] shadow-xl rounded-xl bg-gradient-to-r from-green-300 to-blue-300 pb-[60px] md:my-[20px] my-[10px] cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
        <div>
          <img
            src={img}
            className="rounded-lg w-full h-[250px]"
            alt="contest image"
          />
        </div>
        <div className="flex items-center justify-between">
          {/* Display formatted date */}
          <p>{formattedDate}</p>
          {/* Display formatted time */}
          <p>{formattedTime} IST</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mt-[7px]">{name}</h2>
        </div>
      </div>
    </Link>
  );
};

export default ContestCard;
