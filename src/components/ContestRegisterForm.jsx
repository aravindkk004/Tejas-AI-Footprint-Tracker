import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const ContestRegisterForm = ({ contestId }) => {
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const registerForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/contests/register", {
        contestId: contestId,
        userId: userId,
      });
      if (response.status === 200) {
        toast.success("Successfully Registered!");
        window.location.reload();
      } else if (response.status === 201) {
        toast.info("Already registered");
        window.location.reload();
      } else {
        toast.error("Error while registering");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error While registering";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <>
        <div>
          <h2 className="text-center font-bold text-3xl my-[5px]">
            Register here!
          </h2>
          <form onSubmit={registerForm}>
            <div className="flex flex-col my-[10px]">
              <label className="font-semibold mb-[10px]">Email</label>
              <input
                type="email"
                placeholder="Your Email"
                className="border border-gray-200 rounded-lg px-[10px] py-2"
              />
            </div>
            <div className="flex flex-col my-[10px]">
              <label className="font-semibold mb-[10px]">Username</label>
              <input
                type="text"
                placeholder="Your username"
                className="border border-gray-200 rounded-lg px-[10px] py-2"
              />
            </div>
            <div className="flex flex-col my-[10px]">
              <label className="font-semibold mb-[10px]">Phone Number</label>
              <input
                type="text"
                placeholder="Your Phone number"
                className="border border-gray-200 rounded-lg px-[10px] py-2"
              />
            </div>
            <button
              className="bg-green-700 px-[40px] my-[10px] w-full py-3 rounded-md text-white"
              type="submit"
              disabled={loading}
            >
              {loading ? "Registering" : "Register"}
            </button>
          </form>
        </div>
      </>
    </>
  );
};

export default ContestRegisterForm;
