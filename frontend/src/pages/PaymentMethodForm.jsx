import React from "react";
import { Field, Form, useFormikContext } from "formik";

import FormNavigation from "@/components/FormNavigationButtons.jsx";
import ProgressBar from "@/components/ProgressBar.jsx";
import {insurances} from "shared";

/**
 * Step 5
 *
 * Form component for selecting payment method using radios
 *
 * returns {JSX.Element} A form with payment options as radios
 */
const PaymentMethodForm = () => {
  const { isSubmitting } = useFormikContext();

   return (
    <Form className="p-6">
      {/* Show current step */}
      <ProgressBar currentStep={5} />

      <h1 className="title text-2xl font-bold mb-6">
        How would you like to pay for therapy?
      </h1>

      <p className="mb-4">Please select your preferred payment method.</p>

      <div className="space-y-4">
        {insurances.map((option) => (
          <div key={option} className="flex items-center space-x-3">
            <Field
              type="radio"
              name="payment method"
              id={option}
              value={option}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor={option} className="text-gray-700 font-medium">
              {option}
            </label>
          </div>
        ))}
      </div>

      <FormNavigation isSubmitting={isSubmitting} />
    </Form>
  );
};

export default PaymentMethodForm;
