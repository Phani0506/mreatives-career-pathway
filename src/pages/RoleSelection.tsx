
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    "Graphic Designer",
    "Social Media Manager / Marketer",
    "ADs Executive",
    "Production Executive",
    "Intern"
  ];

  const handleRoleSelect = (role: string) => {
    navigate(`/apply?role=${encodeURIComponent(role)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="text-center space-y-8 max-w-md w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12">
          Choose Your Path
        </h1>
        
        <div className="space-y-4">
          {roles.map((role, index) => (
            <Button
              key={index}
              onClick={() => handleRoleSelect(role)}
              className="w-full bg-white hover:bg-blue-50 text-gray-800 border-2 border-blue-200 hover:border-blue-400 py-4 text-lg font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              variant="outline"
            >
              {role}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
