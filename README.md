# 🎭 MetaTest-MERN Frontend

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Recharts-FF6B6B?style=for-the-badge&logo=recharts&logoColor=white" />
  <br/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white" />
</div>

<div align="center">
  <h3>🔬 AI Metamorphic Testing Platform - Frontend Dashboard</h3>
  <p>Research-grade tool for testing AI model reliability using Metamorphic Testing (MT)</p>
</div>

---

## 📋 **Table of Contents**
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage Guide](#-usage-guide)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 **Overview**

MetaTest-MERN is a professional automated testing platform for AI models using **Metamorphic Testing (MT)** to address the "Oracle Problem". This frontend dashboard provides an intuitive interface for researchers to:

- Select AI models from Hugging Face
- Apply different metamorphic transformations
- Visualize test results with interactive charts
- Track model reliability over time
- Detect metamorphic bugs in AI predictions

The platform validates AI predictions by checking **relationships between inputs and outputs** instead of exact correctness, making it ideal for testing sentiment analysis, translation, and classification models.

---

## ✨ **Features**

### 🔹 **Core Functionality**
| Feature | Description |
|---------|-------------|
| 🤖 **Model Selection** | Choose from multiple Hugging Face models (RoBERTa, DistilBERT, BART, etc.) |
| 🔄 **5 MR Types** | Synonym Replacement, Gender Swap, Punctuation, Negation, Paraphrase |
| 📝 **Test Input** | Enter custom text or use example prompts |
| ⚡ **Real-time Testing** | Instant metamorphic test execution |

### 🔹 **Analytics Dashboard**
| Feature | Description |
|---------|-------------|
| 📊 **Pass/Fail Rates** | Visual representation of test results by MR type |
| 📈 **Reliability Score** | Model performance percentage over multiple tests |
| 🎯 **Bug Detection** | Identify metamorphic violations in real-time |
| 📉 **Trend Analysis** | Track model behavior over time |

### 🔹 **UI/UX**
| Feature | Description |
|---------|-------------|
| 🌙 **Dark Mode** | Research-ready, professional interface |
| 📱 **Responsive Design** | Works on desktop, tablet, and mobile |
| 🎨 **Glass Morphism** | Modern, sleek visual design |
| ⚡ **Animations** | Smooth transitions and loading states |

---

## 🛠️ **Tech Stack**

<div align="center">

| **Category** | **Technologies** |
|--------------|------------------|
| **Framework** | React 18, Vite 4 |
| **Styling** | Tailwind CSS 3, CSS3 |
| **Charts** | Recharts 2 |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |
| **Notifications** | React Hot Toast |
| **Deployment** | Vercel |

</div>

---

## 📁 **Project Structure**
metatest-frontend/
├── 📂 public/ # Static assets
│ 
├── 📂 src/
│ ├── 📂 components/ # React components
│ │ ├── Dashboard.jsx # Performance overview
│ │ ├── ModelSelector.jsx # Model dropdown with search
│ │ ├── ResultsChart.jsx # Interactive charts
│ │ └── TestInput.jsx # Test form with MR types
│ ├── 📂 services/ # API services
│ │ └── api.js # Backend API calls
│ ├── 📂 styles/ # CSS files
│ │ └── index.css # Tailwind imports
│ ├── 📂 utils/ # Helper functions
│ ├── App.jsx # Main application
│ └── main.jsx # Entry point
├── .env.example # Environment variables template
├── .gitignore # Git ignore rules
├── index.html # HTML template
├── package.json # Dependencies
├── postcss.config.js # PostCSS config
├── tailwind.config.js # Tailwind config
└── vite.config.js # Vite configuration


---

## 🚀 **Installation**

### Prerequisites
- Node.js **v16.x** or higher
- npm **v8.x** or higher

### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/metatest-frontend.git
cd metatest-frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Update environment variables
# Edit .env with your backend URL

# 5. Start development server
npm run dev