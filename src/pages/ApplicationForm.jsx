
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ApplicationForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const selectedRole = searchParams.get("role") || "Unknown Role";

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    expectedSalary: "",
    hasLaptop: "",
    hasAgencyExperience: "",
    currentCity: "",
    willingToRelocate: "",
    resume: null,
    portfolioLink: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedRole || selectedRole === "Unknown Role") {
      navigate("/roles");
    }
  }, [selectedRole, navigate]);

  // Helper function to get the correct table name and bucket based on role
  const getRoleConfig = (role) => {
    const roleConfigs = {
      "Graphic Designer": {
        tableName: "graphic_designer_applications",
        bucketName: "graphic-designer-resumes"
      },
      "Social Media Manager / Marketer": {
        tableName: "social_media_manager_applications",
        bucketName: "social-media-manager-resumes"
      },
      "ADs Executive": {
        tableName: "ads_executive_applications",
        bucketName: "ads-executive-resumes"
      },
      "Production Executive": {
        tableName: "production_executive_applications",
        bucketName: "production-executive-resumes"
      },
      "Intern": {
        tableName: "intern_applications",
        bucketName: "intern-resumes"
      }
    };

    return roleConfigs[role] || {
      tableName: "intern_applications",
      bucketName: "intern-resumes"
    };
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOC, or DOCX file.",
          variant: "destructive",
        });
        return;
      }
      
      setFormData(prev => ({ ...prev, resume: file }));
      if (errors.resume) {
        setErrors(prev => ({ ...prev, resume: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.expectedSalary.trim()) newErrors.expectedSalary = "Expected salary is required";
    if (!formData.hasLaptop) newErrors.hasLaptop = "Please select an option";
    if (!formData.hasAgencyExperience) newErrors.hasAgencyExperience = "Please select an option";
    if (!formData.currentCity.trim()) newErrors.currentCity = "Current city is required";
    if (!formData.willingToRelocate) newErrors.willingToRelocate = "Please select an option";
    if (!formData.resume) newErrors.resume = "Resume is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone number validation (basic)
    if (formData.phoneNumber && formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadResume = async (file, bucketName) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log("Uploading resume to bucket:", bucketName, "with filename:", fileName);

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (uploadError) {
      console.error("Resume upload error:", uploadError);
      throw uploadError;
    }

    return filePath;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Some required fields are missing or invalid.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Starting form submission for role:", selectedRole);
      
      const roleConfig = getRoleConfig(selectedRole);
      console.log("Using role config:", roleConfig);
      
      // Upload resume file
      let resumeFilePath = null;
      if (formData.resume) {
        console.log("Uploading resume file...");
        resumeFilePath = await uploadResume(formData.resume, roleConfig.bucketName);
        console.log("Resume uploaded successfully:", resumeFilePath);
      }

      // Prepare application data
      const applicationData = {
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        email: formData.email,
        expected_salary: parseInt(formData.expectedSalary),
        has_laptop: formData.hasLaptop === 'yes',
        has_agency_experience: formData.hasAgencyExperience === 'yes',
        current_city: formData.currentCity,
        willing_to_relocate: formData.willingToRelocate === 'yes',
        resume_file_path: resumeFilePath,
        portfolio_link: formData.portfolioLink || null
      };

      console.log("Inserting application data into table:", roleConfig.tableName);
      console.log("Application data:", applicationData);

      // Insert application data into the role-specific table
      const { data, error } = await supabase
        .from(roleConfig.tableName)
        .insert([applicationData])
        .select();

      if (error) {
        console.error("Database insertion error:", error);
        throw error;
      }

      console.log("Application submitted successfully:", data);

      toast({
        title: "Application submitted successfully!",
        description: "We will review your application and get back to you soon.",
      });

      navigate("/thank-you");
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission failed",
        description: error.message || "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviousPage = () => {
    navigate("/roles");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={handlePreviousPage}
            variant="outline"
            className="flex items-center gap-2 bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-400"
          >
            <ArrowLeft size={16} />
            Previous
          </Button>
          
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="flex items-center gap-2 bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-400"
          >
            <Home size={16} />
            Home
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Applying for: {selectedRole}
          </h1>
          <p className="text-gray-600 text-lg">Please fill out the form below.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              className={errors.phoneNumber ? "border-red-500" : ""}
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email ID *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedSalary">Expected Salary (per month) *</Label>
            <Input
              id="expectedSalary"
              type="number"
              value={formData.expectedSalary}
              onChange={(e) => handleInputChange("expectedSalary", e.target.value)}
              className={errors.expectedSalary ? "border-red-500" : ""}
            />
            {errors.expectedSalary && <p className="text-red-500 text-sm">{errors.expectedSalary}</p>}
          </div>

          <div className="space-y-3">
            <Label>Do you own a laptop/desktop suitable for work? *</Label>
            <RadioGroup
              value={formData.hasLaptop}
              onValueChange={(value) => handleInputChange("hasLaptop", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="laptop-yes" />
                <Label htmlFor="laptop-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="laptop-no" />
                <Label htmlFor="laptop-no">No</Label>
              </div>
            </RadioGroup>
            {errors.hasLaptop && <p className="text-red-500 text-sm">{errors.hasLaptop}</p>}
          </div>

          <div className="space-y-3">
            <Label>Have you worked with a social media agency before? *</Label>
            <RadioGroup
              value={formData.hasAgencyExperience}
              onValueChange={(value) => handleInputChange("hasAgencyExperience", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="agency-yes" />
                <Label htmlFor="agency-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="agency-no" />
                <Label htmlFor="agency-no">No</Label>
              </div>
            </RadioGroup>
            {errors.hasAgencyExperience && <p className="text-red-500 text-sm">{errors.hasAgencyExperience}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentCity">Current City *</Label>
            <Input
              id="currentCity"
              type="text"
              value={formData.currentCity}
              onChange={(e) => handleInputChange("currentCity", e.target.value)}
              className={errors.currentCity ? "border-red-500" : ""}
            />
            {errors.currentCity && <p className="text-red-500 text-sm">{errors.currentCity}</p>}
          </div>

          <div className="space-y-3">
            <Label>Are you willing to relocate to Hyderabad? *</Label>
            <RadioGroup
              value={formData.willingToRelocate}
              onValueChange={(value) => handleInputChange("willingToRelocate", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="relocate-yes" />
                <Label htmlFor="relocate-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="relocate-no" />
                <Label htmlFor="relocate-no">No</Label>
              </div>
            </RadioGroup>
            {errors.willingToRelocate && <p className="text-red-500 text-sm">{errors.willingToRelocate}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume">Upload Your Resume *</Label>
            <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className={errors.resume ? "border-red-500" : ""}
            />
            {errors.resume && <p className="text-red-500 text-sm">{errors.resume}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolioLink">Portfolio Link</Label>
            <Input
              id="portfolioLink"
              type="url"
              placeholder="https://... or type N/A"
              value={formData.portfolioLink}
              onChange={(e) => handleInputChange("portfolioLink", e.target.value)}
            />
          </div>

          <div className="pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
