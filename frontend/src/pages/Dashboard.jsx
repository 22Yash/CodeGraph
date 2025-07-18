import React, { useState, useRef } from "react";
import {
  GitBranch,
  Search,
  Bell,
  Sun,
  Settings,
  Folder,
  Camera,
  Activity,
  Users,
  Plus,
  Share2,
  Filter,
  ChevronDown,
  Clock,
  Zap,
  Star,
  MoreHorizontal,
  Eye,
  RefreshCw,
} from "lucide-react";

import "../pages/Dashoard.css";
import GitHubRepoDropdown from "../components/GithubRepoDropdown";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("repositories");
  const [selectedRepo, setSelectedRepo] = useState(null);

  const toggleStar = (id) => {
    setRepositories((repos) =>
      repos.map((repo) =>
        repo.id === id ? { ...repo, starred: !repo.starred } : repo
      )
    );
  };

  const navItems = [
    { id: "repositories", label: "Repositories", icon: Folder },
    { id: "snapshots", label: "Saved Snapshots", icon: Camera },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "team", label: "Team", icon: Users },
  ];

  const handleSelect = (repo) => {
    setSelectedRepo(repo);
    console.log("Selected repo:", repo);
  };

  const handleViewGraph = () => {
    const token = localStorage.getItem("token");
    console.log("Stored token:", token);

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

  return (
    <div className="dashboard-container">
      <div className="floating-element">
        <GitBranch size={24} />
      </div>
      <div className="floating-element">
        <Zap size={32} />
      </div>
      <div className="floating-element">
        <Activity size={20} />
      </div>

      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">
              <GitBranch />
              <span>CodeGraph</span>
            </div>
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search repositories or files..."
                className="search-input"
              />
            </div>
          </div>
          <div className="header-actions">
            <button className="action-btn">
              <Bell size={20} />
            </button>
            <button className="action-btn">
              <Sun size={20} />
            </button>
            <button className="action-btn">
              <Settings size={20} />
            </button>
            <div className="user-avatar">JD</div>
          </div>
        </div>
      </header>

      <div className="main-layout">
        <aside className="sidebar">
          <nav>
            {navItems.map(({ id, label, icon: Icon }) => (
              <div
                key={id}
                className={`nav-item ${activeTab === id ? "active" : ""}`}
                onClick={() => setActiveTab(id)}
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

        <main className="main-content ">
          {activeTab === "repositories" && (
            <div>
              <div className="content-header gap-[20]">
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
                    dropdownWidth="w-[250px]"
                    buttonClassName="bg-blue-600 hover:bg-blue-700 text-white px-6"
                    dropdownClassName="bg-white border border-blue-200 shadow-xl"
                  />
                </div>
              </div>

              {selectedRepo && (
                <div className="selected-repo-info p-4 bg-gray-100 rounded-lg flex items-center justify-between mb-4">
                  <span className="font-semibold text-blue-600">
                    Selected Repository: {selectedRepo.name}
                  </span>
                  <button
                    onClick={handleViewGraph}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:opacity-90"
                  >
                    View Dependency Graph
                  </button>
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
              <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
                <p>Snapshot management interface coming soon...</p>
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
              <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
                <p>Activity feed coming soon...</p>
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
              <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
                <p>Team collaboration features coming soon...</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
