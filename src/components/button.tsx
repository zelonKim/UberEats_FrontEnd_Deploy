import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
  disabled?: boolean;
}

export const Button: React.FC<IButtonProps> = ({
  disabled = false,
  canClick,
  loading,
  actionText,
}) => (
  <button
    role="button"
    className={`w-4/5 ml-16 rounded-md text-lg font-medium focus:outline-none text-white py-4  transition-colors ${
      canClick && !disabled
        ? "bg-lime-600 hover:bg-lime-700"
        : "bg-gray-300 hover:bg-gray-400 "
    }`}
    disabled={disabled}
  >
    {loading ? (
      <FontAwesomeIcon icon={faSpinner} className="text-sm animate-spin" />
    ) : (
      actionText
    )}
  </button>
);
