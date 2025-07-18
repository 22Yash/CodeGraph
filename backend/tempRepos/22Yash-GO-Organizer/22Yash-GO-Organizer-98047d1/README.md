# GitHub Organizer - Repository Cleanup & Analysis Tool

![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vercel](https://vercel.com/button)

> A full-stack web application that helps developers identify and clean up unused files, imports, and potential issues in their GitHub repositories.

## 📊 Live Demo

* **Frontend**: [https://go-organizer.vercel.app](https://go-organizer.vercel.app)
* **Backend (Render)**: [https://go-organizer.onrender.com](https://go-organizer.onrender.com)

## 🎓 What I Learned

This project helped me solidify:

* GitHub OAuth2 integration (access token, profile fetch)
* Using `jsPDF` and `autoTable` to generate beautiful PDF reports
* Express.js backend architecture with JWT authentication
* MongoDB schema design for storing scan data per user
* Building responsive UIs with TailwindCSS + React
* Understanding performance testing tools (Loader.io, Apache Benchmark, K6)
* Full deployment pipeline: Vercel (frontend) + Render (backend)

## 🌐 Tech Stack

### Frontend

* React (Vite)
* React Router
* Tailwind CSS
* Lucide Icons
* jsPDF + autoTable

### Backend

* Node.js + Express
* MongoDB (Mongoose)
* GitHub OAuth2 (axios)
* JWT Authentication
* File system scanning logic

### Deployment

* **Frontend**: Vercel
* **Backend**: Render.com

---

## 🤝 Features

* ✉ GitHub Login with OAuth
* 🔎 Full repo scan on unused files/imports
* 🔧 Scan history and analytics dashboard
* 📄 PDF report generation for each scan
* 🌐 Deployed on Vercel (frontend) and Render (backend)

---

## 📂 Folder Structure

```
root/
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── server.js
└── frontend/
    ├── src/
    └── vercel.json
```

---

## 🔢 Local Setup

### Backend

```bash
cd backend
npm install
# Create .env file
PORT=5000
MONGODB_URI=your_mongodb_uri
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_REDIRECT_URI=https://go-organizer.onrender.com/api/auth/github/callback
FRONTEND_URL=https://go-organizer.vercel.app
JWT_SECRET=your_secret

node server.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev # for local testing
npm run build # for production build
```

---

## 🔄 Deployment

### Backend

* Deploy to [Render.com](https://render.com)
* Set root to `backend`
* Add environment variables as above

### Frontend

* Deploy to [Vercel.com](https://vercel.com)
* Set root to `frontend`
* Add `vercel.json` for React Router support:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 📊 Performance Testing

* **Apache Benchmark**: `ab -n 100 -c 10 https://your-api.com/api/scan`
* **Loader.io**: configure test with `/api/dashboard/:userId`
* **k6**: use a JS test script

---

## 📃 PDF Report

* Uses `jsPDF` and `autoTable`
* Shows: Repository info, issues found, categorized breakdown, recommendations
* Filename: `RepoName_Cleanup_Report_YYYY-MM-DD.pdf`

---

## ⚠ Known Limitations

* Only scanning unused files/imports (assets/duplication are planned)
* GitHub OAuth redirect delays on free hosting
* No GitHub rate limit handling

---

## ✍️ Author

**Yash Doke**
Full-Stack Developer | GitHub Automation Enthusiast

---

## ⚖️ License

This project is licensed under the [MIT License](LICENSE).

---

For improvements, suggestions or collaboration, feel free to raise an issue or fork the project! ✨
