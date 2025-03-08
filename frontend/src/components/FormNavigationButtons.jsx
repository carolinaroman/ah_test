import {useNavigate} from "react-router-dom";

/**
 * Component for navigation buttons in form steps

 * @param {Object} props - Component props
 * @param {boolean} props.isSubmitting - Flag indicating if form is currently submitting
 *
 * @returns {JSX.Element} Navigation buttons row with Previous and Next buttons
 */
const FormNavigation = ({ isSubmitting }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between mt-6">
      <button
        type="button"
        className="btn-secondary py-2 px-6 bg-gray-100 hover:bg-gray-200 rounded-md"
        onClick={() => navigate(-1)}
      >
        &larr; Previous
      </button>
      <button
        type="submit"
        className="btn-submit"
        disabled={isSubmitting}
      >
        Next &rarr;
      </button>
    </div>
  );
};

export default FormNavigation;