import { Button } from "../ui/button";
import FormControls from "./form-controls";

function CommonForm({
  handleSubmit,
  buttonText,
  formControls = [],
  formData,
  setFormData,
  isButtonDisabled = false,
  showPassword,
  setShowPassword,
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormControls
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
      <Button 
        disabled={isButtonDisabled} 
        type="submit" 
        className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
