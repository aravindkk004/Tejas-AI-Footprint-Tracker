"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function LogActivity() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    transportation: "",
    energy: "",
    diet: "",
    recycling: "",
    travel: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/log_activity/get_log_activity", {
        transportation: formData.transportation,
        energy: formData.energy,
        diet: formData.diet,
        recycling: formData.recycling,
        travel: parseInt(formData.travel, 10), // Ensure travel is a number
      });
      if (response.status === 200) {
        toast.success("Submitted Successfully!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(!loading);
    }
  };

  return (
    <div className="container mx-auto mt-12 max-w-xl bg-white p-8 rounded-lg shadow-2xl mb-[20px]">
      <h1 className="text-center text-3xl font-semibold mb-6 text-green-700">
        Log Your Activities
      </h1>
      <form onSubmit={handleSubmit}>
        {/* Transportation */}
        <div className="mb-4">
          <label
            htmlFor="transportation"
            className="block text-lg font-bold text-green-700"
          >
            How do you commute to work/school?
          </label>
          <select
            className="form-select mt-2 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            id="transportation"
            name="transportation"
            value={formData.transportation}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select an option
            </option>
            <option value="car_petrol">Car (Petrol)</option>
            <option value="car_diesel">Car (Diesel)</option>
            <option value="public_transport">Public Transport</option>
            <option value="bicycle">Bicycle</option>
            <option value="walk">Walking</option>
            <option value="electric_vehicle">Electric Vehicle</option>
          </select>
        </div>

        {/* Energy Usage */}
        <div className="mb-4">
          <label
            htmlFor="energy"
            className="block text-lg font-bold text-green-700"
          >
            What type of energy do you use at home?
          </label>
          <select
            className="form-select mt-2 block w-full border p-2 border-gray-300 rounded-md shadow-sm"
            id="energy"
            name="energy"
            value={formData.energy}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select an option
            </option>
            <option value="renewable">Renewable (Solar, Wind, etc.)</option>
            <option value="nonrenewable">
              Non-Renewable (Coal, Gas, etc.)
            </option>
          </select>
        </div>

        {/* Diet */}
        <div className="mb-4">
          <label
            htmlFor="diet"
            className="block text-lg font-bold text-green-700"
          >
            What is your diet preference?
          </label>
          <select
            className="form-select mt-2 block w-full border p-2 border-gray-300 rounded-md shadow-sm"
            id="diet"
            name="diet"
            value={formData.diet}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select an option
            </option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="non_vegetarian">Non-Vegetarian</option>
          </select>
        </div>

        {/* Recycling */}
        <div className="mb-4">
          <label
            htmlFor="recycling"
            className="block text-lg font-bold text-green-700"
          >
            Do you recycle at home?
          </label>
          <select
            className="form-select mt-2 block w-full border p-2 border-gray-300 rounded-md shadow-sm"
            id="recycling"
            name="recycling"
            value={formData.recycling}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select an option
            </option>
            <option value="always">Always</option>
            <option value="sometimes">Sometimes</option>
            <option value="rarely">Rarely</option>
          </select>
        </div>

        {/* Travel */}
        <div className="mb-4">
          <label
            htmlFor="travel"
            className="block text-lg font-bold text-green-700"
          >
            How many flights do you take per year?
          </label>
          <input
            type="number"
            className="form-control mt-2 block w-full border p-2 border-gray-300 rounded-md shadow-sm"
            id="travel"
            name="travel"
            value={formData.travel}
            onChange={handleChange}
            placeholder="Enter number of flights"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="btn btn-primary w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          {loading ? "Submitting" : "Submit"}
        </button>
      </form>
    </div>
  );
}
