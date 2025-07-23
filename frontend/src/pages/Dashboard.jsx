import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom"; // Added useNavigate for clarity
import {
  Activity,
  Folder,
  Camera,
  Users,
  Plus,
  Share2,
  Filter,
  ChevronDown,
  Clock,
  Eye,
} from "lucide-react";

import "../pages/Dashoard.css"; // Ensure this path is correct
import GitHubRepoDropdown from "../components/GithubRepoDropdown"; // Ensure this path is correct
import DashboardNavbar from "../components/DashboardNavbar"; // Ensure this path is correct

function Dashboard({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation(); // Useful if you need to access state from navigate
  const [activeTab, setActiveTab] = useState("repositories");
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [localUserId, setLocalUserId] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  // ✨ NEW: State to hold the user's JWT token
  const [userToken, setUserToken] = useState(null);

  // Effect to manage localUserId and load the JWT token
  useEffect(() => {
    let userId = localStorage.getItem("localUserId");
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem("localUserId", userId);
      console.log("Dashboard: Generated new localUserId:", userId);
    } else {
      console.log("Dashboard: Retrieved existing localUserId:", userId);
    }
    setLocalUserId(userId);

    // ✨ NEW: Retrieve JWT token from localStorage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setUserToken(storedToken);
      console.log("Dashboard: Retrieved JWT token from localStorage.");
    } else {
      console.warn("Dashboard: No JWT token found in localStorage.");
      // Optional: If no token, redirect to login/home
      // navigate("/");
    }
  }, [navigate]); // Added navigate to dependency array as per ESLint recommendation

  // Effect to fetch recent activities
  useEffect(() => {
    const fetchRecentActivities = async () => {
      if (activeTab === "activity" && localUserId) {
        setActivitiesLoading(true);
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/graph/recent-activities?userId=${localUserId}`);
          setRecentActivities(res.data.activities);
          console.log("Recent activities fetched:", res.data.activities);
        } catch (error) {
          console.error("Error fetching recent activities:", error.response?.data || error.message);
          setRecentActivities([]);
        } finally {
          setActivitiesLoading(false);
        }
      }
    };

    fetchRecentActivities();
  }, [activeTab, localUserId]);

  const handleSelect = (repo) => {
    setSelectedRepo(repo);
    console.log("Selected repo:", repo);
  };

  const handleViewGraph = () => {
    // ✨ Using userToken from state now
    if (selectedRepo && userToken) {
      navigate("/graphview", {
        state: {
          repoName: selectedRepo.full_name || selectedRepo.name,
        },
      });
    } else {
      console.error("Missing repo selection or token!");
    }
  };

  const handleViewGraphFromActivity = (repoFullName) => {
    // ✨ Using userToken from state now
    if (repoFullName && userToken) {
      navigate("/graphview", {
        state: {
          repoName: repoFullName,
        },
      });
    } else {
      console.error("Missing repository name or token for activity view!");
    }
  };

  const navItems = [
    { id: "repositories", label: "Repositories", icon: Folder },
    { id: "snapshots", label: "Saved Snapshots", icon: Camera },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "team", label: "Team", icon: Users },
  ];

  return (
    <div className="dashboard-container">
      <DashboardNavbar theme={theme} toggleTheme={toggleTheme} />

      <div className="main-layout">
        <aside className="sidebar">
          <nav>
            {navItems.map(({ id, label, icon: Icon }) => (
              <div
                key={id}
                className={`nav-item ${activeTab === id ? "active" : ""}`}
                onClick={() => setActiveTab(id)}
                role="button"
                tabIndex={0}
                aria-selected={activeTab === id}
              >
                <Icon size={20} />
                <span>{label}</span>
              </div>
            ))}
          </nav>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <button className="quick-btn">
              <Plus size={16} />
              <span>New Analysis</span>
            </button>
            <button className="quick-btn secondary">
              <Share2 size={16} />
              <span>Share Graph</span>
            </button>
          </div>
        </aside>

        <main className="main-content">
          {activeTab === "repositories" && (
            <div>
              <div className="content-header">
                <h1 className="content-title">Repositories</h1>
                <div className="content-actions">
                  <button className="filter-btn">
                    <Filter size={16} />
                    <span>Filter</span>
                    <ChevronDown size={16} />
                  </button>
                  {/* ✨ NEW: Pass userToken from state to GitHubRepoDropdown */}
                  <GitHubRepoDropdown
                    token={userToken} // <-- Changed to userToken state
                    onSelect={handleSelect}
                    dropdownWidth="w-[250px]"
                    buttonClassName="primary-btn"
                    dropdownClassName="dropdown-menu"
                    disabled={!userToken} // Disable if no token
                  />
                </div>
              </div>

              {selectedRepo ? (
                <div className="selected-repo-info">
                  <span className="selected-repo-name">
                    Selected Repository: {selectedRepo.name}
                  </span>
                  <button
                    onClick={handleViewGraph}
                    className="primary-btn"
                    disabled={!userToken} // Disable if no token
                  >
                    View Dependency Graph
                  </button>
                </div>
              ) : (
                <div className="empty-state">
                  <Folder size={64} className="empty-state-icon" />
                  <p className="empty-state-title">
                    Start by Browse your GitHub repositories.
                  </p>
                  <p className="empty-state-description">
                    Select a repository from the "Browse Repositories" dropdown above to view its dependency graph.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "snapshots" && (
            <div>
              <div className="content-header">
                <h1 className="content-title">Saved Snapshots</h1>
                <div className="content-actions">
                  <button className="primary-btn">
                    <Camera size={16} />
                    <span>Save Current State</span>
                  </button>
                </div>
              </div>
              <div className="empty-state">
                <Camera size={64} className="empty-state-icon" />
                <p className="empty-state-title">
                  No snapshots saved yet.
                </p>
                <p className="empty-state-description">
                  Save the current state of a graph analysis to revisit it later.
                </p>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div>
              <div className="content-header">
                <h1 className="content-title">Recent Activity</h1>
                <div className="content-actions">
                  <button className="filter-btn">View All</button>
                </div>
              </div>
              <div className="activity-list-container">
                {activitiesLoading ? (
                  <p className="loading-message">Loading recent activities...</p>
                ) : recentActivities.length > 0 ? (
                  <div className="activity-grid">
                    {recentActivities.map((activity) => (
                      <div key={activity._id} className="activity-card">
                        <div className="activity-card-header">
                          <h3 className="activity-repo-name">{activity.repoFullName}</h3>
                          <span className="activity-timestamp">
                            <Clock size={14} className="icon" />
                            {new Date(activity.lastSynced).toLocaleString()}
                          </span>
                        </div>
                        <p className="activity-description">
                          Graph for this repository was last analyzed or loaded.
                        </p>
                        <div className="activity-actions">
                          <button
                            onClick={() => handleViewGraphFromActivity(activity.repoFullName)}
                            className="activity-view-btn"
                            disabled={!userToken} // Disable if no token
                          >
                            <Eye size={16} className="icon" /> View Graph
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-state-description">No recent activities found. Analyze a repository to see activity here!</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div>
              <div className="content-header">
                <h1 className="content-title">Team Collaboration</h1>
                <div className="content-actions">
                  <button className="primary-btn">
                    <Users size={16} />
                    <span>Invite Member</span>
                  </button>
                </div>
              </div>
              <div className="empty-state">
                <Users size={64} className="empty-state-icon" />
                <p className="empty-state-title">
                  Collaborate with your team members.
                </p>
                <p className="empty-state-description">
                  Invite members to share and discuss dependency graphs.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;