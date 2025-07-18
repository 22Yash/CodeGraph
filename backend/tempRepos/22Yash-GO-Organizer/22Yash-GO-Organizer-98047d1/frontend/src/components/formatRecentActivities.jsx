import { CheckCircle, AlertTriangle, Clock } from "lucide-react";

export const formatRecentActivities = (activities = []) => {
  return activities.map((act) => {
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
  });
};
