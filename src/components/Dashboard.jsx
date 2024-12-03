"use client";
import { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import axios from "axios";
import { toast } from "react-toastify";
import router, { useRouter } from "next/navigation";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const activityChartRef = useRef(null);
  const categoryChartRef = useRef(null);
  const activityChartInstance = useRef(null);
  const categoryChartInstance = useRef(null);

  useEffect(() => {
    const checkData = async () => {
      try {
        const response = await axios.get("/api/get-details");

        if (response.status === 200) {
          const activity = response.data.message;

          if (activity === true) {
            return; // Do nothing if activity is true
          } else if (activity === false) {
            router.push("/get-details");
          }
        }
      } catch (error) {
        console.log("Error in checkData:", error);
        toast.error("Failed to connect to the server");
      }
    };

    checkData(); // Invoke the function once when the component mounts
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/dashboard");
        setUserData(response.data);
      } catch (error) {
        console.log("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render Activity Breakdown
  const renderActivityBreakdown = async () => {
    try {
      const response = await axios.get("/api/log_activity/activity_breakdown/");
      const data = await response.data;

      if (activityChartInstance.current) {
        activityChartInstance.current.destroy();
      }

      const labels = data.categories.map((item) => item.label);
      const values = data.categories.map((item) => item.value);

      if (activityChartRef.current) {
        const ctx = activityChartRef.current.getContext("2d");
        activityChartInstance.current = new Chart(ctx, {
          type: "pie",
          data: {
            labels: labels,
            datasets: [
              {
                data: values,
                backgroundColor: [
                  "#52b788",
                  "#ffadad",
                  "#ffb84d",
                  "#ffd700",
                  "#ff9999",
                ],
                hoverOffset: 4,
              },
            ],
          },
          options: {
            plugins: {
              legend: { position: "top" },
            },
          },
        });
      }
    } catch (error) {
      console.error("Error rendering activity breakdown:", error);
    }
  };

  // Render Category Breakdown
  const renderCategoryBreakdown = async () => {
    try {
      const response = await axios.get("/api/log_activity/category_breakdown/");
      const data = await response.data;

      if (categoryChartInstance.current) {
        categoryChartInstance.current.destroy();
      }

      const labels = data.map((item) => item._id); // e.g., ['Emission', 'Reduction']
      const values = data.map((item) => item.totalCo2);

      if (categoryChartRef.current) {
        const ctx = categoryChartRef.current.getContext("2d");
        categoryChartInstance.current = new Chart(ctx, {
          type: "pie",
          data: {
            labels: labels,
            datasets: [
              {
                data: values,
                backgroundColor: ["#FF6384", "#36A2EB"],
                hoverOffset: 4,
              },
            ],
          },
          options: {
            plugins: {
              legend: { position: "top" },
            },
          },
        });
      }
    } catch (error) {
      console.error("Error rendering category breakdown:", error);
    }
  };

  // Ensure Charts Rendered on DOM Updates
  useEffect(() => {
    if (!isLoading && userData) {
      renderActivityBreakdown();
      renderCategoryBreakdown();
    }

    // Cleanup to prevent duplicate chart rendering
    return () => {
      if (activityChartInstance.current)
        activityChartInstance.current.destroy();
      if (categoryChartInstance.current)
        categoryChartInstance.current.destroy();
    };
  }, [userData, isLoading]);

  if (isLoading) return <div>Loading...</div>;
  if (!userData) return <div>Error loading data</div>;

  const {
    user: { username, points },
    co2Emitted,
    maxCo2Footprint,
    co2Percentage,
    suggestions,
  } = userData;

  const contribution = Math.floor((co2Emitted / maxCo2Footprint) * 100);
  return (
    <div className=" min-h-screen">
      <div className="container mx-auto p-6 bg-white shadow-xl rounded-lg">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
          Welcome, {username}!
        </h2>

        {/* First Row: Your Points, CO2 Activity Breakdown, CO2 Footprint */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Points Section */}
          <div className="bg-gradient-to-r flex flex-col justify-center from-green-400 to-blue-500 text-white p-6 rounded-lg shadow-lg h-[500px]">
            <h3 className="md:text-3xl text-xl font-semibold text-center mb-4">
              Your Points
            </h3>
            <div className="text-center mb-4">
              <img
                src="https://i.ibb.co/s56NLRW/download.jpg"
                alt="Points Icon"
                className="md:w-40 w-28 mx-auto rounded-lg shadow-md"
              />
            </div>
            <p className="md:text-6xl text-4xl font-bold text-center text-black">
              {points}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
              <div
                className="bg-orange-400 h-3 rounded-full"
                style={{ width: `${points}%` }}
              ></div>
            </div>
            <p className="text-center mt-2 text-white text-md">
              Your current points
            </p>
          </div>

          {/* CO₂ Activity Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow-lg h-[500px]">
            <h2 className="text-lg font-semibold text-center mb-4">
              CO₂ Activity Breakdown
            </h2>
            {/* <canvas id="myPieChart"></canvas> */}
            <canvas ref={activityChartRef} width="400" height="400"></canvas>
          </div>

          {/* CO₂ Footprint Section */}
          <div className="bg-gradient-to-r flex flex-col justify-center from-green-500 to-red-400 h-[500px] text-white p-6 rounded-lg shadow-lg">
            <h3 className="md:text-3xl text-xl font-semibold text-center mb-4">
              CO₂ Footprint
            </h3>
            <div className="text-center mb-4">
              <img
                src="https://img.icons8.com/ios-filled/50/ffffff/earth-planet.png"
                alt="Earth Icon"
                className="md:w-40 w-20 mx-auto"
              />
            </div>
            <div className="text-base">
              <p>
                <strong>Emitted:</strong> {co2Emitted} kg
              </p>
              <p>
                <strong>Maximum Threshold:</strong> {maxCo2Footprint} kg
              </p>
              <p>
                <strong>Contribution:</strong> {contribution}%
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
              <div
                className="bg-orange-400 h-3 rounded-full"
                style={{ width: `${contribution}%` }}
              ></div>
            </div>
            <p className="text-center mt-2 text-white text-md">
              Your contribution to the total CO₂ footprint among the users
            </p>
          </div>
        </div>

        {/* Second Row: Emission Level, Monthly CO₂ Chart, Suggestions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Emission Level Section */}
          <div className="bg-gradient-to-br from-orange-600 to-orange-400 p-5 rounded-lg shadow-lg h-[550px]">
            <h3 className="text-white text-2xl font-semibold text-center mb-5">
              Your Emission Level
            </h3>

            {/* Icon Section */}
            <div className="text-center mb-5">
              <a href="https://imgbb.com/">
                <img
                  src="https://i.ibb.co/KNcvGkJ/print2.webp"
                  alt="Emission Icon"
                  width={"100%"}
                  height={"200px"}
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </a>
            </div>

            {/* Progress Bar */}
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600">
                    Emission Progress
                  </span>
                </div>
              </div>
              <div className="flex mb-2">
                <div className="w-full bg-gray-200 rounded-full">
                  <div
                    className="bg-red-600 text-xs font-medium text-center p-0.5 leading-none rounded-full"
                    style={{ width: `${co2Percentage}%` }}
                  >
                    <span className="text-white">{co2Percentage}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Emission Data */}
            <div className="text-center text-white font-bold text-xl mb-4">
              <p className="text-black">
                You&apos;ve emitted {co2Emitted} kg of CO₂ out of your maximum
                allowed {maxCo2Footprint} kg.
              </p>
            </div>

            {/* Emission Status */}
            <p className="text-center text-white text-sm">
              Based on your current emission level, {co2Percentage}% of your
              limit has been used.
            </p>
          </div>

          {/* activity breakdown  */}
          <div className="bg-white p-5 rounded-lg shadow-lg h-[550px]">
            <h2 className="text-lg font-semibold text-center mb-4">
              Emission vs Reduction
            </h2>
            {/* <canvas id="myPieChart"></canvas> */}
            <canvas ref={categoryChartRef} width="400" height="400"></canvas>
          </div>

          {/* Suggestions Section */}
          <div className="overflow-y-scroll p-5 h-[550px]">
            <h3 className="text-xl font-semibold mb-4">Suggestions</h3>
            <div className="flex flex-col space-y-4">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-4 bg-green-100 rounded-lg border-l-4 border-green-700 shadow-sm transition-transform transform hover:scale-105"
                  >
                    <strong>Suggestion {index + 1}:</strong> {suggestion}
                  </div>
                ))
              ) : (
                <div>No suggestions available at the moment.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
