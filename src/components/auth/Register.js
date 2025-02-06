import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Register() {
  const [isAngler, setIsAngler] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Added successMessage state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    dateOfBirth: null,
    mobileNumber: "",
    complexName: "",
    agreeToTerms: false,
  });

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevState) => ({
      ...prevState,
      dateOfBirth: date,
    }));
  };

  const validateForm = () => {
    // console.log('Validating form data:', formData);
    const requiredFields = [
      "email",
      "password",
      "firstName",
      "lastName",
      "mobileNumber",
    ];
    if (!isAngler) {
      requiredFields.push("complexName");
    }

    for (let field of requiredFields) {
      if (!formData[field]) {
        console.log(
          `Field ${field} is empty or undefined. Value:`,
          formData[field]
        );
        setErrorMessage(
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        );
        return false;
      }
    }

    if (isAngler && !formData.dateOfBirth) {
      console.log("Date of Birth is empty");
      setErrorMessage("Date of Birth is required");
      return false;
    }

    // console.log('Form validation passed');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('handleSubmit called. isAngler:', isAngler, 'formData:', formData);
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.agreeToTerms) {
      setErrorMessage("You must agree to the terms and conditions");
      return;
    }

    // console.log('Form data before validation:', formData);

    if (!validateForm()) {
      return;
    }

    try {
      const userType = isAngler ? "angler" : "lakeOwner";

      const registrationData = {
        ...formData,
        userType,
      };

      // console.log('Attempting to register with data:', registrationData);
      const response = await register(registrationData);

      console.log("Registration response:", response);
      setSuccessMessage("Registration successful! Redirecting to dashboard...");

      // Redirect based on user type
      setTimeout(() => {
        if (userType === "angler") {
          navigate("/angler-dashboard");
        } else {
          navigate("/lake-owner-dashboard");
        }
      }, 2000);
    } catch (error) {
      console.error("Registration failed:", error);
      if (error.response?.data?.message) {
        setErrorMessage(`Registration failed: ${error.response.data.message}`);
      } else if (error.response) {
        setErrorMessage(
          "Registration failed. Please check your information and try again."
        );
      } else if (error.request) {
        setErrorMessage("No response from server. Please try again later.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  if (!showForm) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Choose Registration Type
          </h2>
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => {
                setIsAngler(true);
                setShowForm(true);
              }}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#ae7a31] hover:bg-[#8e6429] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ae7a31]"
            >
              Register as Angler
            </button>
            <button
              onClick={() => {
                setIsAngler(false);
                setShowForm(true);
              }}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#ae7a31] hover:bg-[#8e6429] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ae7a31]"
            >
              Register as Lake Owner
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register as {isAngler ? "Angler" : "Lake Owner"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {errorMessage && (
            <div
              className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {errorMessage}</span>
            </div>
          )}
          {successMessage && ( // Added success message display
            <div
              className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline"> {successMessage}</span>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#ae7a31] focus:border-[#ae7a31] sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#ae7a31] focus:border-[#ae7a31] sm:text-sm"
              />
            </div>
            {isAngler && (
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date of Birth(dd/MM/yyyy)
                </label>
                <DatePicker
                  selected={formData.dateOfBirth}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  showYearDropdown
                  scrollableYearDropdown
                  maxDate={new Date("2010-01-01")} // Sets max date to current date
                  minDate={new Date("1950-01-01")} // Optional: Sets minimum date
                  yearDropdownItemNumber={100}
                  placeholderText="Select your date of birth"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#ae7a31] focus:border-[#ae7a31] sm:text-sm"
                />
              </div>
            )}
            {!isAngler && (
              <div>
                <label
                  htmlFor="complexName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Complex Name
                </label>
                <input
                  type="text"
                  name="complexName"
                  id="complexName"
                  minLength={3}
                  maxLength={50}
                  value={formData.complexName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#ae7a31] focus:border-[#ae7a31] sm:text-sm"
                />
              </div>
            )}
            <div>
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobileNumber"
                min={10}
                max={10}
                id="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#ae7a31] focus:border-[#ae7a31] sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#ae7a31] focus:border-[#ae7a31] sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#ae7a31] focus:border-[#ae7a31] sm:text-sm"
              />
            </div>
            <div className="flex items-center">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                required
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-[#ae7a31] focus:ring-[#ae7a31] border-gray-300 rounded"
              />
              <label
                htmlFor="agreeToTerms"
                className="ml-2 block text-sm text-gray-900"
              >
                I agree to the terms and conditions
              </label>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ae7a31] hover:bg-[#8e6429] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ae7a31]"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
