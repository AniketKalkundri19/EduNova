# 🚀 EduNova: AI-Powered Smart Student Ecosystem  

**EduNova** is a comprehensive full-stack ecosystem designed to bridge the gap between academic progress and professional job readiness. By unifying student profile management with state-of-the-art **Large Language Models (LLMs)**, the platform provides personalized mentorship, automated skill-gap analysis, and ATS-optimized resume enhancement.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Framer Motion, Recharts, Tailwind CSS 🎨 |
| **Main Backend** | Node.js, Express, Mongoose, JWT, Multer 🏗️ |
| **AI Gateway** | Python 3.12, Flask, PyMuPDF (fitz) 🐍 |
| **Database** | MongoDB Atlas 🍃 |
| **Intelligence** | DeepSeek-V3 (LLM), all-MiniLM-L6-v2 (Vector Embeddings) 🧠 |
| **Infrastructure** | Private Hugging Face Spaces ☁️ |

---

## ✨ Core Features

### 🤖 NovaBot: Profile-Grounded Mentor
* **Context-Aware:** Unlike generic bots, NovaBot pulls your live GPA, skills, and projects from MongoDB to give tailored advice.
* **Smart Memory:** Uses a **Sliding Window Memory** system to keep the conversation flowing without losing track of your goals.

### 📊 Skill-Gap Analyzer
* **Semantic Matching:** Converts your profile and Job Descriptions into 384-dimensional vectors.
* **Math-Driven Insights:** Uses **Cosine Similarity** to calculate exactly how close you are to your dream job.
* **Learning Roadmap:** DeepSeek-V3 identifies missing skills and creates a prioritized study plan.

### 📄 AI-Powered Resume Enhancer
* **ATS Optimization:** Rebuilds your bullet points using the **Google XYZ Formula** (*"Accomplished [X] as measured by [Y], by doing [Z]"*).
* **Hallucination Guardrails:** Uses **In-Context Learning (ICL)** to ensure all enhancements are 100% grounded in your real experience.

---

## 🏗️ System Architecture

The project uses a **layered microservices approach** to keep the core app fast while the AI handles the heavy lifting:

1. **Frontend:** React Dashboard for data visualization.
2. **Node.js Backend:** Handles Auth (JWT) and data persistence.
3. **Python AI Gateway:** A specialized service that runs reasoning and embeddings.
4. **Security Handshake:** Uses a private **Bearer Token** system to secure communication between servers.

---

## 📂 Project Structure

```text
EduNova/
├── backend/ (Node.js)      # Student & User Schemas, JWT Auth
├── frontend/ (React)       # UI Dashboard & NovaBot Interface
└── ai-gateway/ (Python)    # LLM logic & Vector Embeddings
```

---

## 🚀 Getting Started

### 🔑 Environment Variables
Create a `.env` file in the root directory:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
AI_BACKEND_URL=your_python_gateway_url
HF_TOKEN=your_huggingface_token
```

### ⚡ Installation
```bash
# Install all dependencies
npm install && npm install --prefix backend && npm install --prefix frontend

# Run the project (Concurrent Mode)
npm start
```

---

## 🛡️ Security & Performance
* **Dual-Layer Auth:** Secure sessions via JWT + internal AI access via private tokens.
* **Warm Boot Loading:** Sentence-Transformer models are pre-loaded into RAM for zero-latency embeddings.
* **Data Integrity:** 100% grounding through strict prompt constraints.

---

## 👨‍💻 Author
**Aniket** *Final Year BE-IT Student* 🎓  
*Pune, India* 📍
