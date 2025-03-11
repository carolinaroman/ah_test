import React, { useEffect } from "react";
import { Formik } from "formik";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import AboutTherapyForm from "@/pages/TherapyPreferenceForm.jsx";
import AreasOfConcern from "@/pages/MentalHealthConcernsForm.jsx";
import PaymentMethodForm from "@/pages/PaymentMethodForm.jsx";
import PersonalInfoForm from "@/pages/PersonalInfoForm.jsx";
import TherapistPreferencesForm from "@/pages/TherapistPreferencesForm.jsx";
import { submitFormData } from "@/apiService/apiService.js";

/**
 * Formik main form component, handling routing between steps, and
 * using our form context to maintain data state
 *
 * @returns {JSX.Element} Multi-step form with configured routes
 */
const WizardForm = () => {
  const navigate = useNavigate();

  // All questions in our form
  const initialValues = {
    email: "",
    name: "",
    state: "",
    language: "",

    // From concernsMapping
    "ADHD & Autism": false,
    "Anxiety, Panic & Worry": false,
    "Behavioral Health": false,
    "Cultural & Identity": false,
    "Depression & Mood Disorders": false,
    "Grief & Loss": false,
    "Mental Health Conditions": false,
    "Relationships & Social": false,
    "Trauma & PTSD": false,
    "Work & Life Challenges": false,

    // From flat arrays
    gender: "",
    ethnicity: "",
    religion: "",

    // From therapyTypes
    "Behavioral & Motivational": false,
    "Cognitive Behavioral Approaches": false,
    "Creative & Narrative": false,
    "Psychodynamic & Person-Centered": false,
    "Relationship & Family": false,
    "Trauma & EMDR": false,

    "payment method": "",
  };

  const savedFormData = location.state?.startFresh
    ? initialValues
    : JSON.parse(localStorage.getItem("formData")) || initialValues;

  /**
   * Handle submission of form values to backend. It also sets
   * backend response in LocalStorage and redirects to results page
   *
   * @param values
   * @return {Promise<void>}
   */
  const handleSubmit = async (values) => {
    if (location.pathname !== "/form/payment-method") {
      return;
    }

    try {
      const data = await submitFormData(values);
      console.log("Form submission successful! Response data:", data);

      // Assuming the backend returns some data with an ID or path to redirect to
      // You can store the response data in localStorage if needed
      localStorage.setItem("formResponse", JSON.stringify(data));

      // Redirect to results page
      // navigate("/matches");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <Formik initialValues={savedFormData} onSubmit={handleSubmit}>
        {(formikProps) => {
          // Save current values on localStorage, so we
          // won't lose anything on reload
          useEffect(() => {
            localStorage.setItem(
              "formData",
              JSON.stringify(formikProps.values),
            );
          }, [formikProps.values]);

          return (
            <div>
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/form/personal-info" replace />}
                />
                <Route
                  path="personal-info"
                  element={<PersonalInfoForm {...formikProps} />}
                />
                <Route
                  path="areas-of-concern"
                  element={<AreasOfConcern {...formikProps} />}
                />
                <Route
                  path="therapist-preferences"
                  element={<TherapistPreferencesForm {...formikProps} />}
                />
                <Route
                  path="therapy-preferences"
                  element={<AboutTherapyForm {...formikProps} />}
                />

                <Route
                  path="payment-method"
                  element={<PaymentMethodForm {...formikProps} />}
                />
              </Routes>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

export default WizardForm;
