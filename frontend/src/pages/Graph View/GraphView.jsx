import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import GraphHeader from "../../components/GraphHeader"; // Assuming this might need theme props too
import GraphTree from "../../components/GraphTree";
import GraphSidebar from "../../components/GraphSidebar";
import DashboardNavbar from "../../components/DashboardNavbar";

function GraphView({ theme, toggleTheme }) { // Ensure theme and toggleTheme are received
  const [selectedFile, setSelectedFile] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState(""); // State for messages (loading/saving/error)

  const location = useLocation();
  const { repoName } = location.state || {}; // e.g., "owner/repo-name"

  const [githubToken, setGithubToken] = useState(null);
  const [localUserId, setLocalUserId] = useState(null); // State to store the client-generated user ID

  // --- Generate and Persist a Local User ID ---
  useEffect(() => {
    let userId = localStorage.getItem("localUserId");
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem("localUserId", userId);
      console.log("Generated new localUserId:", userId);
    } else {
      console.log("Retrieved existing localUserId:", userId);
    }
    setLocalUserId(userId);
  }, []);

  // --- Fetch GitHub Token ---
  useEffect(() => {
    const fetchGithubToken = async () => {
      const jwt = localStorage.getItem("token");

      if (!jwt) {
        console.warn("No JWT found in localStorage. GitHub token cannot be fetched.");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5500/api/auth/me/github-token", {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        setGithubToken(res.data.githubAccessToken);
        console.log("✅ GitHub token fetched:", res.data.githubAccessToken);
      } catch (err) {
        console.error("Error fetching GitHub token:", err);
      }
    };

    fetchGithubToken();
  }, []);

  // --- Handle Visualization (Generate or Load via Backend) ---
  const handleVisualize = async () => {
    if (!repoName || !githubToken || !localUserId) {
      console.error("Repo name, GitHub token, or localUserId missing");
      setSaveMessage("Please select a repository, ensure GitHub token is available, and reload if necessary.");
      return;
    }

    setLoading(true);
    setSaveMessage("Requesting graph from backend...");
    try {
      const res = await axios.post("http://localhost:5500/api/graph", {
        repoFullName: repoName,
        githubToken: githubToken,
        userId: localUserId,
      });

      setGraphData(res.data.treeGraph);
      setSaveMessage(res.data.message || "Graph operation successful.");
      console.log("Graph operation successful, received data:", res.data.treeGraph);

    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      setSaveMessage(`Visualization error: ${errorMessage}`);
      console.error("Visualization error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
      setTimeout(() => setSaveMessage(""), 5000);
    }
  };

  return (
    // Use CSS variable for background and text color on the main container
    <div className="flex flex-col h-screen font-inter" style={{ backgroundColor: 'var(--graph-primary-bg)', color: 'var(--graph-text-primary)' }}>
      <DashboardNavbar theme={theme} toggleTheme={toggleTheme} />

      <div className="p-6 flex-grow overflow-hidden mt-[60px]">
        {/* Header section with repo name and visualize button */}
        <div className="flex justify-between items-center mb-6 p-4 rounded-lg shadow-sm"
             style={{ backgroundColor: 'var(--graph-card-bg)', boxShadow: 'var(--graph-shadow-sm)' }}>
          <div>
            <h2 className="text-3xl font-extrabold" style={{ color: 'var(--graph-text-primary)' }}>
              {repoName || "No Repository Selected"}
            </h2>
            <p className="mt-1" style={{ color: 'var(--graph-text-secondary)' }}>
              {repoName
                ? `Interactive dependency graph for ${repoName}`
                : "Please select a repository first from the Dashboard."}
            </p>
          </div>

          {repoName && (
            <button
              onClick={handleVisualize}
              // Use CSS variables for button colors and shadow
              className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 ease-in-out`}
              style={{
                backgroundColor: loading || !localUserId ? 'var(--graph-button-disabled-bg)' : 'var(--graph-button-bg)',
                boxShadow: loading || !localUserId ? 'none' : 'var(--graph-shadow-sm)',
                cursor: loading || !localUserId ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!(loading || !localUserId)) {
                  e.currentTarget.style.backgroundColor = 'var(--graph-button-hover-bg)';
                  e.currentTarget.style.boxShadow = 'var(--graph-shadow-lg)';
                }
              }}
              onMouseLeave={(e) => {
                if (!(loading || !localUserId)) {
                  e.currentTarget.style.backgroundColor = 'var(--graph-button-bg)';
                  e.currentTarget.style.boxShadow = 'var(--graph-shadow-sm)';
                }
              }}
              disabled={loading || !localUserId}
            >
              {loading ? "Processing..." : "Visualize / Load Graph"}
            </button>
          )}
        </div>

        {saveMessage && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{saveMessage}</span>
          </div>
        )}

        {repoName ? (
          <>
            {/* Input field */}
            <input
              type="text"
              placeholder="Search files in the graph…"
              className="px-4 py-2 rounded-lg w-full mb-6 shadow-sm"
              style={{
                backgroundColor: 'var(--input-bg)', // Reusing input-bg from Dashboard.css
                border: '1px solid var(--graph-input-border)',
                color: 'var(--graph-text-primary)',
                boxShadow: 'var(--graph-shadow-sm)',
                transition: 'background-color 0.4s ease-in-out, border-color 0.4s ease-in-out, color 0.4s ease-in-out, box-shadow 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--graph-input-focus-border)';
                e.target.style.boxShadow = `0 0 0 3px var(--graph-input-focus-ring)`;
                e.target.style.backgroundColor = 'var(--secondary-bg)'; // Match Dashboard's focus behavior
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--graph-input-border)';
                e.target.style.boxShadow = 'var(--graph-shadow-sm)';
                e.target.style.backgroundColor = 'var(--input-bg)';
              }}
            />

            <div className="flex flex-grow h-[calc(100vh-250px)]">
            <div className="flex-grow rounded-lg p-6 mr-4 overflow-hidden flex items-center justify-center"
                   style={{ backgroundColor: 'var(--graph-card-bg)', boxShadow: 'var(--graph-shadow-lg)' }}>
                {graphData ? (
                  <GraphTree data={graphData} onNodeClick={setSelectedFile} theme={theme} />
                ) : ( // <--- This is the correct placement for the colon (:)
                    <p className="text-lg text-center" style={{ color: 'var(--graph-text-secondary)' }}>
                    {loading ? "Loading graph data..." : "Click 'Visualize / Load Graph' to generate or load the dependency graph."}
                  </p>
                )}
              </div>
              

              <GraphSidebar selectedFile={selectedFile} theme={theme} /> {/* Pass theme to GraphSidebar if needed */}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-[calc(100vh-200px)] rounded-lg"
               style={{ backgroundColor: 'var(--graph-card-bg)', boxShadow: 'var(--graph-shadow-lg)' }}>
            <p className="text-xl font-medium" style={{ color: 'var(--graph-text-secondary)' }}>
              Please go back to the Dashboard and select a repository to visualize its dependencies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GraphView;