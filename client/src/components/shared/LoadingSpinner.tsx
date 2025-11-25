interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  color?: string;
}

export default function LoadingSpinner({
  size = "md",
  message = "Loading...",
  color = "border-red-500",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 ${color}`}
      ></div>
      {message && (
        <span className="ml-3 text-gray-600 dark:text-gray-400">{message}</span>
      )}
    </div>
  );
}
