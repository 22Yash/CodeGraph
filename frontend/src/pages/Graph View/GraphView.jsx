import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
// Assuming these components are correctly implemented and styled with Tailwind CSS
// import "../Graph View/graphView.css"; // If you have specific CSS, keep this. Tailwind is primary.
import GraphHeader from "../../components/GraphHeader";
import GraphTree from "../../components/GraphTree";
import GraphSidebar from "../../components/GraphSidebar";

function GraphView() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState(""); // State for messages (loading/saving/error)

  const location = useLocation();
  const { repoName } = location.state || {}; // e.g., "owner/repo-name"

  const [githubToken, setGithubToken] = useState(null);
  const [localUserId, setLocalUserId] = useState(null); // State to store the client-generated user ID

  // --- Generate and Persist a Local User ID ---
  // This useEffect generates a unique ID for the user (browser instance)
  // and stores it in localStorage. This ID will be sent to the backend.
  useEffect(() => {
    let userId = localStorage.getItem("localUserId");
    if (!userId) {
      // Generate a new UUID if one doesn't exist
      userId = crypto.randomUUID();
      localStorage.setItem("localUserId", userId);
      console.log("Generated new localUserId:", userId);
    } else {
      console.log("Retrieved existing localUserId:", userId);
    }
    setLocalUserId(userId);
  }, []); // Empty dependency array means this runs only once on component mount

  // --- Fetch GitHub Token ---
  // This useEffect fetches the GitHub token from your backend, necessary for cloning repos.
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
  }, []); // Empty dependency array means this runs only once on component mount

  // --- Handle Visualization (Generate or Load via Backend) ---
  // This function is triggered when the "Visualize / Load Graph" button is clicked.
  // It sends a request to your backend, which then handles the database interaction (load/save)
  // and graph generation.
  const handleVisualize = async () => {
    // Basic validation: ensure repoName, GitHub token, and localUserId are available
    if (!repoName || !githubToken || !localUserId) {
      console.error("Repo name, GitHub token, or localUserId missing");
      setSaveMessage("Please select a repository, ensure GitHub token is available, and reload if necessary.");
      return;
    }

    setLoading(true); // Set loading state to true
    setSaveMessage("Requesting graph from backend..."); // Inform the user about the process
    try {
      // Make a POST request to your backend's /api/graph endpoint.
      // The backend will determine if the graph needs to be loaded from MongoDB or generated.
      const res = await axios.post("http://localhost:5500/api/graph", {
        repoFullName: repoName,
        githubToken: githubToken,
        userId: localUserId, // Pass the client-generated userId to the backend
      });

      setGraphData(res.data.treeGraph); // Set the graph data received from the backend
      setSaveMessage(res.data.message || "Graph operation successful."); // Display message from backend (e.g., "Graph loaded from database.")
      console.log("Graph operation successful, received data:", res.data.treeGraph);

    } catch (error) {
      // Handle errors from the backend API call
      const errorMessage = error.response?.data?.error || error.message;
      setSaveMessage(`Visualization error: ${errorMessage}`);
      console.error("Visualization error:", error.response?.data || error.message);
    } finally {
      setLoading(false); // Reset loading state
      // Clear the message after a few seconds for better UX
      setTimeout(() => setSaveMessage(""), 5000);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-inter">
     

      <div className="p-6 flex-grow overflow-hidden mt-[60px]">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800">
              {repoName || "No Repository Selected"}
            </h2>
            <p className="text-gray-500 mt-1">
              {repoName
                ? `Interactive dependency graph for ${repoName}`
                : "Please select a repository first from the Dashboard."}
            </p>
          </div>

          {/* Visualize Button - only shown if a repo is selected */}
          {repoName && (
            <button
              onClick={handleVisualize}
              // Disable button if loading, or if localUserId is not yet available
              className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 ease-in-out
                ${loading || !localUserId ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"}`}
              disabled={loading || !localUserId}
            >
              {loading ? "Processing..." : "Visualize / Load Graph"}
            </button>
          )}
        </div>

        {/* Message Display (e.g., "Loading...", "Graph saved successfully!") */}
        {saveMessage && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{saveMessage}</span>
          </div>
        )}

        {/* Conditional rendering for graph content based on repo selection */}
        {repoName ? (
          <>
            <input
              type="text"
              placeholder="Search files in the graph…"
              className="border border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-4 py-2 rounded-lg w-full mb-6 shadow-sm"
            />

            <div className="flex flex-grow h-[calc(100vh-250px)]">
              <div className="flex-grow bg-white rounded-lg shadow-lg p-6 mr-4 overflow-hidden flex items-center justify-center">
                {graphData ? (
                  <GraphTree data={graphData} onNodeClick={setSelectedFile} />
                ) : (
                  <p className="text-gray-500 text-lg text-center">
                    {loading ? "Loading graph data..." : "Click 'Visualize / Load Graph' to generate or load the dependency graph."}
                  </p>
                )}
              </div>

              <GraphSidebar selectedFile={selectedFile} />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-[calc(100vh-200px)] bg-white rounded-lg shadow-lg">
            <p className="text-gray-600 text-xl font-medium">
              Please go back to the Dashboard and select a repository to visualize its dependencies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GraphView;
