
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ThankYou = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Thank you for applying!
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-light">
            We will get back to you shortly.
          </p>
        </div>
        
        <div className="pt-8">
          <Button 
            onClick={handleGoHome}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
