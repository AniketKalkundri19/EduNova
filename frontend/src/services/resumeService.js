import axios from "axios";

// 🚀 FIXED: Pointing to the production URL with a local fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://edunova-backend-fypl.onrender.com";

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
      `${API_BASE_URL}/api/ai/enhance-resume`, // ✅ Updated URL
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
      // The server responded with a status code outside the 2xx range
      throw new Error(error.response.data.error || "Server error");
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("Backend not reachable. Check if the Render server is awake.");
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
};
