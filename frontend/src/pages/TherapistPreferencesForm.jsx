import React from "react";
import { Field, Form, useFormikContext } from "formik";
import { useNavigate } from "react-router-dom";

import FormNavigation from "@/components/FormNavigationButtons.jsx";
import ProgressBar from "@/components/ProgressBar.jsx";
import {gender, ethnicIdentities, languages, religion} from "shared";

/**
 * Step 3
 *
 * Form component collecting therapist preferences. Allows patients
 * to select their preferred therapist characteristics including gender,
 * ethnicity, and religious background.
 *
 * @returns {JSX.Element} A form with radio button groups for therapist preferences
 *
 * @throws {Error} If there's an error updating form values during submission
 */
const TherapistPreferencesForm = () => {
  const navigate = useNavigate();

  const { values, isSubmitting, setValues } = useFormikContext();

  // ToDo: it would be better to allow things like
  //       religion: muslim OR jewish
  //       in other words not all options are radios
  /**
   * Handles form progression, saving current values in
   * Formik context before navigate to Therapy preferences form
   *
   * @param {React.FormEvent} e - The form submission event
   * @returns {Promise<void>}
   */
  const handleNext = async (e) => {
    e.preventDefault();
    try {
      await setValues(values, true);
      navigate("/form/therapy-preferences");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form className="p-6" onSubmit={handleNext}>
      {/* Show current step */}
      <ProgressBar currentStep={3} />

      <h1 className="title text-2xl font-bold mb-6">Therapist Preferences</h1>

      <p className="mb-4">Please select your preferences for each category.</p>

      <div className="space-y-6">
        {/* Gender Preferences */}
        <div>
          <h3 className="font-medium mb-2">Preferred Gender:</h3>
          <div className="space-y-2">
            {gender.map((option) => (
              <div key={option} className="flex items-center space-x-3">
                <Field
                  type="radio"
                  name="gender preference"
                  value={option}
                  id={`gender_${option}`}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor={`gender_${option}`}
                  className="text-gray-700 capitalize"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Language Preferences */}
        <div>
          <h3 className="font-medium mb-2">Preferred Language:</h3>
          <div className="space-y-2">
            {languages.map((option) => (
              <div key={option} className="flex items-center space-x-3">
                <Field
                  type="radio"
                  name="language preference"
                  value={option}
                  id={`language_${option}`}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor={`language_${option}`}
                  className="text-gray-700 capitalize"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Ethnicity Preferences */}
        <div>
          <h3 className="font-medium mb-2">Preferred Ethnicity:</h3>
          <div className="space-y-2">
            {ethnicIdentities.map((option) => (
              <div key={option} className="flex items-center space-x-3">
                <Field
                  type="radio"
                  name="ethnicity preference"
                  value={option}
                  id={`ethnicity_${option}`}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor={`ethnicity_${option}`}
                  className="text-gray-700 capitalize"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Religious Preferences */}
        <div>
          <h3 className="font-medium mb-2">Preferred Religious Background:</h3>
          <div className="space-y-2">
            {religion.map((option) => (
              <div key={option} className="flex items-center space-x-3">
                <Field
                  type="radio"
                  name="religion preference"
                  value={option}
                  id={`religion_${option}`}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor={`religion_${option}`}
                  className="text-gray-700 capitalize"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FormNavigation isSubmitting={isSubmitting} />
    </Form>
  );
};

export default TherapistPreferencesForm;
