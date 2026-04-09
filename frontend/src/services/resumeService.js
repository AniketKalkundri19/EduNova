import axios from "axios";

// 🚀 Dynamic URL: Switches based on environment
// Ensure VITE_API_URL is set to https://edunova-backend-fypl.onrender.com in Vercel
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const enhanceResumeService = async (
  resumeFile,
  jobDescription,
  userProfile
) => {
  const formData = new FormData();

  formData.append("resume", resumeFile);
  formData.append("job_description", jobDescription);
  formData.append("profile_json", JSON.stringify(userProfile));

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/ai/enhance-resume`, // ✅ Dynamic endpoint
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      // The server responded with a status code (e.g., 400, 500)
      throw new Error(error.response.data.error || "Server error");
    } else if (error.request) {
      // The request was made but no response was received (e.g., Render is sleeping)
      throw new Error("AI Backend not reachable. Please wait 60s for server wakeup.");
    } else {
      throw new Error("An unexpected error occurred during AI processing");
    }
  }
};
