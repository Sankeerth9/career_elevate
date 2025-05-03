# CareerElevate

CareerElevate is an AI-powered career guidance web application that helps users discover personalized career pathways, explore job opportunities, and plan their educational journey.

---

## 🚀 Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Wouter (routing)
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (Neon), Drizzle ORM
- **AI Integration:** Google Gemini API (Generative AI)
- **Job Listings:** Mock API (with filterable skills/experience), ready for integration with real APIs
- **Testing:** Jest, React Testing Library

---

## 🗂️ Project Structure

```
CareerElevate/
├── client/                # Frontend React app
│   └── src/
│       ├── pages/         # Main pages (home, job-listings, career-assessment, etc.)
│       ├── components/    # Reusable UI components
│       └── lib/           # API utilities, hooks, etc.
├── server/                # Backend Express app
│   ├── routes.ts          # API routes (auth, assessments, jobs, etc.)
│   ├── services/          # AI, job, and other service logic
│   └── storage.ts         # Database logic (Drizzle ORM)
├── shared/                # Shared types and schema
├── app.env                # Environment variables (not committed)
└── README.md              # Project documentation
```

---

## 🧠 Main Logic & Features

### 1. **Authentication**
- User registration, login, logout, and session management
- Secure password hashing and session cookies

### 2. **Career Assessment**
- Multi-step form collects education, interests, skills, and goals
- On submit, data is sent to the backend and stored in the database
- AI-powered recommendations are generated using the Gemini API

### 3. **AI Recommendations**
- The backend formats user data and sends it to Gemini
- Gemini returns personalized career pathways, which are displayed to the user
- Fallback logic provides generic recommendations if AI is unavailable

### 4. **Educational Pathways**
- Users can browse and explore various educational and career pathways
- Pathways are seeded in the database and fetched via API

### 5. **Job Listings**
- Users can filter jobs by skills and experience level
- Job cards display title, company, location, required skills, and salary
- Currently uses mock data, but ready for integration with real job APIs (e.g., RapidAPI JSearch)

### 6. **Payments (Optional)**
- Payment endpoints and logic are scaffolded for future premium features

---

## 🛠️ How It Works

1. **User interacts with the frontend** (React app)
2. **Frontend sends API requests** to the backend (Express server)
3. **Backend processes requests**, interacts with the database and Gemini API as needed
4. **Backend sends responses** (data, errors, recommendations) back to the frontend
5. **Frontend updates the UI** based on the response

---

## 📝 Setup & Development

1. Clone the repo and install dependencies:
   ```sh
   git clone https://github.com/Sankeerth9/career_elevate.git
   cd career_elevate
   npm install
   ```
2. Create an `app.env` file with your database and Gemini API keys
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## 📦 Extending the Project
- Integrate a real job API by updating the backend `/api/jobs` endpoint
- Add more filters (location, salary, job type) to the job listings page
- Enhance AI prompts for more personalized recommendations
- Add user dashboards, notifications, and premium features

---

## 📄 License
MIT 