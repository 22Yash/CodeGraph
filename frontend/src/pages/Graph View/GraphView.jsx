import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
// Assuming these components are correctly implemented and styled with Tailwind CSS
import "../Graph View/graphView.css";
import GraphHeader from "../../components/GraphHeader";
import GraphTree from "../../components/GraphTree";
import GraphSidebar from "../../components/GraphSidebar";

function GraphView() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { repoName } = location.state || {};
  const [githubToken, setGithubToken] = useState(null);

  useEffect(() => {
    const fetchGithubToken = async () => {
      const jwt = localStorage.getItem("token");

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

  const handleVisualize = async () => {
    if (!repoName || !githubToken) {
      console.error("Repo name or GitHub token missing");
      return;
    }

    setLoading(true);
    try {
      // Make a POST request to your backend to generate the graph
      const res = await axios.post("http://localhost:5500/api/graph", {
        repoFullName: repoName,
        githubToken: githubToken,
      });

      // Set the graph data from the response. Use `res.data.treeGraph`
      setGraphData(res.data.treeGraph);
      console.log("Graph data:", res.data.treeGraph);
    } catch (error) {
      console.error("Visualization error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-inter">
      <GraphHeader />

      <div className="p-6 flex-grow overflow-hidden">
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

          {repoName && (
            <button
              onClick={handleVisualize}
              className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 ease-in-out
                ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"}`}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Visualize Graph"}
            </button>
          )}
        </div>

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
                    Click "Visualize Graph" to generate the dependency graph for{" "}
                    <span className="font-semibold text-blue-600">{repoName}</span>.
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
