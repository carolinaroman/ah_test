import ky from "ky";

/**
 * Submits the intake form data to the backend API
 *
 * @param {Object} formData - The complete intake form data containing:
 * @param {string} formData.email - User's email address
 * @param {string} formData.name - User's full name
 * @param {string} formData.state - User's state
 * @param {string} formData.background - User's background information
 * @param {boolean} formData.anxiety - Whether anxiety is selected
 * @param {boolean} formData.depression - Whether depression is selected
 * @param {boolean} formData.racial_identity_related_issues - Whether racial identity issues are selected
 * @param {boolean} formData.academic_stress - Whether academic stress is selected
 * @param {boolean} formData.Trauma_related_stress - Whether trauma-related stress is selected
 * @param {boolean} formData.Work_related_stress - Whether work-related stress is selected
 * @param {boolean} formData.insomnia - Whether insomnia is selected
 * @param {string} formData.gender - Preferred therapist gender or "no_preference"
 * @param {string} formData.ethnicity - Preferred therapist ethnicity or "no_preference"
 * @param {string} formData.religion - Preferred therapist religion or "no_preference"
 * @param {boolean} formData.cognitive_behavioral_therapy_cbt - Whether CBT is selected
 * @param {boolean} formData.dialectical_behavior_therapy_dbt - Whether DBT is selected
 * @param {boolean} formData.acceptance_and_commitment_therapy_act - Whether ACT is selected
 * @param {boolean} formData.eye_movement_desensitization_and_reprocessing_emdr - Whether EMDR is selected
 * @param {string} formData.paymentMethod - Selected payment method
 *
 * @returns {Promise<Object>} The API response containing the submission result
 * @throws {Error} If the network request fails or server returns an error
 */
export const submitFormData = async (formData) => {
  const apiUrl = import.meta.env.VITE_VERCEL_URL;

  console.log(apiUrl);
  try {
    return await ky
      .post(`${apiUrl}/matches`, {
        headers: {
          "x-api-key": import.meta.env.VITE_ANISE_API_KEY,
        },
        json: formData,
      })
      .json();
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};
