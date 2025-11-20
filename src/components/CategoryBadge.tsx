import React from "react";
import type { Category } from "../types";
import "../styles/CategoryBadge.css";

interface CategoryBadgeProps {
  category: Category;
  size?: "small" | "medium" | "large";
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = "medium",
}) => {
  const getCategoryIcon = (category: Category): string => {
    switch (category) {
      case "WORK":
        return "💼";
      case "PERSONAL":
        return "👤";
      case "SHOPPING":
        return "🛒";
      case "HEALTH":
        return "❤️";
      case "FINANCE":
        return "💰";
      case "EDUCATION":
        return "📚";
      case "OTHER":
        return "📌";
      default:
        return "📌";
    }
  };

  const getCategoryLabel = (category: Category): string => {
    return category.charAt(0) + category.slice(1).toLowerCase();
  };

  return (
    <span className={`category-badge category-${size}`}>
      <span className="category-icon">{getCategoryIcon(category)}</span>
      <span className="category-label">{getCategoryLabel(category)}</span>
    </span>
  );
};

export default CategoryBadge;
