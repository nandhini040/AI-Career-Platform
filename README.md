# AI Career Platform

An advanced AI-powered career preparation platform designed to help users land their dream jobs. This platform offers an integrated suite of tools including AI Mock Interviews, coding practice environments with AI feedback, and personalized dashboards.

## 🚀 Features

* **AI Mock Interviews:**
  * Interactive interview sessions (Technical, HR, Behavioral).
  * Speech-to-text integration for real-time verbal answering (`react-speech-recognition`).
  * AI-driven evaluation providing scores, strengths, areas for improvement, and ideal answers.
  * Audio file support for interview sessions.

* **Coding Practice Environment:**
  * Built-in code editor using Monaco Editor (`@monaco-editor/react`).
  * Assorted coding problems with varying difficulty levels and topics.
  * Automated test case validation and execution.
  * AI-generated feedback on code submissions for optimization and syntax.

* **User Authentication & Dashboard:**
  * Secure JWT-based authentication.
  * Personalized user dashboard with charts (`recharts`) tracking interview and coding performance over time.

## 🛠️ Technology Stack

### Backend
* **Framework:** Django 6.0, Django REST Framework
* **Database:** PostgreSQL
* **Authentication:** JWT (JSON Web Tokens) via `rest_framework_simplejwt`
* **Integrations:** AI tools for grading/feedback, CORS handling for React frontend.

### Frontend
* **Framework:** React 19, Vite
* **Styling & UI:** Bootstrap, React-Bootstrap, Lucide React (Icons)
* **Routing:** React Router v7
* **Data Fetching:** Axios
* **Key Libraries:** `recharts` (charts), `@monaco-editor/react` (code editor), `react-speech-recognition` (voice input).

## 📁 Project Structure

```text
Project1/
├── backend/                  # Django Backend Application
│   ├── backend_core/         # Main Django project settings and URLs
│   ├── coding/               # Coding practice app (models, views, serializers)
│   ├── interviews/           # AI Mock interviews app
│   ├── users/                # User authentication and profiles
│   ├── manage.py             # Django entry point
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Backend environment variables
│
├── frontend/                 # React Frontend Application
│   ├── public/               # Static public assets
│   ├── src/                  # React source code (components, pages, styles)
│   ├── package.json          # Node.js dependencies and scripts
│   ├── vite.config.js        # Vite bundler configuration
│   └── .env                  # Frontend environment variables
│
└── README.md                 # This file
```

## ⚙️ Installation & Setup

### Prerequisites
* Python 3.10+
* Node.js 18+ & npm
* PostgreSQL

### 1. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file and add necessary environment variables
# Example variables:
# DB_USER=postgres
# DB_PASSWORD=yourpassword
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=ai_interview_prep
# SECRET_KEY=your_secret_key

# Run database migrations
python manage.py migrate

# (Optional) Seed the database with coding problems
python seed_coding.py

# Start the Django development server
python manage.py runserver
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create a .env file (if required for API URL configuration)

# Start the Vite development server
npm run dev
```
The frontend should now be running on `http://localhost:5173/` and backend on `http://localhost:8000/`.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
This project is proprietary and confidential.
