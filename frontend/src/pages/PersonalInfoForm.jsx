import React from "react";
import { ErrorMessage, Field, Form, useFormikContext } from "formik";
import { useNavigate } from "react-router-dom";

import FormNavigation from "@/components/FormNavigationButtons.jsx";
import ProgressBar from "@/components/ProgressBar.jsx";
import usStates from "@/utils/usStates.json";

/**
 * Step 1
 *
 * Form component for collecting user's personal information including email, name, state, and background
 *
 * @returns {JSX.Element} A form with personal information fields and navigation buttons
 */
const PersonalInfoForm = () => {
  const navigate = useNavigate();
  const { values, isSubmitting, setValues } = useFormikContext();

  const { states } = usStates;

  /**
   * Handles form progression, saving current values in
   * Formik context before navigate to Areas of Concern form
   *
   * @param {React.FormEvent} e - The form submission event
   * @returns {Promise<void>}
   */
  const handleNext = async (e) => {
    e.preventDefault();
    try {
      await setValues(values, true);
      navigate("/form/areas-of-concern");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form className="p-6" onSubmit={handleNext}>
      {/* Show current step */}
      <ProgressBar currentStep={1} />
      <h1 className="title">Tell us about you</h1>

      {/* Ask email to create account after matching or to send results*/}
      <div className="space-y-1">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <Field
          type="email"
          name="email"
          placeholder="Enter your email"
          className="formInputField"
        />
        <ErrorMessage
          name="email"
          component="div"
          className="formErrorMessage"
        />
      </div>

      {/* Now their names */}
      <div className="space-y-1">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Your Name
        </label>
        <Field
          type="text"
          name="name"
          placeholder="Enter Your Name"
          className="formInputField"
        />
        <ErrorMessage
          name="name"
          component="div"
          className="formErrorMessage"
        />
      </div>

      {/* Ask for contexts to filter providers to those licensed here */}
      <div className="space-y-1">
        <label
          htmlFor="state"
          className="block text-sm font-medium text-gray-700"
        >
          Your state of residence
        </label>
        <Field as="select" name="state" className="formInputField">
          <option value="">Select your state</option>
          {states.map((state) => (
            <option key={state.value} value={state.value}>
              {state.label}
            </option>
          ))}
        </Field>
        <ErrorMessage
          name="state"
          component="div"
          className="formErrorMessage"
        />
      </div>

      {/* Any other information that could be relevant */}
      <div className="space-y-1 mt-4">
        <label
          htmlFor="background"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Optional: Share any background information that might help us match
          you with the right therapist
        </label>
        <Field
          as="textarea"
          id="background"
          name="background"
          placeholder="e.g., Japanese, Christian, married"
          rows={2}
          className="formInputField"
        />
        <ErrorMessage
          name="background"
          component="div"
          className="formErrorMessage"
        />
      </div>

      <FormNavigation isSubmitting={isSubmitting} />

    </Form>
  );
};

export default PersonalInfoForm;
