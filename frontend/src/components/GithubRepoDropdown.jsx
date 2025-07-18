import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";

const GitHubRepoDropdown = ({
  token,
  onSelect,
  onError,
  className = "",
  buttonText = "Browse Repositories",
  loadingText = "Loading...",
  emptyText = "No repositories found",
  cancelText = "Cancel",
  buttonClassName = "bg-gray-100 hover:bg-gray-200 text-gray-700",
  dropdownClassName = "bg-white border border-gray-300",
  itemClassName = "hover:bg-gray-100",
  icon: Icon = Search,
  endpoint = `${import.meta.env.VITE_API_URL}/api/github/repos`,
  disabled = false,
  dropdownWidth = "w-96", // New prop for controlling dropdown width
}) => {
  const [repos, setRepos] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchRepositories = async () => {
    if (!token || disabled) return;

    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      setRepos(data.repos || []);
      setShowDropdown(true);
    } catch (err) {
      console.error("Error fetching repos:", err);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={fetchRepositories}
        disabled={loading || disabled}
        className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-colors duration-200 font-medium ${buttonClassName} ${
          (loading || disabled) ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Icon className="w-4 h-4" />
        )}
        <span>{loading ? loadingText : buttonText}</span>
      </button>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className={`absolute z-10 mt-2 ${dropdownWidth} rounded-lg shadow-lg max-h-96 overflow-y-auto ${dropdownClassName}`}
        >
          {repos.length === 0 ? (
            <div className="p-4 text-gray-500 text-sm">{emptyText}</div>
          ) : (
            <>
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  className={`p-3 cursor-pointer text-sm border-b last:border-b-0 ${itemClassName}`}
                  onClick={() => {
                    onSelect(repo);
                    setShowDropdown(false);
                  }}
                >
                  <div className="font-medium truncate">{repo.name}</div>
                  {repo.description && (
                    <div className="text-xs text-gray-500 truncate">
                      {repo.description}
                    </div>
                  )}
                </div>
              ))}
              <div
                className="text-center py-2 bg-gray-100 hover:bg-gray-200 cursor-pointer text-sm text-gray-700"
                onClick={() => setShowDropdown(false)}
              >
                {cancelText}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GitHubRepoDropdown;