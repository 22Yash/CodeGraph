const CleanupActivity = require("../modles/CleanupActivity");

const getDashboardSummary = async (req, res) => {
  const { userId } = req.params;

  try {
    const activities = await CleanupActivity.find({ userId }).sort({ createdAt: -1 });

    const totalRepos = new Set(activities.map((a) => a.repoName)).size;
    const cleanupsDone = activities.length;

    // Calculate by severity per scanned repo
    let healthy = 0;
    let warnings = 0;
    let critical = 0;

    activities.forEach((activity) => {
      const issues = activity.issues;

      const hasCritical = issues.some((i) => i.severity === "Critical");
      const hasMedium = issues.some((i) => i.severity === "Medium");

      if (hasCritical) {
        critical++;
      } else if (hasMedium) {
        warnings++;
      } else {
        healthy++;
      }
    });

    const recentActivity = activities.slice(0, 5).map((act) => ({
      type: act.scanType,
      file: act.repoName,
      timeAgo: timeSince(act.createdAt),
      status:
        act.issues.some(i => i.severity === "Critical")
          ? "danger"
          : act.issues.some(i => i.severity === "Medium")
          ? "warning"
          : "success",
    }));

    res.status(200).json({
      totalRepos,
      cleanupsDone,
      warnings,
      criticalIssues: critical,
      recentActivity,
      repoHealth: {
        healthy,
        warnings,
        critical,
      },
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
};

const timeSince = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.floor(minutes)} minutes ago`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)} hours ago`;
  const days = hours / 24;
  return `${Math.floor(days)} days ago`;
};

module.exports = { getDashboardSummary };
