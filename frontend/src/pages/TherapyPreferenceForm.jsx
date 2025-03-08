import React from "react";
import { Field, Form, useFormikContext } from "formik";
import { useNavigate } from "react-router-dom";

import FormNavigation from "@/components/FormNavigationButtons.jsx";
import ProgressBar from "@/components/ProgressBar.jsx";

/**
 * Step 4
 *
 * Form component for selecting therapy types preferences.
 *
 * @returns {JSX.Element} A form with therapy type selection checkboxes
 */
const TherapyPreferenceForm = () => {
  const navigate = useNavigate();
  const { values, isSubmitting, setValues } = useFormikContext();

  // Array of therapy modalities, allowing patients
  // to select only multiple ones
  const therapyTypes = [
    "cognitive behavioral therapy (cbt)",
    "dialectical behavior therapy (dbt)",
    "acceptance and commitment therapy (act)",
    "eye movement desensitization and reprocessing (emdr)",
  ];

  /**
   * Handles form progression, saving current values in
   * Formik context before navigate to the Payment method form
   *
   * @param {React.FormEvent} e - The form submission event
   * @returns {Promise<void>}
   */
  const handleNext = async (e) => {
    e.preventDefault();
    try {
      await setValues(values, true);
      navigate("/form/payment-method");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form className="p-6" onSubmit={handleNext}>
      {/* Show current step */}
      <ProgressBar currentStep={4} />

      <h1 className="title text-2xl font-bold mb-6">
        What type of therapy are you interested in?
      </h1>

      <p className="mb-4">Please select all that interest you.</p>

      {therapyTypes.map((therapy) => (
        <div key={therapy} className="flex items-center space-x-3 mb-3">
          <Field
            type="checkbox"
            name={therapy}
            id={therapy}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor={therapy} className="text-gray-700 font-medium capitalize">
            {therapy}
          </label>
        </div>
      ))}

      <FormNavigation isSubmitting={isSubmitting} />
    </Form>
  );
};

export default TherapyPreferenceForm;
