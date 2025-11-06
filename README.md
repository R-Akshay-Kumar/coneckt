# coneckt – Internal Communication Chat Platform

coneckt is a real-time internal communication platform designed for team collaboration, inspired by tools like Slack and Microsoft Lync.  
The project is being built step-by-step, following a full-stack development workflow.

---

## Project Progress (Phased Development Approach)

| Phase | Status | Description |
|------|:------:|-------------|
| Phase 1 |  Completed | Built complete UI using HTML, CSS & JavaScript (Login + Chat Interface) |
| Phase 2 |  Completed | Implemented real user authentication using Node.js & MySQL (Signup + Login) |
| Phase 3 |  In Progress | Add database-backed chat messaging (store + load chat history) |
| Phase 4 |  Upcoming | Implement real-time messaging using Socket.io |
| Phase 5 |  Upcoming | Rebuild frontend in React and deploy full-stack version |

---

##  Tech Stack

### Frontend (Current)
- HTML
- CSS
- JavaScript 

### Backend
- Node.js
- Express.js
- bcrypt (Password Encryption)
- JSON Web Token (Authentication)

### Database
- MySQL (User & Message Data Storage)

---

## Features Implemented So Far

### Authentication System
- User Signup (stores user details securely in MySQL)
- User Login (JWT token based)
- Form mode toggle: Login ↔ Signup
- Fully functional from UI → Backend → Database

### UI Features (Phase 1)
- Modern login page UI
- Sidebar navigation (Chats / Groups)
- Chat panel layout similar to Microsoft Lync
- Message input & dynamic message rendering
- User profile dropdown & Logout support

---

## What’s Next (Phase 3)
We will:
- Store messages in the database
- Load chat history when switching contacts
- Replace the placeholder “Hello!” response

Then we will enable real-time communication using **Socket.io**.

