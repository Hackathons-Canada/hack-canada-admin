type ActionType = "create" | "view" | "update" | "delete" | string;

interface ActionBadgeProps {
  action: ActionType;
}

export function ActionBadge({ action }: ActionBadgeProps) {
  const getActionStyles = (action: ActionType) => {
    switch (action) {
      case "create":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "update":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "delete":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-medium ${getActionStyles(
        action,
      )}`}
    >
      {action}
    </span>
  );
}
