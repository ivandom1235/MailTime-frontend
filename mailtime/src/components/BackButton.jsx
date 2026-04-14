import { useNavigate } from "react-router-dom";
import "../pages/styles/back-button.css";

function BackButton({ fallbackPath = "/login" }) {
  const navigate = useNavigate();

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallbackPath);
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className="back-button"
    >
      <span className="back-button__icon">&larr;</span>
      Back
    </button>
  );
}

export default BackButton;
