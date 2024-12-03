"use client";
import { MdLogin, MdLogout } from "react-icons/md";
import Link from "next/link";
import { AiFillDashboard } from "react-icons/ai";
import { FaHeartbeat } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa";
import { UserButton, useAuth, useClerk, useUser } from "@clerk/nextjs";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";
import { MdOutlineEventAvailable } from "react-icons/md";
import { MdOutlineLogout } from "react-icons/md";

export default function NavBar() {
  const { userId } = useAuth();
  const { user } = useUser();
  const isSignedIn = userId ? true : false;
  const [openNav, setOpenNav] = useState(false);

  const { signOut } = useClerk();

  return (
    <nav
      className="shadow-md p-[10px] md:flex items-center justify-between"
      style={{ background: "linear-gradient(to right, #FF7659, #FFBA03)" }}
    >
      <div className="flex items-center gap-[10px]">
        <img
          src="https://i.ibb.co/P450Bzb/download.png"
          alt="logo"
          className="rounded-full h-[50px] w-[50px]"
        />{" "}
        <h1 className="font-semibold text-2xl text-white">
          Tejas Footprint-CO2 Tracker
        </h1>
      </div>
      <div className="md:hidden">
        <IoMenu
          size={40}
          onClick={() => setOpenNav(!openNav)}
          className="text-white text-2xl border border-white p-[5px] rounded-md my-[3px]"
        />
      </div>
      <div
        className={`md:flex items-center gap-5 ${
          openNav ? "block" : "hidden"
        } md:block`}
      >
        <ul className="flex md:flex-row flex-col items-center gap-5">
          <li>
            <Link href="/dashboard">
              <div className="flex items-center hover:text-yellow-200 px-2 py-2 border border-transparent hover:border-yellow-500 hover:bg-yellow-100 hover:bg-opacity-30 transition-all duration-300">
                <AiFillDashboard className="text-white mr-[7px]" />
                <p className="text-white text-xl ">Dashboard</p>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/log-activity">
              <div className="flex items-center hover:text-yellow-200 px-2 py-2 border border-transparent hover:border-yellow-500 hover:bg-yellow-100 hover:bg-opacity-30 transition-all duration-300">
                <FaHeartbeat className="text-white mr-[7px]" />
                <p className="text-white text-xl ">Log Activity</p>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/leaderboard">
              <div className="flex items-center hover:text-yellow-200 px-2 py-2 border border-transparent hover:border-yellow-500 hover:bg-yellow-100 hover:bg-opacity-30 transition-all duration-300">
                <FaTrophy className="text-white mr-[7px]" />
                <p className="text-white text-xl">Leaderboard</p>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/contestHome">
              <div className="flex items-center hover:text-yellow-200 px-2 py-2 border border-transparent hover:border-yellow-500 hover:bg-yellow-100 hover:bg-opacity-30 transition-all duration-300">
                <MdOutlineEventAvailable className="text-white mr-[7px]" />
                <p className="text-white text-xl">Contest</p>
              </div>
            </Link>
          </li>
          <li>
            {isSignedIn ? (
              <div className="flex items-center">
                <button onClick={() => signOut({ redirectUrl: "/" })} className="flex items-center">
                  <MdOutlineLogout className="text-white mr-[7px]" size={20}/>
                  <p className="text-xl text-white">Logout</p>
                </button>
                <div className="flex items-center gap-[5px] hover:text-yellow-200 px-2 py-2 border border-transparent hover:border-yellow-500 hover:bg-yellow-100 hover:bg-opacity-30 transition-all duration-300">
                  <UserButton/>
                  {/* <p className="text-white">{user.username}</p> */}
                </div>
              </div>
            ) : (
              <Link href="/sign-in">
                <div className="flex cursor-pointer items-center hover:text-yellow-200 px-2 py-2 border border-transparent hover:border-yellow-500 hover:bg-yellow-100 hover:bg-opacity-30 transition-all duration-300">
                  <MdLogin className="text-white" />
                  <p className="text-white text-xl ">Login</p>
                </div>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
