import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * This component renders the landing page with a welcome message and a "Get Started" button
 * that navigates to the form page.
 *
 * @component
 *
 * @returns {JSX.Element} A welcome page with centered content and a call-to-action button
 */
const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    localStorage.removeItem("formData");

    // Use location.state to define a variable to indicate
    // we need to reset Formik values and localStorage
    navigate("/form", { state: { startFresh: true } });
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8">
      <h1 className="title">Welcome!</h1>

      <p className="text-lg text-gray-700">
        Share a few details with us, and we'll connect you with the right
        healthcare provider for your needs.
      </p>

      <button onClick={handleGetStarted} className="btn-submit">
        Get Started
      </button>
    </div>
  );
};

export default Home;
