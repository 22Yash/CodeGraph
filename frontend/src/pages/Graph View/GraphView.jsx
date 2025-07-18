import { useEffect, useState } from "react";
import axios from "axios";
import "../Graph View/graphView.css";
import GraphHeader from "../../components/GraphHeader";
import GraphTree from "../../components/GraphTree";
import GraphSidebar from "../../components/GraphSidebar";
import { useLocation } from "react-router-dom";

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
      const res = await axios.post("http://localhost:5500/api/graph", {
        repoFullName: repoName,
        githubToken: githubToken,
      });
      
      

      setGraphData(res.data.graph);
      console.log("Graph data:", res.data.graph);
    } catch (error) {
      console.error("Visualization error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="graph-container">
      <GraphHeader />

      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">{repoName || "No Repo Selected"}</h2>
          <p className="text-gray-500">
            {repoName
              ? `Interactive dependency graph for ${repoName}`
              : "Please select a repository first"}
          </p>
        </div>

        {repoName && (
          <button
            onClick={handleVisualize}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Visualize"}
          </button>
        )}
      </div>

      {repoName && (
        <>
          <input
            type="text"
            placeholder="Search files…"
            className="border px-3 py-2 rounded-md w-full mb-2"
          />

          <div className="graph-main">
            <div className="graph-canvas">
              {graphData ? (
                <GraphTree data={graphData} onNodeClick={setSelectedFile} />
              ) : (
                <p className="text-gray-500 text-center mt-10">
                  Click "Visualize" to generate graph
                </p>
              )}
            </div>

            <GraphSidebar selectedFile={selectedFile} />
          </div>
        </>
      )}
    </div>
  );
}

export default GraphView;
