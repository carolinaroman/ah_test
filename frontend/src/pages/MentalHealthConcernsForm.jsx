import React from "react";
import { Field, Form, useFormikContext } from "formik";
import { useNavigate } from "react-router-dom";

import FormNavigation from "@/components/FormNavigationButtons.jsx";
import ProgressBar from "@/components/ProgressBar.jsx";
import { concernsMapping } from "shared";

/**
 * Step 2
 *
 * Form component for selecting mental health concerns using checkboxes
 *
 * @returns {JSX.Element} Form with mental health concerns checkboxes
 */
const MentalHealthConcernsForm = () => {
  const navigate = useNavigate();
  const { values, isSubmitting, setValues, setFieldValue
  } = useFormikContext();

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

      {Object.keys(concernsMapping).map((concern) => (
        <div key={concern} className="relative group">
          <div className="flex items-center space-x-3">
            <Field
              type="checkbox"
              name={`concerns.${concern}`}  // Namespace the field
              id={concern}
              checked={values.concerns?.[concern] || false}  // Control the checked state
              onChange={async (e) => {
                await setFieldValue(`concerns.${concern}`, e.target.checked);
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor={concern}
              className="text-gray-700 font-medium capitalize"
            >
              {concern}
            </label>

            {/* Info icon with tooltip */}
            <div className="relative group">
              <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs cursor-help">
                i
              </div>

              {/* Tooltip positioned to the right of the icon */}
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block z-10">
                <div className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  {concernsMapping[concern].join(", ")}
                  {/* Arrow pointing left */}
                  <div className="absolute top-1/2 right-full -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
                </div>
              </div>

            </div>

          </div>
        </div>
      ))}

      <FormNavigation isSubmitting={isSubmitting} />
    </Form>
  );
};

export default MentalHealthConcernsForm;
