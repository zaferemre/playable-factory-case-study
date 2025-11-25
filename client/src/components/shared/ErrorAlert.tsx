import { AlertCircle } from "lucide-react";

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

export default function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <div className="rounded-lg bg-red-50 border border-red-200 p-4 dark:bg-red-900/30 dark:border-red-500/40">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
        <p className="text-red-700 dark:text-red-100 text-sm flex-1">
          {message}
        </p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-600 ml-2"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
