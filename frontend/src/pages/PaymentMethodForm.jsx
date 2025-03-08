import React from "react";
import { Field, Form, useFormikContext } from "formik";

import FormNavigation from "@/components/FormNavigationButtons.jsx";
import ProgressBar from "@/components/ProgressBar.jsx";

/**
 * Step 5
 *
 * Form component for selecting payment method using radios
 *
 * returns {JSX.Element} A form with payment options as radios
 */
const PaymentMethodForm = () => {
  const { values, isSubmitting, setValues } = useFormikContext();

  // Array of payment options, to be displayed as
  // radios so the patient can only select one
  const paymentOptions = [
    { id: "aetna", label: "Aetna Insurance" },
    { id: "magellan", label: "Magellan Healthcare" },
    { id: "anthem", label: "Anthem Blue Cross" },
    { id: "self_pay", label: "Self-pay" },
  ];

  return (
    <Form className="p-6">
      {/* Show current step */}
      <ProgressBar currentStep={5} />

      <h1 className="title text-2xl font-bold mb-6">
        How would you like to pay for therapy?
      </h1>

      <p className="mb-4">Please select your preferred payment method.</p>

      <div className="space-y-4">
        {paymentOptions.map((option) => (
          <div key={option.id} className="flex items-center space-x-3">
            <Field
              type="radio"
              name="paymentMethod"
              id={option.id}
              value={option.id}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor={option.id} className="text-gray-700 font-medium">
              {option.label}
            </label>
          </div>
        ))}
      </div>

      {values.paymentMethod === "self_pay" && (
        <p className="mt-4 text-sm text-gray-600">
          Self-pay options provide flexibility and privacy. We'll discuss rates
          with your matched therapist.
        </p>
      )}

      <FormNavigation isSubmitting={isSubmitting} />
    </Form>
  );
};

export default PaymentMethodForm;
