
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  const handleApplyNow = () => {
    navigate("/roles");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold text-gray-800 tracking-wide">
            MREATIVES
          </h1>
          <h2 className="text-2xl md:text-3xl text-gray-600 font-light">
            We're Hiring.
          </h2>
        </div>
        
        <div className="pt-8">
          <Button 
            onClick={handleApplyNow}
            className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-6 text-xl font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
