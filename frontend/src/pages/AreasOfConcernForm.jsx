import React from "react";
import { Field, Form, useFormikContext } from "formik";
import { useNavigate } from "react-router-dom";

import FormNavigation from "@/components/FormNavigationButtons.jsx";
import ProgressBar from "@/components/ProgressBar.jsx";

/**
 * Step 2
 *
 * Form component for selecting mental health concerns using checkboxes
 *
 * @returns {JSX.Element} Form with mental health concerns checkboxes
 */
const MentalHealthConcerns = () => {
  const navigate = useNavigate();
  const { values, isSubmitting, setValues } = useFormikContext();

  // Array of elements to be made into checkboxes
  // so patients can select multiple
  const concerns = [
    "academic_stress",
    "anxiety",
    "depression",
    "insomnia",
    "racial_identity_issues",
    "trauma_related_stress",
    "work_related_stress",
  ];

  /**
   * Handles form progression, saving current values in
   * Formik context before navigate to Therapist preferences form
   *
   * @param {React.FormEvent} e - The form submission event
   * @returns {Promise<void>}
   */
  const handleNext = async (e) => {
    e.preventDefault();
    try {
      await setValues(values, true);
      navigate("/form/therapist-preferences");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form className="p-6" onSubmit={handleNext}>
      {/* Show current step */}
      <ProgressBar currentStep={2} />

      <h1 className="title text-2xl font-bold mb-6">
        What are your main concerns?
      </h1>
      <p>Please select all that apply to you.</p>

      {concerns.map((concern) => (
        <div key={concern} className="flex items-center space-x-3">
          <Field
            type="checkbox"
            name={concern}
            id={concern}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor={concern} className="text-gray-700 font-medium">
            {concern.charAt(0).toUpperCase() + concern.slice(1)}
          </label>
        </div>
      ))}

      <FormNavigation isSubmitting={isSubmitting} />
    </Form>
  );
};

export default MentalHealthConcerns;
