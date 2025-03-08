import React from "react";

/**
 * Pretty progress bar component, showing the current step in a multi-step form.
 * Displays six steps with their labels and highlights the current and completed
 * steps in blue.
 *
 * For this test, it will have the steps hardcoded. For a more flexible solution,
 * the component should accept an array of steps
 *
 * @component
 * @param {number} currentStep - Current step number (1-6)
 *
 * @returns {JSX.Element} A progress bar with step labels
 *
 * @example
 * // Using the ProgressBar in a form component
 * <ProgressBar currentStep={3} />
 */
const ProgressBar = ({ currentStep }) => {
  const steps = [
    "Personal Info",
    "Areas of Concern",
    "About Therapy",
    "Therapist Preferences",
    "Payment",
    "Review"
  ];

  return (
    <div className="mb-8">
      <div className="flex w-full gap-1">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 ${
              index <= currentStep - 1 ? "bg-blue-600" : "bg-gray-200"
            } transition-all duration-300`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col items-center w-1/6 relative ${
              index === currentStep - 1 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div className="text-xs text-center">{step}</div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ProgressBar;
