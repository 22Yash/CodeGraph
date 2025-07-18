import React from "react";

const RecentActivityCard = ({ activity }) => {
  const IconComponent = activity.icon;
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150">
      <IconComponent className={`w-5 h-5 ${activity.color} mt-0.5`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-900">{activity.title}</span>
          <span className="text-gray-500">-</span>
          <span className="font-mono text-sm text-gray-700">{activity.subtitle}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">({activity.time})</p>
      </div>
    </div>
  );
};

export default RecentActivityCard;
