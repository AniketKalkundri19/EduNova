import axios from "axios";

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
      "http://localhost:5000/api/ai/enhance-resume",
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
      throw new Error(error.response.data.error || "Server error");
    } else if (error.request) {
      throw new Error("Backend not reachable");
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
};
