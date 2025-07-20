import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  GitBranch, // Used for floating element 1
  Zap,       // Used for floating element 2
  Activity,  // Used for floating element 3
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

import "../pages/Dashoard.css"; // Now contains most styling
import GitHubRepoDropdown from "../components/GithubRepoDropdown";
import DashboardNavbar from "../components/DashboardNavbar"; // Import the DashboardNavbar component
import { useNavigate } from "react-router-dom";

// Dashboard now receives 'theme' and 'toggleTheme' from App.jsx
function Dashboard({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("repositories");
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [localUserId, setLocalUserId] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);

  // No need for theme state or useEffect here, as it's managed by App.jsx
  // and passed down as props.

  // --- Generate and Persist a Local User ID ---
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
  }, []);

  // --- Fetch Recent Activities ---
  useEffect(() => {
    const fetchRecentActivities = async () => {
      if (activeTab === "activity" && localUserId) {
        setActivitiesLoading(true);
        try {
          const res = await axios.get(`http://localhost:5500/api/graph/recent-activities?userId=${localUserId}`);
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
    const token = localStorage.getItem("token");
    if (selectedRepo && token) {
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
    const token = localStorage.getItem("token");
    if (repoFullName && token) {
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
      {/* Floating elements for visual flair */}
      <div className="floating-element floating-element-1">
        <GitBranch size={24} /> {/* Using LucideReact component */}
      </div>
      <div className="floating-element floating-element-2">
        <Zap size={32} /> {/* Using LucideReact component */}
      </div>
      <div className="floating-element floating-element-3">
        <Activity size={20} /> {/* Using LucideReact component */}
      </div>

      {/* Use the DashboardNavbar component, passing theme and toggleTheme */}
      <DashboardNavbar theme={theme} toggleTheme={toggleTheme} />

      {/* Adjusted top margin to account for the fixed header height */}
      <div className="main-layout mt-[60px]">
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
                  <GitHubRepoDropdown
                    token={localStorage.getItem("token")}
                    onSelect={handleSelect}
                    dropdownWidth="w-[250px]" // Tailwind class, keep if needed
                    buttonClassName="primary-btn" // Use generic primary-btn
                    dropdownClassName="dropdown-menu" // Custom class for dropdown
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
                  >
                    View Dependency Graph
                  </button>
                </div>
              ) : (
                <div className="empty-state">
                  <Folder size={64} className="empty-state-icon" />
                  <p className="empty-state-title">
                    Start by browsing your GitHub repositories.
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
