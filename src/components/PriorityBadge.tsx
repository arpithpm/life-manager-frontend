import React from "react";
import type { Priority } from "../types";
import "../styles/PriorityBadge.css";

interface PriorityBadgeProps {
  priority: Priority;
  size?: "small" | "medium" | "large";
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = "medium",
}) => {
  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case "HIGH":
        return "priority-high";
      case "MEDIUM":
        return "priority-medium";
      case "LOW":
        return "priority-low";
      default:
        return "priority-medium";
    }
  };

  const getPriorityLabel = (priority: Priority): string => {
    return priority.charAt(0) + priority.slice(1).toLowerCase();
  };

  return (
    <span
      className={`priority-badge ${getPriorityColor(
        priority
      )} priority-${size}`}
    >
      {getPriorityLabel(priority)}
    </span>
  );
};

export default PriorityBadge;
