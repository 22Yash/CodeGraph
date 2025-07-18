import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Plus,
  Search,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  let userId = null;
  let user = null;

  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.userId;
  }

  user = JSON.parse(localStorage.getItem("user"));
  const username = user?.githubUsername;

  useEffect(() => {
    if (!token || !userId) {
      navigate("/");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/dashboard/${userId}`
        );
        const data = await res.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to fetch dashboard summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, token, userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchRepositories = async () => {
    if (!token || !user) {
      console.error("User not logged in");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/github/repos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setRepos(data.repos);
      setShowDropdown(true);
    } catch (err) {
      console.error("Error fetching repos", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleCleanUp = () => {
    if (!selectedRepo) {
      alert("Please select a repository first.");
      return;
    }

    navigate("/scanreport", {
      state: { repo: selectedRepo },
    });
  };

  const statsData = dashboardData
    ? [
        {
          title: "Total Repositories",
          value: dashboardData.totalRepos,
          change: "+2 this month",
          color: "bg-green-50 border-green-200",
          textColor: "text-green-800",
          changeColor: "text-green-600",
        },
        {
          title: "Cleanups Done",
          value: dashboardData.cleanupsDone,
          change: "+6 this week",
          color: "bg-blue-50 border-blue-200",
          textColor: "text-blue-800",
          changeColor: "text-blue-600",
        },
        {
          title: "Warnings",
          value: dashboardData.warnings,
          change: "Needs attention",
          color: "bg-yellow-50 border-yellow-200",
          textColor: "text-yellow-800",
          changeColor: "text-yellow-600",
        },
        {
          title: "Critical Issues",
          value: dashboardData.criticalIssues,
          change: "Fix immediately",
          color: "bg-red-50 border-red-200",
          textColor: "text-red-800",
          changeColor: "text-red-600",
        },
      ]
    : [];

  const recentActivities =
    dashboardData?.recentActivity.map((act) => {
      let icon = CheckCircle;
      let color = "text-green-600";

      if (act.status === "warning") {
        icon = AlertTriangle;
        color = "text-yellow-600";
      } else if (act.status === "danger") {
        icon = Clock;
        color = "text-red-600";
      }

      return {
        icon,
        color,
        title: act.type,
        subtitle: act.file,
        time: act.timeAgo,
      };
    }) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm" >GO</span>
            </div>
            <h1 className="text-xl flex flex-col md:flex-row font-semibold text-gray-900">
              <span>GitHub</span> 
              <span className="mt-[-12px] md:mt-[0px] md:ml-[10px]">Organizer</span>
            </h1>
          </div>
          <div className=" md:flex md:items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700 hover:bg-gray-300 hover:rounded-[10px] p-[4px]">
              <User className="w-5 h-5" />
              <span className="font-medium">{username || "User"}</span>
            </div>
            <button
              onClick={handleLogout}
              className="mt-[10px] md:mt-[0px] flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {username || "User"} 👋
          </h2>
          <p className="text-gray-600">
            You're managing{" "}
            <span className="font-semibold">github-organizer</span>. Here's a
            quick overview:
          </p>
        </div>

        {loading ? (
          <div className="text-gray-500">Loading dashboard...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsData.map((stat, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (stat.title === "Total Repositories")
                        navigate("/repositories");
                      // You can add more logic for other tiles if needed
                    }}
                    className={`border ${stat.color} p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition`}
                  >
                    <h3 className={`text-sm font-medium ${stat.textColor}`}>
                      {stat.title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className={`text-sm ${stat.changeColor}`}>
                      {stat.change}
                    </p>
                  </div>
                ))}
              </div>

              {/* Recent Activity Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const IconComponent = activity.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                      >
                        <IconComponent
                          className={`w-5 h-5 ${activity.color} mt-0.5`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {activity.title}
                            </span>
                            <span className="text-gray-500">-</span>
                            <span className="font-mono text-sm text-gray-700">
                              {activity.subtitle}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            ({activity.time})
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Start New Cleanup</span>
                  </button>

                  <div className="relative">
                    <button
                      onClick={fetchRepositories}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Search className="w-4 h-4" />
                      <span>Browse Repositories</span>
                    </button>

                    {showDropdown && (
                      <div
                        ref={dropdownRef}
                        className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      >
                        {repos.length === 0 ? (
                          <div className="p-3 text-gray-500 text-sm">
                            No repositories found
                          </div>
                        ) : (
                          <>
                            {repos.map((repo) => (
                              <div
                                key={repo.id}
                                className="p-3 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-b-0"
                                onClick={() => {
                                  setSelectedRepo(repo);
                                  setShowDropdown(false);
                                }}
                              >
                                <div className="font-medium">{repo.name}</div>
                                <div className="text-xs text-gray-500">
                                  {repo.description || "No description"}
                                </div>
                              </div>
                            ))}
                            <div
                              className="text-center py-2 bg-gray-100 hover:bg-gray-200 cursor-pointer text-sm text-gray-700"
                              onClick={() => setShowDropdown(false)}
                            >
                              Cancel
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {selectedRepo && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-700">
                        Selected Repo:{" "}
                        <span className="font-semibold">
                          {selectedRepo.name}
                        </span>
                      </p>
                      <button
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                        onClick={handleCleanUp}
                      >
                        Clean Up Repository
                      </button>
                    </div>
                  )}

                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span onClick={() => navigate('/repositories')}>View Reports</span>
                  </button>
                </div>
              </div>

              {dashboardData && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Repository Health
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">
                        {dashboardData.repoHealth.healthy} Healthy
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (dashboardData.repoHealth.healthy /
                              (dashboardData.repoHealth.healthy +
                                dashboardData.repoHealth.warnings || 1)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>

                    <div className="flex items-center space-x-2 mt-4">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span className="text-gray-700">
                        {dashboardData.repoHealth.warnings} Warnings
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (dashboardData.repoHealth.warnings /
                              (dashboardData.repoHealth.healthy +
                                dashboardData.repoHealth.warnings || 1)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
